import { FullLocaleText } from '../types/trigger';

// Output strings for now require a field for every language, so this is a
// helper function to generate one for literal numbers.
const numberToOutputString = function(n: number): FullLocaleText {
  const str = n.toString();
  return {
    en: str,
    de: str,
    fr: str,
    ja: str,
    cn: str,
    ko: str,
  };
};

// General guidelines:
// * property names should closely match English text
// * use OnPlayer suffix for things with `${player}`
// * use OnTarget suffix for things with `${name}`
// * any other parameters (of which there are none, currently) should use consistent suffixes.
// * the value of each property should be a single object with localized keys
export default {
  aoe: {
    en: 'aoe',
    de: 'AoE',
    fr: 'AoE',
    ja: '全体攻撃',
    cn: 'AoE',
    ko: '전체 공격',
  },
  bigAoe: {
    en: 'big aoe!',
    de: 'Große AoE!',
    fr: 'Grosse AoE !',
    ja: '強力な全体攻撃',
    cn: '大AoE傷害！',
    ko: '강한 전체 공격!',
  },
  bleedAoe: {
    en: 'AoE + Bleed',
    de: 'AoE + Blutung',
    fr: 'AoE + Saignement',
    ja: '全体攻撃 + DoT',
    cn: 'AOE + 流血',
    ko: '전체 공격 + 도트',
  },
  tankBuster: {
    en: 'Tank Buster',
    de: 'Tank buster',
    fr: 'Tank buster',
    ja: 'タンク強攻撃',
    cn: '坦克死刑',
    ko: '탱버',
  },
  miniBuster: {
    en: 'Mini Buster',
    de: 'Kleiner Tankbuster',
    fr: 'Mini Buster',
    ja: 'タンク攻撃',
    cn: '小死刑',
    ko: '약한 탱버',
  },
  tankBusterOnPlayer: {
    en: 'Tank Buster on ${player}',
    de: 'Tank buster auf ${player}',
    fr: 'Tank buster sur ${player}',
    ja: '${player}に強攻撃',
    cn: '死刑 點 ${player}',
    ko: '"${player}" 탱버',
  },
  tankBusterOnYou: {
    en: 'Tank Buster on YOU',
    de: 'Tank buster auf DIR',
    fr: 'Tank buster sur VOUS',
    ja: '自分に強攻撃',
    cn: '死刑點名',
    ko: '탱버 대상자',
  },
  // when there are multiple tankbusters going out
  tankBusters: {
    en: 'Tank Busters',
    de: 'Tank busters',
    fr: 'Tank busters',
    ja: 'タンク強攻撃',
    cn: '坦克死刑',
    ko: '탱버',
  },
  tetherBusters: {
    en: 'Tank Tethers',
    de: 'Tank-Verbindungen',
    fr: 'Liens Tank',
    ja: 'タンク線取り',
    cn: '坦克截线',
    ko: '탱커가 선 가로채기',
  },
  avoidTetherBusters: {
    en: 'Avoid Tank Tethers',
  },
  tankCleave: {
    en: 'Tank cleave',
    de: 'Tank Cleave',
    fr: 'Tank cleave',
    ja: 'タンク範囲攻撃',
    cn: '範圍死刑',
    ko: '광역 탱버',
  },
  tankBusterCleaves: {
    en: 'Tank Buster Cleaves',
    de: 'Tankbuster Cleaves',
    fr: 'Tankbuster cleaves',
    ja: 'MT・ST同時範囲攻撃',
    cn: '坦克範圍死刑',
    ko: '동시 광역 탱버',
  },
  tankBusterCleavesOnYou: {
    en: 'Tank Cleaves on YOU',
    de: 'Tank Cleaves auf DIR',
    fr: 'Tank cleaves sur VOUS',
    ja: 'MT・ST同時範囲攻撃(自分対象)',
    cn: '坦克範圍死刑點名',
    ko: '광역 탱버 대상자',
  },
  avoidTankCleave: {
    en: 'Avoid tank cleave',
    de: 'Tank Cleave ausweichen',
    fr: 'Évitez le tank cleave',
    ja: 'タンク範囲攻撃を避ける',
    cn: '遠離範圍死刑',
    ko: '광역 탱버 피하기',
  },
  avoidTankCleaves: {
    en: 'Avoid Tank Cleaves',
    de: 'Tankbuster Cleaves ausweichen',
    fr: 'Évitez les cleaves (tankbusters)',
    ja: '範囲攻撃を避けて',
    cn: '遠離坦克範圍死刑',
    ko: '광역 탱버 피하기',
  },
  tankCleaveOnYou: {
    en: 'Tank cleave on YOU',
    de: 'Tank Cleave aud DIR',
    fr: 'Tank cleave sur VOUS',
    ja: '自分に範囲攻撃',
    cn: '範圍死刑點名',
    ko: '나에게 광역 탱버',
  },
  sharedTankbuster: {
    en: 'Shared Tank Buster',
    de: 'Geteilter Tankbuster',
    fr: 'Partagez le Tank buster',
    ja: 'タンク頭割り',
    cn: '集合死刑',
    ko: '쉐어 탱버',
  },
  sharedTankbusterOnYou: {
    en: 'Shared Tank Buster on YOU',
    de: 'geteilter Tankbuster auf DIR',
    fr: 'Tank buster à partager sur VOUS',
    ja: '自分にタンク頭割り',
    cn: '集合死刑點名',
    ko: '쉐어 탱버 대상자',
  },
  sharedTankbusterOnPlayer: {
    en: 'Shared Tank Buster on ${player}',
    de: 'geteilter Tankbuster on ${player}',
    fr: 'Tank buster à partager sur ${player}',
    ja: '${player} にタンク頭割り',
    cn: '集合死刑點 ${player}',
    ko: '"${player}" 쉐어 탱버',
  },
  tankSwap: {
    en: 'Tank Swap!',
    de: 'Tankwechsel!',
    fr: 'Tank swap !',
    ja: 'タンクスイッチ!',
    cn: '換T！',
    ko: '탱 교대',
  },
  spread: {
    en: 'Spread',
    de: 'Verteilen',
    fr: 'Dispersez-vous',
    ja: '散開',
    cn: '散開',
    ko: '산개',
  },
  stackMarker: {
    // for stack marker situations
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '頭割り',
    cn: '集合',
    ko: '쉐어뎀',
  },
  getTogether: {
    // for getting together without stack marker
    en: 'Stack',
    de: 'Sammeln',
    fr: 'Packez-vous',
    ja: '集合',
    cn: '集合',
    ko: '모이기',
  },
  healerGroups: {
    en: 'Healer Groups',
    de: 'Heiler-Gruppen',
    fr: 'Groupes sur les heals',
    ja: 'ヒラに頭割り',
    cn: '治療集合組',
    ko: '힐러 그룹 쉐어',
  },
  stackOnYou: {
    en: 'Stack on YOU',
    de: 'Auf DIR sammeln',
    fr: 'Package sur VOUS',
    ja: '自分に頭割り',
    cn: '集合點名',
    ko: '쉐어징 대상자',
  },
  stackOnPlayer: {
    en: 'Stack on ${player}',
    de: 'Auf ${player} sammeln',
    fr: 'Packez-vous sur ${player}',
    ja: '${player}に頭割り',
    cn: '靠近 ${player}集合',
    ko: '"${player}" 쉐어징',
  },
  stackMiddle: {
    en: 'Stack in middle',
    de: 'In der Mitte sammeln',
    fr: 'Packez-vous au milieu',
    ja: '中央で頭割り',
    cn: '中間集合',
    ko: '중앙에서 모이기',
  },
  doritoStack: {
    en: 'Dorito Stack',
    de: 'Mit Marker sammeln',
    fr: 'Packez les marques',
    ja: 'マーカー同士で頭割り',
    cn: '點名集合',
    ko: '징끼리 모이기',
  },
  spreadThenStack: {
    en: 'Spread => Stack',
    de: 'Verteilen => Sammeln',
    fr: 'Dispersion => Package',
    ja: '散開 => 頭割り',
    cn: '散開 => 集合',
    ko: '산개 => 집합',
  },
  stackThenSpread: {
    en: 'Stack => Spread',
    de: 'Sammeln => Verteilen',
    fr: 'Package => Dispersion',
    ja: '頭割り => 散開',
    cn: '集合 => 散開',
    ko: '집합 => 산개',
  },
  drawIn: {
    // Opposite of a knockback.
    en: 'Draw In',
    de: 'Einzug',
    fr: 'Attraction',
    ja: '吸込み',
    cn: '吸引',
    ko: '끌어당김',
  },
  knockback: {
    en: 'Knockback',
    de: 'Rückstoß',
    fr: 'Poussée',
    ja: 'ノックバック',
    cn: '擊退',
    ko: '넉백',
  },
  knockbackOnYou: {
    en: 'Knockback on YOU',
    de: 'Rückstoß auf DIR',
    fr: 'Poussée sur VOUS',
    ja: '自分にノックバック',
    cn: '擊退點名',
    ko: '넉백징 대상자',
  },
  knockbackOnPlayer: {
    en: 'Knockback on ${player}',
    de: 'Rückstoß auf ${player}',
    fr: 'Poussée sur ${player}',
    ja: '${player}にノックバック',
    cn: '擊退點名${player}',
    ko: '"${player}" 넉백징',
  },
  lookTowardsBoss: {
    en: 'Look Towards Boss',
    de: 'Anschauen Boss',
    fr: 'Regardez le boss',
    ja: 'ボスを見る',
    cn: '面向Boss',
    ko: '쳐다보기',
  },
  lookAway: {
    en: 'Look Away',
    de: 'Wegschauen',
    fr: 'Regardez ailleurs',
    ja: 'ボスを見ない',
    cn: '背對Boss',
    ko: '뒤돌기',
  },
  lookAwayFromPlayer: {
    en: 'Look Away from ${player}',
    de: 'Schau weg von ${player}',
    fr: 'Ne regardez pas ${player}',
    ja: '${player}を見ない',
    cn: '背對${player}',
    ko: '${player}에게서 뒤돌기',
  },
  lookAwayFromTarget: {
    en: 'Look Away from ${name}',
    de: 'Schau weg von ${name}',
    fr: 'Ne regardez pas ${name}',
    ja: '${name}を見ない',
    cn: '背對${name}',
    ko: '${name}에게서 뒤돌기',
  },
  getBehind: {
    en: 'Get Behind',
    de: 'Hinter ihn',
    fr: 'Passez derrière',
    ja: '背面へ',
    cn: '去背後',
    ko: '보스 뒤로',
  },
  goFrontOrSides: {
    en: 'Go Front / Sides',
    de: 'Gehe nach Vorne/ zu den Seiten',
    fr: 'Allez Devant / Côtés',
    ja: '前／横へ',
    cn: '去前側方',
    ko: '보스 후방 피하기',
  },
  goFront: {
    en: 'Go Front',
    de: 'Geh nach vorn',
    fr: 'Allez Devant',
    ja: '前へ',
    cn: '去前面',
    ko: '앞으로',
  },
  // getUnder is used when you have to get into the bosses hitbox
  getUnder: {
    en: 'Get Under',
    de: 'Unter ihn',
    fr: 'En dessous',
    ja: 'ボスに貼り付く',
    cn: '去腳下',
    ko: '보스 아래로',
  },
  // in is more like "get close but maybe even melee range is fine"
  in: {
    en: 'In',
    de: 'Rein',
    fr: 'Intérieur',
    ja: '中へ',
    cn: '靠近',
    ko: '안으로',
  },
  // out means get far away
  out: {
    en: 'Out',
    de: 'Raus',
    fr: 'Extérieur',
    ja: '外へ',
    cn: '遠離',
    ko: '밖으로',
  },
  outOfMelee: {
    en: 'Out of melee',
    de: 'Raus aus Nahkampf',
    fr: 'Sortez de la mêlée',
    ja: '近接の範囲から離れる',
    cn: '離開近戰距離',
    ko: '근접범위 밖으로',
  },
  inThenOut: {
    en: 'In => out',
    de: 'Rein, dann raus',
    fr: 'Intérieur, puis extérieur',
    ja: '中 => 外',
    cn: '先靠近，再遠離',
    ko: '안으로 => 밖으로',
  },
  outThenIn: {
    en: 'Out => in',
    de: 'Raus, dann rein',
    fr: 'Extérieur, puis intérieur',
    ja: '外 => 中',
    cn: '先遠離，再靠近',
    ko: '밖으로 => 안으로',
  },
  backThenFront: {
    en: 'Back => Front',
    de: 'Nach Hinten, danach nach Vorne',
    fr: 'Derrière puis devant',
    ja: '後ろ => 前',
    cn: '後 => 前',
    ko: '뒤로 => 앞으로',
  },
  frontThenBack: {
    en: 'Front => Back',
    de: 'Nach Vorne, danach nach Hinten',
    fr: 'Devant puis derrière',
    ja: '前 => 後ろ',
    cn: '前 => 後',
    ko: '앞으로 => 뒤로',
  },
  goIntoMiddle: {
    en: 'Get Middle',
    de: 'in die Mitte gehen',
    fr: 'Allez au milieu',
    ja: '中へ',
    cn: '去中間',
    ko: '중앙으로',
  },
  front: {
    en: 'Front',
    de: 'Vorne',
    fr: 'Devant',
    ja: '前',
    cn: '前',
    ko: '앞',
  },
  back: {
    en: 'Back',
    de: 'Hinten',
    fr: 'Derrière',
    ja: '後ろ',
    cn: '後',
    ko: '뒤',
  },
  right: {
    en: 'Right',
    de: 'Rechts',
    fr: 'À droite',
    ja: '右へ',
    cn: '右',
    ko: '오른쪽',
  },
  left: {
    en: 'Left',
    de: 'Links',
    fr: 'À gauche',
    ja: '左へ',
    cn: '左',
    ko: '왼쪽',
  },
  getLeftAndWest: {
    en: '<= Get Left/West',
    de: '<= Nach Links/Westen',
    fr: '<= Allez à Gauche/Ouest',
    ja: '<= 左/西へ',
    cn: '<= 去左/西邊',
    ko: '<= 왼쪽/서쪽',
  },
  getRightAndEast: {
    en: 'Get Right/East =>',
    de: 'Nach Rechts/Osten =>',
    fr: 'Allez à Droite/Est =>',
    ja: '右/東へ =>',
    cn: '去右/東邊 =>',
    ko: '오른쪽/동쪽 =>',
  },
  leftThenRight: {
    en: 'Left => Right',
    de: 'Links => Rechts',
    fr: 'À gauche => À droite',
    ja: '左 => 右',
    cn: '左 => 右',
    ko: '왼쪽 => 오른쪽',
  },
  rightThenLeft: {
    en: 'Right => Left',
    de: 'Rechts => Links',
    fr: 'À droite => À gauche',
    ja: '右 => 左',
    cn: '右 => 左',
    ko: '오른쪽 => 왼쪽',
  },
  goFrontBack: {
    en: 'Go Front/Back',
    de: 'Geh nach Vorne/Hinten',
    fr: 'Allez Devant/Derrière',
    ja: '縦へ',
    cn: '去前後',
    ko: '앞/뒤로',
  },
  sides: {
    en: 'Sides',
    de: 'Seiten',
    fr: 'Côtés',
    ja: '横へ',
    cn: '去側面',
    ko: '양옆으로',
  },
  middle: {
    en: 'Middle',
    de: 'Mitte',
    fr: 'Milieu',
    ja: '中へ',
    cn: '中間',
    ko: '중앙',
  },
  clockwise: {
    en: 'Clockwise',
    de: 'Im Uhrzeigersinn',
    fr: 'Sens horaire',
    ja: '時針回り',
    cn: '順時針',
    ko: '시계방향',
  },
  counterclockwise: {
    en: 'Counter-clock',
    de: 'Gegen den Uhrzeigersinn',
    fr: 'Anti-horaire',
    ja: '反時針回り',
    cn: '逆時針',
    ko: '반시계방향',
  },
  // killAdds is used for adds that will always be available
  killAdds: {
    en: 'Kill adds',
    de: 'Adds besiegen',
    fr: 'Tuez les adds',
    ja: '雑魚から倒して',
    cn: '擊殺小怪',
    ko: '쫄 잡기',
  },
  // killExtraAdd is used for adds that appear if a mechanic was not played correctly
  killExtraAdd: {
    en: 'Kill Extra Add',
    de: 'Add besiegen',
    fr: 'Tuez l\'add',
    ja: '雑魚から倒して',
    cn: '擊殺小怪',
    ko: '쫄 잡기',
  },
  awayFromFront: {
    en: 'Away From Front',
    de: 'Weg von Vorne',
    fr: 'Éloignez-vous du devant',
    ja: '前方から離れる',
    cn: '遠離正面',
    ko: '보스 전방 피하기',
  },
  sleepTarget: {
    en: 'Sleep ${name}',
    de: 'Schlaf auf ${name}',
    fr: 'Sommeil sur ${name}',
    ja: '${name} にスリプル',
    cn: '催眠 ${name}',
    ko: '${name} 슬리플',
  },
  stunTarget: {
    en: 'Stun ${name}',
    de: 'Betäubung auf ${name}',
    fr: 'Étourdissez ${name}',
    ja: '${name} にスタン',
    cn: '眩暈 ${name}',
    ko: '${name}기절',
  },
  interruptTarget: {
    en: 'interrupt ${name}',
    de: 'unterbreche ${name}',
    fr: 'Interrompez ${name}',
    ja: '${name} に沈黙',
    cn: '打斷${name}',
    ko: '${name}기술 시전 끊기',
  },
  preyOnYou: {
    en: 'Prey on YOU',
    de: 'Marker auf DIR',
    fr: 'Marquage sur VOUS',
    ja: '自分に捕食',
    cn: '掠食點名',
    ko: '홍옥징 대상자',
  },
  preyOnPlayer: {
    en: 'Prey on ${player}',
    de: 'Marker auf ${player}',
    fr: 'Marquage sur ${player}',
    ja: '${player}に捕食',
    cn: '掠食點名${player}',
    ko: '"${player}" 홍옥징',
  },
  awayFromGroup: {
    en: 'Away from Group',
    de: 'Weg von der Gruppe',
    fr: 'Éloignez-vous du groupe',
    ja: '外へ',
    cn: '遠離人群',
    ko: '다른 사람들과 떨어지기',
  },
  awayFromPlayer: {
    en: 'Away from ${player}',
    de: 'Weg von ${player}',
    fr: 'Éloignez-vous de ${player}',
    ja: '${player}から離れる',
    cn: '遠離${player}',
    ko: '"${player}"에게서 멀어지기',
  },
  meteorOnYou: {
    en: 'Meteor on YOU',
    de: 'Meteor auf DIR',
    fr: 'Météore sur VOUS',
    ja: '自分にメテオ',
    cn: '隕石點名',
    ko: '나에게 메테오징',
  },
  stopMoving: {
    en: 'Stop Moving!',
    de: 'Bewegung stoppen!',
    fr: 'Ne bougez pas !',
    ja: '移動禁止！',
    cn: '停止移動！',
    ko: '이동 멈추기!',
  },
  stopEverything: {
    en: 'Stop Everything!',
    de: 'Stoppe Alles!',
    fr: 'Arrêtez tout !',
    ja: '行動禁止！',
    cn: '停止行動！',
    ko: '행동 멈추기!',
  },
  moveAway: {
    // move away to dodge aoes
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '避けて！',
    cn: '快躲開！',
    ko: '이동하기!',
  },
  moveAround: {
    // move around (e.g. jumping) to avoid being frozen
    en: 'Move!',
    de: 'Bewegen!',
    fr: 'Bougez !',
    ja: '動く！',
    cn: '快動！',
    ko: '움직이기!',
  },
  breakChains: {
    en: 'Break chains',
    de: 'Kette zerbrechen',
    fr: 'Brisez les chaines',
    ja: '線を切る',
    cn: '切斷連線',
    ko: '선 끊기',
  },
  moveChainsTogether: {
    en: 'Move chains together',
    de: 'Ketten zusammen bewegen',
    fr: 'Bougez les chaines ensemble',
    ja: '線同士で一緒に移動',
    cn: '連線一起移動',
    ko: '선 붙어서 같이 움직이기',
  },
  earthshakerOnYou: {
    en: 'Earth Shaker on YOU',
    de: 'Erdstoß auf DIR',
    fr: 'Marque de terre sur VOUS',
    ja: '自分にアースシェイカー',
    cn: '大地搖動點名',
    ko: '어스징 대상자',
  },
  wakeUp: {
    en: 'WAKE UP',
    de: 'AUFWACHEN',
    fr: 'RÉVEILLE-TOI',
    ja: '目を覚まして！',
    cn: '醒醒！動一動！！',
    ko: '일어나세요!',
  },
  closeTethersWithPlayer: {
    en: 'Close Tethers (${player})',
    de: 'Nahe Verbindungen (${player})',
    fr: 'Liens proches avec (${player})',
    ja: '${player}に近づく',
    cn: '靠近連線 (${player})',
    ko: '상대와 가까이 붙기 (${player})',
  },
  farTethersWithPlayer: {
    en: 'Far Tethers (${player})',
    de: 'Entfernte Verbindungen (${player})',
    fr: 'Liens éloignés avec (${player})',
    ja: ' (${player})から離れる',
    cn: '遠離連線 (${player})',
    ko: '상대와 떨어지기 (${player})',
  },
  getTowers: {
    en: 'Get Towers',
    de: 'Türme nehmen',
    fr: 'Allez dans les tours',
    ja: '塔を踏む',
    cn: '踩塔',
    ko: '기둥 들어가기',
  },
  unknown: {
    en: '???',
    de: '???',
    fr: '???',
    ja: '???',
    cn: '???',
    ko: '???',
  },
  north: {
    en: 'North',
    de: 'Norden',
    fr: 'Nord',
    ja: '北',
    cn: '上(北)',
    ko: '북쪽',
  },
  south: {
    en: 'South',
    de: 'Süden',
    fr: 'Sud',
    ja: '南',
    cn: '下(南)',
    ko: '남쪽',
  },
  east: {
    en: 'East',
    de: 'Osten',
    fr: 'Est',
    ja: '東',
    cn: '右(東)',
    ko: '동쪽',
  },
  west: {
    en: 'West',
    de: 'Westen',
    fr: 'Ouest',
    ja: '西',
    cn: '左(西)',
    ko: '서쪽',
  },
  northwest: {
    en: 'Northwest',
    de: 'Nordwesten',
    fr: 'Nord-Ouest',
    ja: '北西',
    cn: '左上(西北)',
    ko: '북서쪽',
  },
  northeast: {
    en: 'Northeast',
    de: 'Nordosten',
    fr: 'Nord-Est',
    ja: '北東',
    cn: '右上(東北)',
    ko: '북동쪽',
  },
  southwest: {
    en: 'Southwest',
    de: 'Südwesten',
    fr: 'Sud-Ouest',
    ja: '南西',
    cn: '左下(西南)',
    ko: '남서쪽',
  },
  southeast: {
    en: 'Southeast',
    de: 'Südosten',
    fr: 'Sud-Est',
    ja: '南東',
    cn: '右下(東南)',
    ko: '남동쪽',
  },
  dirN: {
    en: 'N',
    de: 'N',
    fr: 'N',
    ja: '北',
    cn: '上(北)',
    ko: '북',
  },
  dirS: {
    en: 'S',
    de: 'S',
    fr: 'S',
    ja: '南',
    cn: '下(南)',
    ko: '남',
  },
  dirE: {
    en: 'E',
    de: 'O',
    fr: 'E',
    ja: '東',
    cn: '右(東)',
    ko: '동',
  },
  dirW: {
    en: 'W',
    de: 'W',
    fr: 'O',
    ja: '西',
    cn: '左(西)',
    ko: '서',
  },
  dirNW: {
    en: 'NW',
    de: 'NW',
    fr: 'NO',
    ja: '北西',
    cn: '左上(西北)',
    ko: '북서',
  },
  dirNE: {
    en: 'NE',
    de: 'NO',
    fr: 'NE',
    ja: '北東',
    cn: '右上(東北)',
    ko: '북동',
  },
  dirSW: {
    en: 'SW',
    de: 'SW',
    fr: 'SO',
    ja: '南西',
    cn: '左下(西南)',
    ko: '남서',
  },
  dirSE: {
    en: 'SE',
    de: 'SO',
    fr: 'SE',
    ja: '南東',
    cn: '右下(東南)',
    ko: '남동',
  },
  dirNNE: {
    en: 'NNE',
    de: 'NNO',
    fr: 'NNE',
    ja: '北北東(1時)',
    cn: '上偏右(北偏東)',
    ko: '1시',
  },
  dirENE: {
    en: 'ENE',
    de: 'ONO',
    fr: 'ENE',
    ja: '東北東(2時)',
    cn: '右偏上(東偏北)',
    ko: '2시',
  },
  dirESE: {
    en: 'ESE',
    de: 'OSO',
    fr: 'ESE',
    ja: '東南東(4時)',
    cn: '右偏下(東偏南)',
    ko: '4시',
  },
  dirSSE: {
    en: 'SSE',
    de: 'SSO',
    fr: 'SSE',
    ja: '南南東(5時)',
    cn: '下偏右(南偏東)',
    ko: '5시',
  },
  dirSSW: {
    en: 'SSW',
    de: 'SSW',
    fr: 'SSO',
    ja: '南南西(7時)',
    cn: '下偏左(南偏西)',
    ko: '7시',
  },
  dirWSW: {
    en: 'WSW',
    de: 'WSW',
    fr: 'OSO',
    ja: '西南西(8時)',
    cn: '左偏下(西偏南)',
    ko: '8시',
  },
  dirWNW: {
    en: 'WNW',
    de: 'WNW',
    fr: 'ONO',
    ja: '西北西(10時)',
    cn: '左偏上(西偏北)',
    ko: '10시',
  },
  dirNNW: {
    en: 'NNW',
    de: 'NNW',
    fr: 'NNO',
    ja: '北北西(11時)',
    cn: '上偏左(北偏西)',
    ko: '11시',
  },
  tank: {
    en: 'Tank',
    de: 'Tank',
    fr: 'Tank',
    ja: 'タンク',
    cn: '坦克',
    ko: '탱',
  },
  healer: {
    en: 'Healer',
    de: 'Heiler',
    fr: 'Healer',
    ja: 'ヒーラー',
    cn: '治療',
    ko: '힐',
  },
  dps: {
    en: 'DPS',
    de: 'DPS',
    fr: 'DPS',
    ja: 'DPS',
    cn: 'DPS',
    ko: '딜러',
  },
  // Literal numbers.
  num0: numberToOutputString(0),
  num1: numberToOutputString(1),
  num2: numberToOutputString(2),
  num3: numberToOutputString(3),
  num4: numberToOutputString(4),
  num5: numberToOutputString(5),
  num6: numberToOutputString(6),
  num7: numberToOutputString(7),
  num8: numberToOutputString(8),
  num9: numberToOutputString(9),
} as const;
