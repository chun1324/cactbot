import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  waterDarkMarker?: boolean;
  freeze?: boolean;
  flame?: boolean;
  sphereCount?: number;
  brand?: string;
  netherBlast?: boolean;
}

// Hades Extreme

// TODO: call out direction for safe spot
// TODO: fire/ice tethers (0060|0061)

const triggerSet: TriggerSet<Data> = {
  id: 'TheMinstrelsBalladHadessElegy',
  zoneId: ZoneId.TheMinstrelsBalladHadessElegy,
  timelineFile: 'hades-ex.txt',
  timelineTriggers: [
    {
      id: 'HadesEx Comet',
      regex: /Comet 1/,
      beforeSeconds: 5,
      condition: (data) => data.role === 'tank' || data.job === 'BLU',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Comet Towers',
          de: 'Türme',
          fr: 'Tours de comète',
          ja: 'コメットを処理',
          cn: '踩塔',
          ko: '혜성 기둥',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'HadesEx Shadow Spread 1',
      type: 'StartsUsing',
      netRegex: { id: '47A8', source: 'Hades', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '散開',
          cn: '散開',
          ko: '위치 산개',
        },
      },
    },
    {
      id: 'HadesEx Shadow Spread 2',
      type: 'StartsUsing',
      netRegex: { id: '47A8', source: 'Hades', capture: false },
      delaySeconds: 5.5,
      response: Responses.moveAway('alert'),
    },
    {
      id: 'HadesEx Ravenous Assault',
      type: 'StartsUsing',
      netRegex: { id: '47A6', source: 'Hades' },
      response: Responses.tankBuster(),
    },
    {
      id: 'HadesEx Bad Faith Left 1',
      type: 'StartsUsing',
      netRegex: { id: '47AB', source: 'Hades', capture: false },
      response: Responses.goLeft('info'),
    },
    {
      id: 'HadesEx Bad Faith Left 2',
      type: 'StartsUsing',
      netRegex: { id: '47AB', source: 'Hades', capture: false },
      delaySeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Then Right',
          de: 'Dann Rechts',
          fr: 'À Droite',
          ja: 'そして右へ',
          cn: '然後右',
          ko: '다음 오른쪽',
        },
      },
    },
    {
      id: 'HadesEx Bad Faith Right 1',
      type: 'StartsUsing',
      netRegex: { id: '47AC', source: 'Hades', capture: false },
      response: Responses.goRight('info'),
    },
    {
      id: 'HadesEx Bad Faith Right 2',
      type: 'StartsUsing',
      netRegex: { id: '47AC', source: 'Hades', capture: false },
      delaySeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Then Left',
          de: 'Dann Links',
          fr: 'À Gauche',
          ja: 'そして左へ',
          cn: '然後左',
          ko: '다음 왼쪽',
        },
      },
    },
    {
      id: 'HadesEx Arcane Control Orbs',
      type: 'AddedCombatant',
      netRegex: { name: 'Arcane Globe', capture: false },
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go to Safe Spot',
          de: 'Geh zur sicheren Stelle',
          fr: 'Allez dans la zone safe',
          ja: '安全の場所へ移動',
          cn: '前往安全區域',
          ko: '안전 지대로 이동',
        },
      },
    },
    {
      id: 'HadesEx Arcane Control Doors',
      type: 'AddedCombatant',
      netRegex: { name: 'Arcane Font', capture: false },
      durationSeconds: 6,
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Hide Behind Door',
          de: 'Hinter der Tür verstecken',
          fr: 'Cachez-vous derrière le mirroir',
          ja: '鏡の後ろに',
          cn: '鏡子後躲避',
          ko: '문 없는 곳 반대쪽으로',
        },
      },
    },
    {
      id: 'HadesEx Quake III',
      type: 'StartsUsing',
      netRegex: { id: '47B8', source: 'Nabriales\'s Shade', capture: false },
      delaySeconds: 25,
      response: Responses.aoe(),
    },
    {
      id: 'HadesEx Dark II Tether',
      type: 'Tether',
      netRegex: { id: '0011', source: 'Shadow Of The Ancients' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Point Tether Out',
          de: 'Verbindung nach draußen richten',
          fr: 'Pointez le lien vers l\'extérieur',
          ja: '線を外に引く',
          cn: '連線',
          ko: '선 연결 바깥으로 빼기',
        },
      },
    },
    {
      id: 'HadesEx Ancient Water 3',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.waterDarkMarker = true,
      outputStrings: {
        text: {
          en: 'Healer Stacks',
          de: 'Bei dem Heiler sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治療集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'HadesEx Ancient Darkness',
      type: 'HeadMarker',
      netRegex: { id: '0060' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.waterDarkMarker = true,
      outputStrings: {
        text: {
          en: 'Tank Spread',
          de: 'Tanks verteilen',
          fr: 'Tanks, dispersez-vous',
          ja: 'タンクは外に',
          cn: '坦克散開',
          ko: '탱 산개',
        },
      },
    },
    {
      id: 'HadesEx Ancient Water Unmarked',
      type: 'HeadMarker',
      netRegex: { id: ['0030', '0060'], capture: false },
      condition: (data) => !data.waterDarkMarker,
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治療集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'HadesEx Shades Too Close',
      type: 'Tether',
      netRegex: {
        id: '000E',
        source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'],
        target: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'],
        capture: false,
      },
      condition: (data) => data.role === 'tank' || data.job === 'BLU',
      suppressSeconds: 10,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move Shades Apart',
          de: 'Schatten auseinander ziehen',
          fr: 'Écartez les spectres',
          ja: 'アシエンを引き離す',
          cn: '拉開無影',
          ko: '분신 서로 떨어뜨리기',
        },
      },
    },
    {
      id: 'HadesEx Spheres',
      type: 'StartsUsing',
      netRegex: { id: '47BD', source: 'Igeyorhm\'s Shade', capture: false },
      condition: (data) => data.role === 'tank' || data.job === 'BLU',
      infoText: (data, _matches, output) => {
        if (!data.sphereCount)
          return;
        return output.text!();
      },
      run: (data) => {
        data.sphereCount = (data.sphereCount ?? 0) + 1;
      },
      outputStrings: {
        text: {
          en: 'tank swap soon',
          de: 'Gleich: Tank swap',
          fr: 'Tank swap bientôt',
          ja: 'まもなく、タンクスイッチ',
          cn: '坦克即將換T',
          ko: '곧 탱교대',
        },
      },
    },
    {
      id: 'HadesEx Annihilation',
      type: 'StartsUsing',
      netRegex: { id: '47BF', source: 'Lahabrea\'s And Igeyorhm\'s Shades', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HadesEx Burning Brand',
      type: 'GainsEffect',
      netRegex: { effectId: '850' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.brand = 'fire',
      outputStrings: {
        text: {
          en: 'Attack Igeyorhm',
          de: 'Igeyorhm angreifen',
          fr: 'Attaquez Igeyorhm',
          ja: 'イゲオルムを攻撃',
          cn: '攻擊以格約姆',
          ko: '이게요름 공격',
        },
      },
    },
    {
      id: 'HadesEx Freezing Brand',
      type: 'GainsEffect',
      netRegex: { effectId: '851' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.brand = 'ice',
      outputStrings: {
        text: {
          en: 'Attack Lahabrea',
          de: 'Lahabrea angreifen',
          fr: 'Attaquez Lahabrea',
          ja: 'ラハブレアを攻撃',
          cn: '攻擊拉哈布雷亞',
          ko: '라하브레아 공격',
        },
      },
    },
    {
      id: 'HadesEx Blizzard IV',
      type: 'StartsUsing',
      netRegex: { id: '47C3', source: 'Igeyorhm\'s Shade' },
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'HadesEx Fire IV',
      type: 'StartsUsing',
      netRegex: { id: '47C2', source: 'Lahabrea\'s Shade' },
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'HadesEx Healers Blizzard/Fire IV',
      type: 'StartsUsing',
      netRegex: {
        id: ['47C3', '47C2'],
        source: ['Igeyorhm\'s Shade', 'Lahabrea\'s Shade'],
        capture: false,
      },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'HadesEx Doom',
      type: 'GainsEffect',
      netRegex: { effectId: '6E9', capture: false },
      condition: (data) => data.role === 'healer' || data.job === 'BLU',
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Heal T/H to Full',
          de: 'Heile T/H voll',
          fr: 'Soignez T/H complétement',
          ja: 'タンク／ヒーラーのHPを満タンに',
          cn: '奶滿T奶',
          ko: '탱/힐 풀피로 만들기',
        },
      },
    },
    {
      id: 'HadesEx Shriek',
      type: 'GainsEffect',
      netRegex: { effectId: '1C4' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      suppressSeconds: 2,
      response: Responses.lookAway('alarm'),
    },
    {
      id: 'HadesEx Beyond Death',
      type: 'GainsEffect',
      netRegex: { effectId: '566' },
      condition: Conditions.targetIsYou(),
      durationSeconds: 8,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Killed',
          de: 'Stirb',
          fr: 'Mourrez',
          ja: '自殺',
          cn: '自殺',
          ko: '죽을 정도로 맞기',
        },
      },
    },
    {
      id: 'HadesEx Ancient Circle',
      type: 'GainsEffect',
      netRegex: { effectId: '83E' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Donut on YOU',
          de: 'Donut auf DIR',
          fr: 'Donut sur VOUS',
          ja: '自分にエンシェントリング',
          cn: '月環點名',
          ko: '도넛 징 대상자',
        },
      },
    },
    {
      id: 'HadesEx Forked Lightning',
      type: 'GainsEffect',
      netRegex: { effectId: '24B' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stay Out',
          de: 'Draußen stehen',
          fr: 'Restez éloigné',
          ja: 'ライトニングを外に安置',
          cn: '外側放雷',
          ko: '바깥에 있기',
        },
      },
    },
    {
      id: 'HadesEx Blight',
      type: 'StartsUsing',
      netRegex: { id: '47CC', source: 'Ascian Prime\'s Shade', capture: false },
      delaySeconds: 12,
      response: Responses.bleedAoe(),
    },
    {
      id: 'HadesEx Height Of Chaos',
      type: 'StartsUsing',
      netRegex: { id: '47D1', source: 'Ascian Prime\'s Shade' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.tankBusterOnYou!();

        if (data.role === 'healer')
          return output.busterOn!({ player: data.party.member(matches.target) });

        return output.awayFromPlayer!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
        busterOn: Outputs.tankBusterOnPlayer,
        awayFromPlayer: {
          en: 'Away from ${player}',
          de: 'Weg von ${player}',
          fr: 'Éloignez-vous de ${player}',
          ja: '${player}から離れ',
          cn: '遠離 ${player}',
          ko: '"${player}" 탱버',
        },
      },
    },
    {
      id: 'HadesEx Megiddo Flame',
      type: 'StartsUsing',
      netRegex: { id: '47CD', source: 'Ascian Prime\'s Shade', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Healer Stacks',
          de: 'Bei den Heilern sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治療集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'HadesEx Shadow Flare',
      type: 'StartsUsing',
      netRegex: { id: '47D0', source: 'Ascian Prime\'s Shade', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HadesEx Captivity',
      type: 'HeadMarker',
      netRegex: { id: '0078' },
      condition: Conditions.targetIsYou(),
      response: Responses.getOut('alarm'),
    },
    {
      id: 'HadesEx Aetherial Gaol',
      type: 'AddedCombatant',
      netRegex: { name: 'Aetherial Gaol', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Aetherial Gaol',
          de: 'Zerstöre Ätherkerker',
          fr: 'Détruisez la Geôle éthérée',
          ja: 'エーテリアル・ジェイルを打ち破す',
          cn: '打破牢獄',
          ko: '에테르 감옥 부수기',
        },
      },
    },
    {
      id: 'HadesEx Dark Flame',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.flame = true,
      outputStrings: {
        text: {
          en: 'Knockback + Stack on YOU',
          de: 'Rückstoß + sammeln beim DIR',
          fr: 'Poussée + package sur VOUS',
          ja: 'ノックバック + 頭割り',
          cn: '擊退 + 集合 點名',
          ko: '넉백 + 쉐어징 대상자',
        },
      },
    },
    {
      id: 'HadesEx Dark Freeze',
      type: 'HeadMarker',
      netRegex: { id: '00C1' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      run: (data) => data.freeze = true,
      outputStrings: {
        text: {
          en: 'Knockback + Ice on YOU',
          de: 'Rückstoß + Eis auf DIR',
          fr: 'Poussée + Glace sur VOUS',
          ja: '自分に ノックバック + 氷',
          cn: '擊退 + 冰 點名',
          ko: '넉백 + 얼음징 대상자',
        },
      },
    },
    {
      id: 'HadesEx Wail Of The Lost',
      type: 'StartsUsing',
      netRegex: { id: '47E1', source: 'Hades', capture: false },
      condition: (data) => !data.flame && !data.freeze,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback + Stack With Partner',
          de: 'Rückstoß + sammeln beim Partner',
          fr: 'Poussée + packez-vous avec votre partenaire',
          ja: 'パートナーと ノックバック + 頭割り',
          cn: '與夥伴 擊退 + 集合',
          ko: '넉백 + 파트너랑 모이기',
        },
      },
    },
    {
      id: 'HadesEx Nether Blast',
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      run: (data) => data.netherBlast = true,
      outputStrings: {
        text: {
          en: 'Puddles on YOU',
          de: 'Fläche auf YOU',
          fr: 'Zone au sol sur VOUS',
          ja: 'AoEを外に捨て',
          cn: '水圈點名',
          ko: '징 대상자',
        },
      },
    },
    {
      id: 'HadesEx Bident',
      type: 'StartsUsing',
      netRegex: { id: '47E3', source: 'Hades', capture: false },
      condition: (data) => !data.netherBlast,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Healer Stacks',
          de: 'Bei dem Heiler sammeln',
          fr: 'Packages sur les heals',
          ja: 'ヒーラーに集合',
          cn: '治療集合',
          ko: '힐러 모이기',
        },
      },
    },
    {
      id: 'HadesEx Shadow Stream',
      type: 'StartsUsing',
      netRegex: { id: '47EA', source: 'Hades', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'HadesEx Polydegmon\'s Purgation',
      type: 'StartsUsing',
      netRegex: { id: '47EB', source: 'Hades', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Front and Center',
          de: 'Vorne und Mitte',
          fr: 'Devant et au centre',
          ja: '中央',
          cn: '中間前方',
          ko: '앞 중앙으로',
        },
      },
    },
    {
      id: 'HadesEx Dark Current',
      type: 'StartsUsing',
      netRegex: { id: '47F1', source: 'Hades', capture: false },
      durationSeconds: 12,
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Exoflares',
          de: 'Exa-Flares',
          fr: 'Exabrasiers',
          ja: 'ダークストリーム',
          cn: '地火',
          ko: '엑사플레어',
        },
      },
    },
    {
      id: 'HadesEx Gigantomachy',
      type: 'StartsUsing',
      netRegex: { id: '47F3', source: 'Hades', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HadesEx Quadrastrike 1',
      type: 'StartsUsing',
      netRegex: { id: '47F4', source: 'Hades', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HadesEx Quadrastrike 2',
      type: 'StartsUsing',
      netRegex: { id: '47F6', source: 'Hades', capture: false },
      condition: (data) => data.role === 'tank' || data.role === 'healer' || data.job === 'BLU',
      suppressSeconds: 2,
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank' || data.job === 'BLU')
          return output.getTowers!();
      },
      infoText: (data, _matches, output) => {
        if (data.role === 'healer')
          return output.tankBusters!();
      },
      outputStrings: {
        tankBusters: Outputs.tankBusters,
        getTowers: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Allez dans les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '기둥 들어가기',
        },
      },
    },
    {
      id: 'HadesEx Quadrastrike 3',
      type: 'Ability',
      netRegex: { id: '47F6', source: 'Hades', capture: false },
      // After tanks take tower damage
      delaySeconds: 2,
      suppressSeconds: 2,
      response: Responses.bleedAoe(),
    },
    {
      id: 'HadesEx Enrage Gigantomachy',
      type: 'StartsUsing',
      netRegex: { id: '47F9', source: 'Hades', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Enrage',
          de: 'Finalangriff',
          fr: 'Enrage',
          ja: '時間切れ',
          cn: '狂暴',
          ko: '전멸기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aetherial Gaol': 'Ätherkerker',
        'Arcane Font': 'Arkan(?:e|er|es|en) Körper',
        'Arcane Globe': 'Arkan(?:e|er|es|en) Kugel',
        'Ascian Prime\'s Shade': 'Schatten des Prim-Ascian',
        '(?<!\\w)Hades': 'Hades',
        '(?<! )Igeyorhm\'s Shade': 'Igeyorhms Schatten',
        'Lahabrea\'s Shade': 'Lahabreas Schatten',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'Lahabrea und Igeyorhm',
        'Nabriales\'s Shade': 'Nabriales\' Schatten',
        'Our plea transcends': 'Reißt nieder die Grenze',
        'Shadow of the Ancients': 'Schatten der Alten',
      },
      'replaceText': {
        'Again The Abyssal Celebrant': 'Erinnerung an den Abgrund',
        'Again The Majestic': 'Erinnerung an den Erhabenen',
        'Again The Martyr': 'Erinnerung an die Märtyrer',
        'Ancient Circle': 'Orbis Antiquus',
        'Ancient Dark IV': 'Neka der Alten',
        'Ancient Darkness': 'Dunkelung der Alten',
        'Ancient Double': 'Doppelung der Alten',
        'Ancient Eruption': 'Antike Eruption',
        'Ancient Water III': 'Aquaga der Alten',
        'Annihilation': 'Annihilation',
        'Arcane Control': 'Beleben des Kreises',
        'Arcane Utterance': 'Zeichnen des Kreises',
        'Bad Faith': 'Maske des Grolls',
        'Blight': 'Pesthauch',
        'Blizzard IV': 'Eiska',
        'Blizzard Sphere': 'Eissphäre',
        'Broken Faith': 'Maske der Trauer',
        '(?<! )Captivity': 'Gefangenschaft',
        'Dark Current': 'Dunkel-Strom',
        'Dark Flame': 'Dunkel-Flamme',
        'Dark Freeze': 'Dunkel-Einfrieren',
        'Dark II': 'Negra',
        'Dark Seal': 'Dunkles Siegel',
        'Death Shriek': 'Todesschrei',
        'Fire IV': 'Feuka',
        'Fire Sphere': 'Feuersphäre',
        'Forked Lightning': 'Gabelblitz',
        'Gigantomachy': 'Gigantomachie',
        'Height Of Chaos': 'Klimax des Chaos',
        'Megiddo Flame': 'Megiddoflamme',
        'Nether Blast': 'Schattenausbruch',
        'Purgation': 'Schlag des Polydegmon',
        'Quake III': 'Seisga',
        'Ravenous Assault': 'Fegefeuer der Helden',
        'Shadow Flare': 'Schattenflamme',
        'Shadow Spread': 'Dunkle Schatten',
        'Stream': 'Schattenstrom',
        'Titanomachy': 'Titanomachie',
        'Universal Manipulation': 'Umwertung aller Werte',
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
        'Comet': 'Komet',
        'Quadrastrike(?! [^0-9])': 'Quadraschlag',
        'Magic Chakram/Spear': 'Magisches Chakram/Speer',
        'Magic Spear/Chakram': 'Magischer Speer/Chakram',
        'Life In Captivity': 'Leben in Gefangenschaft',
        'Quadrastrike Tower': 'Quadraschlag Turm',
        'Quadrastrike Bleed': 'Quadraschlag Blutung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aetherial Gaol': 'Geôle Éthérée',
        'Arcane Font': 'Solide Arcanique',
        'Arcane Globe': 'Globe Arcanique',
        'Ascian Prime\'s Shade': 'Spectre de Primo-Ascien',
        '(?<!\\w)Hades': 'Hadès',
        '(?<! )Igeyorhm\'s Shade': 'Spectre d\'Igeyorhm',
        'Lahabrea\'s Shade': 'Spectre de Lahabrea',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'Duo d\'Asciens',
        'Nabriales\'s Shade': 'Spectre de Nabriales',
        'Our plea transcends': 'Nos convictions sont si fortes',
        'Shadow of the Ancients': 'Spectre d\'Ascien',
      },
      'replaceText': {
        'Again The Abyssal Celebrant': 'Mémoire d\'un contemplateur de l\'abysse',
        'Again The Majestic': 'Mémoire d\'un souverain',
        'Again The Martyr': 'Mémoire d\'un martyre',
        'Ancient Circle': 'Cercle ancien',
        'Ancient Dark IV': 'Giga Ténèbres anciennes',
        'Ancient Darkness': 'Ténèbres anciennes',
        'Ancient Double': 'Double ancien',
        'Ancient Eruption': 'Éruption ancienne',
        'Ancient Water III': 'Méga Eau ancienne',
        'Annihilation': 'Annihilation',
        'Arcane Control': 'Activation arcanique',
        'Arcane Utterance': 'Énoncé arcanique',
        'Bad Faith': 'Mauvaise foi',
        'Blight': 'Supplice',
        'Blizzard IV': 'Giga Glace',
        'Blizzard Sphere': 'Sphère de glace',
        'Broken Faith': 'Foi brisée',
        '(?<! )Captivity': 'Captivité',
        'Dark Current': 'Flux sombre',
        'Dark Flame': 'Flamme ténébreuse',
        'Dark Freeze': 'Gel ténébreux',
        'Dark II': 'Extra Ténèbres',
        'Dark Seal': 'Sceau ténébreux',
        'Death Shriek': 'Hurlement fatal',
        'Fire IV': 'Giga Feu',
        'Fire Sphere': 'Sphère de feu',
        'Forked Lightning': 'Éclair ramifié',
        'Gigantomachy': 'Gigantomachie',
        'Height Of Chaos': 'Apogée du chaos',
        'Life In Captivity': 'Vie de captivité',
        'Magic Chakram/Spear': 'Chakram/Lance magique',
        'Magic Spear/Chakram': 'Lance/Chakram magique',
        'Megiddo Flame': 'Flamme de Megiddo',
        'Nether Blast': 'Détonation infernale',
        'Purgation': 'Assaut du Polydegmon',
        'Quake III': 'Méga Séisme',
        'Ravenous Assault': 'Assaut acharné',
        'Shadow Flare': 'Éruption ténébreuse',
        'Shadow Spread': 'Diffusion d\'ombre',
        'Stream': 'Flux de Ténèbres',
        'Titanomachy': 'Titanomachie',
        'Universal Manipulation': 'Manipulation universelle',
        'Wail Of The Lost': 'Lamentation des disparus',
        'Comet': 'Comète',
        'Quadrastrike(?! [^0-9])': 'Frappe quadruplée',
        'Quadrastrike Bleed': 'Frappe quadruplée Saignement',
        'Quadrastrike Tower': 'Frappe quadruplée Tour',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arcane Font': '立体魔法陣',
        'Arcane Globe': '球体魔法陣',
        'Ascian Prime\'s Shade': 'アシエン・プライムの影',
        '(?<!\\w)Hades': 'ハーデス',
        '(?<! )Igeyorhm\'s Shade': 'イゲオルムの影',
        'Lahabrea\'s Shade': 'ラハブレアの影',
        'Lahabrea\'s and Igeyorhm\'s Shades': 'ラハブレアとイゲオルム',
        'Nabriales\'s Shade': 'ナプリアレスの影',
        'Our plea transcends': 'その強き願いは、魂の境界さえ超えた……！',
        'Shadow of the Ancients': '古代人の影',
        'Aetherial Gaol': 'エーテリアル・ジェイル',
      },
      'replaceText': {
        'Again The Abyssal Celebrant': '深淵の記憶',
        'Again The Majestic': '尊厳王の記憶',
        'Again The Martyr': '殉教者の記憶',
        'Ancient Circle': 'エンシェントリング',
        'Ancient Dark IV': 'エンシェントダージャ',
        'Ancient Darkness': 'エンシェントダーク',
        'Ancient Double': 'エンシェントダブル',
        'Ancient Eruption': 'エンシェントエラプション',
        'Ancient Water III': 'エンシェントウォタガ',
        'Annihilation': 'アナイアレイション',
        'Arcane Control': '魔法陣起動',
        'Arcane Utterance': '魔法陣記述',
        'Bad Faith': 'バッドフェイス',
        'Blight': 'クラウダ',
        'Blizzard IV': 'ブリザジャ',
        'Blizzard Sphere': 'ブリザードスフィア',
        'Broken Faith': 'ブロークンフェイス',
        '(?<! )Captivity': 'キャプティビティ',
        'Dark Current': 'ダークストリーム',
        'Dark Flame': 'ダークフレイム',
        'Dark Freeze': 'ダークフリーズ',
        'Dark II': 'ダーラ',
        'Dark Seal': 'ダークシール',
        'Death Shriek': 'デスシュリーク',
        'Fire IV': 'ファイジャ',
        'Fire Sphere': 'ファイアスフィア',
        'Forked Lightning': 'フォークライトニング',
        'Gigantomachy': 'ギガントマキア',
        'Height Of Chaos': 'ハイト・オブ・カオス',
        'Life In Captivity': 'ライフ・オブ・キャプティビティ',
        'Magic Chakram/Spear': 'マジックチャクラム／マジックスピア',
        'Magic Spear/Chakram': 'マジックスピア／マジックチャクラム',
        'Megiddo Flame': 'メギドフレイム',
        'Nether Blast': 'ネザーブラスト',
        'Purgation': 'ポリデグモンストライク',
        'Quake III': 'クエイガ',
        'Ravenous Assault': 'ラヴェナスアサルト',
        'Shadow Flare': 'シャドウフレア',
        'Shadow Spread': 'シャドウスプレッド',
        'Stream': 'シャドウストリーム',
        'Titanomachy': 'ティタノマキア',
        'Universal Manipulation': '法則改変',
        'Wail Of The Lost': 'ウエイル・オブ・ザ・ロスト',
        'Comet': 'コメット',
        'Quadrastrike(?! [^0-9])': 'クアドラストライク',
        'Quadrastrike Tower': 'クアドラストライク：塔',
        'Quadrastrike Bleed': 'クアドラストライク：ペイン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aetherial Gaol': '乙太牢獄',
        'Arcane Font': '立體魔法陣',
        'Arcane Globe': '球體魔法陣',
        'Ascian Prime\'s Shade': '至尊無影之影',
        '(?<!\\w)Hades': '哈迪斯',
        '(?<! )Igeyorhm\'s Shade': '以格約姆之影',
        'Lahabrea\'s Shade': '拉哈布雷亞之影',
        'Lahabrea\'s and Igeyorhm\'s Shades': '拉哈布雷亞與以格約姆之影',
        'Nabriales\'s Shade': '那布里亞勒斯之影',
        'Our plea transcends': '你們強大的意志已超越肉體與靈魂的境界！',
        'Shadow of the Ancients': '古代人之影',
      },
      'replaceText': {
        'Again The Abyssal Celebrant': '深淵祭司的記憶',
        'Again The Majestic': '尊嚴王的記憶',
        'Again The Martyr': '殉教者的記憶',
        'Ancient Circle': '古代圓環',
        'Ancient Dark IV': '古代冥暗',
        'Ancient Darkness': '古代黑暗',
        'Ancient Double': '古代雙重',
        'Ancient Eruption': '古火噴發',
        'Ancient Water III': '古代狂水',
        'Annihilation': '湮滅',
        'Arcane Control': '魔法陣啟動',
        'Arcane Utterance': '魔法陣記述',
        'Bad Faith': '失信',
        'Blight': '毒霧',
        'Blizzard IV': '冰澈柱',
        'Blizzard Sphere': '冰結球',
        'Broken Faith': '背信',
        'Life In Captivity': '囚禁生命',
        '(?<! )Captivity': '囚禁',
        'Dark Current': '黑暗奔流',
        'Dark Flame': '暗黑之炎',
        'Dark Freeze': '黑暗玄冰',
        'Dark II': '昏暗',
        'Dark Seal': '黑暗咒印',
        'Death Shriek': '死亡尖叫',
        'Fire IV': '熾炎',
        'Fire Sphere': '火炎球',
        'Forked Lightning': '叉形閃電',
        'Gigantomachy': '巨人之戰',
        'Height Of Chaos': '混沌之巔',
        'Magic Chakram/Spear': '魔法輪/矛',
        'Magic Spear/Chakram': '魔法矛/輪',
        'Megiddo Flame': '米吉多烈焰',
        'Nether Blast': '幽冥衝擊',
        'Purgation': '冥王淨化',
        'Quake III': '爆震',
        'Ravenous Assault': '貪婪突襲',
        'Shadow Flare': '暗影核爆',
        'Shadow Spread': '暗影擴散',
        'Stream': '暗影流',
        'Titanomachy': '諸神之戰',
        'Universal Manipulation': '法則變更',
        'Wail Of The Lost': '逝者的哀嚎',
        'Comet': '彗星',
        'Quadrastrike Tower': '四重強襲 塔',
        'Quadrastrike Bleed': '四重強襲 流血',
        'Quadrastrike(?! [^0-9])': '四重強襲',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aetherial Gaol': '에테르 감옥',
        'Arcane Font': '입체 마법진',
        'Arcane Globe': '구체 마법진',
        'Ascian Prime\'s Shade': '아씨엔 프라임의 그림자',
        '(?<!\\w)Hades': '하데스',
        '(?<! )Igeyorhm\'s Shade': '이게요름의 그림자',
        'Lahabrea\'s Shade': '라하브레아의 그림자',
        'Lahabrea\'s and Igeyorhm\'s Shades': '라하브레아와 이게요름',
        'Nabriales\'s Shade': '나브리알레스의 그림자',
        'Our plea transcends': '그 강한 바람은 혼',
        'Shadow of the Ancients': '고대인의 그림자',
      },
      'replaceText': {
        'Again The Abyssal Celebrant': '심연의 기억',
        'Again The Majestic': '존엄왕의 기억',
        'Again The Martyr': '순교자의 기억',
        'Ancient Circle': '고대의 고리',
        'Ancient Dark IV': '에인션트 다쟈',
        'Ancient Darkness': '에인션트 다크',
        'Ancient Double': '고대의 이중 공격',
        'Ancient Eruption': '고대의 불기둥',
        'Ancient Water III': '에인션트 워터가',
        'Annihilation': '멸절',
        'Arcane Control': '마법진 기동',
        'Arcane Utterance': '마법진 전개',
        'Bad Faith': '불신',
        'Blight': '좀먹힌 우울',
        'Blizzard IV': '블리자쟈',
        'Blizzard Sphere': '눈보라 구체',
        'Broken Faith': '배신',
        '(?<! )Captivity': '감금',
        'Dark Current': '어둠의 급류',
        'Dark Flame': '다크 플레임',
        'Dark Freeze': '다크 프리즈',
        'Dark II': '다라',
        'Dark Seal': '어둠의 봉인',
        'Death Shriek': '죽음의 비명',
        'Fire IV': '파이쟈',
        'Fire Sphere': '불의 구체',
        'Forked Lightning': '갈래 번개',
        'Gigantomachy': '기간토마키아',
        'Height Of Chaos': '혼돈의 정점',
        'Life In Captivity': '감금된 삶',
        'Magic Chakram/Spear': '마법 차크람/창',
        'Magic Spear/Chakram': '마법 창/차크람',
        'Megiddo Flame': '메기도 플레임',
        'Nether Blast': '지옥 강풍',
        'Purgation': '폴리데그몬',
        'Quake III': '퀘이가',
        'Ravenous Assault': '탐욕스러운 공격',
        'Shadow Flare': '섀도우 플레어',
        'Shadow Spread': '그림자 확산',
        'Stream': '그림자 급류',
        'Titanomachy': '티타노마키아',
        'Universal Manipulation': '법칙 변조',
        'Wail Of The Lost': '상실의 통곡',
        'Comet': '혜성',
        'Quadrastrike Tower': '사분격 기둥',
        'Quadrastrike Bleed': '사분격 출혈',
        'Quadrastrike(?! [^0-9])': '사분격',
      },
    },
  ],
};

export default triggerSet;
