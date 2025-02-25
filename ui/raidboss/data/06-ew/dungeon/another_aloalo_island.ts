import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: add callout for Monk Hydroshot target
// TODO: sc3 should say which bubble to take to the other side (for everyone)
// TODO: figure out directions for Lala for Radiance orbs
// TODO: map effects for Lala
// TODO: Lala Planar Tactics could add config strats and tell you who to stack with
// TODO: Statice colors could add config strats for role-based colors + melee flex

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  ketuSpringCrystalCount: number;
  ketuCrystalAdd: NetMatches['AddedCombatant'][];
  ketuHydroBuffCount: number;
  ketuHydroBuffIsSpreadFirst?: boolean;
  ketuHydroBuffIsRoleStacks?: boolean;
  ketuBuff?: 'bubble' | 'fetters';
  ketuBuffPartner?: string;
  ketuBuffCollect: NetMatches['GainsEffect'][];
  ketuStackTargets: string[];
  ketuTwintidesNext?: 'out' | 'in';
  lalaBossRotation?: 'clock' | 'counter';
  lalaBossTimes?: 3 | 5;
  lalaBossInitialSafe?: 'north' | 'east' | 'south' | 'west';
  lalaUnseen?: 'front' | 'left' | 'right' | 'back';
  lalaPlayerTimes?: 3 | 5;
  lalaPlayerRotation?: 'clock' | 'counter';
  lalaSubAlpha: NetMatches['GainsEffect'][];
  staticeBullet: NetMatches['Ability'][];
  staticeTriggerHappy?: number;
  staticePopTriggerHappyNum?: number;
  staticeTrapshooting: ('stack' | 'spread' | undefined)[];
  staticeDart: NetMatches['GainsEffect'][];
  staticePresentBoxCount: number;
  staticeMissileCollect: NetMatches['AddedCombatant'][];
  staticeMissileIdToDir: { [id: string]: number };
  staticeMissileTether: NetMatches['Tether'][];
  staticeClawTether: NetMatches['Tether'][];
  staticeIsPinwheelingDartboard?: boolean;
  staticeHomingColor?: 'blue' | 'yellow' | 'red';
  staticeDartboardTether: NetMatches['HeadMarker'][];
}

// Horizontal crystals have a heading of 0, vertical crystals are -pi/2.
const isHorizontalCrystal = (line: NetMatches['AddedCombatant']) => {
  const epsilon = 0.1;
  return Math.abs(parseFloat(line.heading)) < epsilon;
};

const headmarkerIds = {
  tethers: '0061',
  enumeration: '015B',
} as const;

// TODO: this maybe should be a method on party?
const isStandardLightParty = (data: Data): boolean => {
  const supports = [...data.party.healerNames, ...data.party.tankNames];
  const dps = data.party.dpsNames;
  return supports.length === 2 && dps.length === 2;
};

const triggerSet: TriggerSet<Data> = {
  id: 'AnotherAloaloIsland',
  zoneId: ZoneId.AnotherAloaloIsland,
  timelineFile: 'another_aloalo_island.txt',
  initData: () => {
    return {
      combatantData: [],
      ketuSpringCrystalCount: 0,
      ketuCrystalAdd: [],
      ketuHydroBuffCount: 0,
      ketuBuffCollect: [],
      ketuStackTargets: [],
      lalaSubAlpha: [],
      staticeBullet: [],
      staticeTrapshooting: [],
      staticeDart: [],
      staticePresentBoxCount: 0,
      staticeMissileCollect: [],
      staticeMissileIdToDir: {},
      staticeMissileTether: [],
      staticeClawTether: [],
      staticeDartboardTether: [],
    };
  },
  timelineTriggers: [
    {
      id: 'AAI Lala Radiance',
      regex: /^Radiance \d/,
      beforeSeconds: 4,
      alertText: (data, _matches, output) => {
        // TODO: could figure out directions here and say "Point left at NW Orb"
        const dir = data.lalaUnseen;
        if (dir === undefined)
          return output.orbGeneral!();
        return {
          front: output.orbDirFront!(),
          back: output.orbDirBack!(),
          left: output.orbDirLeft!(),
          right: output.orbDirRight!(),
        }[dir];
      },
      outputStrings: {
        orbDirFront: {
          en: 'Face Towards Orb',
          de: 'Den Orb anschauen',
          fr: 'Pointez l\'orbe',
          cn: '面向球',
          ko: '구슬쪽 보기',
        },
        orbDirBack: {
          en: 'Face Away from Orb',
          de: 'Weg vom Orb schauen',
          fr: 'Ne pointez pas l\'orbe',
          cn: '背对球',
          ko: '뒷면을 구슬쪽으로',
        },
        orbDirLeft: {
          en: 'Point Left at Orb',
          de: 'Zeige links auf den Orb',
          fr: 'Pointez à gauche de l\'orbe',
          cn: '左侧对准球',
          ko: '왼쪽면을 구슬쪽으로',
        },
        orbDirRight: {
          en: 'Point Right at Orb',
          de: 'Zeige Rechts auf den Orb',
          fr: 'Pointez à droite de l\'orbe',
          cn: '右侧对准球',
          ko: '오른쪽면을 구슬쪽으로',
        },
        orbGeneral: {
          en: 'Point opening at Orb',
          de: 'Zeige die Öffnung auf den Orb',
          fr: 'Pointez l\'orbe',
          cn: '开口侧对准球',
          ko: '열린면을 수슬쪽으로',
        },
      },
    },
  ],
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AAI Kiwakin Lead Hook',
      type: 'StartsUsing',
      netRegex: { id: '8C6E', source: 'Aloalo Kiwakin' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBusterOnYou: {
            en: '3x Tankbuster on YOU',
            de: '3x Tankbuster auf DIR',
            fr: 'Tankbuster x3 sur VOUS',
            cn: '3x 坦克死刑点名',
            ko: '3x 탱버 대상자',
          },
          tankBusterOnPlayer: {
            en: '3x Tankbuster on ${player}',
            de: '3x Tankbuster auf ${player}',
            fr: 'Tankbuster x3 sur ${player}',
            cn: '3x 坦克死刑点 ${player}',
            ko: '3x 탱버 ${player}',
          },
        };

        if (matches.target === data.me)
          return { alertText: output.tankBusterOnYou!() };
        const target = data.party.member(matches.target);
        return { infoText: output.tankBusterOnPlayer!({ player: target }) };
      },
    },
    {
      id: 'AAI Kiwakin Sharp Strike',
      type: 'StartsUsing',
      netRegex: { id: '8C63', source: 'Aloalo Kiwakin' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Kiwakin Tail Screw',
      type: 'StartsUsing',
      // This is a baited targeted circle.
      netRegex: { id: '8BB8', source: 'Aloalo Kiwakin', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'AAI Snipper Water III',
      type: 'StartsUsing',
      netRegex: { id: '8C64', source: 'Aloalo Snipper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Snipper Bubble Shower',
      type: 'StartsUsing',
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'AAI Snipper Crab Dribble',
      type: 'Ability',
      // Crab Dribble 8BBA has a fast cast, so trigger on Bubble Shower ability
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      suppressSeconds: 5,
      response: Responses.goFront('info'),
    },
    {
      id: 'AAI Ray Hydrocannon',
      type: 'StartsUsing',
      netRegex: { id: '8BBD', source: 'Aloalo Ray', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AAI Ray Expulsion',
      type: 'StartsUsing',
      netRegex: { id: '8BBF', source: 'Aloalo Ray', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AAI Ray Electric Whorl',
      type: 'StartsUsing',
      netRegex: { id: '8BBE', source: 'Aloalo Ray', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AAI Monk Hydroshot',
      type: 'StartsUsing',
      netRegex: { id: '8C65', source: 'Aloalo Monk' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'AAI Monk Cross Attack',
      type: 'StartsUsing',
      netRegex: { id: '8BBB', source: 'Aloalo Monk' },
      response: Responses.tankBuster(),
    },
    // ---------------- Ketuduke ----------------
    {
      id: 'AAI Ketuduke Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '8AD4', source: 'Ketuduke', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Ketuduke Spring Crystals',
      type: 'StartsUsing',
      netRegex: { id: '8AA8', source: 'Ketuduke', capture: false },
      run: (data) => {
        data.ketuSpringCrystalCount++;
        // Note: cannot clear `data.ketuCrystalAdd` here as there has been at least one case
        // where AddCombatant (coming from memory, so racy) is partially before this cast.
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals Saturate Cleanup',
      type: 'StartsUsing',
      netRegex: { id: ['8AAB', '8AAC'], capture: false },
      run: (data) => data.ketuCrystalAdd = [],
    },
    {
      id: 'AAI Ketuduke Spring Crystal Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607' },
      run: (data, matches) => data.ketuCrystalAdd.push(matches),
    },
    {
      id: 'AAI Ketuduke Bubble Net',
      type: 'StartsUsing',
      netRegex: { id: ['8AC5', '8AAD'], source: 'Ketuduke', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Ketuduke Foamy Fetters Bubble Weave',
      type: 'GainsEffect',
      // ECC = Foamy Fetters
      // E9F = Bubble Weave
      netRegex: { effectId: ['ECC', 'E9F'] },
      delaySeconds: (data, matches) => {
        data.ketuBuffCollect.push(matches);
        return data.ketuBuffCollect.length === 4 ? 0 : 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data.ketuBuffCollect.length === 0)
          return;

        const myBuff = data.ketuBuffCollect.find((x) => x.target === data.me)?.effectId;
        if (myBuff === undefined)
          return;
        data.ketuBuff = myBuff === 'ECC' ? 'fetters' : 'bubble';
        data.ketuBuffPartner = data.ketuBuffCollect.find((x) => {
          return x.target !== data.me && x.effectId === myBuff;
        })?.target;
        const player = data.party.member(data.ketuBuffPartner);

        // To avoid too many calls, we'll call this out later for the Fluke Gale
        // versions of this.
        if (data.ketuSpringCrystalCount === 1 || data.ketuSpringCrystalCount === 4)
          return;

        if (data.ketuBuff === 'fetters')
          return output.fetters!({ player: player });
        return output.bubble!({ player: player });
      },
      run: (data) => data.ketuBuffCollect = [],
      outputStrings: {
        fetters: {
          en: 'Fetters (w/${player})',
          de: 'Fesseln (mit ${player})',
          fr: 'Entraves (avec ${player})',
          cn: '止步 (和 ${player})',
          ko: '속박 (+ ${player})',
        },
        bubble: {
          en: 'Bubble (w/${player})',
          de: 'Blase (mit ${player})',
          fr: 'Bulles (avec ${player})',
          cn: '泡泡 (和 ${player})',
          ko: '거품 (+ ${player})',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Counter',
      type: 'StartsUsing',
      // 8AB8 = Hydrobullet (spread)
      // 8AB4 = Hydrofall (stack)
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke', capture: false },
      run: (data) => {
        data.ketuHydroBuffCount++;
        delete data.ketuHydroBuffIsSpreadFirst;
        delete data.ketuHydroBuffIsRoleStacks;
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff 1',
      comment: {
        en: `These directions assume that you always pick a square in the same
             quadrant as the crystal specified.
             For brevity, "next to" always means horizontal east/west of something.
             See trigger source for diagrams in comments.`,
        de: `Diese Anweisungen gehen davon aus, dass Sie immer ein Quadrat im gleichen
             Quadranten wie der angegebene Kristall liegt.
             Der Einfachheit halber bedeutet "neben" immer horizontal östlich/westlich von etwas.
             Siehe Triggerquelle für Diagramme in den Kommentaren.`,
        fr: `Ces instructions supposent que vous choisissez toujours une case dans le même
             quadrant que le cristal spécifié.
             Par souci de concision, "à côté de" signifie toujours horizontal
             à l'est ou à l'ouest de quelque chose.
             Voir le déclencheur source pour les diagrammes dans les commentaires.`,
        cn: `这些方向假设你一直选的是同一面向的四块地板方格上的水晶。
             简洁起见，"相邻" 指的是左右水平相邻的某一个水晶。
             请参阅触发器源代码注释中的图表。`,
        ko: `이곳의 방향 지시는 항상 지정된 수정과 같은 사분면에 있는 정사각형을 선택한다고 가정합니다.
             간결성을 위해, '옆'은 항상 무언가의 동쪽/서쪽을 의미합니다.
             트리거 소스코드에 주석으로 작성된 다이어그램을 참고하세요.`,
      },
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 1 || data.ketuHydroBuffCount === 6,
      durationSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.ketuBuff === undefined)
          return;

        const isPlayerDPS = data.party.isDPS(data.me);
        const isPartnerDPS = data.ketuBuffPartner !== undefined
          ? data.party.isDPS(data.ketuBuffPartner)
          : undefined;
        const isBubbleNetPartnerSameRole = isPlayerDPS === isPartnerDPS &&
          isStandardLightParty(data);

        // Simplify callout in vast majority of cases where there's a normal light party setup
        // and you and the two dps and two supports get the same debuff, so no need to list
        // your partner.
        //
        // Otherwise, if you're doing this nonstandard for some reason or somebody is dead
        // you can know if you need to flex.
        const isSpread = matches.id === '8AB8';
        const bubbleStr = data.ketuBuff === 'bubble' ? output.bubbleBuff!() : output.fettersBuff!();
        // We don't know about role stacks at this point, as this is just the initial cast bar.
        const stackStr = isSpread ? output.spread!() : output.stacks!();
        if (isBubbleNetPartnerSameRole || data.ketuBuffPartner === undefined)
          return output.bubbleNetMech!({ fettersBubble: bubbleStr, spreadStack: stackStr });
        return output.bubbleNetMechPartner!({
          fettersBubble: bubbleStr,
          spreadStack: stackStr,
          player: data.party.member(data.ketuBuffPartner),
        });
      },
      infoText: (data, matches, output) => {
        // If somebody died and missed a debuff, good luck.
        if (data.ketuBuff === undefined)
          return;

        // Bubble always does the same thing.
        if (data.ketuBuff === 'bubble')
          return output.bubbleAnything!();

        // Two layouts, one with each crystal in its own column ("split")
        // and one with two columns that have an H and a V in that same column ("columns").
        // Wind doesn't matter, as "1" will always be on the horizontal crystals.
        // These can be flipped somewhat, but the solution is always the same.
        // Horizontal crystals are always in lc1 wind, and vertical crystals are always
        // in lc2 wind. Players with bubbles always go either (1) adjacent to a horizontal
        // crystal OR (2) diagonal of a vertical crystal. Either one works, but it
        // depends on how you split your priorities / wind which one you'd take.
        //
        // Legend: V = vertical crystal, H = horizontal crystal
        //         1 = limit cut wind 1, 2 = limit cut wind 2
        //         f = fetters, b = bubble (if placed in lc1)
        //
        // STACK FETTERS COLUMNS (kitty to horizontal)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   | V     f | 1       |     H f | 1
        //   |     H b |    =>   |     V   |
        //   | H b     |         | V       |
        // 1 |   f V   |       1 | H f     |
        //   + - - - - +         + - - - - +
        //           2                   2
        //
        // STACK FETTERS SPLIT (on horizontal)
        //           2                   2
        //   + - - - - +         + - - - - +
        // 1 |     V   |       1 |   V     |
        //   | H b     |    =>   | f H     |
        //   |   V     |         |     V   |
        //   |     b H | 1       |     H f | 1
        //   + - - - - +         + - - - - +
        //     2                   2
        //
        // SPREAD FETTERS COLUMNS (adjacent to vertical)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   | V f     | 1       |   f H b | 1
        //   |     H b |    =>   |     V   |
        //   | H b     |         | V       |
        // 1 |     V f |       1 | H b   f |
        //   + - - - - +         + - - - - +
        //           2                   2
        //
        // SPREAD FETTERS SPLIT (kitty to vertical)
        //     2                   2
        //   + - - - - +         + - - - - +
        //   |   V     | 1       |     V   | 1
        //   | f   b H |    =>   | f   H b |
        //   |     V   |         |   V     |
        // 1 | H b   f |       1 | b H   f |
        //   + - - - - +         + - - - - +
        //           2                   2

        const isSpread = matches.id === '8AB8';
        const horizontal = data.ketuCrystalAdd.filter((x) => isHorizontalCrystal(x));
        const vertical = data.ketuCrystalAdd.filter((x) => !isHorizontalCrystal(x));

        const [firstHorizontal] = horizontal;
        if (horizontal.length !== 2 || vertical.length !== 2 || firstHorizontal === undefined)
          return;
        const firstHorizX = parseFloat(firstHorizontal.x);
        // It's split if no vertical is in the same column as either horizontal.
        const isSplitLayout =
          vertical.find((line) => Math.abs(parseFloat(line.x) - firstHorizX) < 1) === undefined;

        if (isSpread)
          return isSplitLayout ? output.fettersSpreadSplit!() : output.fettersSpreadColumn!();
        return isSplitLayout ? output.fettersStackSplit!() : output.fettersStackColumn!();
      },
      outputStrings: {
        bubbleNetMech: {
          en: '${fettersBubble} + ${spreadStack}',
          de: '${fettersBubble} + ${spreadStack}',
          fr: '${fettersBubble} + ${spreadStack}',
          cn: '${fettersBubble} + ${spreadStack}',
          ko: '${fettersBubble} + ${spreadStack}',
        },
        bubbleNetMechPartner: {
          en: '${fettersBubble} + ${spreadStack} (w/${player})',
          de: '${fettersBubble} + ${spreadStack} (mit ${player})',
          fr: '${fettersBubble} + ${spreadStack} (avec ${player})',
          cn: '${fettersBubble} + ${spreadStack} (和 ${player})',
          ko: '${fettersBubble} + ${spreadStack} (+ ${player})',
        },
        bubbleBuff: {
          en: 'Bubble',
          de: 'Blase',
          fr: 'Bulle',
          cn: '泡泡',
          ko: '거품',
        },
        fettersBuff: {
          en: 'Fetters',
          de: 'Ketten',
          fr: 'Entraves',
          cn: '止步',
          ko: '속박',
        },
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Package',
          cn: '分摊',
          ko: '쉐어',
        },
        bubbleAnything: {
          en: 'Diagonal of Vertical / Next to Horizontal ',
          de: 'Diagonale der Vertikalen / Neben Horizontal',
          fr: 'Diagonale de la verticale / À côté de l\'horizontale',
          cn: '竖水晶对角线 / 左右相邻的横水晶',
          ko: '세로 수정의 대각선 / 가로 수정의 옆',
        },
        fettersSpreadSplit: {
          en: 'Diagonal of Vertical',
          de: 'Diagonale der Vertikalen',
          fr: 'Diagonale de la verticale',
          cn: '竖水晶对角线',
          ko: '세로 수정의 대각선',
        },
        fettersSpreadColumn: {
          en: 'Next to Vertical',
          de: 'Neben Vertikal',
          fr: 'À côté de la verticale',
          cn: '左右相邻的竖水晶',
          ko: '가로 수정의 옆',
        },
        fettersStackSplit: {
          en: 'On Horizontal',
          de: 'Auf Horizontal',
          fr: 'Sur l\'horizontale',
          cn: '横水晶上',
          ko: '가로 수정이 있는 곳',
        },
        fettersStackColumn: {
          en: 'Diagonal of Horizontal',
          de: 'Diagonale der Horizontalen',
          fr: 'Diagonale de l\'horizontale',
          cn: '横水晶对角线',
          ko: '가로 수정의 대각선',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double',
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data.ketuHydroBuffCount === 2 || data.ketuHydroBuffCount === 5,
      alertText: (data, matches, output) => {
        data.ketuHydroBuffIsSpreadFirst = matches.id === '8AB8';
        return data.ketuHydroBuffIsSpreadFirst ? output.spread!() : output.stacks!();
      },
      outputStrings: {
        spread: {
          en: 'Spread => Stacks',
          de: 'Verteilen => Sammeln',
          fr: 'Écarté => Package',
          cn: '分散 => 分摊',
          ko: '산개 => 쉐어',
        },
        stacks: {
          en: 'Stacks => Spread',
          de: 'Sammeln => Verteilen',
          fr: 'Package => Écarté',
          cn: '分摊 => 分散',
          ko: '쉐어 => 산개',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double Followup',
      type: 'Ability',
      netRegex: { id: ['8ABA', '8AB7'], source: 'Ketuduke' },
      suppressSeconds: 10,
      infoText: (data, matches, output) => {
        const wasSpread = matches.id === '8ABA';
        if (wasSpread && data.ketuHydroBuffIsSpreadFirst === true) {
          if (data.ketuHydroBuffIsRoleStacks)
            return output.roleStacks!();
          return output.stacks!();
        } else if (!wasSpread && data.ketuHydroBuffIsSpreadFirst === false) {
          return output.spread!();
        }
      },
      outputStrings: {
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Package',
          cn: '分摊',
          ko: '쉐어',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydrofall Role Stack Warning',
      type: 'GainsEffect',
      netRegex: { effectId: 'EA3' },
      delaySeconds: (data, matches) => {
        data.ketuStackTargets.push(matches.target);
        return data.ketuStackTargets.length === 2 ? 0 : 0.5;
      },
      alarmText: (data, _matches, output) => {
        const [stack1, stack2] = data.ketuStackTargets;
        if (data.ketuStackTargets.length !== 2 || stack1 === undefined || stack2 === undefined)
          return;

        // Sorry, non-standard light party comps.
        if (!isStandardLightParty(data))
          return;

        const isStack1DPS = data.party.isDPS(stack1);
        const isStack2DPS = data.party.isDPS(stack2);

        // If both stacks are on dps or neither stack is on a dps, then you have
        // standard "partner" stacks of one support and one dps. If one is on a dps
        // and one is on a support (which can happen if somebody dies), then
        // you (probably) need to have role stacks.
        if (isStack1DPS === isStack2DPS)
          return;

        data.ketuHydroBuffIsRoleStacks = true;

        // Handle Blowing Bubbles/Angry Seas spread+stack combo.
        if (data.ketuHydroBuffIsSpreadFirst === true)
          return output.spreadThenRoleStacks!();
        else if (data.ketuHydroBuffIsSpreadFirst === false)
          return output.roleStacksThenSpread!();
        return output.roleStacks!();
      },
      run: (data) => data.ketuStackTargets = [],
      outputStrings: {
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
        spreadThenRoleStacks: {
          en: 'Spread => Role Stacks',
          de: 'Verteilen => Rollengruppe sammeln',
          fr: 'Écarté => Package par rôle',
          cn: '分散 => 职能分摊',
          ko: '산개 => 역할별 쉐어',
        },
        roleStacksThenSpread: {
          en: 'Role Stacks => Spread',
          de: 'Rollengruppe sammeln => Verteilen',
          fr: 'Package par rôle => Écarté',
          cn: '职能分摊 => 分散',
          ko: '역할별 쉐어 => 산개',
        },
      },
    },
    {
      id: 'AAI Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACC', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsRoleStacks)
          return output.outInRoleStacks!();
        return output.outInStacks!();
      },
      run: (data) => data.ketuTwintidesNext = 'in',
      outputStrings: {
        outInStacks: {
          en: 'Out => In + Stacks',
          de: 'Raus => Rein + sammeln',
          fr: 'Extérieur => Intérieur + Package',
          cn: '远离 => 靠近 + 分摊',
          ko: '밖 => 안 + 쉐어',
        },
        outInRoleStacks: {
          en: 'Out => In + Role Stacks',
          de: 'Raus => Rein + Rollengruppe sammeln',
          fr: 'Extérieur => Intérieur + Package par rôle',
          cn: '远离 => 靠近 + 职能分摊',
          ko: '밖 => 안 + 역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACE', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsRoleStacks)
          return output.inOutRoleStacks!();
        return output.inOutStacks!();
      },
      run: (data) => data.ketuTwintidesNext = 'out',
      outputStrings: {
        inOutStacks: {
          en: 'In => Out + Stacks',
          de: 'Rein => Raus + sammeln',
          fr: 'Intérieur => Extérieur + Package',
          cn: '靠近 => 远离 + 分摊',
          ko: '안 => 밖 + 쉐어',
        },
        inOutRoleStacks: {
          en: 'In => Out + Role Stacks',
          de: 'Rein => Raus + Rollengruppe sammeln',
          fr: 'Intérieur => Extérieur + Package par rôle',
          cn: '靠近 => 远离 + 职能分摊',
          ko: '안 => 밖 + 역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Twintides Followup',
      type: 'Ability',
      // 8ABC = Sphere Shatter, which happens slightly after the Twintides hit.
      // You can technically start moving along the safe Sphere Shatter side 0.5s earlier
      // after the initial out/in, but this is hard to explain.
      netRegex: { id: '8ABC', source: 'Ketuduke', capture: false },
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        const mech = data.ketuTwintidesNext;
        if (mech === undefined)
          return;
        const mechStr = output[mech]!();
        const stackStr = data.ketuHydroBuffIsRoleStacks ? output.roleStacks!() : output.stack!();
        return output.text!({ inOut: mechStr, stack: stackStr });
      },
      run: (data) => delete data.ketuTwintidesNext,
      outputStrings: {
        text: {
          en: '${inOut} + ${stack}',
          de: '${inOut} + ${stack}',
          fr: '${inOut} + ${stack}',
          cn: '${inOut} + ${stack}',
          ko: '${inOut} + ${stack}',
        },
        in: Outputs.in,
        out: Outputs.out,
        stack: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Package',
          cn: '分摊',
          ko: '쉐어',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals 2',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607', capture: false },
      condition: (data) => data.ketuSpringCrystalCount === 2 && data.ketuCrystalAdd.length === 4,
      // We could call this absurdly early, but knowing this doesn't help with anything
      // until you know what your debuff is, so move it later both so it is less absurd
      // futuresight and so you don't have to remember it as long.
      delaySeconds: 5,
      alertText: (data, _matches, output) => {
        const horizontal = data.ketuCrystalAdd.filter((x) => isHorizontalCrystal(x));
        const vertical = data.ketuCrystalAdd.filter((x) => !isHorizontalCrystal(x));
        if (horizontal.length !== 2 || vertical.length !== 2)
          return;

        // Crystal positions are always -15, -5, 5, 15.

        // Check if any verticals are on the outer vertical edges.
        for (const line of vertical) {
          const y = parseFloat(line.y);
          if (y < -10 || y > 10)
            return output.eastWestSafe!();
        }

        // Check if any horizontals are on the outer horizontal edges.
        for (const line of horizontal) {
          const x = parseFloat(line.x);
          if (x < -10 || x > 10)
            return output.northSouthSafe!();
        }

        return output.cornersSafe!();
      },
      outputStrings: {
        northSouthSafe: {
          en: 'North/South',
          de: 'Norden/Süden',
          fr: 'Nord/Sud',
          cn: '上/下',
          ko: '북/남',
        },
        eastWestSafe: {
          en: 'East/West',
          de: 'Osten/Westen',
          fr: 'Est/Ouest',
          cn: '左/右',
          ko: '동/서',
        },
        cornersSafe: {
          en: 'Corners',
          de: 'Ecken',
          fr: 'Coins',
          cn: '四角',
          ko: '구석',
        },
      },
    },
    {
      id: 'AAI Ketuduke Angry Seas',
      type: 'StartsUsing',
      netRegex: { id: '8AC1', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data.ketuHydroBuffIsSpreadFirst)
          return output.knockbackSpread!();
        if (data.ketuHydroBuffIsRoleStacks)
          return output.knockbackRoleStacks!();
        return output.knockbackStacks!();
      },
      outputStrings: {
        knockbackSpread: {
          en: 'Knockback => Spread',
          de: 'Rückstoß => verteilen',
          fr: 'Pousée => Écartez-vous',
          cn: '击退 => 分散',
          ko: '넉백 => 산개',
        },
        knockbackStacks: {
          en: 'Knockback => Stacks',
          de: 'Rückstoß => sammeln',
          fr: 'Poussée => Package',
          cn: '击退 => 分摊',
          ko: '넉백 => 쉐어',
        },
        knockbackRoleStacks: {
          en: 'Knockback => Role Stacks',
          de: 'Rückstoß => Rollengruppe sammeln',
          fr: 'Poussée => Package par rôle',
          cn: '击退 => 职能分摊',
          ko: '넉백 => 역할별 쉐어',
        },
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'AAI Wood Golem Ancient Aero III',
      type: 'StartsUsing',
      netRegex: { id: '8C4C', source: 'Aloalo Wood Golem' },
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'AAI Wood Golem Tornado',
      type: 'StartsUsing',
      netRegex: { id: '8C4D', source: 'Aloalo Wood Golem' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tornadoOn: {
            en: 'Away from ${player}',
            de: 'Weg von ${player}',
            fr: 'Loin de ${player}',
            cn: '远离 ${player}',
            ko: '${player}에게서 떨어지기',
          },
          tornadoOnYou: {
            en: 'Tornado on YOU',
            de: 'Tornado auf DIR',
            fr: 'Tornade sur VOUS',
            cn: '龙卷风点名',
            ko: '토네이도 대상자',
          },
        };

        if (data.me === matches.target)
          return { alertText: output.tornadoOnYou!() };
        return { infoText: output.tornadoOn!({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'AAI Wood Golem Tornado Bind',
      type: 'GainsEffect',
      netRegex: { effectId: 'EC0' },
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
          fr: 'Guérissez ${player}',
          cn: '康复 ${player}',
          ko: '${player} 디버프 해제',
        },
      },
    },
    {
      id: 'AAI Wood Golem Ovation',
      type: 'StartsUsing',
      netRegex: { id: '8BC1', source: 'Aloalo Wood Golem', capture: false },
      response: Responses.getBehind('info'),
    },
    {
      id: 'AAI Islekeeper Gravity Force',
      type: 'StartsUsing',
      netRegex: { id: '8BC5', source: 'Aloalo Islekeeper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Islekeeper Isle Drop',
      type: 'StartsUsing',
      netRegex: { id: '8C6F', source: 'Aloalo Islekeeper', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Behind + Out',
          de: 'Geh nach Hinten + Raus',
          fr: 'Derrière + Extérieur',
          cn: '去背后 + 远离',
          ko: '뒤로 + 밖으로',
        },
      },
    },
    {
      id: 'AAI Islekeeper Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '8C4E', source: 'Aloalo Islekeeper', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Islekeeper Ancient Quaga Enrage',
      type: 'StartsUsing',
      netRegex: { id: '8C2F', source: 'Aloalo Islekeeper', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Islekeeper!',
          de: 'Wächter besiegen!',
          fr: 'Tuez le gardien !',
          cn: '击杀 阿罗阿罗守卫!',
          ko: '섬지킴이 잡기!',
        },
      },
    },
    // ---------------- Lala ----------------
    {
      id: 'AAI Lala Inferno Theorem',
      type: 'StartsUsing',
      netRegex: { id: '88AE', source: 'Lala', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Lala Rotation Tracker',
      type: 'HeadMarker',
      netRegex: { id: ['01E4', '01E5'], target: 'Lala' },
      run: (data, matches) => data.lalaBossRotation = matches.id === '01E4' ? 'clock' : 'counter',
    },
    {
      id: 'AAI Lala Angular Addition Tracker',
      type: 'Ability',
      netRegex: { id: ['8889', '8D2E'], source: 'Lala' },
      run: (data, matches) => data.lalaBossTimes = matches.id === '8889' ? 3 : 5,
    },
    {
      id: 'AAI Lala Arcane Blight',
      type: 'StartsUsing',
      netRegex: { id: ['888B', '888C', '888D', '888E'], source: 'Lala' },
      alertText: (data, matches, output) => {
        const initialDir = {
          '888B': 2, // initial back safe
          '888C': 0, // initial front safe
          '888D': 1, // initial right safe
          '888E': 3, // initial left safe
        }[matches.id];
        if (initialDir === undefined)
          return;
        if (data.lalaBossTimes === undefined)
          return;
        if (data.lalaBossRotation === undefined)
          return;
        const rotationFactor = data.lalaBossRotation === 'clock' ? 1 : -1;
        const finalDir = (initialDir + rotationFactor * data.lalaBossTimes + 8) % 4;

        const diff = (finalDir - initialDir + 4) % 4;
        if (diff !== 1 && diff !== 3)
          return;
        return {
          0: output.front!(),
          1: output.right!(),
          2: output.back!(),
          3: output.left!(),
        }[finalDir];
      },
      run: (data) => {
        delete data.lalaBossTimes;
        delete data.lalaBossRotation;
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'AAI Lala Analysis Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E8E', 'E8F', 'E90', 'E91'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap: { [effectId: string]: typeof data.lalaUnseen } = {
          'E8E': 'front',
          'E8F': 'back',
          'E90': 'right',
          'E91': 'left',
        } as const;
        data.lalaUnseen = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Times Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E89', 'ECE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap: { [effectId: string]: typeof data.lalaPlayerTimes } = {
          'E89': 3,
          'ECE': 5,
        } as const;
        data.lalaPlayerTimes = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Player Rotation Collect',
      type: 'HeadMarker',
      netRegex: { id: ['01ED', '01EE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const idMap: { [id: string]: typeof data.lalaPlayerRotation } = {
          '01ED': 'counter',
          '01EE': 'clock',
        } as const;
        data.lalaPlayerRotation = idMap[matches.id];
      },
    },
    {
      id: 'AAI Lala Targeted Light',
      type: 'StartsUsing',
      netRegex: { id: '8CDE', source: 'Lala', capture: false },
      alertText: (data, _matches, output) => {
        const initialUnseen = data.lalaUnseen;
        if (initialUnseen === undefined)
          return;

        const initialDir = {
          front: 0,
          right: 1,
          back: 2,
          left: 3,
        }[initialUnseen];

        const rotation = data.lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data.lalaPlayerTimes;
        if (times === undefined)
          return;

        // The safe spot rotates, so the player counter-rotates.
        const rotationFactor = rotation === 'clock' ? -1 : 1;
        const finalDir = (initialDir + rotationFactor * times + 8) % 4;

        return {
          0: output.front!(),
          1: output.right!(),
          2: output.back!(),
          3: output.left!(),
        }[finalDir];
      },
      run: (data) => {
        delete data.lalaUnseen;
        delete data.lalaPlayerTimes;
      },
      outputStrings: {
        front: {
          en: 'Face Towards Lala',
          de: 'Lala anschauen',
          fr: 'Regardez Lala',
          cn: '面向拉拉鲁',
          ko: '라라 쳐다보기',
        },
        back: {
          en: 'Look Away from Lala',
          de: 'Von Lala weg schauen',
          fr: 'Ne regardez pas Lala',
          cn: '背对拉拉鲁',
          ko: '라라에게서 뒤돌기',
        },
        left: {
          en: 'Left Flank towards Lala',
          de: 'Linke Seite zu Lala zeigen',
          fr: 'Flanc gauche vers Lala',
          cn: '左侧朝向拉拉鲁',
          ko: '왼쪽면을 라라쪽으로',
        },
        right: {
          en: 'Right Flank towards Lala',
          de: 'Rechte Seite zu Lala zeigen',
          fr: 'Flanc droit vers Lala',
          cn: '右侧朝向拉拉鲁',
          ko: '오른쪽면을 라라쪽으로',
        },
      },
    },
    {
      id: 'AAI Lala Strategic Strike',
      type: 'StartsUsing',
      netRegex: { id: '88AD', source: 'Lala' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Lala Planar Tactics',
      type: 'GainsEffect',
      // E8B = Surge Vector
      // E8C = Subtractive Suppressor Alpha
      netRegex: { effectId: ['E8C', 'E8B'] },
      condition: (data, matches) => {
        data.lalaSubAlpha.push(matches);
        return data.lalaSubAlpha.length === 6;
      },
      durationSeconds: 7,
      // Only run once, as Surge Vector is used again.
      suppressSeconds: 9999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          one: {
            en: 'One',
            de: 'Eins',
            fr: 'Un',
            cn: '1',
            ko: '1',
          },
          bigTwo: {
            en: 'Two (stack with three)',
            de: 'Zwei (sammeln mit Drei)',
            fr: 'Deux (Pack avec Trois)',
            cn: '2 (和3分摊)',
            ko: '2 (3과 쉐어)',
          },
          smallTwo: {
            en: 'Two (stack with one)',
            de: 'Zwei (sammeln mit Eins)',
            fr: 'Deux (Pack avec Un',
            cn: '2 (和1分摊)',
            ko: '2 (1과 쉐어)',
          },
          eitherTwo: {
            en: 'Either Two (w/${player})',
            de: 'Eine Zwei (mit ${player})',
            fr: 'Un des deux (avec ${player})',
            cn: '2 (和 ${player})',
            ko: '2 (+ ${player})',
          },
          three: {
            en: 'Three',
            de: 'Drei',
            fr: 'Trois',
            cn: '3',
            ko: '3',
          },
          // This is just a raidcall so you can direct your friends.
          smallTwoOn: {
            en: '(Two with one: ${players})',
            de: '(Zwei mit Eins: ${players})',
            fr: '(Deux avec Un : ${players})',
            cn: '(和1分摊的2: ${players})',
            ko: '(2+1: ${players})',
          },
          unknownNum: {
            en: '${num}',
            de: '${num}',
            fr: '${num}',
            cn: '${num}',
            ko: '${num}',
          },
          num1: Outputs.num1,
          num2: Outputs.num2,
          num3: Outputs.num3,
          num4: Outputs.num4,
        };

        // For brevity, this code calls "small two" the two that stacks with one
        // and the "big two" the two that stacks with three.
        const stacks = data.lalaSubAlpha.filter((x) => x.effectId === 'E8B').map((x) => x.target);
        const nums = data.lalaSubAlpha.filter((x) => x.effectId === 'E8C');
        const myNumberStr = nums.find((x) => x.target === data.me)?.count;
        if (myNumberStr === undefined)
          return;
        const myNumber = parseInt(myNumberStr);
        if (myNumber < 1 || myNumber > 4)
          return;

        const defaultOutput = {
          alertText: output.unknownNum!({ num: output[`num${myNumber}`]!() }),
        } as const;

        if (stacks.length !== 2 || nums.length !== 4)
          return defaultOutput;

        const one = nums.find((x) => parseInt(x.count) === 1)?.target;
        if (one === undefined)
          return defaultOutput;
        const isOneStack = stacks.includes(one);
        const twos = nums.filter((x) => parseInt(x.count) === 2).map((x) => x.target);

        const smallTwos: string[] = [];
        for (const thisTwo of twos) {
          // can this two stack with the one?
          const isThisTwoStack = stacks.includes(thisTwo);
          if (isThisTwoStack && !isOneStack || !isThisTwoStack && isOneStack)
            smallTwos.push(thisTwo);
        }

        const [smallTwo1, smallTwo2] = smallTwos;
        if (smallTwos.length === 0 || smallTwo1 === undefined)
          return defaultOutput;

        const isPlayerSmallTwo = smallTwos.includes(data.me);

        // Worst case adjust
        if (isPlayerSmallTwo && smallTwo2 !== undefined) {
          const otherPlayer = smallTwo1 === data.me ? smallTwo2 : smallTwo1;
          return { alarmText: output.eitherTwo!({ player: data.party.member(otherPlayer) }) };
        }

        let playerRole: string;
        if (one === data.me) {
          playerRole = output.one!();
        } else if (twos.includes(data.me)) {
          playerRole = isPlayerSmallTwo ? output.smallTwo!() : output.bigTwo!();
        } else {
          playerRole = output.three!();
        }

        if (isPlayerSmallTwo)
          return { alertText: playerRole };

        return {
          alertText: playerRole,
          infoText: output.smallTwoOn!({ players: smallTwos.map((x) => data.party.member(x)) }),
        };
      },
    },
    {
      id: 'AAI Lala Forward March',
      type: 'GainsEffect',
      // E83 = Forward March
      netRegex: { effectId: 'E83' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 8,
      durationSeconds: 4,
      alertText: (data, _matches, output) => {
        const rotation = data.lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data.lalaPlayerTimes;
        if (times === undefined)
          return;

        const rotationFactor = rotation === 'clock' ? 1 : -1;
        const finalDir = (rotationFactor * times + 8) % 4;
        if (finalDir === 1)
          return output.left!();
        if (finalDir === 3)
          return output.right!();
      },
      run: (data) => {
        delete data.lalaPlayerRotation;
        delete data.lalaPlayerTimes;
      },
      outputStrings: {
        left: {
          en: 'Leftward March',
          de: 'Linker March',
          fr: 'Marche à gauche',
          cn: '强制移动: 左',
          ko: '강제이동: 왼쪽',
        },
        right: {
          en: 'Rightward March',
          de: 'Rechter March',
          fr: 'Marche à droite',
          cn: '强制移动: 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    {
      id: 'AAI Lala Spatial Tactics',
      type: 'GainsEffect',
      // E8D = Subtractive Suppressor Beta
      netRegex: { effectId: 'E8D' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 999999,
      alertText: (_data, matches, output) => {
        const num = parseInt(matches.count);
        if (num < 1 || num > 4)
          return;
        return output[`num${num}`]!();
      },
      outputStrings: {
        num1: {
          en: 'One (avoid all)',
          de: 'Eins (alles ausweichen)',
          fr: 'Un (Évitez tout)',
          cn: '1 (躲开全部)',
          ko: '1 (전부 피하기)',
        },
        num2: {
          en: 'Two (stay middle)',
          de: 'Zwei (steh in der Mitte)',
          fr: 'Deux (Restez au centre)',
          cn: '2 (待在中间)',
          ko: '2 (중앙에 머물기)',
        },
        num3: {
          en: 'Three (adjacent to middle)',
          de: 'Drei (steh neben der Mitte)',
          fr: 'Trois (adjacent au centre)',
          cn: '3 (中间相邻)',
          ko: '3 (중앙에서 옆 칸)',
        },
        num4: {
          en: 'Four',
          de: 'Vier',
          fr: 'Quatre',
          cn: '4',
          ko: '4',
        },
      },
    },
    // ---------------- Statice ----------------
    {
      id: 'AAI Statice Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '8949', source: 'Statice', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Statice Trick Reload',
      type: 'Ability',
      // 8925 = Locked and Loaded
      // 8926 = Misload
      netRegex: { id: ['8925', '8926'], source: 'Statice' },
      preRun: (data, matches) => data.staticeBullet.push(matches),
      alertText: (data, _matches, output) => {
        // Statice loads 8 bullets, two are duds.
        // The first and the last are always opposite, and one of them is a dud.
        // The first/ last bullets are for Trapshooting and the middle six are for Trigger Happy.
        const [bullet] = data.staticeBullet;
        if (data.staticeBullet.length !== 1 || bullet === undefined)
          return;
        const isStack = bullet.id === '8926';
        data.staticeTrapshooting = isStack ? ['stack', 'spread'] : ['spread', 'stack'];
        return isStack ? output.stackThenSpread!() : output.spreadThenStack!();
      },
      infoText: (data, _matches, output) => {
        const lastBullet = data.staticeBullet[data.staticeBullet.length - 1];
        if (data.staticeBullet.length < 2 || data.staticeBullet.length > 7)
          return;
        if (lastBullet?.id !== '8926')
          return;
        data.staticeTriggerHappy = data.staticeBullet.length - 1;
        return output.numSafeLater!({ num: output[`num${data.staticeTriggerHappy}`]!() });
      },
      run: (data) => {
        if (data.staticeBullet.length === 8)
          data.staticeBullet = [];
      },
      outputStrings: {
        stackThenSpread: Outputs.stackThenSpread,
        spreadThenStack: Outputs.spreadThenStack,
        numSafeLater: {
          en: '(${num} safe later)',
          de: '(${num} später sicher)',
          fr: '(${num} sûr ensuite)',
          cn: '(稍后 ${num} 安全)',
          ko: '(나중에 ${num} 안전)',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Trapshooting',
      type: 'StartsUsing',
      netRegex: { id: ['8D1A', '8959'], source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const mech = data.staticeTrapshooting.shift();
        if (mech === undefined)
          return;
        return output[mech]!();
      },
      outputStrings: {
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'AAI Statice Trigger Happy',
      type: 'StartsUsing',
      netRegex: { id: '894B', source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const num = data.staticeTriggerHappy;
        if (num === undefined)
          return;
        return output[`num${num}`]!();
      },
      run: (data) => delete data.staticeTriggerHappy,
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Bull\'s-eye',
      type: 'GainsEffect',
      netRegex: { effectId: 'E9E' },
      delaySeconds: (data, matches) => {
        // Note: this collects for the pinwheeling dartboard version too.
        data.staticeDart.push(matches);
        return data.staticeDart.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart on YOU',
            de: 'Dart auf DIR',
            fr: 'Dard sur VOUS',
            cn: '飞镖点名',
            ko: '다트 대상자',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
            fr: 'Pas de Dard',
            cn: '无飞镖',
            ko: '다트 없음',
          },
          flexCall: {
            en: '(${player} unmarked)',
            de: '(${player} unmarkiert)',
            fr: '(${player} non-marqué)',
            cn: '(${player} 无标记)',
            ko: '(${player} 다트 없음)',
          },
        };

        if (data.staticeIsPinwheelingDartboard)
          return;

        if (data.staticeDart.length === 0)
          return;

        const dartTargets = data.staticeDart.map((x) => x.target);

        if (!dartTargets.includes(data.me))
          return { alertText: output.noDartOnYou!() };

        const partyNames = data.party.partyNames;

        const flexers = partyNames.filter((x) => !dartTargets.includes(x));
        const [flex] = flexers;
        const flexPlayer = flexers.length === 1 ? data.party.member(flex) : undefined;

        return {
          alertText: output.dartOnYou!(),
          infoText: output.flexCall!({ player: flexPlayer }),
        };
      },
      run: (data) => data.staticeDart = [],
    },
    {
      id: 'AAI Statice Surprise Balloon Reminder',
      // This is an early reminder for the following Trigger Happy with knockback.
      // However, because there's a tight window to immuune both knockbacks,
      // call this ~15s early (in case anybody forgot).
      type: 'StartsUsing',
      netRegex: { id: '894D', source: 'Statice', capture: false },
      infoText: (data, _matches, output) => {
        const num = data.staticeTriggerHappy;
        if (num === undefined)
          return;
        // We'll re-call this out with the knockback warning.
        // However, also clear `data.staticeTriggerHappy` to avoid double callouts.
        data.staticePopTriggerHappyNum = num;
        return output.numSafeSoon!({ num: output[`num${num}`]!() });
      },
      run: (data) => delete data.staticeTriggerHappy,
      outputStrings: {
        numSafeSoon: {
          en: '(${num} safe soon)',
          de: '(${num} gleich sicher)',
          fr: '(${num} bientôt sûr',
          cn: '(稍后 ${num} 安全)',
          ko: '(나중에 ${num} 안전)',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Pop',
      type: 'StartsUsing',
      // TODO: this might need a slight delay
      netRegex: { id: '894E', source: 'Statice', capture: false },
      suppressSeconds: 20,
      alertText: (data, _matches, output) => {
        const num = data.staticePopTriggerHappyNum;
        if (num === undefined)
          return output.knockback!();

        const numStr = output[`num${num}`]!();
        return output.knockbackToNum!({ num: numStr });
      },
      run: (data) => delete data.staticePopTriggerHappyNum,
      outputStrings: {
        knockbackToNum: {
          en: 'Knockback => ${num}',
          de: 'Rückstoß => ${num}',
          fr: 'Poussée => ${num}',
          cn: '击退 => ${num}',
          ko: '넉백 => ${num}',
        },
        knockback: Outputs.knockback,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Face',
      type: 'GainsEffect',
      // DD2 = Forward March
      // DD3 = About Face
      // DD4 = Left Face
      // DD5 = Right Face
      netRegex: { effectId: ['DD2', 'DD3', 'DD4', 'DD5'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 7,
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        let mech = output.unknown!();

        const num = data.staticeTriggerHappy;
        if (num !== undefined) {
          mech = output[`num${num}`]!();
          delete data.staticeTriggerHappy;
        } else {
          const mechName = data.staticeTrapshooting.shift();
          mech = mechName === undefined ? output.unknown!() : output[mechName]!();
        }

        return {
          'DD2': output.forward!({ mech: mech }),
          'DD3': output.backward!({ mech: mech }),
          'DD4': output.left!({ mech: mech }),
          'DD5': output.right!({ mech: mech }),
        }[matches.effectId];
      },
      outputStrings: {
        forward: {
          en: 'Forward March => ${mech}',
          de: 'Vorwärtsmarsch => ${mech}',
          fr: 'Marche en avant => ${mech}',
          cn: '强制移动：前 => ${mech}',
          ko: '강제이동: 앞 => ${mech}',
        },
        backward: {
          en: 'Backward March => ${mech}',
          de: 'Rückwärtsmarsch => ${mech}',
          fr: 'Marche en arrière => ${mech}',
          cn: '强制移动：后 => ${mech}',
          ko: '강제이동: 뒤 => ${mech}',
        },
        left: {
          en: 'Left March => ${mech}',
          de: 'Marsch Links => ${mech}',
          fr: 'Marche à gauche => ${mech}',
          cn: '强制移动：左 => ${mech}',
          ko: '강제이동: 왼쪽 => ${mech}',
        },
        right: {
          en: 'Right March => ${mech}',
          de: 'Marsch Rechts => ${mech}',
          fr: 'Marche à droite => ${mech}',
          cn: '强制移动：右 => ${mech}',
          ko: '강제이동: 오른쪽 => ${mech}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AAI Statice Present Box Counter',
      // This happens ~1s prior to ActorControlExtra on bomb.
      type: 'StartsUsing',
      netRegex: { id: '8955', source: 'Statice', capture: false },
      run: (data) => data.staticePresentBoxCount++,
    },
    {
      id: 'AAI Statice Present Box Missile',
      type: 'Tether',
      netRegex: { source: 'Surprising Missile', id: '0011' },
      delaySeconds: (data, matches) => {
        data.staticeMissileTether.push(matches);
        return data.staticeMissileTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 7,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missileOnYou: {
            en: 'Bait Tethers => Missile Spread',
            de: 'Verbindungen ködern => Verteilen mit Raketen',
            fr: 'Attirez les liens => Écartez les missiles',
            cn: '引导拉线 => 导弹分散',
            ko: '사슬 유도 => 미사일 산개',
          },
        };

        if (data.staticeMissileTether.length !== 2)
          return;

        const missileTether = data.staticeMissileTether.find((x) => x.target === data.me);
        if (missileTether === undefined)
          return;

        return { alertText: output.missileOnYou!() };
      },
      run: (data) => data.staticeMissileTether = [],
    },
    {
      id: 'AAI Statice Present Box Claw',
      type: 'Tether',
      netRegex: { source: 'Surprising Claw', id: '0011' },
      delaySeconds: (data, matches) => {
        data.staticeClawTether.push(matches);
        return data.staticeClawTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        if (data.staticeClawTether.length !== 2)
          return;
        if (!data.staticeClawTether.map((x) => x.target).includes(data.me))
          return;
        return output.stack!();
      },
      run: (data) => data.staticeClawTether = [],
      outputStrings: {
        stack: {
          en: 'Juke Claw => Stack',
          de: 'Zieh Klaue => Sammeln',
          fr: 'Griffe => Package',
          cn: '爪子连线 => 分摊',
          ko: '손아귀 => 쉐어',
        },
      },
    },
    {
      id: 'AAI Statice Burning Chains',
      type: 'GainsEffect',
      netRegex: { effectId: '301' },
      condition: Conditions.targetIsYou(),
      // TODO: add a strategy for dart colors and say where to go here
      // for the Pinwheeling Dartboard if you have a dart.
      response: Responses.breakChains(),
    },
    {
      id: 'AAI Statice Shocking Abandon',
      type: 'StartsUsing',
      netRegex: { id: '8948', source: 'Statice' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Tracker',
      type: 'StartsUsing',
      netRegex: { id: '8CBC', source: 'Statice', capture: false },
      run: (data) => data.staticeIsPinwheelingDartboard = true,
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Color',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12507' },
      durationSeconds: 6,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart (w/${player})',
            de: 'Dart (mit ${player})',
            fr: 'Dard (avec ${player})',
            cn: '飞镖 (和 ${player})',
            ko: '다트 (+ ${player})',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
            fr: 'Pas de dard',
            cn: '无飞镖',
            ko: '다트 없음',
          },
          blue: {
            en: 'Avoid Blue',
            de: 'Vermeide Blau',
            fr: 'Évitez le bleu',
            cn: '躲避蓝色',
            ko: '파란색 피하기',
          },
          red: {
            en: 'Avoid Red',
            de: 'Vermeide Rot',
            fr: 'Évitez le rouge',
            cn: '躲避红色',
            ko: '빨간색 피하기',
          },
          yellow: {
            en: 'Avoid Yellow',
            de: 'Vermeide Gelb',
            fr: 'Évitez le jaune',
            cn: '躲避黄色',
            ko: '노란색 피하기',
          },
        };

        let infoText: string | undefined;

        const centerX = -200;
        const centerY = 0;
        const x = parseFloat(matches.x) - centerX;
        const y = parseFloat(matches.y) - centerY;

        // 12 pie slices, the edge of the first one is directly north.
        // It goes in B R Y order repeating 4 times.
        // The 0.5 subtraction (12 - 0.5 = 11.5) is because the Homing Pattern
        // lands directly in the middle of a slice.
        const dir12 = Math.round(6 - 6 * Math.atan2(x, y) / Math.PI + 11.5) % 12;

        const colorOffset = dir12 % 3;
        const colorMap: { [offset: number]: typeof data.staticeHomingColor } = {
          0: 'blue',
          1: 'red',
          2: 'yellow',
        } as const;

        data.staticeHomingColor = colorMap[colorOffset];
        if (data.staticeHomingColor !== undefined)
          infoText = output[data.staticeHomingColor]!();

        if (data.staticeDart.length !== 2)
          return { infoText };

        const dartTargets = data.staticeDart.map((x) => x.target);
        if (!dartTargets.includes(data.me))
          return { alertText: output.noDartOnYou!(), infoText: infoText };

        const [target1, target2] = dartTargets;
        if (target1 === undefined || target2 === undefined)
          return { infoText };
        const otherTarget = data.party.member(target1 === data.me ? target2 : target1);
        return { alertText: output.dartOnYou!({ player: otherTarget }), infoText: infoText };
      },
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Mech',
      type: 'HeadMarker',
      netRegex: { id: headmarkerIds.tethers },
      condition: (data) => data.staticeIsPinwheelingDartboard,
      delaySeconds: (data, matches) => {
        data.staticeDartboardTether.push(matches);
        return data.staticeDartboardTether.length === 2 ? 0 : 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data.staticeDartboardTether.length !== 2)
          return;

        const tethers = data.staticeDartboardTether.map((x) => x.target);

        if (tethers.includes(data.me)) {
          const [tether1, tether2] = tethers;
          const other = data.party.member(tether1 === data.me ? tether2 : tether1);
          return output.tether!({ player: other });
        }

        const partyNames = data.party.partyNames;
        const nonTethers = partyNames.filter((x) => !tethers.includes(x));
        const [stack1, stack2] = nonTethers;
        const other = data.party.member(stack1 === data.me ? stack2 : stack1);
        return output.stack!({ player: other });
      },
      run: (data) => data.staticeDartboardTether = [],
      outputStrings: {
        // TODO: maybe this should remind you of dart color
        tether: {
          en: 'Tether w/${player}',
          de: 'Verbindung mit ${player}',
          fr: 'Lien avec ${player}',
          cn: '连线 和 ${player}',
          ko: '사슬 +${player}',
        },
        stack: {
          en: 'Stack w/${player}',
          de: 'Sammeln mit ${player}',
          fr: 'Package avec ${player}',
          cn: '分摊 和 ${player}',
          ko: '쉐어 +${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Far Tide/Near Tide': 'Far/Near Tide',
        'Hydrobullet/Hydrofall': 'Hydrobullet/fall',
        'Hydrofall/Hydrobullet': 'Hydrofall/bullet',
        'Receding Twintides/Encroaching Twintides': 'Receding/Encroaching Twintides',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aloalo Golem': 'Aloalo-Holzgolem',
        'Aloalo Islekeeper': 'Aloalo-Wächter',
        'Aloalo Kiwakin': 'Aloalo-Kiwakin',
        'Aloalo Monk': 'Aloalo-Mönch',
        'Aloalo Ray': 'Aloalo-Rochen',
        'Aloalo Snipper': 'Aloalo-Schnippler',
        'Aloalo Wood Golem': 'Aloalo-Holzgolem',
        'Aloalo Zaratan': 'Aloalo-Zaratan',
        'Arcane Font': 'arkan(?:e|er|es|en) Körper',
        'Arcane Globe': 'arkan(?:e|er|es|en) Kugel',
        'Ball of Fire': 'Feuerkugel',
        'Bomb': 'Bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'Nadel',
        'Spring Crystal': 'Wasserquell-Kristall',
        'Statice': 'Statice',
        'Surprising Claw': 'Überraschungsklaue',
        'Surprising Missile': 'Überraschungsrakete',
        'Surprising Staff': 'Überraschungsstab',
        'The Dawn Trial': 'Morgenrot-Probe',
        'The Dusk Trial': 'Abendrot-Probe',
        'The Midnight Trial': 'Vollmond-Probe',
      },
      'replaceText': {
        '\\(buff\\)': '(Statusveränderung)',
        '\\(cast\\)': '(wirken)',
        'Aero II': 'Windra',
        'Aero IV': 'Windka',
        'Analysis': 'Analyse',
        'Angry Seas': 'Zornige Fluten',
        'Angular Addition': 'Winkeladdition',
        'Arcane Array': 'Arkanes Spektrum',
        'Arcane Blight': 'Arkane Fäule',
        'Arcane Mine': 'Arkane Mine',
        'Arcane Plot': 'Arkane Flur',
        'Arcane Point': 'Arkane Stätte',
        'Beguiling Glitter': 'Irrleuchten',
        'Blowing Bubbles': 'Pusteblasen',
        'Bright Pulse': 'Glühen',
        'Bubble Net': 'Blasennetz',
        'Burning Chains': 'Brennende Ketten',
        'Burst': 'Explosion',
        'Constructive Figure': 'Ruf der Schöpfer',
        'Dartboard of Dancing Explosives': 'Darts und Drehung',
        'Encroaching Twintides': 'Ring der Zwiegezeiten',
        'Explosive Theorem': 'Arkane Fäule',
        'Faerie Ring': 'Feenring',
        'Far Tide': 'Ring der Gezeiten',
        'Fire Spread': 'Brandstiftung',
        'Fireworks': 'Feuerwerk',
        'Fluke Gale': 'Flossensturm',
        'Fluke Typhoon': 'Flossentaifun',
        'Hundred Lashings': 'Auspeitschung',
        'Hydrobomb': 'Hydro-Bombe',
        'Hydrobullet': 'Hydro-Kugel',
        'Hydrofall': 'Hydro-Sturz',
        'Inferno Divide': 'Infernale Teilung',
        'Inferno Theorem': 'Infernales Theorem',
        'Locked and Loaded': 'Geladen und entsichert',
        'Misload': 'Fehlladung',
        'Near Tide': 'Kreis der Gezeiten',
        'Pinwheeling Dartboard': 'Darts und Rad',
        'Planar Tactics': 'Flächentaktiken',
        'Pop': 'Platzen',
        'Powerful Light': 'Entladenes Licht',
        'Present Box': 'Geschenkschachtel',
        'Radiance': 'Radiation',
        'Receding Twintides': 'Kreis der Zwiegezeiten',
        'Ring a Ring o\' Explosions': 'Ringel-Ringel-Bombe',
        '(?<! )Roar': 'Brüllen',
        'Saturate': 'Wasserfontäne',
        'Shocking Abandon': 'Schockende Hingabe',
        'Spatial Tactics': 'Raumtaktiken',
        'Sphere Shatter': 'Sphärensplitterung',
        'Spring Crystals': 'Quellkristalle',
        'Strategic Strike': 'Schwere Attacke',
        'Strewn Bubbles': 'Streublasen',
        'Surprise Balloon': 'Überraschungsballon',
        'Surprise Needle': 'Überraschungsnadel',
        'Symmetric Surge': 'Symmetrischer Schub',
        'Targeted Light': 'Gezieltes Licht',
        'Telluric Theorem': 'Tellurisches Theorem',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Trapshooting': 'Tontaubenschuss',
        'Trick Reload': 'Trickladung',
        'Trigger Happy': 'Schießwut',
        'Uncommon Ground': 'Voll ins Schwarze',
        'Updraft': 'Aufwind',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aloalo Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Islekeeper': 'gardien d\'Aloalo',
        'Aloalo Kiwakin': 'kiwakin d\'Aloalo',
        'Aloalo Monk': 'moine d\'Aloalo',
        'Aloalo Ray': 'raie rayée d\'Aloalo',
        'Aloalo Snipper': 'cisailleur d\'Aloalo',
        'Aloalo Wood Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Zaratan': 'zaratan d\'Aloalo',
        'Arcane Font': 'sphère arcanique',
        'Arcane Globe': 'globe arcanique',
        'Ball of Fire': 'orbe de feu',
        'Bomb': 'bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'aiguille',
        'Spring Crystal': 'cristal de source',
        'Statice': 'Statice',
        'Surprising Claw': 'griffe surprise',
        'Surprising Missile': 'missile surprise',
        'Surprising Staff': 'sceptre surprise',
        'The Dawn Trial': 'Épreuve de Dilumu',
        'The Dusk Trial': 'Épreuve de Qurupe',
        'The Midnight Trial': 'Épreuve de Nokosero',
      },
      'replaceText': {
        '\\(buff\\)': '(Buff)',
        '\\(cast\\)': '(Incantation)',
        'Aero II': 'Extra Vent',
        'Aero IV': 'Giga Vent',
        'Analysis': 'Analyse',
        'Angry Seas': 'Mer agitée',
        'Angular Addition': 'Calcul angulaire',
        'Arcane Array': 'Assemblement arcanique',
        'Arcane Blight': 'Canon arcanique',
        'Arcane Mine': 'Mine arcanique',
        'Arcane Plot': 'Modulateur arcanique',
        'Arcane Point': 'Pointe arcanique',
        'Beguiling Glitter': 'Paillettes aveuglantes',
        'Blowing Bubbles': 'Bulles soufflées',
        'Bright Pulse': 'Éclat',
        'Bubble Net': 'Filet de bulles',
        'Burning Chains': 'Chaînes brûlantes',
        'Burst': 'Explosion',
        'Constructive Figure': 'Icône articulée',
        'Dartboard of Dancing Explosives': 'Duo fléchettes-tourbillon',
        'Encroaching Twintides': 'Double marée débordante',
        'Explosive Theorem': 'Théorème explosif',
        'Faerie Ring': 'Cercle féérique',
        'Far Tide': 'Marée lointaine',
        'Fire Spread': 'Nappe de feu',
        'Fireworks': 'Feu d\'artifice',
        'Fluke Gale': 'Bourrasque hasardeuse',
        'Fluke Typhoon': 'Typhon hasardeux',
        'Hundred Lashings': 'Cent coups de fouet',
        'Hydrobomb': 'Hydrobombe',
        'Hydrobullet': 'Barillet hydrique',
        'Hydrofall': 'Pilonnage hydrique',
        'Inferno Divide': 'Division infernale',
        'Inferno Theorem': 'Théorème infernal',
        'Locked and Loaded': 'Rechargement réussi',
        'Misload': 'Rechargement raté',
        'Near Tide': 'Marée proche',
        'Pinwheeling Dartboard': 'Duo fléchettes-moulinette',
        'Planar Tactics': 'Tactique planaire',
        'Pop': 'Rupture',
        'Powerful Light': 'Explosion sacrée',
        'Present Box': 'Boîtes cadeaux',
        'Radiance': 'Irradiation',
        'Receding Twintides': 'Double marée fuyante',
        'Ring a Ring o\' Explosions': 'Tempérament explosif',
        '(?<! )Roar': 'Rugissement',
        'Saturate': 'Jet d\'eau',
        'Shocking Abandon': 'Choc renonciateur',
        'Spatial Tactics': 'Tactique spatiale',
        'Sphere Shatter': 'Rupture glacée',
        'Spring Crystals': 'Cristaux de source',
        'Strategic Strike': 'Coup violent',
        'Strewn Bubbles': 'Bulles éparpillées',
        'Surprise Balloon': 'Ballons surprises',
        'Surprise Needle': 'Aiguille surprise',
        'Symmetric Surge': 'Déferlement symétrique',
        'Targeted Light': 'Rayon ciblé',
        'Telluric Theorem': 'Théorème tellurique',
        'Tidal Roar': 'Vague rugissante',
        'Trapshooting': 'Tir au pigeon',
        'Trick Reload': 'Rechargement habile',
        'Trigger Happy': 'Gâchette impulsive',
        'Uncommon Ground': 'Terrain de mésentente',
        'Updraft': 'Courants ascendants',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aloalo Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Islekeeper': 'アロアロ・キーパー',
        'Aloalo Kiwakin': 'アロアロ・キワキン',
        'Aloalo Monk': 'アロアロ・モンク',
        'Aloalo Ray': 'アロアロ・ストライプレイ',
        'Aloalo Snipper': 'アロアロ・スニッパー',
        'Aloalo Wood Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Zaratan': 'アロアロ・ザラタン',
        'Arcane Font': '立体魔法陣',
        'Arcane Globe': '球体魔法陣',
        'Ball of Fire': '火球',
        'Bomb': '爆弾',
        'Ketuduke': 'ケトゥドゥケ',
        'Lala': 'ララ',
        'Needle': 'ニードル',
        'Spring Crystal': '湧水のクリスタル',
        'Statice': 'スターチス',
        'Surprising Claw': 'サプライズ・クロー',
        'Surprising Missile': 'サプライズ・ミサイル',
        'Surprising Staff': 'サプライズ・ロッド',
        'The Dawn Trial': 'ディルムの試練',
        'The Dusk Trial': 'クルペの試練',
        'The Midnight Trial': 'ノコセロの試練',
      },
      'replaceText': {
        'Aero II': 'エアロラ',
        'Aero IV': 'エアロジャ',
        'Analysis': 'アナライズ',
        'Angry Seas': 'アングリーシーズ',
        'Angular Addition': '回転角乗算',
        'Arcane Array': '複合魔紋',
        'Arcane Blight': '魔紋砲',
        'Arcane Mine': '地雷魔紋',
        'Arcane Plot': '変光魔紋',
        'Arcane Point': '変光起爆',
        'Beguiling Glitter': '惑わしの光',
        'Blowing Bubbles': 'バブルブロワー',
        'Bright Pulse': '閃光',
        'Bubble Net': 'バブルネットフィーディング',
        'Burning Chains': '炎の鎖',
        'Burst': '爆発',
        'Constructive Figure': '人形召喚',
        'Dartboard of Dancing Explosives': 'ダーツ＆ローテーション',
        'Encroaching Twintides': 'リング・ダブルタイド',
        'Explosive Theorem': '魔爆法',
        'Faerie Ring': 'フェアリーリング',
        'Far Tide': 'リングタイド',
        'Fire Spread': '放火',
        'Fireworks': 'ファイアワークフェスティバル',
        'Fluke Gale': 'フリッパーゲイル',
        'Fluke Typhoon': 'フリッパータイフーン',
        'Hundred Lashings': 'めった打ち',
        'Hydrobomb': 'ハイドロボム',
        'Hydrobullet': 'ハイドロバレット',
        'Hydrofall': 'ハイドロフォール',
        'Inferno Divide': '十火法',
        'Inferno Theorem': '散火法',
        'Locked and Loaded': 'リロード成功',
        'Misload': 'リロード失敗',
        'Near Tide': 'ラウンドタイド',
        'Pinwheeling Dartboard': 'ダーツ＆ウィール',
        'Planar Tactics': '爆雷戦術：面',
        'Pop': '破裂',
        'Powerful Light': '光爆',
        'Present Box': 'プレゼントボックス',
        'Radiance': '光球爆散',
        'Receding Twintides': 'ラウンド・ダブルタイド',
        'Ring a Ring o\' Explosions': 'リンクリンクボム',
        '(?<! )Roar': '咆哮',
        'Saturate': '放水',
        'Shocking Abandon': 'アバンドンショック',
        'Spatial Tactics': '爆雷戦術：立体',
        'Sphere Shatter': '破裂',
        'Spring Crystals': '湧水のクリスタル',
        'Strategic Strike': '強撃',
        'Strewn Bubbles': 'バブルストゥルー',
        'Surprise Balloon': 'サプライズバルーン',
        'Surprise Needle': 'サプライズニードル',
        'Symmetric Surge': '双数爆撃',
        'Targeted Light': '高精度光弾',
        'Telluric Theorem': '地隆法',
        'Tidal Roar': 'タイダルロア',
        'Trapshooting': 'トラップシューティング',
        'Trick Reload': 'トリックリロード',
        'Trigger Happy': 'トリガーハッピー',
        'Uncommon Ground': 'グラウンドシアー',
        'Updraft': '上昇気流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aloalo Golem': '阿罗阿罗树木巨像',
        'Aloalo Islekeeper': '阿罗阿罗守卫',
        'Aloalo Kiwakin': '阿罗阿罗奇瓦金',
        'Aloalo Monk': '阿罗阿罗鬼鱼',
        'Aloalo Ray': '阿罗阿罗斑鳐',
        'Aloalo Snipper': '阿罗阿罗利螯陆蟹',
        'Aloalo Wood Golem': '阿罗阿罗树木巨像',
        'Aloalo Zaratan': '阿罗阿罗扎拉坦',
        'Arcane Font': '立体魔法阵',
        'Arcane Globe': '球体魔法阵',
        'Ball of Fire': '火球',
        'Bomb': '炸弹',
        'Ketuduke': '凯图嘟凯',
        'Lala': '拉拉鲁',
        'Needle': '飞针',
        'Spring Crystal': '涌水水晶',
        'Statice': '斯塔缇丝',
        'Surprising Claw': '惊喜爪',
        'Surprising Missile': '惊喜导弹',
        'Surprising Staff': '惊喜杖',
        'The Dawn Trial': '曙色的试炼',
        'The Dusk Trial': '暮色的试炼',
        'The Midnight Trial': '夜色的试炼',
      },
      'replaceText': {
        '\\(buff\\)': '(强化)',
        '\\(cast\\)': '(咏唱)',
        'Aero II': '烈风',
        'Aero IV': '飙风',
        'Analysis': '分析',
        'Angry Seas': '愤怒之海',
        'Angular Addition': '旋转角乘算',
        'Arcane Array': '复合魔纹',
        'Arcane Blight': '魔纹炮',
        'Arcane Mine': '地雷魔纹',
        'Arcane Plot': '变光魔纹',
        'Arcane Point': '变光爆炸',
        'Beguiling Glitter': '幻惑之光',
        'Blowing Bubbles': '吹气泡',
        'Bright Pulse': '闪光',
        'Bubble Net': '捕食气泡网',
        'Burning Chains': '火焰链',
        'Burst': '爆炸',
        'Constructive Figure': '召唤人偶',
        'Dartboard of Dancing Explosives': '飞镖·炸弹·转转转',
        'Encroaching Twintides': '环浪连潮',
        'Explosive Theorem': '魔爆法',
        'Faerie Ring': '仙女环',
        'Far Tide': '环浪',
        'Fire Spread': '喷火',
        'Fireworks': '焰火嘉年华',
        'Fluke Gale': '鲸尾突风',
        'Fluke Typhoon': '鲸尾台风',
        'Hundred Lashings': '胡乱打',
        'Hydrobomb': '水化爆弹',
        'Hydrobullet': '水化弹',
        'Hydrofall': '水瀑',
        'Inferno Divide': '十字火法',
        'Inferno Theorem': '散火法',
        'Locked and Loaded': '装填成功',
        'Misload': '装填失败',
        'Near Tide': '圆浪',
        'Pinwheeling Dartboard': '飞镖·焰火·转转转',
        'Planar Tactics': '平面爆雷战术',
        'Pop': '碎裂',
        'Powerful Light': '光爆',
        'Present Box': '礼物箱',
        'Radiance': '光球爆炸',
        'Receding Twintides': '圆浪连潮',
        'Ring a Ring o\' Explosions': '炸弹连连看',
        '(?<! )Roar': '咆哮',
        'Saturate': '喷水',
        'Shocking Abandon': '放纵冲击',
        'Spatial Tactics': '立体爆雷战术',
        'Sphere Shatter': '碎裂',
        'Spring Crystals': '涌水水晶',
        'Strategic Strike': '强击',
        'Strewn Bubbles': '散布气泡',
        'Surprise Balloon': '惊喜气球',
        'Surprise Needle': '惊喜飞针',
        'Symmetric Surge': '双数爆炸',
        'Targeted Light': '高精度光弹',
        'Telluric Theorem': '地隆法',
        'Tidal Roar': '怒潮咆哮',
        'Trapshooting': '陷阱射击',
        'Trick Reload': '花式装填',
        'Trigger Happy': '开心扳机',
        'Uncommon Ground': '盘面攻击',
        'Updraft': '上升气流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aloalo Golem': '알로알로 나무골렘',
        'Aloalo Islekeeper': '알로알로 섬지킴이',
        'Aloalo Kiwakin': '알로알로 키와킨',
        'Aloalo Monk': '알로알로 문어',
        'Aloalo Ray': '알로알로 줄가오리',
        'Aloalo Snipper': '알로알로 싹둑게',
        'Aloalo Wood Golem': '알로알로 나무골렘',
        'Aloalo Zaratan': '알로알로 자라탄',
        'Arcane Font': '입체마법진',
        'Arcane Globe': '구체마법진',
        'Ball of Fire': '불덩이',
        'Bomb': '폭탄',
        'Ketuduke': '케투두케',
        'Lala': '랄랄',
        'Needle': '바늘',
        'Spring Crystal': '샘물의 크리스탈',
        'Statice': '스타티스',
        'Surprising Claw': '깜짝 손아귀',
        'Surprising Missile': '깜짝 미사일',
        'Surprising Staff': '깜짝 지팡이',
        'The Dawn Trial': '딜루무의 시련',
        'The Dusk Trial': '쿠루페의 시련',
        'The Midnight Trial': '노코세로의 시련',
      },
      'replaceText': {
        '\\(buff\\)': '(디버프)',
        '\\(cast\\)': '(시전)',
        'Aero II': '에어로라',
        'Aero IV': '에어로쟈',
        'Analysis': '분석',
        'Angry Seas': '성난 바다',
        'Angular Addition': '회전각 가산',
        'Arcane Array': '복합 마법 문양',
        'Arcane Blight': '마법 문양포',
        'Arcane Mine': '지뢰 마법 문양',
        'Arcane Plot': '변광 마법 문양',
        'Arcane Point': '변광 기폭',
        'Beguiling Glitter': '환혹의 빛',
        'Blowing Bubbles': '거품 방울',
        'Bright Pulse': '섬광',
        'Bubble Net': '거품 그물 투망',
        'Burning Chains': '화염 사슬',
        'Burst': '산산조각',
        'Constructive Figure': '인형 소환',
        'Dartboard of Dancing Explosives': '다트 돌림판',
        'Encroaching Twintides': '먼바다 연속 풍랑',
        'Explosive Theorem': '마폭법',
        'Faerie Ring': '요정의 고리',
        'Far Tide': '먼바다 풍랑',
        'Fire Spread': '방화',
        'Fireworks': '폭죽 잔치',
        'Fluke Gale': '지느러미 돌풍',
        'Fluke Typhoon': '지느러미 태풍',
        'Hundred Lashings': '마구 때리기',
        'Hydrobomb': '물폭탄',
        'Hydrobullet': '물총알',
        'Hydrofall': '물 쏟기',
        'Inferno Divide': '십자화법',
        'Inferno Theorem': '산화법',
        'Locked and Loaded': '장전 성공',
        'Misload': '장전 실패',
        'Near Tide': '앞바다 풍랑',
        'Pinwheeling Dartboard': '다트 폭죽',
        'Planar Tactics': '폭뢰전술: 평면',
        'Pop': '파열',
        'Powerful Light': '빛의 폭발',
        'Present Box': '선물상자',
        'Radiance': '빛구슬 폭발',
        'Receding Twintides': '앞바다 연속 풍랑',
        'Ring a Ring o\' Explosions': '연결 폭탄',
        '(?<! )Roar': '포효',
        'Saturate': '물 뿜기',
        'Shocking Abandon': '투하 충격',
        'Spatial Tactics': '폭뢰전술: 입체',
        'Sphere Shatter': '파열',
        'Spring Crystals': '샘물의 크리스탈',
        'Strategic Strike': '강력 공격',
        'Strewn Bubbles': '거품 유포',
        'Surprise Balloon': '깜짝 풍선',
        'Surprise Needle': '깜짝 바늘',
        'Symmetric Surge': '대칭 폭격',
        'Targeted Light': '고정밀 광탄',
        'Telluric Theorem': '융기법',
        'Tidal Roar': '바다의 포효',
        'Trapshooting': '함정 사격',
        'Trick Reload': '요술 장전',
        'Trigger Happy': '마구잡이 발사',
        'Uncommon Ground': '그슬린 땅',
        'Updraft': '상승 기류',
      },
    },
  ],
};

export default triggerSet;
