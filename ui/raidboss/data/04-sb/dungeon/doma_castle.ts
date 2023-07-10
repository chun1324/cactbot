import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenTowers?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'DomaCastle',
  zoneId: ZoneId.DomaCastle,
  timelineFile: 'doma_castle.txt',
  timelineTriggers: [
    {
      id: 'Doma Castle Magitek Rearguard Cermet Pile',
      // untelegraphed, instant tank cleave
      regex: /Cermet Pile/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'Doma Castle Magitek Hexadrone 2-Tonze Magitek Missile',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Doma Castle Magitek Hexadrone Magitek Missiles',
      type: 'StartsUsing',
      netRegex: { source: 'Magitek Hexadrone', id: '20A4', capture: false },
      infoText: (data, _matches, output) => {
        return data.seenTowers ? output.getTowers!() : output.getTower!();
      },
      run: (data) => data.seenTowers = true,
      outputStrings: {
        getTower: {
          en: 'Get Tower',
          de: 'Turm nehmen',
          fr: 'Prenez la tour',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
        getTowers: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Doma Castle Hypertuned Grynewaht Delay-Action Charge',
      type: 'HeadMarker',
      netRegex: { id: '0063' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Doma Castle Hypertuned Grynewaht Thermobaric Charge',
      type: 'GainsEffect',
      // There's no 0x1B line or 0x14/0x15 target for this prox marker, only the Prey debuff.
      netRegex: { effectId: '4E5' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Charge Away',
          de: 'Lege Markierung weit weg ab',
          fr: 'Déposez la charge au loin',
          ja: 'マーカーを外に捨てる',
          cn: '將標記放遠',
          ko: '징 멀리 두고 오기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': 'Hexadrohnen-Modul',
        'Hypertuned Grynewaht': 'hyperisiert(?:e|er|es|en) Grynewaht',
        'Magitek Chakram': 'Magitek-Chakram',
        'Magitek Hexadrone': 'Magitek-Hexadrohne',
        'Magitek Rearguard': 'Magitek-Rückendecker',
        'Rearguard Bit': 'Rückendecker-Drohne',
        'Retuned Magitek Bit': 'verbessert(?:e|er|es|en) Magitek-Drohne',
        'The Third Armory': 'Dritte Waffenkammer',
        'The Training Grounds': 'Exerzierplatz',
        'The Hall Of The Scarlet Swallow': 'Halle der Blutroten Schwalbe',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': 'Magitek-Großrakete',
        'Bits Activate': 'Aktivierung der Module',
        'Cermet Pile': 'Cermet-Pfahl',
        'Chainsaw': 'Kettensäge',
        'Circle Of Death': 'Todeskreis',
        'Clean Cut': 'Durchschlag',
        'Delay-Action Charge': 'Zeitzünder',
        'Garlean Fire': 'Garleischer Brandsatz',
        'Gunsaw': 'Kanonensäge',
        'Hexadrone Bits': 'Hexadrohnen-Module',
        'Magitek Bits': 'Magitek-Drohnen',
        'Magitek Missiles': 'Magitek-Rakete',
        'Magitek Ray': 'Magitek-Laser',
        'Rearguard Mines': 'Rückendecker-Minen',
        'Thermobaric Charge': 'Aerosolbombe',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': 'module d\'hexadrone',
        'Hypertuned Grynewaht': 'Grynewaht hyper-renforcé',
        'Magitek Chakram': 'chakram magitek',
        'Magitek Hexadrone': 'hexadrone magitek',
        'Magitek Rearguard': 'arrière-garde magitek',
        'Rearguard Bit': 'drone d\'arrière-garde',
        'Retuned Magitek Bit': 'drone magitek reréglé',
        'The Third Armory': 'Arsenal A3',
        'The Training Grounds': 'Terrain de manœuvres',
        'The Hall Of The Scarlet Swallow': 'Salle de l\'Hirondelle écarlate',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': 'Missiles magitek de 2 tonz',
        'Bits Activate': 'Activation des modules',
        'Cermet Pile': 'Amas de cermet',
        'Chainsaw': 'Tronçonneuse',
        'Circle Of Death': 'Cercle de la mort',
        'Clean Cut': 'Tranchage net',
        'Delay-Action Charge': 'Charge à retardement',
        'Hexadrone Bits': 'Modules d\'hexadrone',
        'Magitek Bits': 'Drones magitek',
        'Garlean Fire': 'Feu garlemaldais',
        'Gunsaw': 'Canon-tronçonneur',
        'Magitek Missiles': 'Missiles magitek',
        'Magitek Ray': 'Rayon magitek',
        'Rearguard Mines': 'Drones d\'arrière-garde',
        'Thermobaric Charge': 'Charge thermobarique',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': 'ヘキサローラー・ビット',
        'Hypertuned Grynewaht': '強化グリーンワート',
        'Magitek Chakram': '魔導チャクラム',
        'Magitek Hexadrone': '魔導ヘキサローラー',
        'Magitek Rearguard': '魔導リアガード',
        'Rearguard Bit': 'リアガード・ビット',
        'Retuned Magitek Bit': '魔導ビット改',
        'The Third Armory': '第III兵器庫',
        'The Training Grounds': '練兵場',
        'The Hall Of The Scarlet Swallow': '赤燕の間',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '大型魔導ミサイル',
        'Cermet Pile': 'サーメットパイル',
        'Chainsaw': 'チェーンソー',
        'Circle Of Death': 'サークル・オブ・デス',
        'Clean Cut': '激突',
        'Delay-Action Charge': '時限爆弾',
        'Hexadrone Bits': 'ヘキサローラー・ビット',
        'Magitek Bits': '魔導ビット',
        'Garlean Fire': 'ガレアンファイア',
        'Gunsaw': 'ガンチェーンソー',
        'Magitek Missiles': '魔導ミサイル',
        'Magitek Ray': '魔導レーザー',
        'Thermobaric Charge': '気化爆弾',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': '魔導六輪裝甲浮游炮',
        'Hypertuned Grynewaht': '強化格林瓦特',
        'Magitek Chakram': '魔導戰輪',
        'Magitek Hexadrone': '魔導六輪裝甲',
        'Magitek Rearguard': '魔導後衛',
        'Rearguard Bit': '魔導後衛浮游炮',
        'Retuned Magitek Bit': '改良版魔導浮游炮',
        'The Third Armory': '第三兵器庫',
        'The Training Grounds': '練兵場',
        'The Hall Of The Scarlet Swallow': '赤燕之間',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '大型魔導導彈',
        'Bits Activate': '浮游砲激活',
        'Cermet Pile': '陶瓷合金樁',
        'Chainsaw': '鏈鋸',
        'Circle Of Death': '死亡迴旋',
        'Clean Cut': '激突',
        'Delay-Action Charge': '定時炸彈',
        'Garlean Fire': '加雷馬火炎',
        'Gunsaw': '鏈鋸槍',
        'Hexadrone Bits': '魔導六輪裝甲浮游炮',
        'Magitek Bits': '魔導浮游炮',
        'Magitek Missiles': '魔導飛彈',
        'Magitek Ray': '魔導雷射',
        'Rearguard Mines': '魔導後衛炸雷',
        'Thermobaric Charge': '氣化炸彈',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': '헥사롤러 비트',
        'Hypertuned Grynewaht': '강화된 그륀바트',
        'Magitek Chakram': '마도 차크람',
        'Magitek Hexadrone': '마도 헥사롤러',
        'Magitek Rearguard': '마도 리어가드',
        'Rearguard Bit': '리어가드 비트',
        'Retuned Magitek Bit': '개량형 마도 비트',
        'The Third Armory': '제III병기고',
        'The Training Grounds': '연병장',
        'The Hall Of The Scarlet Swallow': '세키엔의 방',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '대형 마도 미사일',
        'Bits Activate': '비트 활성화',
        'Cermet Pile': '합금 말뚝',
        'Chainsaw': '전기톱',
        'Circle Of Death': '죽음의 원',
        'Clean Cut': '격돌',
        'Delay-Action Charge': '시한폭탄',
        'Garlean Fire': '갈레안 파이어',
        'Gunsaw': '기관총',
        'Hexadrone Bits': '헥사롤러 비트',
        'Magitek Bits': '마도 비트',
        'Magitek Missiles': '마도 미사일',
        'Magitek Ray': '마도 레이저',
        'Rearguard Mines': '리어가드 폭뢰',
        'Thermobaric Charge': '기화폭탄',
      },
    },
  ],
};

export default triggerSet;
