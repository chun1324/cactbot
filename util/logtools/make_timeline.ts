import fs from 'fs';
import readline from 'readline';

import { Namespace } from 'argparse';

import NetRegexes from '../../resources/netregexes';
import SFuncs from '../../resources/stringhandlers';
import { NetMatches } from '../../types/net_matches';

import { LogUtilArgParse, TimelineArgs } from './arg_parser';
import { printCollectedFights, printCollectedZones } from './encounter_printer';
import {
  EncounterCollector,
  FightEncInfo,
  ignoredCombatants,
  RsvData,
  TLFuncs,
} from './encounter_tools';
import FFLogs from './fflogs';

// TODO: Repeated abilities that need to be auto-commented may not get the comment marker
// if there's an intervening entry between the repeated entries.
// Figure out a more robust way to auto-comment lines that should be visible but unsynced.

// TODO: Add support for assigning sync windows to specific abilities,
// with or without phase conditions.

// TODO: Add support for auto-generating loops.

// TODO: Add support for compiling log lines during the collector pre-pass.

type TimelineEntry = {
  time: string;
  combatant?: string;
  abilityId?: string;
  abilityName?: string;
  targetable?: boolean;
  lineType: string;
  duration?: number;
  window?: { beforeWindow: number; afterWindow: number };
  zoneSeal?: { seal: string; code: '0839' };
  lineComment?: string;
};

type EncounterAbilityList = { [string: string]: string };

class ExtendedArgsRequired extends Namespace implements TimelineArgs {
  'file': string | null;
  'force': boolean | null;
  'search_fights': number | null;
  'search_zones': number | null;
  'fight_regex': string | null;
  'zone_regex': string | null;
  'output_file': string | null;
  'start': string | null;
  'end': string | null;
  'ignore_id': string[] | null;
  'ignore_ability': string[] | null;
  'ignore_combatant': string[] | null;
  'only_combatant': string[] | null;
  'phase': string[] | null;
  'include_targetable': string[] | null;
  'report_id': string | null;
  'report_fight': number | null;
  'key': string | null;
  'list_abilities': string | null;
}

type ExtendedArgs = Partial<ExtendedArgsRequired>;

const timelineParse = new LogUtilArgParse();

timelineParse.parser.addArgument(['--output_file', '-of'], {
  nargs: '?',
  type: 'string',
  help: 'Optional location to write timeline to file.',
});

timelineParse.parser.addArgument(['--ignore_id', '-ii'], {
  nargs: '+',
  help: 'Ability IDs to ignore, e.g. 27EF',
});

timelineParse.parser.addArgument(['--ignore_ability', '-ia'], {
  nargs: '+',
  help: 'Ability names to ignore, e.g. Attack',
});

timelineParse.parser.addArgument(['--ignore_combatant', '-ic'], {
  nargs: '+',
  help: 'Combatant names to ignore, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--only_combatant', '-oc'], {
  nargs: '+',
  help: 'Only the listed combatants will generate timeline data, e.g. "Aratama Soul"',
});

timelineParse.parser.addArgument(['--phase', '-p'], {
  nargs: '+',
  help: 'Abilities that indicate a new phase, and the time to jump to, e.g. 28EC:1000',
});

timelineParse.parser.addArgument(['--include_targetable', '-it'], {
  nargs: '+',
  help: 'Set this flag to include "34" log lines when making the timeline',
});

timelineParse.parser.addArgument(['--list_abilities', '-la'], {
  nargs: '?',
  help: 'Set this flag to include a complete/unfiltered ability list after the timeline',
});

timelineParse.parser.addArgument(
  ['-s', '--start'],
  {
    type: 'string',
    help: 'Timestamp of the start, e.g. \'12:34:56.789',
  },
);
timelineParse.parser.addArgument(
  ['-e', '--end'],
  { type: 'string', help: 'Timestamp of the end, e.g. \'12:34:56.789' },
);

const printHelpAndExit = (errString: string): void => {
  console.error(errString);
  timelineParse.parser.printHelp();
  process.exit(-1);
};

const validateArgs = (args: ExtendedArgs): void => {
  const hasFile = typeof args.file === 'string' && args?.file !== '';
  const hasReport = typeof args.report_id === 'string' && args?.report_id !== '';

  if (hasFile && hasReport || !hasFile && !hasReport)
    printHelpAndExit('Error: Must specify exactly one of -f or -r\n');

  if (args.fight_regex === '-1')
    printHelpAndExit('Error: Timeline generation does not currently support -fr\n');
  if (args.zone_regex === '-1')
    printHelpAndExit('Error: Timeline generation does not currently support -zr\n');

  if (hasFile) {
    if (!args.file?.includes('.log'))
      printHelpAndExit('Error: Must specify an FFXIV ACT log file, as log.log\n');
  } else if (hasReport) {
    if (typeof args.report_id !== 'string')
      printHelpAndExit('Error: Must specify a report ID.');
    if (typeof args.report_fight !== 'number' || args.report_fight < 0)
      printHelpAndExit('Error: Must specify a report fight index of 0 or greater');
  }

  // The remaining part of this function is to check for selecting part of the fight.
  if (typeof args.start === 'string' || typeof args.end === 'string') {
    if (typeof args.start !== 'string' || typeof args.end !== 'string')
      printHelpAndExit('Error: must specify both start and end, or use -lf, -lz, or -rf');
    return;
  }

  let numExclusiveArgs = 0;
  const exclusiveArgs = ['search_fights', 'search_zones', 'report_fight'] as const;
  for (const opt of exclusiveArgs) {
    if (args[opt] !== null && args[opt] !== undefined)
      numExclusiveArgs++;
  }

  if (numExclusiveArgs !== 1)
    printHelpAndExit('Error: Must specify exactly one of -lf, -lz, or -rf\n');
};

const makeCollectorFromPrepass = async (fileName: string, store: boolean) => {
  const collector = new EncounterCollector();
  const lineReader = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  for await (const line of lineReader) {
    // TODO: this could be more efficient if it stopped when it found the requested encounter.
    collector.process(line, store);
  }
  return collector;
};

const parseNameToggleToEntry = (matches: NetMatches['NameToggle']): TimelineEntry => {
  const targetable = matches.toggle === '01';
  const entry: TimelineEntry = {
    time: matches.timestamp,
    combatant: matches.name,
    lineType: 'nameToggle',
    targetable: targetable,
  };
  return entry;
};

const parseAbilityToEntry = (matches: NetMatches['Ability'], rsvData: RsvData): TimelineEntry => {
  let abilityName = matches.ability;
  if (abilityName.toLowerCase().includes('unknown_'))
    abilityName = '--sync--';
  abilityName = rsvData[abilityName] ?? abilityName;
  const entry: TimelineEntry = {
    time: matches.timestamp,
    combatant: matches.source,
    abilityId: matches.id,
    abilityName: abilityName,
    lineType: 'ability',
  };
  return entry;
};

const parseReport = async (
  reportId: string,
  fightIndex: number,
  apiKey: string,
): Promise<{ 'entries': TimelineEntry[]; 'abilityTimes': { [abilityId: string]: number[] } }> => {
  const rawEntries = await FFLogs.parseReport(reportId, fightIndex, apiKey);

  const entries: TimelineEntry[] = [];
  const abilityTimeMap: { [abilityId: string]: number[] } = {};

  for (const event of rawEntries) {
    // FFLogs mixes 14 StartsUsing lines in with 15/16 Ability lines.
    if (event.type !== 'cast')
      continue;

    entries.push({
      time: new Date(event.timestamp).toISOString(),
      combatant: event.combatant,
      abilityId: event.abilityId,
      abilityName: event.abilityName,
      lineType: 'ability',
    });

    // Store off exact times for each ability's usages for later sync commenting
    const abilityId = event.abilityId;
    const abilityTimeStamp = event.timestamp;
    abilityTimeMap[abilityId] ??= [];
    if (!abilityTimeMap[abilityId]?.includes(event.timestamp))
      abilityTimeMap[abilityId]?.push(abilityTimeStamp);
  }
  return { entries: entries, abilityTimes: abilityTimeMap };
};

const extractRawLinesFromLog = async (
  fileName: string,
  start: string | Date,
  end: string | Date,
): Promise<[string[], RsvData]> => {
  const rsvData: RsvData = {};
  const rsvNetRegex = NetRegexes.rsvData({ capture: true });
  const lines: string[] = [];
  const file = readline.createInterface({
    input: fs.createReadStream(fileName),
  });
  start = typeof start === 'string' ? start : TLFuncs.timeFromDate(start);
  end = typeof end === 'string' ? end : TLFuncs.timeFromDate(end);
  let started = false;
  for await (const line of file) {
    const lineTimestampSegment = line.split('|', 3)[1] ?? '';
    if (!started && lineTimestampSegment.includes(start))
      started = true;
    if (started)
      lines.push(line);
    const rsvMatches = rsvNetRegex.exec(line)?.groups;
    if (rsvMatches !== undefined) {
      rsvData[rsvMatches.key] = rsvMatches.value;
    }
    if (lineTimestampSegment.includes(end)) {
      file.close();
      return [lines, rsvData];
    }
  }
  file.close();
  return [lines, rsvData];
};

const extractTLEntriesFromLog = (
  lines: string[],
  targetArray: string[] | null,
  rsvData: RsvData,
): { 'entries': TimelineEntry[]; 'abilityTimes': { [abilityId: string]: number[] } } => {
  const entries: TimelineEntry[] = [];
  const abilityTimeMap: { [abilityId: string]: number[] } = {};
  for (const line of lines) {
    const targetable = NetRegexes.nameToggle().exec(line)?.groups;
    const ability = NetRegexes.ability().exec(line)?.groups;
    // Cull non-relevant lines immediately.

    if (!ability && !targetable)
      continue;

    // Make nameplate toggle lines if and only if the user has specified them.
    if (targetable) {
      if (targetArray !== null && targetArray.includes(targetable.name)) {
        const targetEntry = parseNameToggleToEntry(targetable);
        entries.push(targetEntry);
      }
      continue;
    }

    // At this point, only ability lines are left.
    if (ability) {
      // Cull non-enemy lines
      // TODO: Handle this using the raid emulator's line parsing functionality.
      if (!ability.sourceId.startsWith('4'))
        continue;
      const abilityEntry = parseAbilityToEntry(ability, rsvData);
      entries.push(abilityEntry);

      // Store off exact times for each ability's usages for later sync commenting
      abilityTimeMap[ability.id] ??= [];
      const timestamp = Date.parse(ability.timestamp);
      if (!abilityTimeMap[ability.id]?.includes(timestamp))
        abilityTimeMap[ability.id]?.push(timestamp);
      continue;
    }

    // There shouldn't be any way that we get here,
    // but if we do, something is drastically wrong.
    // Notify the user of the malformed line and continue.
    const errString = `Warning: Potentially malformed/corrupted log line found:\n${line}\n\n`;
    console.log(errString);
    continue;
  }

  if (entries.length === 0) {
    console.error('Fight not found');
    process.exit(-2);
  } else {
    return { entries: entries, abilityTimes: abilityTimeMap };
  }
};

const ignoreTimelineAbilityEntry = (entry: TimelineEntry, args: ExtendedArgs): boolean => {
  const abilityName = entry.abilityName;
  const abilityId = entry.abilityId;
  const combatant = entry.combatant ?? '';

  // Ignore auto-attacks named "attack"
  if (abilityName?.toLowerCase() === 'attack')
    return true;

  // Ignore abilities from NPC allies.
  // If a no-name combatant, we will ignore only if its also an unnamed ability, as
  // a named ability has more potential for being relevant to timeline/trigger creation.
  // Unnamed (e.g. 'unknown_*') abilities have been converted to '--sync--' at this point.
  if (ignoredCombatants.includes(combatant) && combatant !== '')
    return true;
  if (combatant === '') {
    if (
      abilityName === undefined ||
      abilityName === '' ||
      abilityName?.toLowerCase().includes('--sync--')
    )
      return true;
  }

  // Ignore abilities by name.
  if (abilityName !== undefined && args.ignore_ability?.includes(abilityName))
    return true;

  // Ignore abilities by ID
  if (abilityId !== undefined && args.ignore_id?.includes(abilityId))
    return true;

  // Ignore combatants by name
  if (args.ignore_combatant?.includes(combatant))
    return true;

  // If only-combatants was specified, ignore all combatants not in the list.
  if (args.only_combatant && !args.only_combatant?.includes(combatant))
    return true;
  return false;
};

const findTimeDifferences = (lastTimeDiff: number): { diffSeconds: number; drift: number } => {
  if (lastTimeDiff === 0)
    return { diffSeconds: 0, drift: 0 };
  let diffSeconds = Math.floor(lastTimeDiff / 1000);
  const diffMilliSeconds = lastTimeDiff - diffSeconds * 1000;
  let drift = 0;

  // Find the difference in tenths of a second.
  const diffTenthSeconds = Math.floor(diffMilliSeconds / 100) / 10;

  // Adjust full-second difference.
  diffSeconds += diffTenthSeconds;

  // Round up a tenth of a second.
  if (diffMilliSeconds > 600) {
    diffSeconds += 0.1;
  } else if (diffMilliSeconds > 500) {
    // Round up, warning of exceptional drift.
    diffSeconds += 0.1;
    drift = diffMilliSeconds - 1000;
  } else if (diffMilliSeconds > 400) {
    // Round down, warning of exceptional drift
    drift = diffMilliSeconds;
  } else {
    // If <20ms then there's no need to adjust sec or drift
    true;
  }
  return { diffSeconds: diffSeconds, drift: drift };
};

const assembleTimelineStrings = (
  entries: TimelineEntry[],
  abilityTimes: { [abilityId: string]: number[] },
  start: Date,
  args: ExtendedArgs,
  fight?: FightEncInfo,
): string[] => {
  const assembled: string[] = [];
  let lastAbilityTime = start.getTime();
  let timelinePosition = 0;
  let lastEntry: TimelineEntry = { time: lastAbilityTime.toString(), lineType: 'None' };
  if (fight !== undefined && fight.sealName !== undefined) {
    const sealMessage = SFuncs.toProperCase(fight.sealName);
    if (fight.sealId !== undefined) {
      const sealComment = `# ${sealMessage} will be sealed off`;
      const netLogSeal =
        `0.0 "--sync--" SystemLogMessage { id: "7DC", param1: "${fight.sealId}" } window 0,1`;
      assembled.push(sealComment);
      assembled.push(netLogSeal);
    } else {
      const tlString =
        `0.0 "--sync--" GameLog { code: "0839", line: "${sealMessage} will be sealed off.*?" } window 0,1`;
      assembled.push(tlString);
    }
  } else {
    assembled.push('0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1');
  }

  // If the user entered phase information,
  // process it and store it off.
  const phases: { [name: string]: number } = {};
  for (const phase of args.phase ?? []) {
    const [ability, time] = phase.split(':');
    if (ability !== undefined && time !== undefined)
      phases[ability] = parseFloat(time);
  }

  const encounterAbilityList: EncounterAbilityList = {};
  for (const entry of entries) {
    if (entry.lineType === 'ability') {
      // In order to list out all abilities we see in the timeline header,
      // we store them off during the entry collection process.
      // Unfortunately, because of the interaction of old type structure and linter requirements,
      // we have to do a giant block to ensure no undefined values sneak in.
      const id = entry.abilityId;
      const name = entry.abilityName;
      if (id !== undefined && name !== undefined && encounterAbilityList[id] === undefined) {
        // We want all enemy abilities *except* from the specific NPCs in the curated ignore list.
        //
        // For most purposes, we ignore ability lines where the combatant name is empty.
        // But when building a timeline, we want to include named abilities
        // used by no-name combatants, given the increased likelihood they may be relevant.
        // Unnamed (e.g. 'unknown_*') abilities have been converted to '--sync--' at this point.
        const combatant = entry.combatant ?? '';
        if (!ignoredCombatants.includes(combatant))
          encounterAbilityList[id] = name;
        else if (combatant === '' && name !== '' && !name.toLowerCase().includes('--sync--'))
          encounterAbilityList[id] = name;
      }

      // Ignore auto-attacks, NPC allies, and abilities based on user-entered flags.
      if (ignoreTimelineAbilityEntry(entry, args))
        continue;
    }

    // Ignore AoE spam
    if (lastEntry.time === entry.time) {
      if (
        entry.abilityId !== undefined &&
        lastEntry.abilityId !== undefined &&
        entry.abilityId === lastEntry.abilityId
      )
        continue;
    }

    // Ignore targetable lines if not specified
    if (entry.lineType === 'targetable' && !Array.isArray(args.include_targetable))
      continue;

    // Find out how long it's been since the last ability.
    const lineTime = Date.parse(entry.time);
    const lastTimeDiff = lineTime - lastAbilityTime;
    const timeInfo = findTimeDifferences(lastTimeDiff);

    // Set the time, adjusting to phases if necessary.
    const abilityId = entry.abilityId ?? 'Unknown';
    const phaseTime = abilityId ? phases[abilityId] : timelinePosition;
    if (
      !(entry.lineType === 'ability' && abilityId && Object.keys(phases).includes(abilityId))
    ) {
      timelinePosition += timeInfo.diffSeconds;
    } else if (abilityId && phaseTime && Object.keys(phases).includes(abilityId)) {
      timelinePosition = phaseTime;
      delete phases[abilityId];
    }

    // We're done manipulating time, so save where we are for the next loop.
    lastAbilityTime = lineTime;

    // If a given use of an ability is within 2.5 seconds of another use,
    // we want to comment it by default.
    const checkAbilityTime = (element: number) => Math.abs(lineTime - element) <= 2500;
    const lineAbilityTimeList = abilityTimes[abilityId];
    let commentSync = '';
    if (lineAbilityTimeList !== undefined && lineAbilityTimeList.length > 1) {
      const overlaps = lineAbilityTimeList.filter(checkAbilityTime).length > 1;
      commentSync = overlaps ? '#' : '';
    }

    if (entry.lineType !== 'nameToggle') {
      const ability = entry.abilityName ?? 'Unknown';
      const combatant = entry.combatant ?? 'Unknown';
      const newEntry = `${
        timelinePosition.toFixed(1)
      } "${ability}" ${commentSync}Ability { id: "${abilityId}", source: "${combatant}" }`;
      assembled.push(newEntry);
    } else {
      const targetable = entry.targetable ? '--targetable--' : '--untargetable--';
      const newEntry = `${timelinePosition.toFixed(1)} "${targetable}"`;
      assembled.push(newEntry);
    }
    lastEntry = entry;
  }
  const ignoreLines = assembleHeaderArgStrings(args);
  const definiteLines = ignoreLines.concat(assembled);
  // Generate a complete table of abilities if specified.
  // Otherwise just return the timeline and basic header info.
  if (args.list_abilities !== undefined)
    return definiteLines.concat(assembleAbilityTableStrings(args, encounterAbilityList));
  return definiteLines;
};

const assembleHeaderZoneInfoStrings = (fight: FightEncInfo): string[] => {
  const zoneName = fight.zoneName;
  const zoneId = fight.zoneId;
  const headerInfo = [];
  if (zoneName !== undefined) {
    const zoneNameLine = `### ${zoneName.toUpperCase()}`;
    headerInfo.push(zoneNameLine);
  }
  if (zoneId !== undefined) {
    const zoneIdLine = `# ZoneId: ${zoneId}`;
    headerInfo.push(zoneIdLine);
  }
  if (headerInfo.length > 0)
    headerInfo.push('');
  return headerInfo;
};

const assembleHeaderArgStrings = (
  args: ExtendedArgs,
): string[] => {
  const assembled = [];
  let padHeaderArgs = false;

  const sortedAbilityIgnore = args.ignore_id?.sort();
  if (sortedAbilityIgnore !== undefined) {
    // Compared to combatant names, abilities are always guaranteed to be single "words".
    const iiLine = `# -ii ${sortedAbilityIgnore.join(' ')}`;
    assembled.push(iiLine);
    padHeaderArgs = true;
  }

  const sortedCombatantIgnore = args.ignore_combatant?.sort();
  if (sortedCombatantIgnore !== undefined) {
    // A naive sortedCombatantIgnore.join(' ') would be incorrect
    // if there are combatants with names containing more than one word,
    // as for instance "Brute Justice".
    // Single-word combatant names will not be affected by being quote-wrapped.
    const joinedIgnore = sortedCombatantIgnore.map((x) => `"${x}"`).join(' ');
    assembled.push(`# -ic ${joinedIgnore}`);
    padHeaderArgs = true;
  }

  const knownTargetable = args.include_targetable;
  if (knownTargetable !== undefined && knownTargetable !== null) {
    // Assume that the user knows best as far as sorting these args.
    const joinedTargetable = knownTargetable.map((x) => `"${x}"`).join(' ');
    assembled.push(`# -it ${joinedTargetable}`);
    padHeaderArgs = true;
  }

  const phases = args.phase;
  if (phases !== undefined && phases !== null) {
    // It's a lot of extra work to sort the phase information for minimal gain.
    // Assume that the user knows best as far as sorting these args.
    const phaseLine = `# -p ${phases.join(' ')}`;
    assembled.push(phaseLine);
    padHeaderArgs = true;
  }

  // Here and in the ability ignore block, we pad string ends with newlines, not the starts.
  // We assume newline padding from the zone Id function, and if it's not present,
  // the ignore header should be on line 1 of the file.
  if (padHeaderArgs)
    assembled.push('');
  assembled.push('hideall "--Reset--"\nhideall "--sync--"\n');
  assembled.push('0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0\n');
  return assembled;
};

const assembleAbilityTableStrings = (
  args: ExtendedArgs,
  encounterAbilityList: EncounterAbilityList,
): string[] => {
  // Start with a guaranteed extra newline to space out the timeline from the table.
  const assembled: string[] = ['\n'];
  const sortedAbilityIgnore = args.ignore_id?.sort();
  if (sortedAbilityIgnore !== undefined) {
    // The ignore header is inside the conditional block to ensure it's not added spuriously.
    assembled.push('# IGNORED ABILITIES');
    for (const id of sortedAbilityIgnore) {
      const abilityName = encounterAbilityList[id];
      if (abilityName !== undefined) {
        const detailedIgnoreLine = `# ${id} ${abilityName}`;
        assembled.push(detailedIgnoreLine);
      }
    }
    assembled.push('');
  }

  // While the user may not always ignore abilities,
  // we are guaranteed to be listing all abilities if we arrive here.
  // Add the encounter ability header here outside the block,
  // since we can safely assume the encounter will have at least one ability.
  assembled.push('# ALL ENCOUNTER ABILITIES');
  for (const id of (Object.keys(encounterAbilityList).sort())) {
    const abilityName = encounterAbilityList[id];
    if (abilityName !== undefined) {
      const listedLine = `# ${id} ${abilityName}`;
      assembled.push(listedLine);
    }
  }
  return assembled;
};

const parseTimelineFromFile = async (
  args: ExtendedArgs,
  file: string,
  fight: FightEncInfo,
  rsvData: RsvData,
) => {
  const startTime = fight.startTime;
  const endTime = fight.endTime;
  // All encounters on a collector will guaranteed have a start/end time,
  // but Typescript doesn't know that.
  if (!(startTime && endTime)) {
    console.error('Missing start or end time at specified index.');
    process.exit(1);
  }
  // This logic can probably be split out once we re-enable support for raw start/end times.
  let lines: string[];

  if (fight.logLines !== undefined) {
    lines = fight.logLines;
  } else {
    [lines, rsvData] = await extractRawLinesFromLog(
      file,
      TLFuncs.timeFromDate(startTime),
      TLFuncs.timeFromDate(endTime),
    );
  }
  const baseEntries = extractTLEntriesFromLog(
    lines,
    args?.include_targetable ?? null,
    rsvData,
  );
  const assembled = assembleTimelineStrings(
    baseEntries.entries,
    baseEntries.abilityTimes,
    startTime,
    args,
    fight,
  );
  return assembled;
};

const printTimelineToConsole = (entryList: string[]): void => {
  if (entryList.length > 0)
    console.log(entryList.join('\n'));
};

const writeTimelineToFile = (entryList: string[], fileName: string, force: boolean): void => {
  const flags = force ? 'w' : 'wx';
  const writer = fs.createWriteStream(fileName, { flags: flags });
  writer.on('error', (err) => {
    console.error(err);
    process.exit(-1);
  });
  if (entryList.length > 0) {
    for (const entry of entryList) {
      writer.write(entry);
      writer.write('\n');
    }
  }
  writer.close();
};

const makeTimeline = async () => {
  const args: ExtendedArgs = new ExtendedArgsRequired({});
  timelineParse.parser.parseArgs(undefined, args);
  validateArgs(args);

  let assembled: string[] = [];
  if (
    typeof args.report_id === 'string' && typeof args.report_fight === 'number' &&
    typeof args.key === 'string'
  ) {
    const rawEntries = await parseReport(args.report_id, args.report_fight, args.key);
    // Account for the possibility of a malformed response that somehow
    // ends up with a defined encounter but produces bogus or no entries.
    if (rawEntries.entries.length === 0 || rawEntries.entries[0] === undefined) {
      console.error('No encounter found in the report at that fight index.');
      process.exit(-2);
    }
    const startTime = new Date(rawEntries.entries[0].time);
    assembled = assembleTimelineStrings(
      rawEntries.entries,
      rawEntries.abilityTimes,
      startTime,
      args,
    );
  }

  if (typeof args.file === 'string' && args.file.length > 0) {
    if (typeof args.start === 'string' && typeof args.end === 'string') {
      const fight: FightEncInfo = {
        startTime: new Date(args.start),
        endTime: new Date(args.end),
      };
      assembled = await parseTimelineFromFile(args, args.file, fight, {});
    }

    const store = typeof args.search_fights === 'number' && args.search_fights > 0;
    const collector = await makeCollectorFromPrepass(args.file, store);
    if (args['search_fights'] === -1) {
      printCollectedFights(collector);
      process.exit(0);
    }
    if (args.search_zones === -1) {
      printCollectedZones(collector);
      process.exit(0);
    }
    // All fights are 1-indexed on collectors,
    // so we subtract 1 from the user's 1-indexed selection.
    if (args.search_fights) {
      const fight = collector.fights[args.search_fights - 1];
      if (fight === undefined) {
        console.error('No fight found at specified index');
        process.exit(-2);
      }
      const fightHeader = assembleHeaderZoneInfoStrings(fight);
      assembled = fightHeader.concat(
        await parseTimelineFromFile(args, args.file, fight, collector.rsvData),
      );
    }
  }
  if (typeof args.output_file === 'string') {
    const force = typeof args.force === 'boolean' && args.force;
    writeTimelineToFile(assembled, args.output_file, force);
  } else {
    printTimelineToConsole(assembled);
  }
  process.exit(0);
};

void makeTimeline();
