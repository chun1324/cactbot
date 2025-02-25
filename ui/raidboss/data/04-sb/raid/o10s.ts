import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  lastSpinWasHorizontal?: boolean;
}

// TODO: fix tail end (seemed to not work??)
// TODO: add phase tracking (so death from above/below can tell you to swap or not)
// TODO: add swap callout after exaflares
// TODO: debuff tracking for when you lose the barrier to remind you to run?
// TODO: ice head markers
// TODO: stack head markers

// O10S - Alphascape 2.0 Savage
const triggerSet: TriggerSet<Data> = {
  id: 'AlphascapeV20Savage',
  zoneId: ZoneId.AlphascapeV20Savage,
  timelineFile: 'o10s.txt',
  triggers: [
    {
      id: 'O10S Tail End',
      type: 'StartsUsing',
      netRegex: { id: '31AA', source: 'Midgardsormr' },
      response: Responses.tankBuster(),
    },
    {
      id: 'O10S Fire Marker',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      alarmText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.fireOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me !== matches.target)
          return output.fireOn!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        fireOnYou: {
          en: 'Fire Marker on YOU',
          de: 'Feuer Marker auf DIR',
          fr: 'Marqueur feu sur VOUS',
          ja: '自分にマーカー',
          cn: '喷火点名',
          ko: '불징 대상자',
        },
        fireOn: {
          en: 'Fire Marker on ${player}',
          de: 'Feuer Markierung auf ${player}',
          fr: 'Marqueur feu sur ${player}',
          ja: '${player} にマーカー',
          cn: '喷火点${player}',
          ko: '${player} 불징',
        },
      },
    },
    {
      id: 'O10S Death From Below',
      type: 'HeadMarker',
      netRegex: { id: '008F' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Death From Below',
          de: 'Tod von unten',
          fr: 'Désastre terrestre',
          ja: '地の災厄',
          cn: '地之灾厄',
          ko: '디버프 확인',
        },
      },
    },
    {
      id: 'O10S Death From Above',
      type: 'HeadMarker',
      netRegex: { id: '008E' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Death From Above',
          de: 'Tod von oben',
          fr: 'Désastre céleste',
          ja: '天の災厄',
          cn: '天之灾厄',
          ko: '디버프 확인',
        },
      },
    },
    {
      // Spin Table
      // 31AC + 31AE = 31B2 (horiz + horiz = out)
      // 31AC + 31B0 = 31B4 (horiz + vert = in)
      // 31AD + 31AE = 31B3 (vert + horiz = x)
      // 31AD + 31B0 = 31B5 (vert + vert = +)
      id: 'O10S Spin Cleanup',
      type: 'Ability',
      // 16 if it doesn't hit anybody, 15 if it does.
      // Also, some log lines are inconsistent here and don't always list
      // Midgardsormr's name and are sometimes blank.
      netRegex: { id: '31B[2345]', source: ['Midgardsormr', ''], capture: false },
      run: (data) => delete data.lastSpinWasHorizontal,
    },
    {
      id: 'O10S Horizontal Spin 1',
      type: 'Ability',
      netRegex: { id: '31AC', source: 'Midgardsormr', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.lastSpinWasHorizontal = true,
      outputStrings: {
        text: {
          en: 'Next Spin: In or Out',
          de: 'Nächste Drehung: Rein oder Raus',
          fr: 'Tour suivant : Intérieur ou Extérieur',
          ja: '次: 中/外',
          cn: '下一转：靠近或远离',
          ko: '안쪽 / 바깥쪽',
        },
      },
    },
    {
      id: 'O10S Vertical Spin 1',
      type: 'Ability',
      netRegex: { id: '31AD', source: 'Midgardsormr', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.lastSpinWasHorizontal = false,
      outputStrings: {
        text: {
          en: 'Next Spin: Cardinals or Corners',
          de: 'Nächste Drehung: Kanten oder Ecken',
          fr: 'Tour suivant : Cardinal ou Coins',
          ja: '次: コーナー',
          cn: '下一转：靠边或角落',
          ko: '십자 / 대각선',
        },
      },
    },
    {
      id: 'O10S Horizontal Spin 2',
      type: 'Ability',
      netRegex: { id: '31AE', source: 'Midgardsormr', capture: false },
      condition: (data) => data.lastSpinWasHorizontal !== undefined,
      alertText: (data, _matches, output) => {
        if (data.lastSpinWasHorizontal)
          return output.getOut!();

        return output.goToCardinals!();
      },
      outputStrings: {
        getOut: {
          en: 'Get Out',
          de: 'Raus da',
          fr: 'Sortez',
          ja: '外へ',
          cn: '远离',
          ko: '밖으로',
        },
        goToCardinals: {
          en: 'Go To Cardinals',
          de: 'An die Kanten',
          fr: 'Allez sur un cardinal',
          ja: '横や縦へ',
          cn: '靠边',
          ko: '십자 산개',
        },
      },
    },
    {
      id: 'O10S Vertical Spin 2',
      type: 'Ability',
      netRegex: { id: '31B0', source: 'Midgardsormr', capture: false },
      condition: (data) => data.lastSpinWasHorizontal !== undefined,
      alertText: (data, _matches, output) => {
        if (data.lastSpinWasHorizontal)
          return output.getIn!();

        return output.goToCorners!();
      },
      outputStrings: {
        getIn: {
          en: 'Get In',
          de: 'Rein da',
          fr: 'Passez en dessous',
          ja: '中へ',
          cn: '靠近',
          ko: '안으로',
        },
        goToCorners: {
          en: 'Go To Corners',
          de: 'In die Ecken',
          fr: 'Allez dans les coins',
          ja: '角へ',
          cn: '角落',
          ko: '구석 산개',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Dragon': 'antik(?:e|er|es|en) Drache',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cardinals': 'Kanten',
        'Cauterize': 'Kauterisieren',
        'Corners': 'Ecken',
        'Crimson Breath': 'Purpurschwingen',
        'Dry Ice': 'Trockeneis',
        'Earth Shaker': 'Erdstoß',
        'Exaflare': 'Exaflare',
        'Flame Blast': 'Flammenhölle',
        'Flip': 'Rolle',
        'Frost Breath': 'Frostiger Atem',
        'Horrid Roar': 'Entsetzliches Brüllen',
        'Hot Tail': 'Schwelender Schweif',
        'In/Out': 'Rein/Raus',
        '(?<!\/)Out': 'Raus',
        'Northern Cross': 'Kreuz des Nordens',
        'Position': 'Position',
        'Protostar': 'Protostern',
        'Shaker/Thunder': 'Erdstoß/Blitz',
        'Signal': 'Signal',
        'Spin': 'Drehung',
        'Tail End': 'Schweifspitze',
        'Thunderstorm': 'Gewitter',
        'Time Immemorial': 'Urknall',
        'Touchdown': 'Himmelssturz',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ancient Dragon': 'dragon ancien',
        'Midgardsormr': 'Midgardsormr',
      },
      'replaceText': {
        '\\?': ' ?',
        'Akh Morn': 'Akh Morn',
        'Akh Rhai': 'Akh Rhai',
        'Cardinals': 'Cardinaux',
        'Cauterize': 'Cautérisation',
        'Corners': 'Coins',
        'Crimson Breath': 'Souffle écarlate',
        'Dry Ice': 'Poussière glaçante',
        'Earth Shaker': 'Secousse',
        'Enrage Hit': 'Enrage coup',
        'Exaflare': 'ExaBrasier',
        'Flame Blast': 'Fournaise',
        '(?<!/)Flip(?!/)': 'Tour vertical',
        'Flip/Spin': 'Tour vertical/horizontal',
        'Frost Breath': 'Souffle glacé',
        'Horrid Roar': 'Rugissement horrible',
        'Hot Tail': 'Queue calorifique',
        '(?<!\\w)In(?!\\w)': 'Intérieur',
        '(?<!\\w)Out': 'Extérieur',
        'Northern Cross': 'Croix du nord',
        'Position': 'Position',
        'Protostar': 'Proto-étoile',
        'Shaker/Thunder': 'Secousse/Tempête',
        '(?<!/)Spin(?!/)': 'Tour horizontal',
        'Spin/Flip': 'Tour horizontal/vertical',
        'Tail End': 'Pointe de queue',
        'Thunderstorm': 'Tempête de foudre',
        'Time Immemorial': 'Big bang',
        'Touchdown': 'Atterrissage',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ancient Dragon': 'エンシェントドラゴン',
        'Midgardsormr': 'ミドガルズオルム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Akh Rhai': 'アク・ラーイ',
        'Cardinals': '横や縦',
        'Cauterize': 'カータライズ',
        'Corners': '角',
        'Crimson Breath': 'クリムゾンブレス',
        'Dry Ice': 'フリージングダスト',
        'Earth Shaker': 'アースシェイカー',
        'Exaflare': 'エクサフレア',
        'Flame Blast': 'フレイムブラスト',
        'Flip': '回転',
        'Frost Breath': 'フロストブレス',
        'Horrid Roar': 'ホリッドロア',
        'Hot Tail': 'ヒートテイル',
        'In/Out': '中/外',
        '(?<!\/)Out': '外',
        'Northern Cross': 'ノーザンクロス',
        'Position': 'ポジション',
        'Protostar': 'プロトスター',
        'Shaker/Thunder': 'シェーカー/サンダー',
        'Signal': 'フラグ',
        'Spin': 'ぶん回す',
        'Tail End': 'テイルエンド',
        'Thunderstorm': 'サンダーストーム',
        'Time Immemorial': '天地開闢',
        'Touchdown': 'タッチダウン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ancient Dragon': '远古之龙',
        'Midgardsormr': '尘世幻龙',
      },
      'replaceText': {
        'ready': '准备',
        'Akh Morn': '死亡轮回',
        'Akh Rhai': '天光轮回',
        'Cardinals': '边',
        'Cauterize': '低温俯冲',
        'Corners': '角',
        'Crimson Breath': '深红吐息',
        'Dry Ice': '冰尘',
        'Earth Shaker': '大地摇动',
        'Exaflare': '百京核爆',
        'Flame Blast': '烈焰十字爆',
        'Flip': '竖转',
        'Frost Breath': '寒霜吐息',
        'Horrid Roar': '恐惧咆哮',
        'Hot Tail': '燃烧之尾',
        'In/Out': '靠近/远离',
        '(?<!\/)Out': '远离',
        'Northern Cross': '北十字星',
        'Position': '站位',
        'Protostar': '原恒星',
        'Shaker/Thunder': '大地摇动/闪雷风暴',
        'Signal': '信号',
        'Spin': '横转',
        'Tail End': '煞尾',
        'Thunderstorm': '雷暴',
        'Time Immemorial': '开天辟地',
        'Touchdown': '空降',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Midgardsormr': '미드가르드오름',
        'Ancient Dragon': '고룡',
      },
      'replaceText': {
        ' ready': ' 준비 완료',
        'Akh Morn': '아크 몬',
        'Akh Rhai': '아크 라이',
        'Cardinals': '맵 측면',
        'Cauterize': '인두질',
        'Corners': '구석',
        'Crimson Breath': '진홍빛 숨결',
        'Dry Ice': '지면 동결',
        'Earth Shaker': '요동치는 대지',
        'Exaflare': '엑사플레어',
        'Flame Blast': '화염 작렬',
        'Flip': '앞회전',
        'Frost Breath': '서리 숨결',
        'Horrid Roar': '소름끼치는 포효',
        'Hot Tail': '뜨거운 꼬리',
        'In/Out': '안/밖',
        '(?<!\/)Out': '밖',
        'Northern Cross': '북십자성',
        'Position': '위치',
        'Protostar': '원시별',
        'Shaker/Thunder': '어스/번개',
        'Signal': '신호',
        'Spin': '마구 돌리기',
        'Tail End': '꼬리 쓸기',
        'Thunderstorm': '번개 폭풍',
        'Time Immemorial': '천지개벽',
        'Touchdown': '착지',
      },
    },
  ],
};

export default triggerSet;
