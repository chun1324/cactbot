import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import Util from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  beganMonitoringHp?: boolean;
  firstSeed?: string;
  tetherA?: string[];
  tetherB?: string[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheFinalCoilOfBahamutTurn2',
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn2,
  timelineFile: 't11.txt',
  triggers: [
    {
      id: 'T11 Secondary Head',
      type: 'Ability',
      netRegex: { source: 'Kaliya', id: 'B73' },
      alertText: (data, matches, output) => {
        return output.text!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Stun on ${player}',
          de: 'Stun auf ${player}',
          fr: 'Stun sur ${player}',
          ja: '${player}にスタン',
          cn: '擊昏${player}',
          ko: '"${player}" 기절',
        },
      },
    },
    {
      id: 'T11 Seed River First',
      type: 'Ability',
      netRegex: { source: 'Kaliya', id: 'B74', capture: false },
      condition: (data) => !data.firstSeed,
      response: Responses.spreadThenStack(),
      run: (data) => {
        if (!data.firstSeed)
          data.firstSeed = 'river';
      },
    },
    {
      id: 'T11 Seed Sea First',
      type: 'Ability',
      netRegex: { id: 'B75', source: 'Kaliya', capture: false },
      condition: (data) => !data.firstSeed,
      response: Responses.stackThenSpread(),
      run: (data) => {
        if (!data.firstSeed)
          data.firstSeed = 'sea';
      },
    },
    {
      id: 'T11 Seed River Second',
      type: 'Ability',
      netRegex: { id: 'B76', source: 'Kaliya', capture: false },
      condition: (data) => !data.firstSeed,
      response: Responses.stackMarker(),
      run: (data) => delete data.firstSeed,
    },
    {
      id: 'T11 Seed Sea Second',
      type: 'Ability',
      netRegex: { id: 'B77', source: 'Kaliya', capture: false },
      condition: (data) => !data.firstSeed,
      response: Responses.spread(),
      run: (data) => delete data.firstSeed,
    },
    {
      id: 'T11 Phase 2',
      type: 'Ability',
      // Barofield
      netRegex: { source: 'Kaliya', id: 'B6F' },
      condition: (data) => !data.beganMonitoringHp,
      preRun: (data) => data.beganMonitoringHp = true,
      promise: (_data, matches) =>
        Util.watchCombatant({
          ids: [parseInt(matches.sourceId, 16)],
        }, (ret) => {
          return ret.combatants.some((c) => {
            return c.CurrentHP / c.MaxHP <= 0.60;
          });
        }),
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out of Middle',
          de: 'Raus aus der Mitte',
          fr: 'Sortez du milieu',
          ja: '中央から離れる',
          cn: '離開中間',
          ko: '중앙에서 벗어나기',
        },
      },
    },
    {
      id: 'T11 Forked Lightning',
      type: 'Ability',
      netRegex: { id: 'B85', source: 'Electric Node' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lightning on YOU',
          de: 'Blitz auf DIR',
          fr: 'Éclair sur VOUS',
          ja: '自分にフォークライトニング',
          cn: '雷點名',
          ko: '갈래 번개 대상자',
        },
      },
    },
    {
      id: 'T11 Phase 3',
      type: 'Ability',
      netRegex: { id: 'B78', source: 'Kaliya', capture: false },
      sound: 'Long',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Final Phase',
          de: 'Finale Phase',
          fr: 'Phase finale',
          ja: 'フェイス３',
          cn: 'P3',
          ko: '마지막 페이즈',
        },
      },
    },
    {
      id: 'T11 Tether Accumulate A',
      type: 'Tether',
      netRegex: { id: '001C', target: 'Kaliya' },
      run: (data, matches) => {
        (data.tetherA ??= []).push(matches.source);
      },
    },
    {
      id: 'T11 Tether Accumulate B',
      type: 'Tether',
      netRegex: { id: '001D', target: 'Kaliya' },
      run: (data, matches) => {
        (data.tetherB ??= []).push(matches.source);
      },
    },
    {
      id: 'T11 Tether A',
      type: 'Tether',
      netRegex: { id: '001C', target: 'Kaliya', capture: false },
      condition: (data) => data.tetherA?.length === 2,
      alarmText: (data, _matches, output) => {
        let partner;
        const [player0, player1] = data.tetherA ?? [];
        if (!player0 || !player1)
          return;

        if (player0 === data.me)
          partner = player1;
        if (player1 === data.me)
          partner = player0;
        if (!partner)
          return;
        return output.text!({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Red Tethers With ${player}',
          de: 'Rote Verbindung mit ${player}',
          fr: 'Liens rouges avec ${player}',
          ja: '${player}に赤い線',
          cn: '紅線連${player}',
          ko: '"${player}"와 빨간 선',
        },
      },
    },
    {
      id: 'T11 Tether B',
      type: 'Tether',
      netRegex: { id: '001D', target: 'Kaliya', capture: false },
      condition: (data) => data.tetherB?.length === 2,
      alarmText: (data, _matches, output) => {
        let partner;
        const [player0, player1] = data.tetherB ?? [];
        if (!player0 || !player1)
          return;

        if (player0 === data.me)
          partner = player1;
        if (player1 === data.me)
          partner = player0;
        if (!partner)
          return;
        return output.text!({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Blue Tethers With ${player}',
          de: 'Blaue Verbindung mit ${player}',
          fr: 'Liens bleus avec ${player}',
          ja: '${player}に青い線',
          cn: '藍線連${player}',
          ko: '"${player}"와 파랑 선',
        },
      },
    },
    {
      id: 'T11 Tether Cleanup',
      type: 'Ability',
      netRegex: { id: 'B7B', source: 'Kaliya', capture: false },
      run: (data) => {
        delete data.tetherA;
        delete data.tetherB;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Electric Node': 'Elektrisches Modul',
        'Kaliya': 'Kaliya',
        'The Core Override': 'Kern-Steuereinheit',
      },
      'replaceText': {
        'Barofield': 'Baro-Feld',
        'Emergency Mode': 'Notprogramm',
        'Main Head': 'Hauptkopf',
        'Nanospore Jet': 'Nanosporen-Strahl',
        'Nerve Cloud': 'Nervenwolke',
        'Nerve Gas': 'Nervengas',
        'Resonance': 'Resonanz',
        'Secondary Head': 'Nebenkopf',
        'Seed Of The Rivers/Sea': 'Samen der Flüsse/See',
        'Seed Of The Sea/Rivers': 'Samen der See/Flüsse',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Electric Node': 'Module d\'électrochoc',
        'Kaliya': 'Kaliya',
        'The Core Override': 'l\'unité de contrôle du Cœur',
      },
      'replaceText': {
        'Barofield': 'Barotraumatisme',
        'Emergency Mode': 'Mode d\'urgence',
        'Main Head': 'Tête principale',
        'Nanospore Jet': 'Jet de magismoparticules',
        'Nerve Cloud': 'Nuage neurotoxique',
        'Nerve Gas': 'Gaz neurotoxique',
        'Resonance': 'Résonance',
        'Secondary Head': 'Tête secondaire',
        'Seed Of The Rivers/Sea': 'Germe de la rivière/mer',
        'Seed Of The Sea/Rivers': 'Germe de la mer/rivière',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Electric Node': '雷撃システム',
        'Kaliya': 'カーリア',
        'The Core Override': 'コア制御区画',
      },
      'replaceText': {
        'Barofield': 'バロフィールド',
        'Emergency Mode': 'イマージャンシーモード',
        'Main Head': 'メインヘッド',
        'Nanospore Jet': '魔科学粒子散布',
        'Nerve Cloud': 'ナーブクラウド',
        'Nerve Gas': 'ナーブガス',
        'Resonance': 'レゾナンス',
        'Secondary Head': 'サブヘッド',
        'Seed Of The Rivers/Sea': 'シード・オブ・リバー / シード・オブ・シー',
        'Seed Of The Sea/Rivers': 'シード・オブ・シー / シード・オブ・リバー',
        'Stun': 'スタン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Electric Node': '雷擊系統',
        'Kaliya': '卡利亞',
        'The Core Override': '核心控制區間',
      },
      'replaceText': {
        'Barofield': '氣壓領域',
        'Emergency Mode': '緊急模式',
        'Main Head': '主首',
        'Nanospore Jet': '魔科學粒子散布',
        'Nerve Cloud': '神經雲',
        'Nerve Gas': '神經毒氣',
        'Resonance': '共鳴',
        'Secondary Head': '側首',
        'Seed Of The Rivers/Sea': '江河/海洋之種',
        'Seed Of The Sea/Rivers': '海洋/江河之種',
        'Stun': '眩暈',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Electric Node': '뇌격 시스템',
        'Kaliya': '칼리야',
        'The Core Override': '핵심 제어 구역',
      },
      'replaceText': {
        'Barofield': '압력 필드',
        'Emergency Mode': '비상 모드',
        'Main Head': '가운뎃머리',
        'Nanospore Jet': '마과학 입자 살포',
        'Nerve Cloud': '신경 구름',
        'Nerve Gas': '신경 가스',
        'Resonance': '공명',
        'Secondary Head': '옆 머리',
        'Seed Of The Rivers/Sea': '강/바다의 원천',
        'Seed Of The Sea/Rivers': '바다/강의 원천',
        'Stun': '기절',
      },
    },
  ],
};

export default triggerSet;
