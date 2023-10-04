import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'MatoyasRelict',
  zoneId: ZoneId.MatoyasRelict,
  timelineFile: 'matoyas_relict.txt',
  triggers: [
    {
      id: 'Matoyas Mudman Hard Rock',
      type: 'StartsUsing',
      netRegex: { id: '547F', source: 'Mudman' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Matoyas Mudman Peat Pelt',
      type: 'Ability',
      netRegex: { id: '5482', source: 'Mudman', capture: false },
      alertText: (_data, _matches, output) => output.pullOrb!(),
      outputStrings: {
        pullOrb: {
          en: 'Pull orb to an empty hole',
          de: 'Orb in ein Loch lenken',
          fr: 'Tirez l\'orbe vers un trou vide',
          ja: '泥団子を四隅の穴に誘導',
          cn: '誘導泥球到無敵人的風圈',
          ko: '빈 구멍으로 구슬 보내기',
        },
      },
    },
    {
      id: 'Matoyas Mudman Stone Age',
      type: 'StartsUsing',
      netRegex: { id: '5491', source: 'Mudman', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Matoyas Mudman Falling Rock',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Matoyas Mudman Sputter',
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Matoyas Nixie Crash-smash',
      type: 'HeadMarker',
      netRegex: { id: '00E6' },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.tankBuster!();
        return output.avoidTether!({ player: matches.target });
      },
      outputStrings: {
        tankBuster: Outputs.tankBuster,
        avoidTether: {
          en: 'Avoid ${player} and tethers',
          de: 'Weiche ${player} und Verbindungen aus',
          fr: 'Évitez ${player} et les liens',
          ja: '${player}と線から離れる',
          cn: '遠離${player}及其連線',
          ko: '${player}와 선 피하기',
        },
      },
    },
    {
      id: 'Matoyas Nixie Shower Power',
      type: 'StartsUsing',
      netRegex: { id: '5991', source: 'Nixie', capture: false },
      alertText: (_data, _matches, output) => output.avoidWall!(),
      outputStrings: {
        avoidWall: {
          en: 'Avoid Wall Flush',
          de: 'Weiche den Wand-Stömmungen aus',
          fr: 'Évitez le jet d\'eau',
          ja: '光ってない横列に移動',
          cn: '站在牆壁未發光的一列',
          ko: '벽 물줄기 피하기',
        },
      },
    },
    {
      id: 'Matoyas Nixie Pitter-patter',
      type: 'Ability',
      netRegex: { id: '5988', source: 'Nixie', capture: false },
      delaySeconds: 3,
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.stepIn!(),
      outputStrings: {
        stepIn: {
          en: 'Step in Puddle near the Cloud',
          de: 'In einer Fläche nahe der Wolke stehen',
          fr: 'Marchez dans la zone au sol près du nuage',
          ja: '雲に近い水を踏む',
          cn: '站在靠近雲朵的水流裡等待浮空',
          ko: '구름 근처 물줄기 위에 서기',
        },
      },
    },
    {
      id: 'Matoyas Porxie Tender Loin',
      type: 'StartsUsing',
      netRegex: { id: '5913', source: 'Mother Porxie', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Matoyas Porxie Huff and Puff',
      type: 'StartsUsing',
      netRegex: { id: '5919', source: 'Mother Porxie', capture: false },
      alertText: (_data, _matches, output) => output.getKnocked!(),
      outputStrings: {
        getKnocked: {
          en: 'Get Knocked into Safe (no anti-knockback)',
          de: 'Lass dich in den Safespot zurückstoßen (kein Rückstoßschutz)',
          fr: 'Faites-vous pousser en zone safe (pas d\'anti-poussée)',
          ja: 'ボスの正面に (堅実魔効かない)',
          cn: '站在Boss正面 (防擊退無效)',
          ko: '안전한 구역으로 넉백당하기',
        },
      },
    },
    {
      id: 'Matoyas Porxie Meat Mallet',
      type: 'StartsUsing',
      netRegex: { id: '5916', source: 'Mother Porxie', capture: false },
      alertText: (_data, _matches, output) => output.awayFromAoe!(),
      outputStrings: {
        awayFromAoe: {
          en: 'Go to Opposite Side',
          de: 'Geh auf die andere Seite',
          fr: 'Allez du côté opposé',
          ja: '反対側へ',
          cn: '對面躲避墜落',
          ko: '반대편으로 이동',
        },
      },
    },
    {
      id: 'Matoyas Porxie Sucked In',
      type: 'GainsEffect',
      netRegex: { effectId: '9B6' },
      suppressSeconds: (_data, matches) => parseFloat(matches.duration),
      alarmText: (_data, _matches, output) => output.runAway!(),
      outputStrings: {
        runAway: {
          en: 'RUN AWAY',
          de: 'RENN WEG',
          fr: 'FUYEZ',
          ja: 'ボスから離れる',
          cn: '遠離即死區',
          ko: '바람 반대로 뛰기',
        },
      },
    },
    {
      id: 'Matoyas Porxie Minced Meat',
      type: 'StartsUsing',
      netRegex: { id: '5911', source: 'Mother Porxie' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Matoyas Porxie Sprite Explosion',
      type: 'StartsUsing',
      netRegex: { id: '4E34', source: 'aeolian cave sprite', capture: false },
      delaySeconds: 5,
      alertText: (_data, _matches, output) => output.goBoss!(),
      outputStrings: {
        goBoss: {
          en: 'Go to Boss',
          de: 'Gehe zum Boss',
          fr: 'Allez vers le boss',
          ja: 'ボスの場所に移動',
          cn: '站在Boss正下方',
          ko: '보스쪽으로',
        },
      },
    },
    {
      id: 'Matoyas Porxie Open Flame',
      type: 'StartsUsing',
      netRegex: { id: '5922', source: 'Mother Porxie', capture: false },
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aeolian Cave Sprite': 'Windhöhlen-Exergon',
        'The Clayclot Cauldron': 'Lehmgrube',
        'The Clearnote Cauldron': 'Stromkreuz',
        'Mother Porxie': 'Muttersau',
        'Mud Bubble': 'Matschblase',
        'Mudman': 'Matschmann',
        'Nixie': 'Nixchen',
        'The Woebegone Workshop': 'Geht-Weg-Werkstatt',
      },
      'replaceText': {
        'Barbeque': 'Grillfest',
        'Brittle Breccia': 'Gesteinslawine',
        'Buffet': 'Bö',
        'Crash-Smash': 'Plitsch, platsch',
        'Explosion': 'Explosion',
        'Falling Rock': 'Steinschlag',
        'Hard Rock': 'Schlammstachel',
        'Huff And Puff': 'Pusten',
        'Meat Mallet': 'Fleischklopfer',
        'Medium Rear': 'Halb durch',
        'Minced Meat': 'Wolfer',
        'Open Flame': 'Auf offener Flamme',
        'Peat Pelt': 'Mjam Mjam Matschkuchen',
        'Petrified Peat': 'Matschkuchen',
        'Pitter-Patter': 'Plitter, platter',
        'Rocky Roll': 'Kullerklumpen',
        'Stone Age': 'Grollende Erde',
        'Shower Power': 'Glug, glug',
        'Sea Shanty': 'Pitsche, patsche',
        'Splish-Splash': 'Blubber, blubber',
        'Tender Loin': 'Plattierer',
        'To A Crisp': 'Komplett verkohlt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aeolian Cave Sprite': 'élémentaire des cavernes venteuses',
        'The Clayclot Cauldron': 'La carrière clinquante',
        'The Clearnote Cauldron': 'La fontaine frisquette',
        'Mother Porxie': 'mère porxie',
        'Mud Bubble': 'bulle de boue',
        'Mudman': 'tadboue',
        'Nixie': 'nixe',
        'The Woebegone Workshop': 'Grand four délaissé',
      },
      'replaceText': {
        'Barbeque': 'Grillade au barbecue',
        'Brittle Breccia': 'Fracas de roche',
        'Buffet': 'Rafale',
        'Crash-Smash': 'Fracas nerveux',
        'Explosion': 'Explosion',
        'Falling Rock': 'Chute de pierre',
        'Hard Rock': 'Pilier de boue',
        'Huff And Puff': 'Souffle porcin',
        'Meat Mallet': 'Maillet à viande',
        'Medium Rear': 'Cuit à point',
        'Minced Meat': 'Hachoir à viande',
        'Open Flame': 'Flammes nues',
        'Peat Pelt': 'Lancer de boue',
        'Petrified Peat': 'Roulage de boue',
        'Pitter-Patter': 'Giboulée',
        'Rocky Roll': 'Roulé-boulé',
        'Stone Age': 'Grondement terrestre',
        'Shower Power': 'Éclaboussure',
        'Sea Shanty': 'Explosion tournicoton',
        'Splish-Splash': 'Bulles bouillonnantes',
        'Tender Loin': 'Attendrisseur',
        'To A Crisp': 'Roussissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aeolian Cave Sprite': 'ウィンドケイブ・スプライト',
        'The Clayclot Cauldron': '輝きの採土場',
        'The Clearnote Cauldron': '涼しの採水場',
        'Mother Porxie': 'マザーポークシー',
        'Mud Bubble': '泥団子',
        'Mudman': 'マッドマン',
        'Nixie': 'ノッケン',
        'The Woebegone Workshop': '居留守の工房',
      },
      'replaceText': {
        'Barbeque': 'バーベキューグリル',
        'Brittle Breccia': '岩盤崩れ',
        'Buffet': '突風',
        'Crash-Smash': 'ヒヤヒヤカチカチ',
        'Explosion': '爆散',
        'Falling Rock': '落石',
        'Hard Rock': '泥岩柱',
        'Huff And Puff': '吐出',
        'Meat Mallet': 'ミートマレット',
        'Medium Rear': 'ミディアムレア',
        'Minced Meat': 'ミートミンサー',
        'Open Flame': 'オープンフレイム',
        'Peat Pelt': '泥団子遊び',
        'Petrified Peat': '泥団子作り',
        'Pitter-Patter': 'モクモクザーザー',
        'Rocky Roll': 'コロコロ',
        'Stone Age': '地鳴り',
        'Shower Power': 'ザブザブジャブジャブ',
        'Sea Shanty': 'グルグルザパーン',
        'Splish-Splash': 'アワアワブクブ',
        'Tender Loin': 'テンダライザー',
        'To A Crisp': '丸焦げ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aeolian Cave Sprite': '洞窟風元精',
        'The Clayclot Cauldron': '發光的挖土場',
        'The Clearnote Cauldron': '涼爽的打水場',
        'Mother Porxie': '仙子豬之母',
        'Mud Bubble': '泥球',
        'Mudman': '土泥人',
        'Nixie': '水滴精',
        'The Woebegone Workshop': '假裝無人的工房',
      },
      'replaceText': {
        'Barbeque': '烤烤肉',
        'Brittle Breccia': '岩層崩塌',
        'Buffet': '突風',
        'Crash-Smash': '咣噹咣噹',
        'Explosion': '爆炸',
        'Falling Rock': '落石',
        'Hard Rock': '泥岩柱',
        'Huff And Puff': '吐出',
        'Meat Mallet': '敲敲肉',
        'Medium Rear': '三分熟',
        'Minced Meat': '絞絞肉',
        'Open Flame': '明火',
        'Peat Pelt': '玩泥球',
        'Petrified Peat': '造泥球',
        'Pitter-Patter': '滴答滴答',
        'Rocky Roll': '骨碌骨碌',
        'Stone Age': '地鳴',
        'Shower Power': '嘩啦嘩啦',
        'Sea Shanty': '咕嚕咕嚕',
        'Splish-Splash': '咕嘟咕嘟',
        'Tender Loin': '鬆鬆肉',
        'To A Crisp': '烤焦',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aeolian Cave Sprite': '바람 동굴 정령',
        'The Clayclot Cauldron': '빛나는 채토장',
        'The Clearnote Cauldron': '시원한 채수장',
        'Mother Porxie': '마더 포크시',
        'Mud Bubble': '진흙공',
        'Mudman': '진흙인간',
        'Nixie': '뇌켄',
        'The Woebegone Workshop': '버려진 공방',
      },
      'replaceText': {
        'Barbeque': '바비큐 그릴',
        'Brittle Breccia': '암반 붕괴',
        'Buffet': '쥐어박기',
        'Crash-Smash': '오들오들',
        'Explosion': '폭발',
        'Falling Rock': '낙석',
        'Hard Rock': '진흙바위',
        'Huff And Puff': '내쉬기',
        'Meat Mallet': '고기망치',
        'Medium Rear': '미디엄 레어',
        'Minced Meat': '고기 다지기',
        'Open Flame': '불쏘시개',
        'Peat Pelt': '진흙공 굴리기',
        'Petrified Peat': '진흙공 만들기',
        'Pitter-Patter': '뭉게뭉게 쏴아아',
        'Rocky Roll': '데굴데굴',
        'Stone Age': '땅울음',
        'Shower Power': '첨벙첨벙',
        'Sea Shanty': '빙그르르 퐁당',
        'Splish-Splash': '보글보글',
        'Tender Loin': '연육기',
        'To A Crisp': '숯덩이',
      },
    },
  ],
};

export default triggerSet;
