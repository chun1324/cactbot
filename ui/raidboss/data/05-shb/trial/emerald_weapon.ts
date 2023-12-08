import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenMines?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'CastrumMarinum',
  zoneId: ZoneId.CastrumMarinum,
  timelineFile: 'emerald_weapon.txt',
  triggers: [
    {
      id: 'Emerald Emerald Shot',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: '5554' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Emerald Optimized Ultima',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: ['5555', '5556', '5B0F'], capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Emerald Magitek Magnetism',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: '5B0[56]', capture: false },
      condition: (data) => data.seenMines || data.role !== 'tank',
      delaySeconds: 9,
      durationSeconds: 6,
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.seenMines = true,
      outputStrings: {
        text: {
          en: 'Get Near Tethered Mines',
          de: 'Nahe den Bomben mit gleicher Polarisierung',
          fr: 'Allez vers les mines de même polarité',
          ja: '同じ極性の爆雷に近づく',
          cn: '靠近同級地雷',
          ko: '같은 극성 폭탄쪽으로',
        },
      },
    },
    {
      id: 'Emerald Sidescathe Left',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: ['553F', '5540'], capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Emerald Sidescathe Right',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: ['5541', '5542'], capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Emerald Emerald Crusher',
      type: 'StartsUsing',
      netRegex: { source: 'The Emerald Weapon', id: ['553C', '553D'], capture: false },
      // ~7s cast time.
      delaySeconds: 2,
      response: Responses.knockback(),
    },
    {
      id: 'Emerald Divide Et Impera Tankbuster',
      type: 'HeadMarker',
      netRegex: { id: '00DA' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Emerald Primus Terminus Est',
      type: 'HeadMarker',
      netRegex: { id: '00F5' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback Arrow on YOU',
          de: 'Rückstoß-Pfeil auf DIR',
          fr: 'Flèche-Poussée sur VOUS',
          ja: '自分に吹き飛ばし矢印',
          cn: '擊退箭頭點名',
          ko: '넉백 화살표 대상자',
        },
      },
    },
    {
      id: 'Emerald Secundus Terminus Est X',
      type: 'HeadMarker',
      netRegex: { id: '00FE' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Cardinal With Sword',
          de: 'Geh mit dem Schwert zu Kardinalen',
          fr: 'Allez au cardinal avec l\'épée',
          ja: '辺の中心に捨てる',
          cn: '四邊放刀',
          ko: '동서남북으로 이동',
        },
      },
    },
    {
      id: 'Emerald Secundus Terminus Est Plus',
      type: 'HeadMarker',
      netRegex: { id: '00FD' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Intercardinal With Sword',
          de: 'Geh mit dem Schwert zu Interkardinalen',
          fr: 'Allez à l\'intercardinal avec l\'épée',
          ja: '四隅に捨てる',
          cn: '四角放刀',
          ko: '대각위치로 이동',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Black Wolf\'s Image': 'Gaius-Projektion',
        'Claw Bit': 'Satellitenarm',
        'Magnetic Mine': 'Magnetmine',
        'The Emerald Weapon': 'Smaragd-Waffe',
      },
      'replaceText': {
        'Bit Plasma': 'Satellitenarm: Blitznova',
        'Bit Storm': 'Satellitenarme: Zirkelangriff',
        'Disruption Field': 'Gedankenobstruktor',
        'Divide Et Impera': 'Divide et Impera',
        'Emerald Beam': 'Smaragdstrahl',
        'Emerald Crusher': 'Smaragdspalter',
        'Emerald Shot': 'Smaragdschuss',
        'Explosion': 'Explosion',
        'Fire Away': 'Salvenbefehl',
        'Heat Ray': 'Hitzestrahl',
        'Heirsbane': 'Erbenbann',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Magnetism': 'Magimagnetismus',
        'Optimized Ultima': 'Ultima-System',
        'Photon Laser': 'Photonenlaser',
        'Primus Terminus Est': 'Terminus Est: Unus',
        'Pulse Laser': 'Impulslaser',
        'Rank And File': 'Appell',
        'Secundus Terminus Est': 'Terminus Est: Duo',
        'Shots Fired': 'Synchron-Salve',
        'Sidescathe': 'Flankenbeschuss',
        'Split': 'Segregation',
        'Tertius Terminus Est': 'Terminus Est: Tres',
        'Threefold Formation': 'Gefechtslinie',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Wolf\'s Image': 'spectre de Gaius',
        'Claw Bit': 'main volante',
        'Magnetic Mine': 'mine magnétique',
        'The Emerald Weapon': 'Arme Émeraude',
      },
      'replaceText': {
        'Bit Plasma': 'Vague éthéroplasmique',
        'Bit Storm': 'Salve circulaire',
        'Disruption Field': 'Obstruction mentale',
        'Divide Et Impera': 'Divide Et Impera',
        'Emerald Beam': 'Rayon émeraude',
        'Emerald Crusher': 'Écraseur émeraude',
        'Emerald Shot': 'Tir émeraude',
        'Explosion': 'Explosion',
        'Fire Away': 'Peloton d\'exécution',
        'Heat Ray': 'Rayon ardent',
        'Heirsbane': 'Fléau de l\'héritier',
        'Legio Phantasmatis': 'Legio Phantasmatis',
        'Magitek Magnetism': 'Électroaimant magitek',
        'Optimized Ultima': 'Ultima magitek',
        'Photon Laser': 'Laser à photons',
        'Primus Terminus Est': 'Terminus Est : Unus',
        'Pulse Laser': 'Pulsation laser',
        'Rank And File': 'Regroupement',
        'Secundus Terminus Est': 'Terminus Est : Duo',
        'Shots Fired': 'Fusillade',
        'Sidescathe': 'Salve latérale',
        'Split': 'Séparation',
        'Tertius Terminus Est': 'Terminus Est : Tres',
        'Threefold Formation': 'Alignement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Black Wolf\'s Image': 'ガイウスの幻影',
        'Claw Bit': 'ハンドビット',
        'Magnetic Mine': 'マグネットマイン',
        'The Emerald Weapon': 'エメラルドウェポン',
      },
      'replaceText': {
        'Bit Plasma': 'アームビット：爆雷射出',
        'Bit Storm': 'アームビット：円形射撃',
        'Disruption Field': '妨害思念',
        'Divide Et Impera': 'ディヴィデ・エト・インペラ',
        'Emerald Beam': 'エメラルドビーム',
        'Emerald Crusher': 'エメラルドクラッシャー',
        'Emerald Shot': 'エメラルドショット',
        'Explosion': '爆発',
        'Fire Away': '掃射命令',
        'Heat Ray': 'ヒートレイ',
        'Heirsbane': 'No.IX',
        'Legio Phantasmatis': 'レギオ・ファンタズマティス',
        'Magitek Magnetism': '魔導マグネット',
        'Optimized Ultima': '魔導アルテマ',
        'Photon Laser': 'フォトンレーザー',
        'Primus Terminus Est': 'ターミナス・エスト：ウーヌス',
        'Pulse Laser': '波動レーザー',
        'Rank And File': '歩兵集結',
        'Secundus Terminus Est': 'ターミナス・エスト：ドゥオ',
        'Shots Fired': '一斉掃射',
        'Sidescathe': '側面掃射',
        'Split': '分離',
        'Tertius Terminus Est': 'ターミナス・エスト：トレース',
        'Threefold Formation': '歩兵整列',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Black Wolf\'s Image': '蓋烏斯的幻影',
        'Claw Bit': '手型浮游砲',
        'Magnetic Mine': '電磁炸雷',
        'The Emerald Weapon': '綠寶石神兵',
      },
      'replaceText': {
        'Bit Plasma': '浮游砲：射出炸彈',
        'Bit Storm': '浮游砲：圓形射擊',
        'Disruption Field': '妨礙思念',
        'Divide Et Impera': '分而治之',
        'Emerald Beam': '綠寶石光束',
        'Emerald Crusher': '綠寶石碎擊',
        'Emerald Shot': '綠寶石射擊',
        'Explosion': '爆炸',
        'Fire Away': '掃射命令',
        'Heat Ray': '熾熱射線',
        'Heirsbane': '遺禍',
        'Legio Phantasmatis': '幻影軍團',
        'Magitek Magnetism': '魔導磁石',
        'Optimized Ultima': '魔導究極',
        'Photon Laser': '光子射線',
        'Primus Terminus Est': '恩惠終結：壹',
        'Pulse Laser': '波動射線',
        'Rank And File': '步兵集合',
        'Secundus Terminus Est': '恩惠終結：貳',
        'Shots Fired': '一齊掃射',
        'Sidescathe': '側面掃射',
        'Split': '分離',
        'Tertius Terminus Est': '恩惠終結：叄',
        'Threefold Formation': '步兵列隊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Black Wolf\'s Image': '가이우스의 환영',
        'Claw Bit': '핸드 비트',
        'Magnetic Mine': '자석 지뢰',
        'The Emerald Weapon': '에메랄드 웨폰',
      },
      'replaceText': {
        'Bit Plasma': '암 비트: 폭뢰 사출',
        'Bit Storm': '암 비트: 원형 사격',
        'Disruption Field': '방해 사념',
        'Divide Et Impera': '분할 통치',
        'Emerald Beam': '에메랄드 광선',
        'Emerald Crusher': '에메랄드 분쇄',
        'Emerald Shot': '에메랄드 발사',
        'Explosion': '폭발',
        'Fire Away': '소사 명령',
        'Heat Ray': '열광선',
        'Heirsbane': '제IX호',
        'Legio Phantasmatis': '환영 군단',
        'Magitek Magnetism': '마도 자석',
        'Optimized Ultima': '마도 알테마',
        'Photon Laser': '광자 레이저',
        'Primus Terminus Est': '파멸의 종착역 I',
        'Pulse Laser': '파동 레이저',
        'Rank And File': '보병 집결',
        'Secundus Terminus Est': '파멸의 종착역 II',
        'Shots Fired': '일제 소사',
        'Sidescathe': '측면 소사',
        'Split': '분리',
        'Tertius Terminus Est': '파멸의 종착역 III',
        'Threefold Formation': '보병 정렬',
      },
    },
  ],
};

export default triggerSet;
