import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenLovingEmbrace?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheDeadEnds',
  zoneId: ZoneId.TheDeadEnds,
  timelineFile: 'the_dead_ends.txt',
  triggers: [
    {
      id: 'DeadEnds Grebuloff Miasmata',
      type: 'StartsUsing',
      netRegex: { id: '653C', source: 'Caustic Grebuloff', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Grebuloff Certain Solitude',
      type: 'Ability',
      // Corresponds with 0037 headmarker that comes out ~0.5s later.
      netRegex: { id: '6EBD', source: 'Caustic Grebuloff' },
      condition: Conditions.targetIsYou(),
      response: Responses.doritoStack(),
    },
    {
      id: 'DeadEnds Grebuloff Blighted Water',
      type: 'StartsUsing',
      netRegex: { id: '6542', source: 'Caustic Grebuloff' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'DeadEnds Grebuloff Befoulment',
      type: 'StartsUsing',
      netRegex: { id: '6544', source: 'Caustic Grebuloff' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Grebuloff Necrosis',
      type: 'GainsEffect',
      netRegex: { effectId: 'B95' },
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => output.text!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        text: {
          en: 'Esuna ${player}',
          de: 'Medica ${player}',
          fr: 'Guérison sur ${player}',
          ja: '${player} にエスナ',
          cn: '驅散: ${player}',
          ko: '${player} 에스나',
        },
      },
    },
    {
      id: 'DeadEnds Pox Flail',
      type: 'StartsUsing',
      netRegex: { id: '6540', source: 'Caustic Grebuloff' },
      response: Responses.tankBuster(),
    },
    {
      id: 'DeadEnds Peacekeeper Decimation',
      type: 'StartsUsing',
      netRegex: { id: '6550', source: 'Peacekeeper', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Peacekeeper Infantry Deterrent',
      type: 'StartsUsing',
      netRegex: { id: '6EC7', source: 'Peacekeeper' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Peacekeeper No Future Spread',
      type: 'StartsUsing',
      netRegex: { id: '6548', source: 'Peacekeeper' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Peacekeeper Order To Fire',
      type: 'StartsUsing',
      netRegex: { id: '6EBF', source: 'Peacekeeper', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stand Between Bits',
          de: 'Zwichen den Satelliten stehen',
          fr: 'Placez-vous entre les drones',
          ja: '自動殺傷兵器の間に',
          cn: '站在浮游砲間隙躲避雷射',
          ko: '비트 사이에 자리잡기',
        },
      },
    },
    {
      id: 'DeadEnds Peacekeeper Eclipsing Exhaust',
      type: 'StartsUsing',
      netRegex: { id: '654B', source: 'Peacekeeper', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'DeadEnds Peacekeeper Elimination',
      type: 'StartsUsing',
      netRegex: { id: '654F', source: 'Peacekeeper' },
      // TODO: this is maybe worth promoting to responses?
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankLaserOnYou: {
            en: 'Tank Laser on YOU',
            de: 'Tank Laser auf DIR',
            fr: 'Tank laser sur VOUS',
            ja: '自分に対人光線',
            cn: '坦克雷射點名',
            ko: '탱커 레이저',
          },
          tankLaserOnPlayer: {
            en: 'Tank Laser on ${player}',
            de: 'Tank Laser auf ${player}',
            fr: 'Tank laser sur ${player}',
            ja: '${player} に対人光線',
            cn: '坦克雷射點名 ${player}',
            ko: '탱커 레이저: ${player}',
          },
          avoidLaserOnPlayer: {
            en: 'Avoid Laser on ${player}',
            de: 'Weiche dem Laser von ${player} aus',
            fr: 'Évitez le laser sur ${player}',
            ja: '${player} への対人光線を避ける',
            cn: '遠離雷射點名: ${player}',
            ko: '탱커 레이저 피하기: ${player}',
          },
        };

        if (data.me === matches.target)
          return { alertText: output.tankLaserOnYou!() };
        if (data.role === 'healer')
          return {
            alertText: output.tankLaserOnPlayer!({ player: data.ShortName(matches.target) }),
          };
        return { info: output.avoidLaserOnPlayer!({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'DeadEnds Ra-La Warm Glow',
      type: 'StartsUsing',
      netRegex: { id: '655E', source: 'Ra-la', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'DeadEnds Ra-La Pity',
      type: 'StartsUsing',
      netRegex: { id: '655D', source: 'Ra-la' },
      response: Responses.tankBuster(),
    },
    {
      id: 'DeadEnds Ra-la Benevolence',
      type: 'StartsUsing',
      netRegex: { id: '655A', source: 'Ra-la' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'DeadEnds Ra-la Loving Embrace Right',
      type: 'StartsUsing',
      // The first Loving Embrace is a left/right cleave while the boss is in the middle of the room,
      // so give a left/right call to the safe side.  The remaining Loving Embrace casts are when
      // the boss has jumped all the way to an edge and the players are (probably) facing it and so
      // reverse the calls here.
      netRegex: { id: '6557', source: 'Ra-la', capture: false },
      alertText: (data, _matches, output) =>
        data.seenLovingEmbrace ? output.right!() : output.left!(),
      run: (data) => data.seenLovingEmbrace = true,
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'DeadEnds Ra-la Loving Embrace Left',
      type: 'StartsUsing',
      netRegex: { id: '6558', source: 'Ra-la', capture: false },
      alertText: (data, _matches, output) =>
        data.seenLovingEmbrace ? output.left!() : output.right!(),
      run: (data) => data.seenLovingEmbrace = true,
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'DeadEnds Ra-la Still Embrace',
      type: 'StartsUsing',
      netRegex: { id: '655C', source: 'Ra-la' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'DeadEnds Ra-la Doom Cleanse',
      type: 'GainsEffect',
      netRegex: { effectId: '6E9' },
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) =>
        output.cleanse!({ player: data.ShortName(matches.target) }),
      outputStrings: {
        cleanse: {
          en: 'Heal ${player} to Full',
          de: 'Heile ${player} voll',
          fr: 'Soignez ${player} complètement',
          ja: '${player} をフル回復',
          cn: '奶滿 ${player}',
          ko: '완전 회복: ${player}',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Caustic Grebuloff': 'Typhoid der Endzeit',
        'Golden Wings': 'golden(?:e|er|es|en) Schmetterling',
        'Peacekeeper': 'Friedenswächter',
        'Perpetual War Machine': 'automatisiert(?:e|er|es|en) Exterminator',
        'Ra-la': 'Ra-la',
        'The Deterrence Grounds': 'Hügel der Abschreckung',
        'The Shell Mound': 'Verfallenes Muschelhaus',
        'The World Tree': 'Garten des Weltenbaums',
        'Weeping Miasma': 'Pestbeule',
      },
      'replaceText': {
        '\\(circles\\)': '(Kreise)',
        '\\(spread\\)': '(Verteilen)',
        'Befoulment': 'Brackwasserbombe',
        'Benevolence': 'Philanthropie',
        'Blighted Water': 'Brackige Seele',
        'Certain Solitude': 'Einsame Verzweiflung',
        'Cough Up': 'Mutagene Giftlache',
        'Decimation': 'Omnidirektionalschuss',
        'Disengage Hatch': 'Speicherlukenöffnung',
        'Eclipsing Exhaust': 'Atomare Druckwelle',
        'Electromagnetic Repellant': 'Elektro-Massenentladung',
        'Elimination': 'Mörderischer Lichtstrahl',
        'Infantry Deterrent': 'Flächenbombe',
        'Lamellar Light': 'Phosphoreszenz',
        'Lifesbreath': 'Ode an das Leben',
        'Loving Embrace': 'Barmherzige Schwingen',
        'Miasmata': 'Exponentielles Gift',
        'Necrotic Fluid': 'Giftiger Spritzer',
        'No Future': 'Endloses Bombardement',
        'Order to Fire': 'Feuerbefehl',
        'Peacefire': 'Friedenskanonade',
        'Pity': 'Herzensgüte',
        'Pox Flail': 'Pockenschlag',
        'Prance': 'Schmetterlingsschwarm',
        'Small-bore Laser': 'Kleinkaliberstrahl',
        'Still Embrace': 'Schwingen des Seelenfriedens',
        'Warm Glow': 'Erlösendes Licht',
        'Wave of Nausea': 'Giftstrom',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Caustic Grebuloff': 'Grébuloff en stade terminal',
        'Golden Wings': 'papillon d\'or',
        'Peacekeeper': 'Pacificateur',
        'Perpetual War Machine': 'drone antipersonnel',
        'Ra-la': 'Ra-la',
        'The Deterrence Grounds': 'Colline des Dés jetés',
        'The Shell Mound': 'Amas coquillier naufragé',
        'The World Tree': 'Jardin de l\'Arbre-Monde',
        'Weeping Miasma': 'boule de toxine',
      },
      'replaceText': {
        '\\(circles\\)': '(cercles)',
        '\\(spread\\)': '(dispersion)',
        'Befoulment': 'Bombe de pus',
        'Benevolence': 'Philanthropie',
        'Blighted Water': 'Eau contaminée',
        'Certain Solitude': 'Désespoir solitaire',
        'Cough Up': 'Épanchement pleural',
        'Decimation': 'Rayonnement incinérateur',
        'Disengage Hatch': 'Ouverture des écoutilles',
        'Eclipsing Exhaust': 'Purge des gaz',
        'Electromagnetic Repellant': 'Hyperdécharge électromagnétique',
        'Elimination': 'Laser antipersonnel',
        'Infantry Deterrent': 'Bombardement de terrassement',
        'Lamellar Light': 'Phosphorescence',
        'Lifesbreath': 'Vitalisme',
        'Loving Embrace': 'Aile de la bienveillance',
        'Miasmata': 'Propagation de la toxine',
        'Necrotic Fluid': 'Explosion de fiel',
        'No Future': 'Pas d\'avenir',
        'Order to Fire': 'Ordre d\'attaquer',
        'Peacefire': 'Dispenseur de paix',
        'Pity': 'Miséricorde',
        'Pox Flail': 'Poing variolé',
        'Prance': 'Cabriole',
        'Small-bore Laser': 'Laser à faisceau étroit',
        'Still Embrace': 'Aile du repos éternel',
        'Warm Glow': 'Lumière de la miséricorde',
        'Wave of Nausea': 'Torrent de toxine',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Caustic Grebuloff': 'グレビュオフ・メルター',
        'Golden Wings': '黄金蝶',
        'Peacekeeper': 'ピースキーパー',
        'Perpetual War Machine': '自動殺傷兵器',
        'Ra-la': 'ラーラー',
        'The Deterrence Grounds': '抑止の丘',
        'The Shell Mound': '消えゆく貝塚',
        'The World Tree': '世界樹の庭',
        'Weeping Miasma': '腐毒素',
      },
      'replaceText': {
        'Befoulment': '膿汁弾',
        'Benevolence': '博愛',
        'Blighted Water': '腐水塊',
        'Certain Solitude': '孤独の絶望',
        'Cough Up': '胸水流',
        'Decimation': '焼却光線',
        'Disengage Hatch': '格納ハッチ開放',
        'Eclipsing Exhaust': '大噴射',
        'Electromagnetic Repellant': '超電磁放射',
        'Elimination': '対人光線',
        'Infantry Deterrent': '対地爆弾',
        'Lamellar Light': '燐光',
        'Lifesbreath': '生気',
        'Loving Embrace': '慈愛の翼',
        'Miasmata': '腐毒素飛散',
        'Necrotic Fluid': '死腐毒飛散',
        'No Future': 'ノーフューチャー',
        'Order to Fire': '攻撃命令',
        'Peacefire': '平和砲',
        'Pity': '慈悲',
        'Pox Flail': '痘瘡の拳',
        'Prance': '躍動',
        'Small-bore Laser': '小口径光線',
        'Still Embrace': '安寧の翼',
        'Warm Glow': '慈光',
        'Wave of Nausea': '病の激流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Caustic Grebuloff': '變異的格雷布洛弗',
        'Golden Wings': '黃金蝶',
        'Peacekeeper': '和平捍衛者',
        'Perpetual War Machine': '自動殺傷兵器',
        'Ra-la': '拉啦',
        'The Deterrence Grounds': '威懾山丘',
        'The Shell Mound': '即將消失的貝塚',
        'The World Tree': '世界樹庭園',
        'Weeping Miasma': '腐爛毒素',
      },
      'replaceText': {
        '\\(circles\\)': '(圓)',
        '\\(spread\\)': '(擴散)',
        'Befoulment': '膿液彈',
        'Benevolence': '博愛',
        'Blighted Water': '腐水塊',
        'Certain Solitude': '孤獨的絕望',
        'Cough Up': '咳出',
        'Decimation': '燒盡光線',
        'Disengage Hatch': '開放倉庫艙口',
        'Eclipsing Exhaust': '大噴射',
        'Electromagnetic Repellant': '超電磁放射',
        'Elimination': '對人光線',
        'Infantry Deterrent': '對地炸彈',
        'Lamellar Light': '燐光',
        'Lifesbreath': '生息',
        'Loving Embrace': '慈愛之翼',
        'Miasmata': '腐爛毒素飛散',
        'Necrotic Fluid': '致死腐爛毒素飛散',
        'No Future': '未來不再',
        'Order to Fire': '攻擊命令',
        'Peacefire': '和平砲',
        'Pity': '慈悲',
        'Pox Flail': '痘瘡之拳',
        'Prance': '躍動',
        'Small-bore Laser': '小口徑射線',
        'Still Embrace': '安寧之翼',
        'Warm Glow': '慈光',
        'Wave of Nausea': '疾病激流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Caustic Grebuloff': '부식된 그레불로프',
        'Golden Wings': '황금나비',
        'Peacekeeper': '평화수호자',
        'Perpetual War Machine': '자동살상병기',
        'Ra-la': '라라',
        'The Deterrence Grounds': '억제 언덕',
        'The Shell Mound': '사라져가는 패총',
        'The World Tree': '세계수 정원',
        'Weeping Miasma': '부패 독소',
      },
      'replaceText': {
        '\\(circles\\)': '(장판)',
        '\\(spread\\)': '(산개)',
        'Befoulment': '고름탄',
        'Benevolence': '박애',
        'Blighted Water': '썩은물 덩어리',
        'Certain Solitude': '고독의 절망',
        'Cough Up': '흉수류',
        'Decimation': '소각 광선',
        'Disengage Hatch': '격납문 개방',
        'Eclipsing Exhaust': '대분사',
        'Electromagnetic Repellant': '초전자 방사',
        'Elimination': '대인 광선',
        'Infantry Deterrent': '대지 폭탄',
        'Lamellar Light': '인광',
        'Lifesbreath': '생기',
        'Loving Embrace': '자애의 날개',
        'Miasmata': '부패 독소 살포',
        'Necrotic Fluid': '죽음의 부패독 살포',
        'No Future': '미래는 없다',
        'Order to Fire': '공격 명령',
        'Peacefire': '평화포',
        'Pity': '자비',
        'Pox Flail': '두창 주먹',
        'Prance': '약동',
        'Small-bore Laser': '소구경 광선',
        'Still Embrace': '안녕의 날개',
        'Warm Glow': '자광',
        'Wave of Nausea': '병의 격류',
      },
    },
  ],
};

export default triggerSet;
