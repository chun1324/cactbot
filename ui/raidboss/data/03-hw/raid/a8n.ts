import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  bruteTank?: string;
  bruteTankOut?: boolean;
}

// ALEXANDER - THE BURDEN OF THE SON NORMAL
// A8N

const triggerSet: TriggerSet<Data> = {
  id: 'AlexanderTheBurdenOfTheSon',
  zoneId: ZoneId.AlexanderTheBurdenOfTheSon,
  timelineFile: 'a8n.txt',
  timelineTriggers: [
    {
      id: 'A8N Hydrothermal Missile',
      regex: /Hydrothermal Missile/,
      beforeSeconds: 4,
      suppressSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'A8N Flarethrower',
      regex: /Flarethrower/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'A8N Short Needle',
      regex: /Short Needle/,
      beforeSeconds: 4,
      response: Responses.aoe(),
    },
    {
      id: 'A8N Super Jump Soon',
      regex: /Super Jump/,
      beforeSeconds: 8,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Super Jump',
          de: 'Supersprung ködern',
          fr: 'Attirez le Super saut',
          ja: 'スーパージャンプを誘導',
          cn: '引導超級跳',
          ko: '슈퍼 점프',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'A8N Megabeam Onslaughter',
      type: 'StartsUsing',
      netRegex: { source: 'Onslaughter', id: '1732', capture: false },
      // Insert sound effect from Arthars here.
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Megabeamu~',
          de: 'Megalaser~',
          fr: 'Mégarayon~',
          ja: 'メガビーム～',
          cn: '巨型光束砲~',
          ko: '고출력 광선~',
        },
      },
    },
    {
      id: 'A8N Megabeam Brute Justice',
      type: 'StartsUsing',
      netRegex: { source: 'Brute Justice', id: '174F', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Megabeamu~!',
          de: 'Megalaser~!',
          fr: 'Mégarayon~ !',
          ja: 'メガビーム～',
          cn: '巨型光束砲~!',
          ko: '고출력 광선~!',
        },
      },
    },
    {
      id: 'A8N Execution',
      type: 'Ability',
      netRegex: { source: 'Onslaughter', id: '1632', capture: false },
      condition: (data) => data.role === 'dps' || data.job === 'BLU',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Regulators',
          de: 'Dampfregler besiegen',
          fr: 'Tuez les Régulateurs',
          ja: 'スチームジャッジを倒す',
          cn: '擊殺小怪',
          ko: '증기 감독 없애기',
        },
      },
    },
    {
      id: 'A8N Perpetual Ray',
      type: 'StartsUsing',
      netRegex: { source: 'Onslaughter', id: '1730' },
      response: Responses.tankBuster(),
    },
    {
      id: 'A8N Low Arithmeticks',
      type: 'GainsEffect',
      // Note: both high and low use '0025' headmarker
      netRegex: { effectId: '3FD' },
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get High',
          de: 'Geh nach Oben',
          fr: 'Montez',
          ja: '高い床に乗る',
          cn: '去高地',
          ko: '높은곳으로',
        },
      },
    },
    {
      id: 'A8N High Arithmeticks',
      type: 'GainsEffect',
      netRegex: { effectId: '3FE' },
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Down',
          de: 'Geh nach Unten',
          fr: 'Descendez',
          ja: '低い床に乗る',
          cn: '去低地',
          ko: '낮은곳으로',
        },
      },
    },
    {
      id: 'A8N Super Cyclone',
      type: 'StartsUsing',
      netRegex: { source: 'Vortexer', id: '1747', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'A8N Enumeration',
      type: 'HeadMarker',
      netRegex: { id: ['0040', '0041', '0042'] },
      infoText: (data, matches, output) => {
        // 0040 = 2, 0041 = 3, 0042 = 4
        const count = 2 + parseInt(matches.id, 16) - parseInt('0040', 16);
        return output.text!({ player: data.party.member(matches.target), count: count });
      },
      outputStrings: {
        text: {
          en: '${player}: ${count}',
          de: '${player}: ${count}',
          fr: '${player}: ${count}',
          ja: '${player}: ${count}',
          cn: '${player}: ${count}',
          ko: '${player}: ${count}',
        },
      },
    },
    {
      id: 'A8N Double Rocket Punch',
      type: 'StartsUsing',
      netRegex: { source: 'Brute Justice', id: '174E' },
      response: Responses.tankBuster(),
    },
    {
      // Flarethrower comes up at the same time as Long Needle at multiple points.
      // This is *very* dangerous if the healers aren't ready, so we collect the active tank
      // in order to warn them not to stack.
      id: 'A8N Brute Active Tank',
      type: 'Ability',
      netRegex: { source: 'Brute Justice', id: '174C' },
      run: (data, matches) => data.bruteTank = matches.target,
    },
    {
      // The only dangerous Flarethrower is the first one in any rotation.
      // This one is always after J-Kick but before Super Jump,
      // so we can just look for those two abilities and activate triggers on that basis.
      // (The first dangerous Flarethrower is before Super Jump,
      // so all Long Needle triggers will check against false values,
      // since data.bruteTankOut will not be initialized at that point.)
      // 1750 is Super Jump, 1756 is J-Kick.
      id: 'A8N Long Needle Toggle',
      type: 'Ability',
      netRegex: { source: 'Brute Justice', id: ['1750', '1756'] },
      suppressSeconds: 5,
      run: (data, matches) => data.bruteTankOut = matches.id === '1756',
    },
    {
      id: 'A8N Long Needle Party',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      condition: (data) => !(data.me === data.bruteTank && data.bruteTankOut),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'A8N Long Needle Active Tank',
      type: 'HeadMarker',
      netRegex: { id: '003E', capture: false },
      condition: (data) => data.me === data.bruteTank && data.bruteTankOut,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Don\'t Stack! (tank cleave)',
          de: 'Nicht Sammeln! (Tank Cleave)',
          fr: 'Ne vous packez pas ! (tank cleave)',
          ja: '集まらない! (タンクへのスラッシュ)',
          cn: '別去集合！（坦克順劈）',
          ko: '산개하기! (광역 탱버)',
        },
      },
    },
    {
      id: 'A8N Apocalyptic Ray',
      type: 'StartsUsing',
      netRegex: { source: 'Brute Justice', id: '1751', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'A8N Super Jump',
      type: 'StartsUsing',
      netRegex: { source: 'Brute Justice', id: '1750' },
      alertText: (data, matches, output) => {
        if (data.me !== matches.target)
          return;
        return output.superJumpOnYou!();
      },
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return;
        return output.superJumpOn!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        superJumpOn: {
          en: 'Super Jump on ${player}',
          de: 'Supersprung auf ${player}',
          fr: 'Super saut sur ${player}',
          ja: '${player}にスーパージャンプ',
          cn: '超級跳點${player}',
          ko: '"${player}" 슈퍼 점프',
        },
        superJumpOnYou: {
          en: 'Super Jump on YOU',
          de: 'Supersprung auf DIR',
          fr: 'Super saut sur VOUS',
          ja: '自分にスーパージャンプ',
          cn: '超級跳點名',
          ko: '슈퍼 점프 대상자',
        },
      },
    },
    {
      id: 'A8N Mirage Marker',
      type: 'HeadMarker',
      netRegex: { id: '0008' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Mirage on YOU',
          de: 'Mirage auf DIR',
          fr: 'Mirage sur VOUS',
          ja: '自分にミラージュ',
          cn: '分身點名',
          ko: '환영 징 대상자',
        },
      },
    },
    {
      id: 'A8N Ice Missile Marker',
      type: 'HeadMarker',
      netRegex: { id: '0043' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Ice Missile on YOU',
          de: 'Eis-Rakete auf DIR',
          fr: 'Missile de glace sur VOUS',
          ja: '自分にアイスミサイル',
          cn: '冰點名',
          ko: '얼음 미사일 대상자',
        },
      },
    },
    {
      id: 'A8N Mirage Supercharge',
      type: 'StartsUsing',
      netRegex: { source: 'Blaster Mirage', id: '1749', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Mirage Dashes',
          de: 'Weiche den Replikant Ansturm aus',
          fr: 'Évitez la charge de la Réplique',
          ja: 'ミラージュの正面から離れる',
          cn: '躲避分身衝鋒',
          ko: '환영 돌진 피하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Blaster Mirage': 'Blaster-Replikant',
        'Blaster(?! Mirage)': 'Blaster',
        'Brawler': 'Blechbrecher',
        'Brute Justice': 'Brutalus',
        'Hidden Mine': 'Minenfalle',
        'Onslaughter': 'Schlachter',
        'Steam Regulator B': 'β-Dampfregler',
        'Swindler': 'Schwindler',
        'Vortexer': 'Wirbler',
      },
      'replaceText': {
        '--orbs--': '--kugeln--',
        '--regulator check--': '--dampfregler check--',
        '100-Megatonze Shock': '100-Megatonzen-Schock',
        'Apocalyptic Ray': 'Apokalyptischer Strahl ',
        'Attachment': 'Anlegen',
        'Ballistic Missile': 'Ballistische Rakete',
        'Brute Force': 'Brutaler Schlag',
        'Discoid': 'Diskoid',
        'Double Buster': 'Doppelsprenger',
        'Double Rocket Punch': 'Doppelraketenschlag',
        'Earth Missile': 'Erd-Geschoss',
        'Enumeration': 'Zählen',
        'Execution': 'Exekutive',
        'Flarethrower': 'Großflammenwerfer',
        'Height': 'Nivellierung',
        'Hydrothermal Missile': 'Hydrothermales Geschoss',
        'Ice Missile': 'Eisgeschoss',
        'J Kick': 'Gewissenstritt',
        'Long Needle': 'Großes Kaliber',
        'Magicked Mark': 'Magiegeschoss',
        'Mega Beam': 'Megastrahl',
        'Minefield': 'Minenfeld',
        'Mind Blast': 'Geiststoß',
        'Mirage': 'Illusion',
        'Missile Command': 'Raketenkommando',
        'Perpetual Ray': 'Perpetueller Strahl',
        'Seed of the Sky': 'Samen des Himmels',
        'Short Needle': 'Kleines Kaliber',
        'Single Buster': 'Einzelsprenger',
        'Super Cyclone': 'Superzyklon',
        'Super Jump': 'Supersprung',
        'Supercharge': 'Superladung',
        'Transform': 'Geballte Rechtsgewalt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Blaster Mirage': 'Réplique du Fracasseur',
        'Blaster(?! Mirage)': 'Fracasseur',
        'Brawler': 'Bagarreur',
        'Brute Justice': 'Justicier',
        'Hidden Mine': 'Explosion de mine',
        'Onslaughter': 'Attaqueur',
        'Steam Regulator B': 'Régulateur de vapeur β',
        'Swindler': 'Arnaqueur',
        'Vortexer': 'Tourbillonneur',
      },
      'replaceText': {
        '--orbs--': '--orbes--',
        '--regulator check--': '--vérification du régulateur--',
        '100-Megatonze Shock': 'Choc de 100 mégatonz',
        'Apocalyptic Ray': 'Rayon apocalyptique',
        'Attachment': 'Extension',
        'Ballistic Missile': 'Missiles balistiques',
        'Brute Force': 'Force brute',
        'Discoid': 'Discoïde',
        'Double Buster': 'Double pulsoréacteur',
        'Double Rocket Punch': 'Double coup de roquette',
        'Earth Missile': 'Missile de terre',
        'Enumeration': 'Compte',
        'Execution': 'Exécution',
        'Flarethrower': 'Lance-brasiers',
        'Height': 'Dénivellation',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Ice Missile': 'Missile de glace',
        'J Kick': 'Pied justicier',
        'Long Needle': 'Gros missiles',
        'Magicked Mark': 'Tir magique',
        'Mega Beam': 'Mégarayon',
        'Minefield': 'Champ de mines',
        'Mind Blast': 'Explosion mentale',
        'Mirage': 'Mirage',
        'Missile Command': 'Commande missile',
        'Perpetual Ray': 'Rayon perpétuel',
        'Seed Of The Sky': 'Graine du ciel',
        'Short Needle': 'Petits missiles',
        'Single Buster': 'Pulsoréacteur',
        'Super Cyclone': 'Super cyclone',
        'Super Jump': 'Super saut',
        'Supercharge': 'Super charge',
        'Transform': 'Assemblage Justicier',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Blaster Mirage': 'ブラスター・ミラージュ',
        'Blaster(?! Mirage)': 'ブラスター',
        'Brawler': 'ブロウラー',
        'Brute Justice': 'ブルートジャスティス',
        'Hidden Mine': '地雷爆発',
        'Onslaughter': 'オンスローター',
        'Steam Regulator B': 'スチームジャッジβ',
        'Swindler': 'スウィンドラー',
        'Vortexer': 'ボルテッカー',
      },
      'replaceText': {
        '--orbs--': '--オーブ--',
        '--regulator check--': '--レギュレーターチェック--',
        '100-Megatonze Shock': '100メガトンズショック',
        'Apocalyptic Ray': 'アポカリプティクレイ',
        'Attachment': 'アタッチメント',
        'Ballistic Missile': 'ミサイル発射',
        'Brute Force': 'ブルートパンチ',
        'Discoid': 'ディスコイド',
        'Double Buster': 'ダブルバスターアタック',
        'Double Rocket Punch': 'ダブルロケットパンチ',
        'Earth Missile': 'アースミサイル',
        'Enumeration': 'カウント',
        'Execution': '執行準備',
        'Flarethrower': '大火炎放射',
        'Height': 'ハイト',
        'Hydrothermal Missile': '蒸気ミサイル',
        'Ice Missile': 'アイスミサイル',
        'J Kick': 'ジャスティスキック',
        'Long Needle': '大型ミサイル',
        'Magicked Mark': 'マジックショット',
        'Mega Beam': 'メガビーム',
        'Minefield': '地雷散布',
        'Mind Blast': 'マインドブラスト',
        'Mirage': 'ミラージュシステム',
        'Missile Command': 'ミサイル全弾発射',
        'Perpetual Ray': 'パーペチュアルレイ',
        'Seed of the Sky': 'シード・オブ・スカイ',
        'Short Needle': '小型ミサイル',
        'Single Buster': 'バスターアタック',
        'Super Cyclone': 'スーパーサイクロン',
        'Super Jump': 'スーパージャンプ',
        'Supercharge': 'スーパーチャージ',
        'Transform': 'ジャスティス合体',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Blaster Mirage': '爆破者幻象',
        'Blaster(?! Mirage)': '爆破者',
        'Brawler': '爭鬥者',
        'Brute Justice': '殘暴正義號',
        'Hidden Mine': '地雷爆炸',
        'Onslaughter': '突擊者',
        'Steam Regulator B': '蒸汽調整者β',
        'Swindler': '欺詐者',
        'Vortexer': '環旋者',
      },
      'replaceText': {
        '--orbs--': '--球--',
        '--regulator check--': '--調節器檢查--',
        '100-Megatonze Shock': '億萬噸震盪',
        'Apocalyptic Ray': '末世宣言',
        'Attachment': '配件更換',
        'Ballistic Missile': '導彈發射',
        'Brute Force': '殘暴鐵拳',
        'Discoid': '圓盤',
        'Double Buster': '雙重破壞砲擊',
        'Double Rocket Punch': '雙重火箭飛拳',
        'Earth Missile': '大地導彈',
        'Enumeration': '計數',
        'Execution': '執行準備',
        'Flarethrower': '大火炎放射',
        'Height': '高度算術',
        'Hydrothermal Missile': '蒸汽導彈',
        'Ice Missile': '寒冰導彈',
        'J Kick': '正義飛踢',
        'Long Needle': '大型導彈',
        'Magicked Mark': '魔力射擊',
        'Mega Beam': '巨型光束砲',
        'Minefield': '地雷散布',
        'Mind Blast': '精神衝擊',
        'Mirage': '幻影系統',
        'Missile Command': '導彈齊發',
        'Perpetual Ray': '永恆射線',
        'Seed of the Sky': '天空之種',
        'Short Needle': '小型導彈',
        'Single Buster': '破壞砲擊',
        'Super Cyclone': '超級氣旋',
        'Super Jump': '超級跳躍',
        'Supercharge': '超突擊',
        'Transform': '正義合體',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Blaster Mirage': '폭파자의 환영',
        'Blaster(?! Mirage)': '폭파자',
        'Brawler': '폭격자',
        'Brute Justice': '포악한 심판자',
        'Hidden Mine': '지뢰 폭발',
        'Onslaughter': '맹습자',
        'Steam Regulator B': '증기 감독 β',
        'Swindler': '조작자',
        'Vortexer': '교반자',
      },
      'replaceText': {
        '--orbs--': '--구슬--',
        '--regulator check--': '--증기 감옥 확인--',
        '100-Megatonze Shock': '100메가톤즈 충격',
        'Apocalyptic Ray': '파멸 계시',
        'Attachment': '무기 장착',
        'Auxiliary Power': '에너지 지원',
        'Ballistic Missile': '미사일 발사',
        'Brute Force': '폭력적인 주먹',
        'Discoid': '원반',
        'Double Buster': '양손 버스터',
        'Double Rocket Punch': '양손 로켓 주먹',
        'Earth Missile': '대지 미사일',
        'Enumeration': '계산',
        'Execution': '집행 준비',
        'Flarethrower': '대화염방사',
        'Height': '고도',
        'Hydrothermal Missile': '증기 미사일',
        'Ice Missile': '얼음 미사일',
        'J Kick': '정의의 발차기',
        'Long Needle': '대형 미사일',
        'Magicked Mark': '마법 사격',
        'Mega Beam': '고출력 광선',
        'Minefield': '지뢰 살포',
        'Mind Blast': '정신파괴',
        'Mirage': '환영 시스템',
        'Missile Command': '미사일 전탄 발사',
        'Perpetual Ray': '영원한 빛줄기',
        'Seed of the Sky': '하늘의 원천',
        'Short Needle': '소형 미사일',
        'Single Buster': '한손 버스터',
        'Super Cyclone': '대형 돌개바람',
        'Super Jump': '슈퍼 점프',
        'Supercharge': '강력 돌진',
        'Transform': '정의의 합체',
      },
    },
  ],
};

export default triggerSet;
