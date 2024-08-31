import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import { Directions } from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

type TagTeamClone = {
  dir: number;
  cleave: number;
};

export interface Data extends RaidbossData {
  readonly triggerSetConfig: {
    barbarousBarrageKnockback: 'none' | 'first' | 'two' | 'all';
  };
  phaseTracker: number;
  tagTeamCloneTethered?: number;
  tagTeamClones: TagTeamClone[];
}

// TODO: <foo>boom Special delayed in/out triggers?

const getSafeSpotsFromClones = (
  myClone: TagTeamClone,
  otherClone: TagTeamClone,
  murderousMistDir?: number,
): [number[], number] => {
  let safeSpots = [...Array(8).keys()];

  const lastSafeSpots = Array<number>(8).fill(0);

  // Trim the three dirs that aren't getting hit by myClone
  for (let idx = 0; idx < 3; ++idx) {
    const dir = (myClone.cleave + 3 + idx) % 8;
    safeSpots = safeSpots.filter((spot) => dir !== spot);
  }

  // Trim the five dirs that are getting hit by otherClone
  for (let idx = 0; idx < 5; ++idx) {
    const dir = (otherClone.cleave + 6 + idx) % 8;
    safeSpots = safeSpots.filter((spot) => dir !== spot);
    // Track that this spot is getting hit for the last safe spot calc
    lastSafeSpots[dir]++;
  }

  // Handle Murderous Mist if that's getting passed in
  if (murderousMistDir !== undefined) {
    // Invert to get the "safe" spot behind boss
    murderousMistDir = (murderousMistDir + 4) % 8;
    safeSpots = safeSpots.filter((spot) => murderousMistDir !== spot);
  }

  // Figure out where our final safe spot is
  for (let idx = 0; idx < 5; ++idx) {
    const dir = (myClone.cleave + 6 + idx) % 8;
    lastSafeSpots[dir]++;
  }

  const lastSafeSpot = (lastSafeSpots.findIndex((count) => count === 0) + 4) % 8;

  return [safeSpots, lastSafeSpot];
};

const tagTeamOutputStrings = {
  ...Directions.outputStrings8Dir,
  safeDirs: {
    en: 'Safe: ${dirs} => ${last}',
    de: 'Sicher: ${dirs} => ${last}',
    ja: '安地: ${dirs} => ${last}',
    cn: '安全區: ${dirs} => ${last}',
  },
  separator: {
    en: '/',
    de: '/',
    ja: '/',
    cn: '/',
  },
} as const;

const triggerSet: TriggerSet<Data> = {
  id: 'AacLightHeavyweightM3Savage',
  zoneId: ZoneId.AacLightHeavyweightM3Savage,
  config: [
    {
      id: 'barbarousBarrageKnockback',
      name: {
        en: 'Barbarous Barrage Uptime Knockback',
        de: 'Brutalo-Bomben Uptime Rückstoß',
        ja: 'ボンバリアンボムのアムレン/堅実 限界タイミング通知',
        cn: '擊退塔uptime打法擊退提示時機調整功能',
      },
      comment: {
        en: 'Select towers to dodge with knockback immunity.',
        de: 'Wähle welche Türme mit Rückstoß-Immunität genommen werden.',
        ja: '吹き飛ばし無効で避ける塔を選択してください',
        cn: '選擇防擊退覆蓋的塔。',
      },
      type: 'select',
      options: {
        en: {
          'None (No Callout)': 'none',
          'First Tower': 'first',
          'First Two Towers (Recommended)': 'two',
          'All three towers': 'all',
        },
        de: {
          'Keine (keine Ansage)': 'none',
          'Erster Turm': 'first',
          'Ersten zwei Türme (empfohlen)': 'two',
          'Alle drei Türme': 'all',
        },
        ja: {
          'なし (コールなし)': 'none',
          '最初の塔': 'first',
          '最初の2つ (推奨)': 'two',
          '全ての塔': 'all',
        },
        cn: {
          '關閉功能': 'none',
          '第一個塔': 'first',
          '前兩個塔 (推薦)': 'two',
          '全部塔': 'all',
        },
      },
      default: 'none',
    },
  ],
  timelineFile: 'r3s.txt',
  initData: () => ({
    phaseTracker: 0,
    tagTeamClones: [],
  }),
  triggers: [
    {
      id: 'R3S Phase Tracker',
      type: 'GainsEffect',
      netRegex: { effectId: 'FB6', capture: true },
      run: (data, matches) => data.phaseTracker = parseInt(matches.count, 16),
    },
    {
      id: 'R3S Knuckle Sandwich',
      type: 'StartsUsing',
      netRegex: { id: '9423', source: 'Brute Bomber' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'R3S Brutal Impact',
      type: 'StartsUsing',
      netRegex: { id: '9425', source: 'Brute Bomber', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'R3S Octuple Lariat Out',
      type: 'StartsUsing',
      netRegex: { id: '93D8', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out + Spread',
          de: 'Raus + Verteilen',
          ja: '外側 + 散開',
          cn: '鋼鐵 + 八方散開',
          ko: '밖으로 + 산개',
        },
      },
    },
    {
      id: 'R3S Octuple Lariat In',
      type: 'StartsUsing',
      netRegex: { id: '93D9', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'In + Spread',
          de: 'Rein + Verteilen',
          ja: '内側 + 散開',
          cn: '月環 + 八方散開',
          ko: '안으로 + 산개',
        },
      },
    },
    {
      id: 'R3S Octoboom Dive Proximity',
      type: 'StartsUsing',
      netRegex: { id: '93DE', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away + Spread',
          de: 'Weg + Verteilen',
          ja: '離れて + 散開',
          cn: '遠離 + 散開',
          ko: '멀리 + 산개',
        },
      },
    },
    {
      id: 'R3S Octoboom Dive Knockback',
      type: 'StartsUsing',
      netRegex: { id: '93DF', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback + Spread',
          de: 'Rückstoß + Verteilen',
          ja: 'ノックバック + 散開',
          cn: '擊退 + 散開',
          ko: '넉백 + 산개',
        },
      },
    },
    {
      id: 'R3S Barbarous Barrage Uptime Knockback',
      type: 'StartsUsing',
      netRegex: { id: '93FB', source: 'Brute Bomber', capture: false },
      delaySeconds: (data) => {
        switch (data.triggerSetConfig.barbarousBarrageKnockback) {
          case 'first':
            return 9;
          case 'two':
            return 12;
          case 'all':
            return 15;
          case 'none':
            return 0;
        }
      },
      infoText: (data, _matches, output) => {
        if (data.triggerSetConfig.barbarousBarrageKnockback !== 'none')
          return output.knockback!();
      },
      outputStrings: {
        knockback: Outputs.knockback,
      },
    },
    {
      id: 'R3S Murderous Mist',
      type: 'StartsUsing',
      netRegex: { id: '93FE', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.getBehind!(),
      outputStrings: {
        getBehind: Outputs.getBehind,
      },
    },
    {
      id: 'R3S Quadroboom Dive Proximity',
      type: 'StartsUsing',
      netRegex: { id: '93E0', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away + Partners',
          de: 'Weg + Partner',
          ja: '離れて + ペア',
          cn: '遠離 + 雙人集合',
          ko: '멀리 + 쉐어',
        },
      },
    },
    {
      id: 'R3S Quadroboom Dive Knockback',
      type: 'StartsUsing',
      netRegex: { id: '93E1', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback + Partners',
          de: 'Rückstoß + Partner',
          ja: 'ノックバック + ペア',
          cn: '擊退 + 雙人集合',
          ko: '넉백 + 쉐어',
        },
      },
    },
    {
      id: 'R3S Quadruple Lariat Out',
      type: 'StartsUsing',
      netRegex: { id: '93DA', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out + Partners',
          de: 'Raus + Partner',
          ja: '外側 + ペア',
          cn: '鋼鐵 + 雙人集合',
          ko: '밖으로 + 쉐어',
        },
      },
    },
    {
      id: 'R3S Quadruple Lariat In',
      type: 'StartsUsing',
      netRegex: { id: '93DB', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'In + Partners',
          de: 'Rein + Partner',
          ja: '内側 + ペア',
          cn: '月環 + 雙人集合',
          ko: '안으로 + 쉐어',
        },
      },
    },
    {
      id: 'R3S Short Fuse',
      type: 'GainsEffect',
      netRegex: { effectId: 'FB8', capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Short Fuse',
          de: 'Kurze Lunte',
          ja: '短い導火線',
          cn: '短引線點名',
          ko: '짧은 도화선',
        },
      },
    },
    {
      id: 'R3S Long Fuse',
      type: 'GainsEffect',
      netRegex: { effectId: 'FB9', capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Long Fuse',
          de: 'Lange Lunte',
          ja: '長い導火線',
          cn: '長引線點名',
          ko: '긴 도화선',
        },
      },
    },
    {
      id: 'R3S Fuse Field',
      type: 'GainsEffect',
      netRegex: { effectId: 'FB4' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        if (parseFloat(matches.duration) < 30)
          return output.short!();
        return output.long!();
      },
      outputStrings: {
        short: {
          en: 'Short Fuse',
          de: 'Kurze Lunte',
          ja: '短い導火線',
          cn: '短引線點名',
          ko: '짧은 도화선',
        },
        long: {
          en: 'Long Fuse',
          de: 'Lange Lunte',
          ja: '長い導火線',
          cn: '長引線點名',
          ko: '긴 도화선',
        },
      },
    },
    {
      id: 'R3S Octoboom Bombarian Special',
      type: 'StartsUsing',
      netRegex: { id: '9752', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out => In => Knockback => Spread',
          de: 'Raus => Rein => Rückstoß => Verteilen',
          ja: '外側 => 内側 => ノックバック => 散開',
          cn: '鋼鐵 => 月環 => 擊退 => 散開',
          ko: '밖으로 => 안으로 => 넉백 => 산개',
        },
      },
    },
    {
      id: 'R3S Octoboom Bombarian Special Reminder',
      type: 'StartsUsing',
      netRegex: { id: '9752', source: 'Brute Bomber', capture: false },
      delaySeconds: 20,
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.spread!(),
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'R3S Quadroboom Bombarian Special',
      type: 'StartsUsing',
      netRegex: { id: '940A', source: 'Brute Bomber', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out => In => Knockback => Partners',
          de: 'Raus => Rein => Rückstoß => Partner',
          ja: '外側 => 内側 => ノックバック => ペア',
          cn: '鋼鐵 => 月環 => 擊退 => 雙人集合',
          ko: '밖으로 => 안으로 => 넉백 => 쉐어',
        },
      },
    },
    {
      id: 'R3S Quadroboom Bombarian Special Reminder',
      type: 'StartsUsing',
      netRegex: { id: '940A', source: 'Brute Bomber', capture: false },
      delaySeconds: 20,
      durationSeconds: 7,
      alertText: (_data, _matches, output) => output.stack!(),
      outputStrings: {
        stack: Outputs.stackPartner,
      },
    },
    {
      id: 'R3S Tag Team Tether',
      type: 'Tether',
      // The clone uses ID `0112`, the boss uses ID `0113`.
      netRegex: { id: '0112', capture: true },
      condition: Conditions.targetIsYou(),
      promise: async (data, matches) => {
        const actors = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;

        const actor = actors[0];

        if (actors.length !== 1 || actor === undefined) {
          console.error(`R3S Tag Team Tether: Wrong actor count ${actors.length}`);
          return;
        }

        data.tagTeamCloneTethered = Directions.xyTo8DirNum(actor.PosX, actor.PosY, 100, 100);
      },
      infoText: (data, _matches, output) => {
        const dir = output[Directions.outputFrom8DirNum(data.tagTeamCloneTethered ?? -1)]!();
        return output.tetheredTo!({ dir: dir });
      },
      outputStrings: {
        ...Directions.outputStringsCardinalDir,
        tetheredTo: {
          en: 'Tethered to ${dir} clone',
          de: 'Vrebindung zum ${dir} Klon',
          ja: '${dir} の分身に繋がれた',
          cn: '連線分身: ${dir}',
        },
      },
    },
    {
      id: 'R3S Tag Team Clone',
      type: 'StartsUsing',
      /*
        Clones spawn on a random cardinal. They do one lariat dash across, then another one back.
        There are two sets of IDs, one for Tag Team 1, and one for Tag Team 2.
        IDs:
        9B2C - TT1, Right -> Left
        9B2E - TT1, Left -> Right
        9BD8 - TT2, Right -> Left
        9BDA - TT2, Left -> Right
      */
      netRegex: { id: ['9B2C', '9B2E', '9BD8', '9BDA'], source: 'Brute Distortion', capture: true },
      condition: (data, matches) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        const cloneDir = Directions.xyTo8DirNum(x, y, 100, 100);
        // Increment clockwise from our starting position to get the cleave direction.
        // If this is a right cleave, increment by 6 (South + 6 = East)
        // Otherwise, increment 2 positions (South + 2 = West)
        const cleaveAdjust = ['9B2C', '9BD8'].includes(matches.id) ? 6 : 2;
        const cleaveDir = (cloneDir + cleaveAdjust) % 8;
        data.tagTeamClones.push({
          cleave: cleaveDir,
          dir: cloneDir,
        });
        if (data.phaseTracker === 1 && data.tagTeamClones.length === 2)
          return true;
        return false;
      },
      durationSeconds: 10.7,
      infoText: (data, _matches, output) => {
        const myClone = data.tagTeamClones.find((clone) => clone.dir === data.tagTeamCloneTethered);
        const otherClone = data.tagTeamClones.find((clone) =>
          clone.dir !== data.tagTeamCloneTethered
        );

        if (myClone === undefined) {
          console.error('R3S Tag Team Clone: Missing myClone', data.tagTeamClones);
          return;
        }

        if (otherClone === undefined) {
          console.error('R3S Tag Team Clone: Missing otherClone', data.tagTeamClones);
          return;
        }

        const [safeSpots, lastSafeSpot] = getSafeSpotsFromClones(myClone, otherClone);

        return output.safeDirs!({
          dirs: safeSpots
            .map((dir) => output[Directions.outputFrom8DirNum(dir)]!())
            .join(output.separator!()),
          last: output[Directions.outputFrom8DirNum(lastSafeSpot)]!(),
        });
      },
      run: (data) => {
        data.tagTeamCloneTethered = undefined;
        data.tagTeamClones = [];
      },
      outputStrings: tagTeamOutputStrings,
    },
    {
      id: 'R3S Tag Team Murderous Mist',
      type: 'StartsUsingExtra',
      netRegex: { id: '9BD7', capture: true },
      // Sometimes this MM cast is before the clones, sometimes it's after
      delaySeconds: 0.1,
      durationSeconds: 12.7,
      infoText: (data, matches, output) => {
        const myClone = data.tagTeamClones.find((clone) => clone.dir === data.tagTeamCloneTethered);
        const otherClone = data.tagTeamClones.find((clone) =>
          clone.dir !== data.tagTeamCloneTethered
        );

        if (myClone === undefined) {
          console.error('R3S Tag Team Clone: Missing myClone', data.tagTeamClones);
          return;
        }

        if (otherClone === undefined) {
          console.error('R3S Tag Team Clone: Missing otherClone', data.tagTeamClones);
          return;
        }

        const murderousMistDir = Directions.hdgTo8DirNum(parseFloat(matches.heading));

        const [safeSpots, lastSafeSpot] = getSafeSpotsFromClones(
          myClone,
          otherClone,
          murderousMistDir,
        );

        return output.safeDirs!({
          dirs: safeSpots
            .map((dir) => output[Directions.outputFrom8DirNum(dir)]!())
            .join(output.separator!()),
          last: output[Directions.outputFrom8DirNum(lastSafeSpot)]!(),
        });
      },
      run: (data) => {
        data.tagTeamCloneTethered = undefined;
        data.tagTeamClones = [];
      },
      outputStrings: tagTeamOutputStrings,
    },
    {
      id: 'R3S KB Towers 2 Lariat Combo',
      type: 'StartsUsing',
      /*
        Boss jumps to a random cardinal. Does one lariat dash across, then another one back.
        IDs:
        9AE8 - Right cleave, then right cleave again.
             - If north, then east safe, then west. (go)
        9AE9 - Right cleave, then left cleave.
             - If north, then east safe, then east. (stay)
        9AEA - Left cleave, then left cleave again.
             - If north, then west safe, then east. (go)
        9AEB - Left cleave, then right cleave.
             - If north, then west safe, then west. (stay)
      */
      netRegex: { id: ['9AE8', '9AE9', '9AEA', '9AEB'], source: 'Brute Bomber', capture: true },
      durationSeconds: 11,
      infoText: (_data, matches, output) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        const bossDir = Directions.xyTo8DirNum(x, y, 100, 100);

        const firstCleaveDir = ['9AE8', '9AE9'].includes(matches.id) ? 'right' : 'left';
        const secondCleaveDir = ['9AE8', '9AEB'].includes(matches.id) ? 'right' : 'left';

        let firstSafeSpots = [...Array(8).keys()];
        let secondSafeSpots = [...firstSafeSpots];

        for (let idx = 0; idx < 5; ++idx) {
          // Starting at boss position, treat the 5 positions clockwise as unsafe
          // If this is a right cleave instead, then start opposite of boss
          const dir = (bossDir + (firstCleaveDir === 'left' ? 0 : 4) + idx) % 8;
          firstSafeSpots = firstSafeSpots.filter((spot) => spot !== dir);
        }

        for (let idx = 0; idx < 5; ++idx) {
          // Starting opposite boss position, treat the 5 positions clockwise as unsafe
          // If this is a right cleave instead, then start at boss
          const dir = (bossDir + (secondCleaveDir === 'right' ? 0 : 4) + idx) % 8;
          secondSafeSpots = secondSafeSpots.filter((spot) => spot !== dir);
        }

        // Filter cards from first spots, need to get KB'd to intercard
        firstSafeSpots = firstSafeSpots.filter((spot) => (spot % 2) !== 0);

        // Only include card for second spot
        secondSafeSpots = secondSafeSpots.filter((spot) => (spot % 2) === 0);

        const [firstDir1, firstDir2] = firstSafeSpots;

        const secondDir = secondSafeSpots[0];

        if (firstDir1 === undefined || firstDir2 === undefined || secondDir === undefined) {
          console.error(
            'Failed to find safe dirs for second KB towers',
            matches,
            firstSafeSpots,
            secondSafeSpots,
          );
          return output['unknown']!();
        }

        if (firstCleaveDir === secondCleaveDir) {
          return output.comboGo!({
            firstDir1: output[Directions.outputFrom8DirNum(firstDir1)]!(),
            firstDir2: output[Directions.outputFrom8DirNum(firstDir2)]!(),
            secondDir: output[Directions.outputFrom8DirNum(secondDir)]!(),
          });
        }
        return output.comboStay!({
          firstDir1: output[Directions.outputFrom8DirNum(firstDir1)]!(),
          firstDir2: output[Directions.outputFrom8DirNum(firstDir2)]!(),
          secondDir: output[Directions.outputFrom8DirNum(secondDir)]!(),
        });
      },
      outputStrings: {
        ...Directions.outputStrings8Dir,
        comboGo: {
          en: 'Knockback ${firstDir1}/${firstDir2} => Go ${secondDir}',
          de: 'Rückstoß ${firstDir1}/${firstDir2} => Geh nach ${secondDir}',
          ja: 'ノックバック ${firstDir1}/${firstDir2} => ${secondDir} へ移動',
          cn: '擊退 ${firstDir1}/${firstDir2} => 穿 ${secondDir}',
        },
        comboStay: {
          en: 'Knockback ${firstDir1}/${firstDir2}, Stay ${secondDir}',
          de: 'Rückstoß ${firstDir1}/${firstDir2} => Bleibe im ${secondDir}',
          ja: 'ノックバック ${firstDir1}/${firstDir2} => ${secondDir} で待機',
          cn: '擊退 ${firstDir1}/${firstDir2}, 停 ${secondDir}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Brute Bomber': 'Brutalo Bomber',
        'Brute Distortion': 'Brutalo Bomber-Phantom',
        'Lit Fuse': 'Zündschnurbombe',
      },
      'replaceText': {
        '\\(cast\\)': '(wirken)',
        '\\(damage\\)': '(Schaden)',
        '\\(enrage\\)': '(Finalangriff)',
        'Barbarous Barrage': 'Brutalo-Bomben',
        'Blazing Lariat': 'Flammende Lariat',
        'Bombarian Flame': 'Bomben-Feuer',
        '(?<! )Bombarian Special': 'Brutalo-Spezial',
        'Bombariboom': 'Brutalo-Schockwelle',
        'Brutal Impact': 'Knallender Impakt',
        'Chain Deathmatch': 'Ketten-Todeskampf',
        'Diveboom': 'Bombensturz',
        'Doping Draught': 'Aufputschen',
        'Explosion': 'Explosion',
        'Explosive Rain': 'Bombenregen',
        'Final Fusedown': 'Epische Zündschnurbomben',
        'Fuse or Foe': 'Klebrige Bombe',
        'Fusefield': 'Luntenfeld',
        'Fuses of Fury': 'Zündschnurbomben',
        'Infernal Spin': 'Ultimativer Feuertornado',
        'Knuckle Sandwich': 'Knöchelschlag',
        'Lariat Combo': 'Lariat-Kombination',
        'Murderous Mist': 'Grüner Nebel',
        'Octoboom Bombarian Special': 'Okto-Brutalo-Spezial',
        'Octoboom Dive': 'Okto-Bombensturz',
        'Octuple Lariat': 'Okto-Lariat',
        'Quadroboom Dive': 'Quattro-Bombensturz',
        'Quadruple Lariat': 'Quattro-Lariat',
        'Self-Destruct': 'Selbstzerstörung',
        'Special Bombarian Special': 'Ultimativer Brutalo-Spezial',
        'Tag Team': 'Wechselspiel',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Brute Bomber': 'Brute Bomber',
        'Brute Distortion': 'double de Brute Bomber',
        'Lit Fuse': 'bombo à mèche',
      },
      'replaceText': {
        'Barbarous Barrage': 'Bombardement brutal',
        'Blazing Lariat': 'Lariat embrasé',
        'Bombarian Flame': 'Feu brutal',
        '(?<! )Bombarian Special': 'Spéciale brutale',
        'Bombariboom': 'Onde de choc brutale',
        'Brutal Impact': 'Impact brutal',
        'Chain Deathmatch': 'Chaîne de la mort',
        'Diveboom': 'Explongeon',
        'Doping Draught': 'Dopage',
        'Explosion': 'Explosion',
        'Explosive Rain': 'Pluie explosive',
        'Final Fusedown': 'Bombos à méche sadiques',
        'Fuse or Foe': 'Fixation de bombo à mèche',
        'Fusefield': 'Champs de mèches',
        'Fuses of Fury': 'Bombos à mèche',
        'Infernal Spin': 'Toupie infernale',
        'Knuckle Sandwich': 'Sandwich de poings',
        'Lariat Combo': 'Combo de lariats',
        'Murderous Mist': 'Vapeur venimeuse',
        'Octoboom Bombarian Special': 'Octuple spéciale brutale',
        'Octoboom Dive': 'Octuple explongeon',
        'Octuple Lariat': 'Octuple lariat',
        'Quadroboom Dive': 'Quadruple explongeon',
        'Quadruple Lariat': 'Quadruple lariat',
        'Self-Destruct': 'Auto-destruction',
        'Special Bombarian Special': 'Spéciale brutale ultime',
        'Tag Team': 'Combat d\'équipe',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Brute Bomber': 'ブルートボンバー',
        'Brute Distortion': 'ブルートボンバーの幻影',
        'Lit Fuse': 'フューズボム',
      },
      'replaceText': {
        'Barbarous Barrage': 'ボンバリアンボム',
        'Blazing Lariat': 'ラリアット・ブレイザー',
        'Bombarian Flame': 'ボンバリアンファイヤー',
        '(?<! )Bombarian Special': 'ボンバリアンスペシャル',
        'Bombariboom': 'ボンバリアン・ショック',
        'Brutal Impact': 'スマッシュインパクト',
        'Chain Deathmatch': 'チェーンデスマッチ',
        'Diveboom': 'パワーダイブ・ショック',
        'Doping Draught': 'ドーピング',
        'Explosion': '爆発',
        'Explosive Rain': 'ボムレイン',
        'Final Fusedown': '零式フューズボム',
        'Fuse or Foe': 'アタッチ・フューズボム',
        'Fusefield': 'フューズフィールド',
        'Fuses of Fury': 'フューズボム',
        'Infernal Spin': '極盛り式スピニングファイヤー',
        'Knuckle Sandwich': 'ナックルパート',
        'Lariat Combo': 'ラリアットコンビネーション',
        'Murderous Mist': 'グリーンミスト',
        'Octoboom Bombarian Special': '8ショック・ボンバリアンスペシャル',
        'Octoboom Dive': '8ショック・パワーダイブ',
        'Octuple Lariat': '8ウェイ・ダブルラリアット',
        'Quadroboom Dive': '4ショック・パワーダイブ',
        'Quadruple Lariat': '4ウェイ・ダブルラリアット',
        'Self-Destruct': '自爆',
        'Special Bombarian Special': 'アルティメット・ボンバリアンスペシャル',
        'Tag Team': 'タッグマッチ',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Brute Bomber': 'ブルートボンバー',
        'Brute Distortion': 'ブルートボンバーの幻影',
        'Lit Fuse': 'フューズボム',
      },
      'replaceText': {
        'Barbarous Barrage': 'ボンバリアンボム',
        'Blazing Lariat': 'ラリアット・ブレイザー',
        'Bombarian Flame': 'ボンバリアンファイヤー',
        '(?<! )Bombarian Special': 'ボンバリアンスペシャル',
        'Bombariboom': 'ボンバリアン・ショック',
        'Brutal Impact': 'スマッシュインパクト',
        'Chain Deathmatch': 'チェーンデスマッチ',
        'Diveboom': 'パワーダイブ・ショック',
        'Doping Draught': 'ドーピング',
        'Explosion': '爆発',
        'Explosive Rain': 'ボムレイン',
        'Final Fusedown': '零式フューズボム',
        'Fuse or Foe': 'アタッチ・フューズボム',
        'Fusefield': 'フューズフィールド',
        'Fuses of Fury': 'フューズボム',
        'Infernal Spin': '極盛り式スピニングファイヤー',
        'Knuckle Sandwich': 'ナックルパート',
        'Lariat Combo': 'ラリアットコンビネーション',
        'Murderous Mist': 'グリーンミスト',
        'Octoboom Bombarian Special': '8ショック・ボンバリアンスペシャル',
        'Octoboom Dive': '8ショック・パワーダイブ',
        'Octuple Lariat': '8ウェイ・ダブルラリアット',
        'Quadroboom Dive': '4ショック・パワーダイブ',
        'Quadruple Lariat': '4ウェイ・ダブルラリアット',
        'Self-Destruct': '自爆',
        'Special Bombarian Special': 'アルティメット・ボンバリアンスペシャル',
        'Tag Team': 'タッグマッチ',
      },
    },
  ],
};

export default triggerSet;
