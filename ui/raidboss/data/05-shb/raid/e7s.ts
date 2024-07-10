import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  boundless?: { [name: string]: string };
  phase?: string;
  betwixtWorldsTethers?: string[];
  betwixtWorldsStack?: string[];
  falseMidnightSpread?: string[];
  insatiableLightStack?: string[];
  color?: 'light' | 'dark';
}

const colorMap = {
  light: {
    en: 'Dark',
    de: 'Dunkel',
    fr: 'Noir',
    ja: '黒',
    cn: '黑色',
    ko: '어둠',
  },
  dark: {
    en: 'Light',
    de: 'Licht',
    fr: 'Blanc',
    ja: '白',
    cn: '白色',
    ko: '빛',
  },
} as const;

const triggerSet: TriggerSet<Data> = {
  id: 'EdensVerseIconoclasmSavage',
  zoneId: ZoneId.EdensVerseIconoclasmSavage,
  timelineFile: 'e7s.txt',
  triggers: [
    {
      id: 'E7S Empty Wave',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4C8A', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E7S Unshadowed Stake',
      type: 'Tether',
      netRegex: { source: 'The Idol Of Darkness', id: '0025' },
      response: Responses.tankBuster(),
    },
    {
      id: 'E7S Betwixt Worlds',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4CFD', capture: false },
      run: (data) => data.phase = 'betwixtWorlds',
    },
    {
      id: 'E7S Betwixt Worlds Tether',
      type: 'Tether',
      netRegex: { source: 'The Idol Of Darkness', id: '0011' },
      condition: (data) => data.phase === 'betwixtWorlds',
      preRun: (data, matches) => {
        data.betwixtWorldsTethers ??= [];
        data.betwixtWorldsTethers.push(matches.target);
      },
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Tether on YOU',
          de: 'Verbindung auf DIR',
          fr: 'Lien sur VOUS',
          ja: '自分に線',
          cn: '連線點名',
          ko: '선 대상자',
        },
      },
    },
    {
      id: 'E7S Betwixt Worlds Stack',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      condition: (data) => data.phase === 'betwixtWorlds',
      preRun: (data, matches) => {
        data.betwixtWorldsStack ??= [];
        data.betwixtWorldsStack.push(matches.target);
      },
      alertText: (data, matches, output) => {
        data.betwixtWorldsTethers ??= [];
        if (data.betwixtWorldsTethers.includes(data.me))
          return;
        if (data.me === matches.target)
          return output.stackOnYou!();

        if (!data.betwixtWorldsStack || data.betwixtWorldsStack.length === 1)
          return;
        const names = data.betwixtWorldsStack.map((x) => data.party.member(x)).sort();
        return output.stackOn!({ players: names });
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackOn: {
          en: 'Stack (${players})',
          de: 'Sammeln (${players})',
          fr: 'Package sur (${players})',
          ja: '頭割り (${players})',
          cn: '集合 (${players})',
          ko: '모이기 (${players})',
        },
      },
    },
    {
      id: 'E7S Left With Thee',
      type: 'GainsEffect',
      netRegex: { effectId: '8C2' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Teleporting Left',
          de: 'Teleportation Links',
          fr: 'Téléportation à gauche',
          ja: '左にテレポ',
          cn: '向左傳送',
          ko: '왼쪽으로 순간이동',
        },
      },
    },
    {
      id: 'E7S Right With Thee',
      type: 'GainsEffect',
      netRegex: { effectId: '8C3' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Teleporting Right',
          de: 'Teleportation Rechts',
          fr: 'Téléportation à droite',
          ja: '右にテレポ',
          cn: '向右傳送',
          ko: '오른쪽으로 순간이동',
        },
      },
    },
    {
      id: 'E7S Forward With Thee',
      type: 'GainsEffect',
      netRegex: { effectId: '8C0' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Teleporting Forward',
          de: 'Teleportation Vorwärts',
          fr: 'Téléportation devant',
          ja: '前にテレポ',
          cn: '向前傳送',
          ko: '앞으로 순간이동',
        },
      },
    },
    {
      id: 'E7S Back With Thee',
      type: 'GainsEffect',
      netRegex: { effectId: '8C1' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Teleporting Back',
          de: 'Teleportation Rückwärts',
          fr: 'Téléportation derrière',
          ja: '後ろにテレポ',
          cn: '向後傳送',
          ko: '뒤로 순간이동',
        },
      },
    },
    {
      id: 'E7S False Midnight',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4C99', capture: false },
      run: (data) => data.phase = 'falseMidnight',
    },
    {
      id: 'E7S Silver Shot',
      type: 'HeadMarker',
      netRegex: { id: '0065' },
      condition: (data) => data.phase === 'falseMidnight',
      preRun: (data, matches) => {
        data.falseMidnightSpread ??= [];
        data.falseMidnightSpread.push(matches.target);
      },
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text!();
      },
      outputStrings: {
        text: Outputs.spread,
      },
    },
    {
      id: 'E7S Silver Sledge',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      condition: (data) => data.phase === 'falseMidnight',
      // The stack marker is in the middle of spreads,
      // so delay a tiny bit to call out stack so that
      // it is not called out on spreads.
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        data.falseMidnightSpread ??= [];
        if (data.falseMidnightSpread.includes(data.me))
          return;
        if (data.me === matches.target)
          return output.stackOnYou!();

        return output.stackOn!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackOn: Outputs.stackOnPlayer,
      },
    },
    {
      id: 'E7S Adds',
      type: 'AddedCombatant',
      netRegex: { name: 'Blasphemy', capture: false },
      suppressSeconds: 1,
      run: (data) => data.phase = 'adds',
    },
    {
      id: 'E7S Advent Of Light',
      type: 'StartsUsing',
      netRegex: { source: 'Idolatry', id: '4C6E' },
      condition: (data) => data.CanSilence(),
      suppressSeconds: 1,
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'E7S Insatiable Light Stack',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      condition: (data) => data.phase === 'adds',
      preRun: (data, matches) => {
        data.insatiableLightStack ??= [];
        data.insatiableLightStack.push(matches.target);
      },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.stackOnYou!();

        if (!data.insatiableLightStack || data.insatiableLightStack.length === 1)
          return;
        const names = data.insatiableLightStack.map((x) => data.party.member(x)).sort();
        return output.stackPlayers!({ players: names });
      },
      outputStrings: {
        stackOnYou: Outputs.stackOnYou,
        stackPlayers: {
          en: 'Stack (${players})',
          de: 'Sammeln (${players})',
          fr: 'Packez-vous (${players})',
          ja: '頭割り (${players})',
          cn: '集合 (${players})',
          ko: '모이기 (${players})',
        },
      },
    },
    {
      id: 'E7S Insatiable Light',
      type: 'Ability',
      netRegex: { source: 'Idolatry', id: '4C6D', capture: false },
      run: (data) => data.insatiableLightStack = [],
    },
    {
      id: 'E7S Strength in Numbers',
      type: 'StartsUsing',
      netRegex: { source: 'Idolatry', id: '4C70', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get under vertical add',
          de: 'Unter das vertikale Add gehen',
          fr: 'Allez sous l\'add vertical',
          ja: '縦回転をする雑魚へ',
          cn: '去豎轉小怪腳下',
          ko: '세로로 도는 쫄 아래로',
        },
      },
    },
    {
      id: 'E7S Unearned Envy',
      type: 'Ability',
      netRegex: { source: 'Blasphemy', id: '4C74', capture: false },
      durationSeconds: 7,
      suppressSeconds: 15,
      response: Responses.aoe(),
    },
    {
      id: 'E7S Empty Flood',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '(?:4C8[BC]|4E5[56])', capture: false },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'E7S Astral Effect',
      type: 'GainsEffect',
      netRegex: { effectId: '8BE' },
      condition: Conditions.targetIsYou(),
      run: (data) => data.color = 'light',
    },
    {
      id: 'E7S Umbral Effect',
      type: 'GainsEffect',
      netRegex: { effectId: '8BF' },
      condition: Conditions.targetIsYou(),
      run: (data) => data.color = 'dark',
    },
    {
      id: 'E7S Boundless Tracker',
      type: 'StartsUsing',
      netRegex: { source: 'Unforgiven Idolatry', id: '4C5[CD]' },
      run: (data, matches) => {
        data.boundless ??= {};
        const oppositeColor = matches.id === '4C5C' ? 'dark' : 'light';
        data.boundless[oppositeColor] = matches.target;
      },
    },
    {
      id: 'E7S Boundless Light Dark Stack',
      type: 'StartsUsing',
      netRegex: { source: 'Unforgiven Idolatry', id: '4C5[CD]' },
      condition: (data, matches) => {
        if (Object.keys(data.boundless ?? {}).length !== 2)
          return false;
        const oppositeColor = matches.id === '4C5C' ? 'dark' : 'light';
        return data.color === oppositeColor;
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          text: {
            en: 'Avoid ${player}',
            de: 'Vermeide ${player}',
            fr: 'Évitez ${player}',
            ja: '${player} に避け',
            cn: '躲開 ${player}',
            ko: '${player}피하기',
          },
        };
        if (!data.boundless)
          return;

        // If somebody is taking both, definitely don't stack with them!
        if (data.boundless.light === data.boundless.dark) {
          if (matches.target === data.me)
            return;
          return { infoText: output.text!({ player: data.party.member(matches.target) }) };
        }

        return Responses.stackMarkerOn();
      },
    },
    {
      id: 'E7S Boundless Cleanup',
      type: 'StartsUsing',
      netRegex: { source: 'Unforgiven Idolatry', id: '4C5[CD]', capture: false },
      delaySeconds: 20,
      run: (data) => delete data.boundless,
    },
    {
      id: 'E7S Words of Night',
      type: 'StartsUsing',
      netRegex: { source: 'Unforgiven Idolatry', id: '(?:4C2C|4C65)', capture: false },
      alertText: (data, _matches, output) => {
        if (!data.color)
          return;
        const colorTrans = colorMap[data.color];
        const color = colorTrans[data.displayLang];
        if (!color)
          return;
        return output.text!({ color: color });
      },
      outputStrings: {
        text: {
          en: 'Get hit by ${color}',
          de: 'Lass dich treffen von ${color}',
          fr: 'Encaissez le ${color}',
          ja: '${color}を受ける',
          cn: '撞${color}',
          ko: '${color} 맞기',
        },
      },
    },
    {
      id: 'E7S False Dawn',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4C9A', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Puddles',
          de: 'Flächen ködern',
          fr: 'Placez les zones au sol',
          ja: '誘導',
          cn: '放圈',
          ko: '장판 버리기',
        },
      },
    },
    {
      id: 'E7S Crusade',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4C76', capture: false },
      // Can't use knockback prevention for this, so say where to get knocked back.
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Knocked Into Corner',
          de: 'Lass dich in die Ecke zurückstoßen',
          fr: 'Faites-vous pousser dans les coins',
          ja: 'コーナーへノックバック',
          cn: '擊退到角落',
          ko: '구석으로 넉백',
        },
      },
    },
    {
      id: 'E7S Unjoined Aspect P3',
      type: 'Ability',
      netRegex: { source: 'The Idol Of Darkness', id: '4C7A', capture: false },
      // Color buffs go out immediately after the cast
      delaySeconds: 0.1,
      infoText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.goSouth!();

        if (data.color === 'light')
          return output.goNorthwest!();

        return output.goNortheast!();
      },
      outputStrings: {
        goSouth: {
          en: 'Go South',
          de: 'Geh nach Süden',
          fr: 'Allez au Sud',
          ja: '南へ',
          cn: '前往南側',
          ko: '남쪽',
        },
        goNorthwest: {
          en: 'Go Northwest',
          de: 'Geh nach Nordwesten',
          fr: 'Allez au Nord-Ouest',
          ja: '北西へ',
          cn: '前往西北',
          ko: '북서쪽',
        },
        goNortheast: {
          en: 'Go Northeast',
          de: 'Geh nach Nordosten',
          fr: 'Allez au Nord-Est',
          ja: '北東へ',
          cn: '前往東北',
          ko: '북동쪽',
        },
      },
    },
    {
      id: 'E7S Threefold Grace',
      type: 'StartsUsing',
      netRegex: { source: 'The Idol Of Darkness', id: '4C7E', capture: false },
      alertText: (data, _matches, output) => {
        if (!data.color)
          return;
        const colorTrans = colorMap[data.color];
        const color = colorTrans[data.displayLang];
        if (!color)
          return;
        return output.text!({ color: color });
      },
      outputStrings: {
        text: {
          en: 'Stand in ${color}',
          de: 'Stehe in ${color}',
          fr: 'Restez sur ${color}',
          ja: '${color}に踏む',
          cn: '站進${color}',
          ko: '${color}에 서기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Unforgiven Idolatry': 'ungeläutert(?:e|er|es|en) Götzenverehrung',
        'The Idol Of Darkness': 'Götzenbild der Dunkelheit',
        '(?<! )Idolatry': 'Idolatrie',
        'Blasphemy': 'Blasphemie',
      },
      'replaceText': {
        'Words Of Unity': 'Kommando: Stürmischer Angriff',
        'Words Of Spite': 'Kommando: Anvisieren',
        'Words Of Night': 'Kommando: Nächtlicher Angriff',
        'Words Of Motion': 'Kommando: Wellen',
        'Words Of Fervor': 'Kommando: Wilder Tanz',
        'Words Of Entrapment': 'Kommando: Einkesselung',
        'Unshadowed Stake': 'Dunkler Nagel',
        'Unjoined Aspect': 'Attributswechsel',
        'Unearned Envy': 'Verteidigungsinstinkt',
        'Threefold Grace': 'Dreifache Korona',
        'Stygian Sword': 'Schwarzes Schwert',
        'Stygian Spear': 'Schwarzer Speer',
        'Strength In Numbers': 'Angriffsmanöver',
        'Silver Sword': 'Weißes Lichtschwert',
        'Silver Stake': 'Heller Nagel',
        'Silver Spear': 'Weißer Lichtspeer',
        'Silver Sledge': 'Weißer Lichthammer',
        'Silver Shot': 'Weißer Lichtpfeil',
        'Silver Scourge': 'Peitschendes Licht',
        'Shockwave': 'Schockwelle',
        'Overwhelming Force': 'Vernichtende Schlammflut',
        'Light\'s Course': 'Weißer Strom des Lichts',
        'Insatiable Light': 'Licht des Verderbens',
        'Fate\'s Course': 'Reißender Strom',
        'False Moonlight': 'Manöver der Nacht',
        'False Midnight': 'Manöver der Polarnacht',
        'False Dawn': 'Manöver des Morgengrauens',
        'Empty Wave': 'Welle der Leere',
        'Empty Flood': 'Flut der Leere',
        'Dark\'s Course': 'Weißer Strom des Lichts',
        'Crusade': 'Ansturm',
        'Boundless Light': 'Weißer Lichtstrom',
        'Black Smoke': 'Schwarzes Feuer',
        'Betwixt Worlds': 'Dimensionsloch',
        'Away With Thee': 'Zwangsumwandlung',
        'Advent Of Light': 'Lichtsaturation',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Unforgiven Idolatry': 'Nuée D\'idolâtries Impardonnables',
        'The Idol Of Darkness': 'Idole des Ténèbres',
        '(?<! )Idolatry': 'Vol D\'idolâtries Impardonnables',
        'Blasphemy': 'Vol D\'idolâtries Impardonnables',
      },
      'replaceText': {
        'Words Of Unity': 'Ordre d\'assaut',
        'Words Of Spite': 'Ordre de visée',
        'Words Of Night': 'Ordre d\'attaque-surprise',
        'Words Of Motion': 'Ordre de déferlement',
        'Words Of Fervor': 'Ordre de virevolte',
        'Words Of Entrapment': 'Ordre d\'encerclement',
        'White/Black Smoke': 'Brûlure immaculée/ténébreuse',
        'Unshadowed Stake': 'Poinçon clair-obscur',
        'Unjoined Aspect': 'Transition élémentaire',
        'Unearned Envy': 'Mécanisme de défense',
        'Threefold Grace': 'Couronne triple',
        'Stygian Sword': 'Épée ténébreuse',
        'Stygian Spear': 'Lance ténébreuse',
        'Strength In Numbers': 'Murmuration offensive',
        'Silver Sword': 'Épée immaculée',
        'Silver Stake': 'Poinçon immaculé',
        'Silver Spear': 'Lance immaculée',
        'Silver Sledge': 'Pilon immaculé',
        'Silver Shot': 'Trait immaculé',
        'Silver Scourge': 'Lumière fustigeante',
        'Shockwave': 'Onde de choc',
        'Overwhelming Force': 'Remous destructeurs',
        'Light\'s Course': 'Déferlement immaculé',
        'Insatiable Light': 'Lumière destructrice',
        'Fate\'s Course': 'Flot d\'énergie',
        'False Moonlight': 'Murmuration du jour polaire',
        'False Midnight': 'Murmuration de la nuit polaire',
        'False Dawn': 'Murmuration de l\'aube',
        'Empty Wave': 'Onde de néant',
        'Empty Flood': 'Déluge de néant',
        'Dark\'s Course': 'Déferlement ténébreux',
        'Crusade': 'Plongeon de la nuée',
        'Boundless Light': 'Flot immaculé',
        'Betwixt Worlds': 'Brèche dimensionnelle',
        'Away With Thee': 'Translation forcée',
        'Advent Of Light': 'Plénitude lumineuse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'unforgiven idolatry': 'アンフォーギヴン・アイドラトリー',
        'the Idol of Darkness': 'ダークアイドル',
        '(?<! )idolatry': 'アイドラトリー',
        'blasphemy': 'ブラスヒーム',
      },
      'replaceText': {
        'Words of Unity': '強襲の号令',
        'Words of Spite': '照準の号令',
        'Words of Night': '夜襲の号令',
        'Words of Motion': '波状の号令',
        'Words of Fervor': '乱舞の号令',
        'Words of Entrapment': '包囲の号令',
        'Unshadowed Stake': '闇光の釘',
        'Unjoined Aspect': '属性変動',
        'Unearned Envy': '防衛本能',
        'Threefold Grace': '三重光環',
        'Stygian Sword': '黒闇の剣',
        'Stygian Spear': '黒闇の槍',
        'Strength in Numbers': '攻撃機動',
        'Silver Sword': '白光の剣',
        'Silver Stake': '白光の釘',
        'Silver Spear': '白光の槍',
        'Silver Sledge': '白光の槌',
        'Silver Shot': '白光の矢',
        'Silver Scourge': '白光の鞭',
        'Shockwave': '衝撃波',
        'Overwhelming Force': '破滅の濁流',
        'Light\'s Course': '白光の奔流',
        'Insatiable Light': '破滅の光',
        'Fate\'s Course': '奔流',
        'False Moonlight': '白夜の機動',
        'False Midnight': '極夜の機動',
        'False Dawn': '黎明の機動',
        'Empty Wave': '虚無の波動',
        'Empty Flood': '虚無の氾濫',
        'Dark\'s Course': '白光の奔流',
        'Crusade': '群体突進',
        'Boundless Light': '白光の激流',
        'Black Smoke': '黒闇の火',
        'Betwixt Worlds': '次元孔',
        'Away with Thee': '強制転移',
        'Advent of Light': '光の飽和',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Idol Of Darkness': '暗黑心象',
        'Unforgiven Idolatry': '未被寬恕的盲崇',
        'Blasphemy': '褻瀆',
        '(?<! )Idolatry': '盲崇',
      },
      'replaceText': {
        'Empty Wave': '虛無波動',
        'Unshadowed Stake': '暗光釘',
        'Silver Stake': '白光之釘',
        'Words Of Motion': '波狀號令',
        'Betwixt Worlds': '次元孔',
        'Light\'s Course': '白光奔流',
        'Shockwave': '衝擊波',
        'Words Of Spite': '瞄準號令',
        'Away With Thee': '強制傳送',
        'Silver Sledge': '白光之錘',
        'Fate\'s Course': '奔流',
        'False Moonlight': '白夜機動',
        'Silver Sword': '白光之劍',
        'Dark\'s Course': '黑暗奔流',
        'Silver Scourge': '白光之鞭',
        'False Midnight': '極夜機動',
        'Silver Shot': '白光之矢',
        'Overwhelming Force': '破滅濁流',
        'Insatiable Light': '破滅之光',
        'Advent Of Light': '極限光',
        'Strength In Numbers': '攻擊機動',
        'Unearned Envy': '防禦本能',
        'Empty Flood': '虛無氾濫',
        'Unjoined Aspect': '屬性變動',
        'Words Of Unity': '強襲號令',
        'Words Of Entrapment': '包圍號令',
        'White/Black Smoke': '白光/黑暗之火',
        'Boundless Light': '白光激流',
        'Words Of Night': '夜襲號令',
        'False Dawn': '黎明機動',
        'Stygian Sword': '黑暗之劍',
        'Stygian Spear': '黑暗之槍',
        'Silver Spear': '白光之槍',
        'Crusade': '群體突進',
        'Words Of Fervor': '亂舞號令',
        'Threefold Grace': '三重光環',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Idol Of Darkness': '어둠의 우상',
        'Unforgiven Idolatry': '면죄되지 않은 숭배',
        'Blasphemy': '신성 모독',
        '(?<! )Idolatry': '숭배',
      },
      'replaceText': {
        'Empty Wave': '허무의 파동',
        'Unshadowed Stake': '암광의 못',
        'Silver Stake': '백광의 못',
        'Words Of Motion': '파상의 호령',
        'Betwixt Worlds': '차원 구멍',
        'Light\'s Course': '백광의 급류',
        'Shockwave': '충격파',
        'Words Of Spite': '조준의 호령',
        'Away With Thee': '강제 전송',
        'Silver Sledge': '백광의 망치',
        'Fate\'s Course': '급류',
        'False Moonlight': '백야 기동',
        'Silver Sword': '백광의 검',
        'Dark\'s Course': '흑암의 급류',
        'Silver Scourge': '백광의 채찍',
        'False Midnight': '극야 기동',
        'Silver Shot': '백광의 화살',
        'Overwhelming Force': '파멸의 탁류',
        'Insatiable Light': '파멸의 빛',
        'Advent Of Light': '빛의 포화',
        'Strength In Numbers': '공격 기동',
        'Unearned Envy': '방어 본능',
        'Empty Flood': '허무의 범람',
        'Unjoined Aspect': '속성 변동',
        'Words Of Unity': '강습의 호령',
        'Words Of Entrapment': '포위의 호령',
        'White/Black Smoke': '백광/흑암의 불',
        'Boundless Light': '백광의 격류',
        'Words Of Night': '야습의 호령',
        'False Dawn': '여명 기동',
        'Stygian Sword': '흑암의 검',
        'Stygian Spear': '흑암의 창',
        'Silver Spear': '백광의 창',
        'Crusade': '무리 돌진',
        'Words Of Fervor': '난무의 호령',
        'Threefold Grace': '삼중 빛고리',
      },
    },
  ],
};

export default triggerSet;
