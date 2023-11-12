import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import { DirectionOutput8, Directions } from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { OutputStrings, TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  phase: number;
  mainTank?: string;
  thrustPositions: NetMatches['Ability'][];
  seenThrust: boolean;
  swordKnight?: string;
  swordTarget?: string;
  shieldKnight?: string;
  shieldTarget?: string;
  defCounter: number;
}

const unsafeMap: Partial<Record<DirectionOutput8, DirectionOutput8>> = {
  dirN: 'dirS',
  dirNE: 'dirSW',
  dirE: 'dirW',
  dirSE: 'dirNW',
  dirS: 'dirN',
  dirSW: 'dirNE',
  dirW: 'dirE',
  dirNW: 'dirSE',
} as const;

const fullDirNameMap: { [outputString: string]: OutputStrings } = {
  dirN: Outputs.north,
  dirNE: Outputs.northeast,
  dirE: Outputs.east,
  dirSE: Outputs.southeast,
  dirS: Outputs.south,
  dirSW: Outputs.southwest,
  dirW: Outputs.west,
  dirNW: Outputs.northwest,
  unknown: Outputs.unknown,
};

const triggerSet: TriggerSet<Data> = {
  id: 'TheMinstrelsBalladThordansReign',
  zoneId: ZoneId.TheMinstrelsBalladThordansReign,
  timelineFile: 'thordan-ex.txt',
  initData: () => {
    return {
      phase: 1,
      thrustPositions: [],
      seenThrust: false,
      defCounter: 1,
    };
  },
  timelineTriggers: [
    // All timeline triggers include a base suppression of 5 seconds
    // to avoid potential noise from timeline jitter.
    {
      id: 'ThordanEX Ascalons Might',
      regex: /Ascalon's Might/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      // Puddle positions snapshot well before the actual Heavensflame explosion.
      // BeforeSeconds: 10 is correct, as it ends up being only 5-6 seconds
      // in practice.
      id: 'ThordanEX Heavensflame',
      regex: /Heavensflame 1/,
      beforeSeconds: 10,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.baitPuddles!(),
      outputStrings: {
        baitPuddles: {
          en: 'Bait puddles',
          de: 'Flächen Ködern',
          fr: 'Attirez les flaques',
          cn: '誘導圈圈',
          ko: '장판 유도',
        },
      },
    },
    {
      id: 'ThordanEX Heavenly Slash',
      regex: /Heavenly Slash/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'ThordanEX Faith Unmoving',
      regex: /Faith Unmoving/,
      beforeSeconds: 6,
      condition: (data) => data.phase === 2,
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'ThordanEX Dimensional Collapse',
      regex: /Dimensional Collapse/,
      beforeSeconds: 10,
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.baitPuddles!(),
      outputStrings: {
        baitPuddles: {
          en: 'Bait gravity puddles',
          de: 'Köder Gravitationsflächen',
          fr: 'Attirez les flaques de gravité',
          cn: '誘導黑圈',
          ko: '검은색 장판 유도',
        },
      },
    },
    {
      id: 'ThordanEX Light Of Ascalon',
      regex: /The Light of Ascalon 1/,
      beforeSeconds: 5,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.knockbackAoe!(),
      outputStrings: {
        knockbackAoe: {
          en: 'AOE + knockback x7',
          de: 'AoE + Rückstoß x7',
          fr: 'AoE + Poussée x7',
          cn: 'AOE + 擊退 x7',
          ko: '전체공격 + 넉백x7',
        },
      },
    },
    {
      id: 'ThordanEX Ultimate End',
      regex: /Ultimate End/,
      beforeSeconds: 6,
      suppressSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    // Phase tracking
    {
      // Cue off Thordan's movement ability alongside him going untargetable
      id: 'ThordanEX Intermission Phase',
      type: 'Ability',
      netRegex: { id: '105A', source: 'King Thordan', capture: false },
      run: (data) => data.phase = 2,
    },
    {
      // Cue off Knights of the Round
      id: 'ThordanEX Post-Intermission Phase Tracker',
      type: 'Ability',
      netRegex: { id: '148C', source: 'King Thordan', capture: false },
      run: (data) => data.phase += 1,
    },
    {
      id: 'ThordanEX Main Tank Tracker',
      type: 'Ability',
      netRegex: { id: '147D', source: 'King Thordan' },
      condition: (data, matches) => data.mainTank !== matches.target,
      run: (data, matches) => data.mainTank = matches.target,
    },
    {
      id: 'ThordanEX Lightning Storm',
      type: 'HeadMarker',
      netRegex: { id: '0018' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'ThordanEX Dragons Rage',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'ThordanEX Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '1485', source: 'King Thordan', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Heavenly Heel',
      type: 'StartsUsing',
      netRegex: { id: '1487', source: 'King Thordan' },
      response: Responses.tankBuster(),
    },
    {
      id: 'ThordanEX Holy Chains',
      type: 'Tether',
      netRegex: { id: '0009' },
      condition: (data, matches) => data.me === matches.source || data.me === matches.target,
      alertText: (data, matches, output) => {
        const partner = data.me === matches.source ? matches.target : matches.source;
        return output.breakChains!({ partner: data.party.member(partner) });
      },
      outputStrings: {
        breakChains: {
          en: 'Break chains with ${partner}',
          de: 'Ketten mit ${partner} zerbrechen',
          fr: 'Cassez les chaînes avec ${partner}',
          cn: '與 ${partner} 拉斷連鎖',
          ko: '${partner} 사슬 끊기',
        },
      },
    },
    {
      id: 'ThordanEX Conviction',
      type: 'StartsUsing',
      netRegex: { id: '149D', source: 'Ser Hermenost', capture: false },
      suppressSeconds: 5,
      response: Responses.getTowers(),
    },
    {
      id: 'ThordanEX Dragons Gaze',
      type: 'StartsUsing',
      netRegex: { id: '1489', source: 'King Thordan', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 1)
          return output.singleGaze!();
        return output.doubleGaze!();
      },
      outputStrings: {
        singleGaze: {
          en: 'Look away from Thordan',
          de: 'Schau weg von Thordan',
          fr: 'Ne regardez pas Thordan',
          cn: '背對托爾丹',
          ko: '토르당에게서 뒤돌기',
        },
        doubleGaze: {
          en: 'Look away from Thordan and Eye',
          de: 'Schau weg von Thordan und dem Auge',
          fr: 'Ne regardez pas Thordan ni l\'œil',
          cn: '背對托爾丹和眼睛',
          ko: '토르당과 눈에 대해 뒤돌기',
        },
      },
    },
    {
      id: 'ThordanEX Triple Spiral Thrust Collect',
      type: 'Ability',
      netRegex: { id: '1018', source: ['Ser Ignasse', 'Ser Paulecrain', 'Ser Vellguine'] }, // Shared ability from all knights when they teleport in.
      condition: (data) => data.phase === 2 && !data.seenThrust,
      run: (data, matches) => data.thrustPositions.push(matches),
    },
    {
      id: 'ThordanEX Triple Spiral Thrust Call',
      type: 'Ability',
      netRegex: {
        id: '1018',
        source: ['Ser Ignasse', 'Ser Paulecrain', 'Ser Vellguine'],
        capture: false,
      }, // Shared ability from all knights when they teleport in.
      condition: (data) => data.phase === 2 && !data.seenThrust,
      delaySeconds: 0.5,
      infoText: (data, _matches, output) => {
        if (data.thrustPositions.length !== 3)
          return;
        let safeDirs = Object.keys(unsafeMap);
        data.thrustPositions.forEach((knight) => {
          const knightNum = Directions.hdgTo8DirNum(parseFloat(knight.heading));
          const knightDir = Directions.outputFrom8DirNum(knightNum);
          const pairedDir = unsafeMap[knightDir];
          safeDirs = safeDirs.filter((dir) => dir !== knightDir && dir !== pairedDir);
        });
        if (safeDirs.length !== 2)
          return;
        const [dir1, dir2] = safeDirs.sort();
        if (dir1 === undefined || dir2 === undefined)
          return;
        return output.combined!({ dir1: output[dir1]!(), dir2: output[dir2]!() });
      },
      run: (data) => {
        data.thrustPositions = [];
        data.seenThrust = true;
      },
      outputStrings: {
        combined: {
          en: '${dir1} / ${dir2} Safe',
          de: '${dir1} / ${dir2} Sicher',
          fr: '${dir1} / ${dir2} Sûr',
          cn: '${dir1} / ${dir2} 安全',
          ko: '${dir1} / ${dir2} 안전',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'ThordanEX Sword Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B0' },
      infoText: (_data, matches, output) => output.attackSword!({ swordKnight: matches.target }),
      run: (data, matches) => data.swordKnight = matches.target,
      outputStrings: {
        attackSword: {
          en: 'Attack ${swordKnight}',
          de: 'Greife ${swordKnight} an',
          fr: 'Attaquez ${swordKnight}',
          cn: '攻擊 ${swordKnight}',
          ko: '${swordKnight} 공격',
        },
      },
    },
    {
      id: 'ThordanEX Shield Of The Heavens',
      type: 'GainsEffect',
      netRegex: { effectId: '3B1' },
      run: (data, matches) => data.shieldKnight = matches.target,
    },
    {
      id: 'ThordanEX Holiest Of Holy',
      type: 'StartsUsing',
      netRegex: { id: '1495', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      suppressSeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Holy Bladedance Collect',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'] },
      run: (data, matches) => {
        if (data.swordKnight === matches.source)
          data.swordTarget = matches.target;
        if (data.shieldKnight === matches.source)
          data.shieldTarget = matches.target;
      },
    },
    {
      id: 'ThordanEX Holy Bladedance Call',
      type: 'StartsUsing',
      netRegex: { id: '1496', source: ['Ser Adelphel', 'Ser Janlenoux'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.swordTarget === undefined || data.shieldTarget === undefined)
          return output.unknownDance!();
        const swordTarget = data.party.member(data.swordTarget);
        const shieldTarget = data.party.member(data.shieldTarget);
        if (data.swordTarget === data.shieldTarget)
          return output.singleDance!({ target: swordTarget });
        return output.doubleDance!({ sword: swordTarget, shield: shieldTarget });
      },
      run: (data) => {
        delete data.shieldKnight;
        delete data.swordKnight;
        delete data.shieldTarget;
        delete data.swordTarget;
      },
      outputStrings: {
        unknownDance: {
          en: 'Heavy busters',
          de: 'Harter Tankbuster',
          fr: 'Gros busters',
          cn: '高傷死刑',
          ko: '탱버',
        },
        singleDance: {
          en: '2x buster on ${target}',
          de: '2x Tankbuster auf ${target}',
          fr: 'Buster x2 sur ${target}',
          cn: '雙死刑點 ${target}',
          ko: '${target} 탱버 x2',
        },
        doubleDance: {
          en: 'Sword buster on ${sword} (shield on ${shield})',
          de: 'Schwert-Tankbuster auf ${sword} (Schild auf ${shield})',
          fr: 'Buster épée sur ${sword} (bouclier sur ${shield})',
          cn: '劍死刑點 ${sword} (盾死刑點 ${shield})',
          ko: '칼 탱버 ${sword} (방패 ${shield})',
        },
      },
    },
    {
      id: 'ThordanEX Skyward Leap',
      type: 'HeadMarker',
      netRegex: { id: '000E' },
      condition: Conditions.targetIsYou(),
      alarmText: (data, _matches, output) => {
        if (data.phase !== 2)
          return output.defamationNoNumber!();
        return output.defamationCounted!({ number: data.defCounter });
      },
      run: (data) => data.defCounter += 1,
      outputStrings: {
        defamationNoNumber: {
          en: 'Defamation on YOU',
          de: 'Große AoE auf YOU',
          fr: 'Diffamation sur VOUS',
          cn: '穿天點名',
          ko: '광역 대상자',
        },
        defamationCounted: {
          en: 'Defamation #${number} on YOU',
          de: 'Große AoE #${number} auf DIR',
          fr: 'Diffamation #${number} sur VOUS',
          cn: '穿天 #${number} 點名',
          ko: '광역 #${number} 대상자',
        },
      },
    },
    {
      id: 'ThordanEX Spiral Pierce',
      type: 'Tether',
      netRegex: { id: '0005' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.pierceYou!(),
      outputStrings: {
        pierceYou: {
          en: 'Line AoE on YOU',
          de: 'Linien-AoE auf DIR',
          fr: 'AoE en ligne sur VOUS',
          cn: '直線AOE點名',
          ko: '직선 쉐어 대상자',
        },
      },
    },
    {
      id: 'ThordanEX Hiemal Storm',
      type: 'HeadMarker',
      netRegex: { id: '001D' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.icePuddleYou!(),
      outputStrings: {
        icePuddleYou: {
          en: 'Ice puddle on YOU',
          de: 'Eisfläche auf DIR',
          fr: 'Flaque de glace sur VOUS',
          cn: '冰圈點名',
          ko: '얼음 장판 대상자',
        },
      },
    },
    {
      id: 'ThordanEX Comet Puddles',
      type: 'HeadMarker',
      netRegex: { id: '000B' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.meteorYou!(),
      outputStrings: {
        meteorYou: {
          en: '4x meteor puddles on YOU',
          de: '4x Meteorflächen auf DIR',
          fr: '4x Météor sur VOUS',
          cn: '4連隕石點名',
          ko: '4연속 운석 장판 대상자',
        },
      },
    },
    {
      id: 'ThordanEX Fury Spear',
      type: 'HeadMarker',
      netRegex: { id: '0010' },
      alarmText: (data, matches, output) => {
        // Whoever is actively tanking Thordan must not stack,
        // because they will be taking Heavenly Heel shortly after.
        // If they stack, they will receive the physical vulnerability up and auto-die.
        if (data.me !== data.mainTank)
          return;
        if (data.me === matches.target)
          return output.spearYou!();
        return output.spearMainTank!();
      },
      alertText: (data, matches, output) => {
        if (data.me === data.mainTank)
          return;
        if (data.me === matches.target)
          return output.spearYou!();
        return output.spearOther!({ spearTarget: matches.target });
      },
      outputStrings: {
        spearYou: {
          en: 'Wild Charge on YOU',
          de: 'Ansturm auf DIR',
          fr: 'Charge sauvage sur VOUS',
          cn: '奶槍點名',
          ko: '돌진 대상자',
        },
        spearMainTank: {
          en: 'Wild Charge: STAY OUT',
          de: 'Ansturm: BLEIB DRAUSEN',
          fr: 'Charge sauvage : RESTEZ À L\'EXTÉRIEUR',
          cn: '奶槍: 保持遠離',
          ko: '돌진: 밖으로',
        },
        spearOther: {
          en: 'Wild Charge: Intercept ${spearTarget}',
          de: 'Ansturm: Zwichen ${spearTarget} stehen',
          fr: 'Charge sauvage : Interceptez ${spearTarget}',
          cn: '奶槍: 擋住 ${spearTarget}',
          ko: '돌진: ${spearTarget} 앞으로',
        },
      },
    },
    {
      id: 'ThordanEX Pure Of Soul',
      type: 'StartsUsing',
      netRegex: { id: '14B1', source: 'Ser Charibert', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'ThordanEX Single Spiral Thrust',
      type: 'Ability',
      netRegex: { id: '1018', source: 'Ser Vellguine' }, // Shared ability from all knights when they teleport in.
      condition: (data) => data.phase === 5,
      infoText: (_data, matches, output) => {
        const knightNum = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const knightDir = Directions.outputFrom8DirNum(knightNum);
        const [dir1, dir2] = [knightDir, unsafeMap[knightDir]].sort();
        if (dir1 === undefined || dir2 === undefined)
          return;
        return output.combined!({ dir1: output[dir1]!(), dir2: output[dir2]!() });
      },
      outputStrings: {
        combined: {
          en: '${dir1} / ${dir2} Unsafe',
          de: '${dir1} / ${dir2} Nicht Sicher',
          fr: '${dir1} / ${dir2} non-sûr',
          cn: '${dir1} / ${dir2} 危險',
          ko: '${dir1} / ${dir2} 위험',
        },
        ...Directions.outputStrings8Dir,
      },
    },
    {
      id: 'ThordanEX Faith Unmoving Off Center',
      type: 'Ability',
      netRegex: { id: '1018', source: 'Ser Grinnaux' }, // Shared ability from all knights when they teleport in.
      condition: (data) => data.phase === 4,
      delaySeconds: 7, // Grinnaux insta-casts Faith Unmoving 13s after appearing. Give ~6s of warning.
      alertText: (_data, matches, output) => {
        const knightX = parseFloat(matches.x);
        const knightY = parseFloat(matches.y);
        const knightDir = Directions.xyTo8DirOutput(knightX, knightY, 0, 0);
        return output.knockbackWarn!({ knightDir: output[knightDir]!() });
      },
      outputStrings: {
        knockbackWarn: {
          en: 'Knockback from ${knightDir}',
          de: 'Rückstoß von ${knightDir}',
          fr: 'Poussée depuis ${knightDir}',
          cn: '${knightDir} 擊退',
          ko: '${knightDir} 넉백',
        },
        ...fullDirNameMap,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'The Dragon\'s Gaze/The Dragon\'s Glory': 'The Dragon\'s Gaze/Glory',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Comet Circle': 'Meteoritensiegel',
        'King Thordan': 'Thordan',
        'Meteor Circle': 'Meteorsiegel',
        'Ser Adelphel': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Guerrique': 'Guerrique',
        'Ser Haumeric': 'Haumeric',
        'Ser Hermenost': 'Hermenost',
        'Ser Ignasse': 'Ignasse',
        'Ser Janlenoux': 'Janlenoux',
        'Ser Noudenet': 'Noudenet',
        'Ser Paulecrain': 'Paulecrain',
        'Ser Vellguine': 'Vellguine',
        'Ser Zephirin': 'Zephirin',
      },
      'replaceText': {
        '--chains appear--': '--Ketten erscheinen--',
        '--towers spawn--': '--Türme erscheinen--',
        'Absolute Conviction': 'Absolute Konviktion',
        'Ancient Quaga': 'Seisga Antiqua',
        'Ascalon\'s Mercy': 'Gnade von Askalon',
        'Ascalon\'s Might': 'Macht von Askalon',
        'Comet(?! Impact)': 'Komet',
        'Comet Impact': 'Kometeneinschlag',
        '(?<!Absolute )Conviction': 'Konviktion',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Divine Right': 'Göttliches Recht',
        'Faith Unmoving': 'Fester Glaube',
        'Heavenly Heel': 'Himmelsschritt',
        'Heavenly Slash': 'Himmelsschlag',
        'Heavensflame': 'Himmlische Flamme',
        'Heavensward Leap': 'Sprung himmelwärts',
        'Heavy Impact': 'Heftiger Einschlag',
        'Hiemal Storm': 'Hiemaler Sturm',
        'Holiest Of Holy': 'Quell der Heiligkeit',
        'Holy Bladedance': 'Geweihter Schwerttanz',
        'Holy Meteor': 'Heiliger Meteor',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Knights Of the Round': 'Ritter der Runde',
        'Lightning Storm': 'Blitzsturm',
        'Meteor Impact': 'Meteoreinschlag',
        'Meteorain': 'Meteorregen',
        'Pure Of Soul': 'Reine Seele',
        'Sacred Cross': 'Heiliges Kreuz',
        'Skyward Leap': 'Luftsprung',
        'Spear Of the Fury': 'Speer der Furie',
        'Spiral Pierce': 'Spiralstich',
        'Spiral Thrust': 'Spiralstoß',
        'The Dragon\'s Gaze': 'Blick des Drachen',
        'The Dragon\'s Glory': 'Ruhm des Drachen',
        'The Light Of Ascalon': 'Licht von Askalon',
        'Ultimate End': 'Ultimatives Ende',
        'the Dragon\'s Eye': 'Auge des Drachen',
        'the Dragon\'s Gaze': 'Blick des Drachen',
        'the Dragon\'s Rage': 'Zorn des Drachen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Comet Circle': 'sceau de la comète',
        'King Thordan': 'roi Thordan',
        'Meteor Circle': 'sceau du météore',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Guerrique': 'sire Guerrique',
        'Ser Haumeric': 'sire Haumeric',
        'Ser Hermenost': 'sire Hermenoist',
        'Ser Ignasse': 'sire Ignassel',
        'Ser Janlenoux': 'sire Janlenoux',
        'Ser Noudenet': 'sire Noudenet',
        'Ser Paulecrain': 'sire Paulecrain',
        'Ser Vellguine': 'sire Vellguine',
        'Ser Zephirin': 'sire Zéphirin',
      },
      'replaceText': {
        'Absolute Conviction': 'Conviction absolue',
        'Ancient Quaga': 'Méga Séisme ancien',
        'Ascalon\'s Mercy': 'Grâce d\'Ascalon',
        'Ascalon\'s Might': 'Puissance d\'Ascalon',
        'Comet(?! Impact)': 'Comète',
        'Comet Impact': 'Impact de comète',
        '(?<!Absolute )Conviction': 'Conviction',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Divine Right': 'Droit divin',
        'Faith Unmoving': 'Foi immuable',
        'Heavenly Heel': 'Estoc céleste',
        'Heavenly Slash': 'Lacération céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavensward Leap': 'Bond divin',
        'Heavy Impact': 'Impact violent',
        'Hiemal Storm': 'Tempête hiémale',
        'Holiest Of Holy': 'Saint des saints',
        'Holy Bladedance': 'Danse de la lame céleste',
        'Holy Meteor': 'Météore sacré',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Knights Of the Round': 'Chevaliers de la Table ronde',
        'Lightning Storm': 'Pluie d\'éclairs',
        'Meteor Impact': 'Impact de météore',
        'Meteorain': 'Pluie de météorites',
        'Pure Of Soul': 'Pureté d\'âme',
        'Sacred Cross': 'Croix sacrée',
        'Skyward Leap': 'Bond céleste',
        'Spear Of the Fury': 'Lance de la Conquérante',
        'Spiral Pierce': 'Empalement tournoyant',
        'Spiral Thrust': 'Transpercement tournoyant',
        'The Dragon\'s Gaze': 'Regard du dragon',
        'The Dragon\'s Glory': 'Gloire du dragon',
        'The Light Of Ascalon': 'Lumière d\'Ascalon',
        'Ultimate End': 'Fin ultime',
        'the Dragon\'s Eye': 'Œil du dragon',
        'the Dragon\'s Gaze': 'Regard du dragon',
        'the Dragon\'s Rage': 'Colère du dragon',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Comet Circle': '星片の聖紋',
        'King Thordan': '騎神トールダン',
        'Meteor Circle': '流星の聖紋',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Guerrique': '聖騎士ゲリック',
        'Ser Haumeric': '聖騎士オムリク',
        'Ser Hermenost': '聖騎士エルムノスト',
        'Ser Ignasse': '聖騎士イニアセル',
        'Ser Janlenoux': '聖騎士ジャンルヌ',
        'Ser Noudenet': '聖騎士ヌドゥネー',
        'Ser Paulecrain': '聖騎士ポールクラン',
        'Ser Vellguine': '聖騎士ヴェルギーン',
        'Ser Zephirin': '聖騎士ゼフィラン',
      },
      'replaceText': {
        'Absolute Conviction': 'アブソルートコンヴィクション',
        'Ancient Quaga': 'エンシェントクエイガ',
        'Ascalon\'s Mercy': 'アスカロンメルシー',
        'Ascalon\'s Might': 'アスカロンマイト',
        'Comet(?! Impact)': 'コメット',
        'Comet Impact': 'コメットインパクト',
        '(?<!Absolute )Conviction': 'コンヴィクション',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Divine Right': '蒼天の構え',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Heavenly Heel': 'ヘヴンリーヒール',
        'Heavenly Slash': 'ヘヴンリースラッシュ',
        'Heavensflame': 'ヘヴンフレイム',
        'Heavensward Leap': 'ヘヴンスリープ',
        'Heavy Impact': 'ヘヴィインパクト',
        'Hiemal Storm': 'ハイマルストーム',
        'Holiest Of Holy': 'ホリエストホーリー',
        'Holy Bladedance': 'ホーリーブレードダンス',
        'Holy Meteor': 'ホーリーメテオ',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Knights Of the Round': 'ナイツ・オブ・ラウンド',
        'Lightning Storm': '百雷',
        'Meteor Impact': 'メテオインパクト',
        'Meteorain': 'メテオレイン',
        'Pure Of Soul': 'ピュア・オブ・ソウル',
        'Sacred Cross': 'セイクリッドクロス',
        'Skyward Leap': 'スカイワードリープ',
        'Spear Of the Fury': 'スピア・オブ・ハルオーネ',
        'Spiral Pierce': 'スパイラルピアス',
        'Spiral Thrust': 'スパイラルスラスト',
        'The Dragon\'s Gaze': '竜の邪眼',
        'The Dragon\'s Glory': '邪竜の眼光',
        'The Light Of Ascalon': 'ライト・オブ・アスカロン',
        'Ultimate End': 'アルティメットエンド',
        'the Dragon\'s Eye': '竜の眼',
        'the Dragon\'s Gaze': '竜の邪眼',
        'the Dragon\'s Rage': '邪竜の魔炎',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Comet Circle': '星屑聖紋',
        'King Thordan': '騎神托爾丹',
        'Meteor Circle': '流星聖紋',
        'Ser Adelphel': '聖騎士阿代爾斐爾',
        'Ser Charibert': '聖騎士沙里貝爾',
        'Ser Grinnaux': '聖騎士格里諾',
        'Ser Guerrique': '聖騎士蓋里克',
        'Ser Haumeric': '聖騎士奧默里克',
        'Ser Hermenost': '聖騎士埃爾姆諾斯特',
        'Ser Ignasse': '聖騎士伊尼亞斯',
        'Ser Janlenoux': '聖騎士讓勒努',
        'Ser Noudenet': '聖騎士努德內',
        'Ser Paulecrain': '聖騎士波勒克蘭',
        'Ser Vellguine': '聖騎士韋爾吉納',
        'Ser Zephirin': '聖騎士澤菲蘭',
      },
      'replaceText': {
        '--chains appear--': '--鎖鏈出現--',
        '--towers spawn--': '--塔生成--',
        'Absolute Conviction': '絕對信仰',
        'Ancient Quaga': '古代爆震',
        'Ascalon\'s Mercy': '阿斯卡隆之仁',
        'Ascalon\'s Might': '阿斯卡隆之威',
        'Comet(?! Impact)': '彗星',
        'Comet Impact': '星屑衝擊',
        '(?<!Absolute )Conviction': '信仰',
        'Dimensional Collapse': '空間破碎',
        'Divine Right': '蒼穹體勢',
        'Faith Unmoving': '堅定信仰',
        'Heavenly Heel': '天踵',
        'Heavenly Slash': '天斬',
        'Heavensflame': '天火',
        'Heavensward Leap': '穿越蒼穹',
        'Heavy Impact': '沉重衝擊',
        'Hiemal Storm': '嚴冬風暴',
        'Holiest Of Holy': '至聖',
        'Holy Bladedance': '聖光劍舞',
        'Holy Meteor': '隕石聖星',
        'Holy Shield Bash': '聖盾猛擊',
        'Knights Of the Round': '圓桌騎士',
        'Lightning Storm': '百雷',
        'Meteor Impact': '隕石衝擊',
        'Meteorain': '流星雨',
        'Pure Of Soul': '純粹靈魂',
        'Sacred Cross': '神聖十字',
        'Skyward Leap': '穿天',
        'Spear Of the Fury': '戰女神之槍',
        'Spiral Pierce': '螺旋槍',
        'Spiral Thrust': '螺旋刺',
        'The Dragon\'s Gaze': '龍眼之邪',
        'The Dragon\'s Glory': '邪龍目光',
        'The Light Of Ascalon': '阿斯卡隆之光',
        'Ultimate End': '萬物終結',
        'the Dragon\'s Eye': '龍眼之光',
        'the Dragon\'s Gaze': '龍眼之邪',
        'the Dragon\'s Rage': '邪龍魔炎',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Comet Circle': '성스러운 별조각 문양',
        'King Thordan': '기사신 토르당',
        'Meteor Circle': '성스러운 별똥별 문양',
        'Ser Adelphel': '성기사 아델펠',
        'Ser Charibert': '성기사 샤리베르',
        'Ser Grinnaux': '성기사 그리노',
        'Ser Guerrique': '성기사 게리크',
        'Ser Haumeric': '성기사 오메리크',
        'Ser Hermenost': '성기사 에르메노',
        'Ser Ignasse': '성기사 이냐스',
        'Ser Janlenoux': '성기사 장르누',
        'Ser Noudenet': '성기사 누데네',
        'Ser Paulecrain': '성기사 폴르크랭',
        'Ser Vellguine': '성기사 벨긴',
        'Ser Zephirin': '성기사 제피랭',
      },
      'replaceText': {
        '--chains appear--': '--사슬 연결--',
        '--towers spawn--': '--기둥 등장--',
        'Absolute Conviction': '절대적 신념',
        'Ancient Quaga': '에인션트 퀘이가',
        'Ascalon\'s Mercy': '아스칼론의 자비',
        'Ascalon\'s Might': '아스칼론의 권능',
        'Comet(?! Impact)': '혜성',
        'Comet Impact': '혜성 낙하',
        '(?<!Absolute )Conviction': '신념',
        'Dimensional Collapse': '차원 파괴',
        'Divine Right': '창천 태세',
        'Faith Unmoving': '굳건한 신앙',
        'Heavenly Heel': '천상의 발꿈치',
        'Heavenly Slash': '천상의 참격',
        'Heavensflame': '천상의 불꽃',
        'Heavensward Leap': '천상의 도약',
        'Heavy Impact': '무거운 충격',
        'Hiemal Storm': '동장군 폭풍',
        'Holiest Of Holy': '지고한 신성',
        'Holy Bladedance': '신성한 검무',
        'Holy Meteor': '홀리 메테오',
        'Holy Shield Bash': '성스러운 방패 강타',
        'Knights Of the Round': '나이츠 오브 라운드',
        'Lightning Storm': '백뢰',
        'Meteor Impact': '운석 낙하',
        'Meteorain': '메테오 레인',
        'Pure Of Soul': '영혼의 순수',
        'Sacred Cross': '거룩한 십자가',
        'Skyward Leap': '공중 도약',
        'Spear Of the Fury': '할로네의 창',
        'Spiral Pierce': '나선 관통',
        'Spiral Thrust': '나선 찌르기',
        'The Dragon\'s Gaze': '용의 마안',
        'The Dragon\'s Glory': '사룡의 눈빛',
        'The Light Of Ascalon': '아스칼론의 광휘',
        'Ultimate End': '궁극의 종말',
        'the Dragon\'s Eye': '용의 눈',
        'the Dragon\'s Gaze': '용의 마안',
        'the Dragon\'s Rage': '사룡의 마염',
      },
    },
  ],
};

export default triggerSet;
