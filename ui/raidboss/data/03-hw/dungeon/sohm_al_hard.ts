import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'SohmAlHard',
  zoneId: ZoneId.SohmAlHard,
  timelineFile: 'sohm_al_hard.txt',
  timelineTriggers: [
    {
      id: 'Sohm Al Hard Wild Horn',
      regex: /Wild Horn/,
      beforeSeconds: 4,
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      // The actual damage is 1C31, but the windup for the damage
      // occurs between 1C30 and 1C31.
      id: 'Sohm Al Hard Inflammable Fumes',
      type: 'Ability',
      netRegex: { id: '1C30', source: 'The Leightonward', capture: false },
      response: Responses.aoe(),
    },
    {
      // Both the small and large Spore Sacs use Glorious Blaze.
      // However, it's not the same ability.
      id: 'Sohm Al Hard Glorious Blaze',
      type: 'StartsUsing',
      netRegex: { id: '1C32', source: 'Spore Sac', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from large pod',
          de: 'Weg vom großen Pod',
          fr: 'Éloignez-vous des spores',
          ja: 'スポアサックから離れる',
          cn: '遠離大孢囊',
          ko: '큰 포자 주머니에게서 떨어지기',
        },
      },
    },
    {
      // The actual effect being checked here is Heavy.
      id: 'Sohm Al Hard Excretion',
      type: 'GainsEffect',
      netRegex: { effectId: '0E' },
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
          fr: 'Guérison sur ${player}',
          ja: 'エスナ：${player}',
          cn: '康復${player}',
          ko: '${player} 에스나',
        },
      },
    },
    {
      // Inflicts Incoming Healing Down.
      // If used while Gowrow is empowered,
      // leaves a tornado at the target location on completion.
      id: 'Sohm Al Hard Ripper Claw',
      type: 'StartsUsing',
      netRegex: { id: '1C37', source: 'Gowrow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      // Inflicts Incoming Healing Down.
      // This ability is used only if there is a party member in range behind Gowrow
      // AND if Gowrow is not empowered.
      id: 'Sohm Al Hard Tail Smash',
      type: 'StartsUsing',
      netRegex: { id: '1C35', source: 'Gowrow', capture: false },
      response: Responses.goFrontOrSides(),
    },
    {
      // Inflicts Incoming Healing Down.
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Tail Swing',
      type: 'StartsUsing',
      netRegex: { id: '1C36', source: 'Gowrow', capture: false },
      response: Responses.getOut(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Wild Charge',
      type: 'StartsUsing',
      netRegex: { id: '1C39', source: 'Gowrow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Hot Charge',
      type: 'StartsUsing',
      netRegex: { id: '1C3A', source: 'Gowrow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is not empowered.
      id: 'Sohm Al Hard Fireball',
      type: 'StartsUsing',
      netRegex: { id: '1C3B', source: 'Gowrow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      // Used only if Gowrow is empowered.
      id: 'Sohm Al Hard Lava Flow',
      type: 'StartsUsing',
      netRegex: { id: '1C3C', source: 'Gowrow', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      // This cast is accompanied by a 0017 head marker on the target.
      // We use the cast line for this trigger because the timing is the same.
      id: 'Sohm Al Hard Flying Press',
      type: 'StartsUsing',
      netRegex: { id: '1C3E', source: 'Lava Scorpion' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop puddle outside',
          de: 'Fläche draußen ablegen',
          fr: 'Déposez la zone au sol à l\'extérieur',
          ja: '外周に置く',
          cn: '人群外放圈圈',
          ko: '바깥쪽으로 장판 유도하기',
        },
      },
    },
    {
      id: 'Sohm Al Hard Deadly Thrust',
      type: 'StartsUsing',
      netRegex: { id: ['1C40', '1C48'], source: ['Lava Scorpion', 'The Scorpion\'s Tail'] },
      response: Responses.tankBuster(),
    },
    {
      id: 'Sohm Al Hard Hiss',
      type: 'StartsUsing',
      netRegex: { id: '1C45', source: 'Lava Scorpion', capture: false },
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Wound': 'Wunde',
        'The Scorpion\'s Tail': 'Schwanzskorpion',
        'The Lava Tube': 'Lavagrotte',
        'The Leightonward': 'Hortigolem',
        'Small Spore Sac': 'klein(?:e|er|es|en) Sporensack',
        '(?<!Small )Spore Sac': 'Sporensack',
        'Lava Scorpion': 'Lavaskorpion',
        'Gowrow': 'Gowrow',
      },
      'replaceText': {
        '\\(Back\\)': '(Hinten)',
        '\\(Front\\)': '(Vorne)',
        '\\(Readies\\)': '(Vorbereitung)',
        '\\(Ring\\)': '(Ring)',
        'Wild Horn': 'Wildes Horn',
        'Spore Sac': 'Sporensack',
        'Realm Shaker': 'Erderschütterer',
        'Molten Silk': 'Geschmolzene Seide',
        'Inflammable Fumes': 'Entzündliches Gas',
        'Hiss': 'Zischen',
        'Glorious Blaze': 'Zündung',
        'Flying Press': 'Flugdruck',
        'Excretion': 'Schleim',
        'Deadly Thrust': 'Tödliche Durchbohrung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Wound': 'La Plaie',
        'The Lava Tube': 'Tunnel de lave',
        'The Leightonward': 'Chortocyon',
        'Small Spore Sac': 'petit sac de spores',
        'Lava Scorpion': 'scorpion de lave',
        'The Scorpion\'s Tail': 'queue du scorpion',
        '(?<!Small )Spore Sac': 'Sac de spores',
        'Gowrow': 'Gowrow',
      },
      'replaceText': {
        '\\(Back\\)': '(Derrière)',
        '\\(Front\\)': '(Devant)',
        '\\(Readies\\)': '(Préparation)',
        '\\(Ring\\)': '(Anneau)',
        'Wild Horn': 'Corne sauvage',
        '(?<!Small )Spore Sac': 'Sac de spores',
        'Realm Shaker': 'Secousse tellurique',
        'Molten Silk': 'Soie en fusion',
        'Inflammable Fumes': 'Gaz inflammable',
        'Hiss': 'Sifflet',
        'Glorious Blaze': 'Embrasement',
        'Flying Press': 'Aplatissement',
        'Excretion': 'Mucus',
        'Deadly Thrust': 'Transpercement mortel',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Wound': '霊峰の傷',
        'The Lava Tube': '大溶岩窟',
        'The Leightonward': 'レイトンワード',
        'Small Spore Sac': 'スモール・スポアサック',
        'Lava Scorpion': 'ラーヴァ・スコーピオン',
        'The Scorpion\'s Tail': 'テイル・スコーピオン',
        '(?<!Small )Spore Sac': 'スポアサック',
        'Gowrow': 'ガウロウ',
      },
      'replaceText': {
        '\\(Adds x2\\)': '(2つ 雑魚)',
        '\\(Adds x4\\)': '(4つ 雑魚)',
        '\\(Back\\)': '(後ろ)',
        '\\(Front\\)': '(前)',
        '\\(Readies\\)': '(構え)',
        '\\(Ring\\)': '(輪)',
        'Wild Horn': 'ワイルドホーン',
        'Spore Sac': 'スポアサック',
        'Realm Shaker': 'レルムシェーカー',
        'Molten Silk': 'モルテンシルク',
        'Inflammable Fumes': '可燃性ガス',
        'Hiss': '呼び寄せ',
        'Glorious Blaze': '引火',
        'Flying Press': 'フライングプレス',
        'Excretion': '粘液',
        'Deadly Thrust': 'デッドリースラスト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gowrow': '高牢怪龍',
        'The Wound': '靈傷',
        'The Scorpion\'s Tail': '尖尾蠍',
        'The Lava Tube': '大熔岩窟',
        'The Leightonward': '萊頓瓦德',
        'Small Spore Sac': '小型孢囊',
        '(?<!Small )Spore Sac': '孢囊',
        'Lava Scorpion': '熔岩蠍',
      },
      'replaceText': {
        '\\(Adds x2\\)': '(小怪x2)',
        '\\(Adds x4\\)': '(小怪x4)',
        '\\(Back\\)': '(後)',
        '\\(Front\\)': '(前)',
        '\\(Readies\\)': '(準備)',
        '\\(Ring\\)': '(月環)',
        'Wild Horn': '野性利角',
        'Spore Sac': '孢囊',
        'Realm Shaker': '震撼領域',
        'Molten Silk': '炎絲噴射',
        'Inflammable Fumes': '可燃性氣體',
        'Hiss': '呼喚',
        'Glorious Blaze': '引火',
        'Flying Press': '飛躍重壓',
        'Excretion': '粘液',
        'Deadly Thrust': '致命尾刺',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gowrow': '가우로우',
        'The Wound': '영봉의 상처',
        'The Lava Tube': '대용암굴',
        'The Leightonward': '레이튼워드',
        'Small Spore Sac': '작은 포자 주머니',
        'Lava Scorpion': '용암 전갈',
        'The Scorpion\'s Tail': '꼬리 전갈',
        '(?<!Small )Spore Sac': '포자 주머니',
      },
      'replaceText': {
        'Wild Horn': '사나운 뿔',
        'Spore Sac': '포자 주머니',
        'Realm Shaker': '파멸 영역',
        'Molten Silk': '용암 분사',
        'Inflammable Fumes': '가연성 가스',
        'Hiss': '불러내기',
        'Glorious Blaze': '불붙이기',
        'Flying Press': '도약 내리찍기',
        'Excretion': '점액',
        'Deadly Thrust': '죽음의 꼬리',
      },
    },
  ],
};

export default triggerSet;
