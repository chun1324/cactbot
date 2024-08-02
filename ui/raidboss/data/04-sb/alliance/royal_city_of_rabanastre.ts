import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  maskValue?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheRoyalCityOfRabanastre',
  zoneId: ZoneId.TheRoyalCityOfRabanastre,
  timelineFile: 'royal_city_of_rabanastre.txt',
  triggers: [
    {
      id: 'Rab Mateus Aqua Sphere',
      type: 'StartsUsing',
      netRegex: { id: '2633', source: 'Mateus, The Corrupt', capture: false },
      delaySeconds: 11,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Aqua Spheres',
          de: 'Wasserkugeln zerstören',
          fr: 'Détruire les bulles d\'eau',
          ja: 'アクアスフィアを倒す',
          cn: '擊殺水球',
          ko: '물 구체 죽이기',
        },
      },
    },
    {
      id: 'Rab Mateus Breathless',
      type: 'GainsEffect',
      netRegex: { effectId: '595' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, matches, output) => {
        if (parseInt(matches.count) === 6)
          return output.getInBubble!();
      },
      infoText: (_data, matches, output) => {
        const count = parseInt(matches.count);
        if (count >= 7)
          return output.breathless!({ num: count });
      },
      outputStrings: {
        breathless: {
          en: 'Breathless: ${num}',
          de: 'Atemnot: ${num}',
          fr: 'Suffocation : ${num}',
          ja: '呼吸困難 :${num}',
          cn: '窒息層數:${num}',
          ko: '호흡곤란: ${num}',
        },
        getInBubble: {
          en: 'Get In Bubble',
          de: 'Geh in die Blase',
          fr: 'Allez dans une bulle',
          ja: '泡に入る',
          cn: '進氣泡',
          ko: '물방울 안으로',
        },
      },
    },
    {
      id: 'Rab Mateus Blizzard IV',
      type: 'StartsUsing',
      netRegex: { id: '263D', source: 'Mateus, The Corrupt', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move To Safe Spot',
          de: 'Zur sicheren Zone',
          fr: 'Allez en zone safe',
          ja: '安置へ',
          cn: '去安全點',
          ko: '안전 지대로 이동',
        },
      },
    },
    {
      id: 'Rab Hashmal Quake IV',
      type: 'StartsUsing',
      netRegex: { id: '25D8', source: 'Hashmal, Bringer Of Order', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rab Hashmal Extreme Edge Left',
      type: 'StartsUsing',
      netRegex: { id: '25D0', source: 'Hashmal, Bringer Of Order', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Find Hashmal; Dodge Left',
          de: 'Finde Hashmallim; Weiche nach Links aus',
          fr: 'Trouvez Hashmal, Esquivez à gauche',
          ja: 'ボスに向かって左に',
          cn: '找到BOSS; 向左躲避',
          ko: '하쉬말림 찾고, 왼쪽으로 피하기',
        },
      },
    },
    {
      id: 'Rab Hashmal Extreme Edge Right',
      type: 'StartsUsing',
      netRegex: { id: '25CE', source: 'Hashmal, Bringer Of Order', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Find Hashmal; Dodge Right',
          de: 'Finde Hashmallim; Weiche nach Rechts aus',
          fr: 'Trouvez Hashmal, Esquivez à droite',
          ja: 'ボスに向かって右に',
          cn: '找到BOSS; 向右躲避',
          ko: '하쉬말림 찾고, 오른쪽으로 피하기',
        },
      },
    },
    {
      id: 'Rab Hashmal Rock Cutter',
      type: 'StartsUsing',
      netRegex: { id: '25D7', source: 'Hashmal, Bringer Of Order' },
      response: Responses.tankCleave(),
    },
    {
      id: 'Rab Hashmal Falling Boulder',
      type: 'StartsUsing',
      netRegex: { id: '25D2', source: 'Hashmal, Bringer Of Order', capture: false },
      // There's three of these, so just say stack.
      suppressSeconds: 1,
      response: Responses.stackMarker(),
    },
    {
      id: 'Rab Hashmal Falling Rock',
      type: 'StartsUsing',
      netRegex: { id: '25D3', source: 'Hashmal, Bringer Of Order' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Rab Hashmal Earth Hammer',
      type: 'StartsUsing',
      netRegex: { id: '25CB', source: 'Hashmal, Bringer Of Order', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move Away',
          de: 'Weg da',
          fr: 'Éloignez-vous',
          ja: 'ハンマーから離れる',
          cn: '遠離大錘落點',
          ko: '기둥 피하기',
        },
      },
    },
    {
      id: 'Rab Hashmal Golems',
      type: 'StartsUsing',
      netRegex: { id: '25D4', source: 'Hashmal, Bringer Of Order', capture: false },
      delaySeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill Golems',
          de: 'Golems töten',
          fr: 'Tuez les golems',
          ja: 'ゴーレムを倒す',
          cn: '擊殺小怪',
          ko: '골렘 죽이기',
        },
      },
    },
    {
      id: 'Rab Trash Dragon Voice',
      type: 'StartsUsing',
      netRegex: { id: 'D10', source: 'Archaeolion', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'Rab Trash Ram Voice',
      type: 'StartsUsing',
      netRegex: { id: ['D0F', '273B'], source: 'Archaeolion', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Rab Rofocale Crush Helm',
      type: 'Ability',
      netRegex: { id: '2681', source: 'Rofocale' },
      suppressSeconds: 10,
      // 2680 is on Rofocale with a castbar, then multiple 2681 and a final 2682 ability.
      // TODO: should this say "multi-hit tankbuster?"
      response: Responses.tankBuster(),
    },
    {
      id: 'Rab Rofocale Chariot',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      response: Responses.getIn('alarm'),
    },
    {
      id: 'Rab Rofocale Trample',
      type: 'StartsUsing',
      netRegex: { id: '2676', source: 'Rofocale', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Trample',
          de: 'Zertrampeln',
          fr: 'Fauchage',
          ja: '蹂躙',
          cn: '蹂躪',
          ko: '유린',
        },
      },
    },
    {
      id: 'Rab Argath Fire IV',
      type: 'StartsUsing',
      netRegex: { source: 'Argath Thadalfus', id: '262E', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Rab Argath Crippling Blow',
      type: 'StartsUsing',
      netRegex: { source: 'Argath Thadalfus', id: '262D' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Rab Argath Trepidation',
      type: 'Ability',
      netRegex: { source: 'Argath Thadalfus', id: '2622', capture: false },
      infoText: (_data, _matches, output) => output.getTowers!(),
      outputStrings: {
        getTowers: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '기둥 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Rab Argath Mask of Truth',
      type: 'Ability',
      netRegex: { source: 'Argath Thadalfus', id: '261A', capture: false },
      run: (data) => data.maskValue = true,
    },
    {
      id: 'Rab Argath Mask of Lies',
      type: 'Ability',
      netRegex: { source: 'Argath Thadalfus', id: '2619', capture: false },
      run: (data) => data.maskValue = false,
    },
    {
      id: 'Rab Argath Command Scatter',
      type: 'HeadMarker',
      netRegex: { id: '007B' },
      condition: Conditions.targetIsYou(),
      infoText: (data, _matches, output) => {
        if (data.maskValue)
          return output.move!();

        return output.stop!();
      },
      outputStrings: {
        move: Outputs.moveAround,
        stop: Outputs.stopEverything,
      },
    },
    {
      id: 'Rab Argath Command Turn',
      type: 'HeadMarker',
      netRegex: { id: '007C' },
      condition: Conditions.targetIsYou(),
      infoText: (data, _matches, output) => {
        if (data.maskValue)
          return output.lookAway!();

        return output.lookTowards!();
      },
      outputStrings: {
        lookAway: Outputs.lookAway,
        lookTowards: Outputs.lookTowardsBoss,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Mask Of Truth/Mask Of Lies': 'Mask Of Truth/Lies',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aqua Sphere': 'Wassersphäre',
        'Archaeodemon': 'Archaeodämon',
        'Archaeolion': 'Archaeolöwe',
        'Argath Thadalfus': 'Argath Thadalfus',
        'Azure Guard': 'Azurwächter',
        'Command Tower': 'Turmkommando',
        'Control Tower': 'Turmkontrolle',
        'Flume Toad': 'Abflusskröte',
        'Hashmal, Bringer of Order': 'Hashmallim der Einiger',
        'Heartless': 'Kalte Klinge',
        'Icicle': 'Eiszapfen',
        'Mateus, The Corrupt': 'Mateus (?:der|die|das) Peiniger',
        'Pennantstone Golem': 'Sandstein-Golem',
        'Rofocale': 'Rofocale',
        'Sand Sphere': 'Sandwirbel',
        'Submission Tower': 'Turmdivision',
        'The Crumbling Bridge': 'Die verwitterte Brücke',
        'The Lesalia Garden Ruins': 'Verfallene Gärten',
        'The Lesalia Temple Ruins': 'Tempelruine',
        'The Palace Square': 'Palasthof',
        'The heavens tremble in my wake': 'Mein Streitwagen donnert empor in luftige Höhen',
      },
      'replaceText': {
        '--Shade--': '--Schatten--',
        '--Shard--': '--Kristall--',
        '--enrage--': '--Finalangriff--',
        '--invulnerable--': '--unverwundbar--',
        '--lock out--': '--ausgesperrt--',
        'Adds': 'Adds',
        'Aqua Sphere': 'Wassersphäre',
        'Archaeodemon': 'Archaeodämon',
        'Azure Guard': 'Azurwächter',
        'Blizzard IV': 'Eiska',
        'Blizzard Sphere': 'Eissphäre',
        'Chariot': 'Streitwagen',
        'Coldblood': 'Kaltblut',
        'Command Tower': 'Turmkommando',
        'Control Tower': 'Turmkontrolle',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Crush Helm': 'Zenitspaltung',
        'Crush Weapon': 'Jenseitsschrei',
        'Cry Of Victory': 'Kampfruf',
        'Cry of Victory': 'Kampfruf',
        'Dark Geas': 'Dunkles Gelöbnis',
        'Dark Ultima': 'Dunkel-Ultima',
        'Demolish': 'Ausradieren',
        'Dendrite': 'Eisdendriten',
        'Dualcast': 'Doppelzauber',
        'Earth Hammer': 'Erdhammer',
        'Earth Shaker': 'Erdstoß',
        'Embrace': 'Umschließen',
        'Empty Soul': 'Leere Seele',
        'Extreme Edge': 'Extremkante',
        'Falling Boulder': 'Felsschlag',
        'Falling Rock': 'Steinschlag',
        'Fire IV': 'Feuka',
        'Flash-Freeze': 'Frostlanze',
        'Flume Toad': 'Abflusskröte',
        'Frostwave': 'Polarlanze',
        'Gnawing Dread': 'Nagende Angst',
        'Golem': 'Golem',
        'Hammerfall': 'Hammerschlag',
        'Heartless': 'Kalte Klinge',
        'Heavenly Subjugation': 'Himmelsgewalt',
        'Hole In One': 'Hole In One',
        'Impact': 'Impakt',
        'Jagged Edge': 'Schartenkante',
        'Judgment Blade': 'Klinge des Urteils',
        'Landwaster': 'Landverwüster',
        'Mask Of Lies': 'Maske der Lüge',
        'Mask Of Truth': 'Maske der Wahrheit',
        'Maverick': 'Einzelgänger',
        'Might': 'Steinstärke',
        'Pomp And Circumstance': 'Pauken und Trompeten',
        'Pomp and Circumstance': 'Pauken und Trompeten',
        'Quake IV': 'Seiska',
        'Rail Of The Rat': 'Rache der Ratte',
        'Rebind': 'Zusammenfrieren',
        'Rock Cutter': 'Steinfräse',
        'Royal Blood': 'Blaues Blut',
        'Sanction': 'Sanktion',
        'Sand Sphere': 'Sandwirbel',
        'Snowpierce': 'Schneestich',
        'Soulfix': 'Seelenspießer',
        'Submission Tower': 'Turmdivision',
        'Summon': 'Rufen',
        'The Word': 'Gottes Wort',
        'Towerfall': 'Turmsturz',
        'Trample': 'Zertrampeln',
        'Trepidation': 'Beklemmung',
        'Unbind': 'Loseisen',
        'Unrelenting': 'Unerbittliche Klinge',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aqua Sphere': 'sphère d\'eau',
        'Archaeodemon': 'archéodémon',
        'Archaeolion': 'archéochimère',
        'Argath Thadalfus': 'Argath Thadalfus',
        'Azure Guard': 'gardien azur',
        'Command Tower': 'Tour de commandement',
        'Control Tower': 'Tour de contrôle',
        'Flume Toad': 'crapaud des torrents',
        'Hashmal, Bringer of Order': 'Hashmal le Grand Ordonnateur',
        'Heartless': 'Sans-cœur',
        'Icicle': 'stalactite',
        'Mateus, The Corrupt': 'Mateus le Corrompu',
        'Pennantstone Golem': 'golem de dalles',
        'Rofocale': 'Rofocale le Roi centaure',
        'Sand Sphere': 'Sphère de Sable',
        'Submission Tower': 'Tour de soumission',
        'The Crumbling Bridge': 'Pont démoli',
        'The heavens tremble in my wake': 'Mon char arpente le ciel aussi aisément que les plaines',
        'The Lesalia Garden Ruins': 'Jardins ravagés de Lesalia',
        'The Lesalia Temple Ruins': 'Ruines du temple de Lesalia',
        'The Palace Square': 'Place du palais',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(Hole In One\\)': '(Un seul trou)',
        '--Aqua Sphere Adds--': '--Adds Sphères d\'eau--',
        '--Azure Guard Adds--': 'Adds Gardiens azur',
        '--Blizzard Sphere Adds--': '--Adds Sphères de glace--',
        '--Flume Toad Adds--': '--Adds Crapauds des torrents--',
        '--Golem Adds--': 'Adds Golems',
        '--invulnerable--': '--invulnérable--',
        '--lock out--': '--verrouiller--',
        '--Sand Sphere Adds--': 'Adds Sphères de Sable',
        '--Shade Adds--': '--Adds Ombres--',
        '--Shard Adds--': '--Adds Cristaux du néant--',
        'Archaeodemon Adds': 'Adds Archéodémon',
        'Blizzard IV': 'Giga Glace',
        'Chariot': 'Charge centaure',
        'Coldblood': 'Sang-froid',
        'Command Tower': 'Tour de commandement',
        'Control Tower': 'Tour de contrôle',
        'Crippling Blow': 'Coup handicapant',
        'Crush Helm': 'Bombardement céleste',
        'Crush Weapon': 'Cri de l\'au-delà',
        'Cry Of Victory': 'Cri de triomphe',
        'Dark Geas': 'Invocation ténébreuse',
        'Dark Ultima': 'Ultima ténébreuse',
        'Demolish': 'Oblitération',
        'Dendrite': 'Dendrite',
        'Dualcast': 'Chaîne de sorts',
        'Earth Hammer': 'Marteau tellurique',
        'Earth Shaker': 'Secousse',
        'Embrace': 'Étreinte',
        'Empty Soul': 'Âme du vide',
        'Extreme Edge': 'Taille suprême',
        'Falling Boulder': 'Chute de pierre',
        'Falling Rock': 'Chute de rocher',
        'Fire IV': 'Giga Feu',
        'Flash-Freeze': 'Glaciation instantanée',
        'Frostwave': 'Vague réfrigérante',
        'Gnawing Dread': 'Peur calamiteuse',
        'Hammerfall': 'Aplatissoir',
        'Heartless': 'Sans-cœur',
        'Heavenly Subjugation': 'Marche triomphale',
        'Impact': 'Impact',
        'Jagged Edge': 'Pointes acérées',
        'Judgment Blade': 'Lame du jugement',
        'Landwaster': 'Dislocation terrestre',
        '(?<!/)Mask Of Lies': 'Masque du mensonge',
        'Mask Of Truth/Mask Of Lies': 'Masque du mensonge/vérité',
        'Mask Of Truth(?!/)': 'Masque de la vérité',
        'Maverick': 'Franc-tireur',
        'Might': 'Bras de fer',
        'Pomp And Circumstance': 'La pompe et l\'attirail',
        'Quake IV': 'Giga Séisme',
        'Rail Of The Rat': 'Coup du rat',
        'Rebind': 'Emprisonnement',
        'Rock Cutter': 'Trancheur rocheux',
        'Royal Blood': 'Sang royal',
        'Sanction': 'Sanction',
        'Snowpierce': 'Perçage algide',
        'Soulfix': 'Fixage d\'âme',
        'Submission Tower': 'Tour de soumission',
        'Summon': 'Invocation',
        'The Word': 'Châtiment céleste',
        'Towerfall': 'Écroulement',
        'Trample': 'Fauchage',
        'Trepidation': 'Trépidation',
        'Unbind': 'Délivrance',
        'Unrelenting': 'Déferlement',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Aqua Sphere': 'アクアスフィア',
        'Archaeodemon': 'アルケオデーモン',
        'Archaeolion': 'アルケオキマイラ',
        'Argath Thadalfus': '冷血剣アルガス',
        'Azure Guard': 'アズールガード',
        'Command Tower': '支配の塔',
        'Control Tower': '統制の塔',
        'Flume Toad': 'フルームトード',
        'Hashmal, Bringer of Order': '統制者ハシュマリム',
        'Heartless': '冷血剣',
        'Icicle': 'アイシクル',
        'Mateus, The Corrupt': '背徳の皇帝マティウス',
        'Pennantstone Golem': 'ペナント・ゴーレム',
        'Rofocale': '人馬王ロフォカレ',
        'Sand Sphere': '砂球',
        'Submission Tower': '服従の塔',
        'The Crumbling Bridge': '崩れかけた橋',
        'The Lesalia Garden Ruins': 'ルザリア円庭跡',
        'The Lesalia Temple Ruins': 'ルザリア神殿跡',
        'The Palace Square': '王宮前広場',
        'The heavens tremble in my wake': '我が戦車の車輪は、天をも駆ける！\\s+ゆくぞ……！',
      },
      'replaceText': {
        '--invulnerable--': '--インヴィンシブル--',
        '--lock out--': '--ロックオン--',
        'Aqua Sphere Adds': 'アクアスフィア',
        'Archaeodemon Adds': 'アルケオデーモン',
        'Azure Guard Adds': 'アズールガード',
        'Blizzard IV': 'ブリザジャ',
        'Blizzard Sphere': 'ブリザードスフィア',
        'Chariot': '人馬戦車',
        'Coldblood': '冷血乱舞',
        'Command Tower(?! )': '支配の塔',
        'Command Tower Add': '支配の塔',
        'Control Tower': '統制の塔',
        'Crippling Blow': '痛打',
        'Crush Helm': '星天爆撃打',
        'Crush Weapon': '冥界恐叫打',
        'Cry Of Victory': '鬨の声',
        'Dark Geas': '暗黒魔法陣',
        'Dark Ultima': 'ダークアルテマ',
        'Demolish': 'デモリッシュ',
        'Dendrite': '凍結晶',
        'Dualcast': '連続魔',
        'Earth Hammer': '大地のハンマー',
        'Earth Shaker': 'アースシェイカー',
        'Embrace': '抱締',
        'Empty Soul': '虚無の魂',
        'Extreme Edge': 'ブーストエッジ',
        'Falling Boulder': '大落石',
        'Falling Rock': '落石',
        'Fire IV': 'ファイジャ',
        'Flash-Freeze': '凍天撃',
        'Flume Toad': 'フルームトード',
        'Frostwave': '凍てつく波動',
        'Gnawing Dread': '喪失の恐怖',
        'Golem Adds': 'ゴーレム',
        'Hammerfall': 'ハンマークラッシュ',
        'Heartless': '冷血剣',
        'Heavenly Subjugation': '天将覇道撃',
        'Hole In One': 'ボスと貼りつく',
        'Impact': '衝撃',
        'Jagged Edge': 'ロックスパイク',
        'Judgment Blade': '不動無明剣',
        'Landwaster': 'ランドワスター',
        'Mask Of Lies': '虚構の仮面',
        'Mask Of Truth': '真実の仮面',
        'Maverick': '独立独行',
        'Might': '豪腕',
        'Pomp And Circumstance': '威風堂々',
        'Quake IV': 'クエイジャ',
        'Rail Of The Rat': '鼠の一撃',
        'Rebind': '再拘束',
        'Rock Cutter': 'ロックカッター',
        'Royal Blood': '高貴なる血脈',
        'Sanction': '制裁の刃',
        'Sand Sphere Adds': '砂球',
        'Snowpierce': '凍槍突',
        'Soulfix': '呪槍串刺',
        'Submission Tower': '服従の塔',
        'Summon': '召喚',
        'The Word': '神罰',
        'Towerfall': '倒壊',
        'Trample': '蹂躙',
        'Trepidation': '狐鶏鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手無双剣',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aqua Sphere': '水球',
        'Archaeodemon': '古惡魔',
        'Archaeolion': '古奇美拉',
        'Argath Thadalfus': '冷血劍阿加斯',
        'Azure Guard': '蔚藍護衛',
        'Command Tower': '支配之塔',
        'Control Tower': '統治之塔',
        'Flume Toad': '渡槽蟾蜍',
        'Hashmal, Bringer of Order': '統治者哈修馬利姆',
        'Heartless': '冷血劍',
        'Icicle': '冰柱',
        'Mateus, The Corrupt': '背德皇帝馬提烏斯',
        'Pennantstone Golem': '石板巨像',
        'Rofocale': '人馬王洛弗卡勒',
        'Sand Sphere': '沙球',
        'Submission Tower': '服從之塔',
        'The Crumbling Bridge': '崩塌的橋',
        'The Lesalia Garden Ruins': '勒薩利亞圓庭遺跡',
        'The Lesalia Temple Ruins': '勒薩利亞神殿遺跡',
        'The Palace Square': '王宮前廣場',
        'The heavens tremble in my wake': '我的戰車馳騁天際！',
      },
      'replaceText': {
        '--Shade--': '--陰影--',
        '--Shard--': '--碎片--',
        '--enrage--': '--狂暴--',
        '--invulnerable--': '--無敵--',
        '--lock out--': '--封鎖--',
        'Adds': '出現',
        'Aqua Sphere': '水球',
        'Archaeodemon': '古惡魔',
        'Azure Guard': '蔚藍護衛',
        'Blizzard IV': '冰澈',
        'Blizzard Sphere': '冰結球',
        'Chariot': '人馬戰車',
        'Coldblood': '冷血亂舞',
        'Command Tower': '支配之塔',
        'Control Tower': '統治之塔',
        'Crippling Blow': '痛擊',
        'Crush Helm': '星天爆擊打',
        'Crush Weapon': '冥界恐叫打',
        'Cry Of Victory': '戰吼',
        'Dark Geas': '暗黑魔法陣',
        'Dark Ultima': '暗黑究極',
        'Demolish': '破魔震',
        'Dendrite': '冰結晶',
        'Dualcast': '連續詠唱',
        'Earth Hammer': '大地之錘',
        'Earth Shaker': '大地搖動',
        'Embrace': '抱擁',
        'Empty Soul': '虛無之魂',
        'Extreme Edge': '加速刃',
        'Falling Boulder': '大落石',
        'Falling Rock': '落石',
        'Fire IV': '熾炎',
        'Flash-Freeze': '凍天擊',
        'Flume Toad': '渡槽蟾蜍',
        'Frostwave': '寒冰波動',
        'Gnawing Dread': '喪失之痛',
        'Golem': '巨像兵',
        'Hammerfall': '錘擊',
        'Heartless': '冷血劍',
        'Heavenly Subjugation': '天將霸道擊',
        'Hole In One': '去BOSS腳下',
        'Impact': '衝擊',
        'Jagged Edge': '岩石突擊',
        'Judgment Blade': '不動無明劍',
        'Landwaster': '地動',
        'Mask Of Lies': '虛假的面具',
        'Mask Of Truth': '真實的面具',
        'Maverick': '特立獨行',
        'Might': '強腕',
        'Pomp And Circumstance': '威風凜凜',
        'Quake IV': '激震',
        'Rail Of The Rat': '鼠擊',
        'Rebind': '再拘束',
        'Rock Cutter': '石刃',
        'Royal Blood': '高貴血脈',
        'Sanction': '制裁之刃',
        'Sand Sphere': '沙球',
        'Snowpierce': '冰槍突刺',
        'Soulfix': '咒槍穿刺',
        'Submission Tower': '服從之塔',
        'Summon': '召喚',
        'The Word': '神罰',
        'Towerfall': '崩塌',
        'Trample': '蹂躪',
        'Trepidation': '狐雞鼠',
        'Unbind': '拘束解放',
        'Unrelenting': '千手無雙劍',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aqua Sphere': '물 구체',
        'Archaeodemon': '원시 악마',
        'Archaeolion': '원시 키마이라',
        'Argath Thadalfus': '냉혈검 아르가스',
        'Azure Guard': '푸른 파수꾼',
        'Command Tower': '지배의 탑',
        'Control Tower': '통제의 탑',
        'Flume Toad': '수로 두꺼비',
        'Hashmal, Bringer of Order': '통제자 하쉬말림',
        'Heartless': '냉혈검',
        'Icicle': '고드름',
        'Mateus, The Corrupt': '배덕의 황제 마티우스',
        'Pennantstone Golem': '페넌트 골렘',
        'Rofocale': '인마왕 로포칼레',
        'Sand Sphere': '모래공',
        'Submission Tower': '복종의 탑',
        'The Crumbling Bridge': '무너진 다리',
        'The Lesalia Garden Ruins': '르잘리아 정원 옛터',
        'The Lesalia Temple Ruins': '르잘리아 신전 옛터',
        'The Palace Square': '왕궁 광장',
        'The heavens tremble in my wake': '이것이 바로 빛나는 \'성석\'의 힘이다!',
      },
      'replaceText': {
        '--invulnerable--': '--무적--',
        '--lock out--': '--지역 분리--',
        '--Shade Adds--': '--쫄 등장--',
        '--Shard Adds--': '--결정 등장--',
        '--Aqua Sphere Adds--': '--물 구체 등장--',
        '--Azure Guard Adds--': '--푸른 파수꾼 등장--',
        '--Blizzard Sphere Adds--': '--눈보라 구체 등장--',
        '--Golem Adds--': '--골렘 등장--',
        '--Flume Toad Adds--': '--수로 두꺼비 등장--',
        '--Sand Sphere Adds--': '--모래공 등장--',
        'Archaeodemon Adds': '원시 악마 등장',
        'Blizzard IV': '블리자쟈',
        'Chariot': '인마전차',
        'Coldblood': '냉혈난무',
        'Command Tower': '지배의 탑',
        'Control Tower': '통제의 탑',
        'Crippling Blow': '통타',
        'Crush Helm': '성천폭격타',
        'Crush Weapon': '명계공규타',
        'Cry Of Victory': '승리의 함성',
        'Dark Geas': '암흑 마법진',
        'Dark Ultima': '다크 알테마',
        'Demolish': '완전 파괴',
        'Dendrite': '얼음 결정',
        'Dualcast': '연속 마법',
        'Earth Hammer': '대지의 망치',
        'Earth Shaker': '요동치는 대지',
        'Embrace': '껴안기',
        'Empty Soul': '허무의 혼',
        'Extreme Edge': '돌격하는 칼날',
        'Falling Boulder': '대낙석',
        'Falling Rock': '낙석',
        'Fire IV': '파이쟈',
        'Flash-Freeze': '동천격',
        'Frostwave': '얼어붙은 파동',
        'Gnawing Dread': '상실의 공포',
        'Hammerfall': '망치 강타',
        'Heartless': '냉혈검',
        'Heavenly Subjugation': '천장패도격',
        'Hole In One': '보스 밑으로',
        'Impact': '충격',
        'Jagged Edge': '바위 꿰기',
        'Judgment Blade': '부동무명검',
        'Landwaster': '대지 황폐화',
        'Mask Of Lies': '허구의 가면',
        'Mask Of Truth': '진실의 가면',
        'Maverick': '독립독행',
        'Might': '완력 강화',
        'Pomp And Circumstance': '위풍당당',
        'Quake IV': '퀘이쟈',
        'Rail Of The Rat': '쥐의 일격',
        'Rebind': '재구속',
        'Rock Cutter': '바위 가르기',
        'Royal Blood': '고귀한 혈통',
        'Sanction': '제재의 칼날',
        'Snowpierce': '얼음창 찌르기',
        'Soulfix': '저주창 내리꽂기',
        'Submission Tower': '복종의 탑',
        'Summon': '소환',
        'The Word': '신벌',
        'Towerfall': '무너지는 탑',
        'Trample': '유린',
        'Trepidation': '여우 닭 쥐',
        'Unbind': '구속 해방',
        'Unrelenting': '천수무쌍검',
      },
    },
  ],
};

export default triggerSet;
