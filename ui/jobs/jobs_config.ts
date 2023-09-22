import UserConfig from '../../resources/user_config';

UserConfig.registerOptions('jobs', {
  options: [
    {
      id: 'JustBuffTracker',
      name: {
        en: 'Only show the party buff tracker',
        de: 'Zeige nur den Gruppen Buff-Tracker',
        fr: 'Afficher seulement le tracker de buff de l\'équipe',
        ja: 'シナジー効果のみを表示する',
        cn: '僅監控團輔技能',
        ko: '파티 버프만 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'CompactView',
      name: {
        en: 'Enable compact view',
        de: 'Kompaktansicht aktivieren',
        fr: 'Activer la vue compacte',
        ja: 'コンパクトUIを有効にする',
        cn: '啟用緊湊視圖',
        ko: '간략한 UI 사용',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'LowerOpacityOutOfCombat',
      name: {
        en: 'Lower ui opacity when out of combat',
        de: 'Veringere die Deckkraft auserhalb des Kampfes',
        fr: 'Diminiuer l\'opacité de l\'UI hors combat',
        ja: '非戦闘時にUIを透過する',
        cn: '非戰鬥狀態時使UI半透明',
        ko: '전투 중이 아닐 때, UI 투명도 높이기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'OpacityOutOfCombat',
      name: {
        en: 'Opacity of ui when out of combat',
        de: 'Deckkraft der UI auserhalb des Kampfes',
        fr: 'Opacité de l\'UI hors combat',
        ja: '非戦闘時のUI透過度',
        cn: '非戰鬥狀態時的UI透明度',
        ko: '전투 중이 아닐 때, UI 투명도',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'PlayCountdownSound',
      name: {
        en: 'Enable countdown notification sound',
        de: 'Aktiviere Countdown Hinweis-Ton',
        fr: 'Activer la notification sonore du compte à rebours',
        ja: 'カウントダウンを音声で知らせる',
        cn: '啟用倒計時提示音',
        ko: '초읽기 알림 소리 켜기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'HideWellFedAboveSeconds',
      name: {
        en: 'Hide cheese icon when food > time (in seconds)',
        de: 'Verstecke das Käse Icon wenn Bufffood > Zeit (in Sekunden)',
        fr: 'Masquer l\'icône du fromage lorsque vous êtes repu > durée (en secondes)',
        ja: '飯効果の時間が不足したらチーズアイコンを表示する (秒)',
        cn: '食物 Buff 剩餘時間不足警報 (秒)',
        ko: '남은 식사 효과 시간이 이 시간보다 길면, 치즈 아이콘 숨김 (단위: 초)',
      },
      type: 'integer',
      default: 15 * 60,
    },
    {
      id: 'ShowMPTickerOutOfCombat',
      name: {
        en: 'Show MP ticker out of combat',
        de: 'Zeige MP-Ticker auserhalb des Kampfes',
        fr: 'Afficher le symbole PM hors combat',
        ja: '非戦闘時にもMPを表示する',
        cn: '一直顯示MP監控',
        ko: '전투 중이 아닐 때, MP 티커 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'MidHealthThresholdPercent',
      name: {
        en: 'Percent of health considered middling',
        de: 'Prozent der Lebenspunkte (mittelmaß)',
        fr: 'Pourcentage de vie considéré comme moyenne',
        ja: '健康なHPとして扱うHP量 (1 = 100%)',
        cn: '中等血量閾值 (1 = 100%)',
        ko: '보통 HP로 취급될 HP비율 (1 = 100%)',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'LowHealthThresholdPercent',
      name: {
        en: 'Percent of health considered low',
        de: 'Prozent der Lebenspunkte (gering)',
        fr: 'Pourcentage de vie considéré comme bas',
        ja: '危険なHPとして扱うHP量 (1 = 100%)',
        cn: '危險血量閾值 (1 = 100%)',
        ko: '낮은 HP로 취급될 HP비율 (1 = 100%)',
      },
      type: 'float',
      default: 0.2,
    },
    {
      id: 'BigBuffShowCooldownSeconds',
      name: {
        en: 'Minimum seconds on a cooldown before shown',
        de: 'Minimum an Sekunden für einen Cooldown vor der Anzeige',
        fr: 'Nombre minimal de secondes avant l\'affichage du temps de recharge',
        ja: 'シナジースキルが使用可能前にアイコンを表示する (秒)',
        cn: '團輔冷卻完成預告 (秒)',
        ko: '재사용 대기시간을 표시할 기준 시간(초 이하)',
      },
      type: 'float',
      default: 20,
    },
    {
      id: 'BigBuffIconWidth',
      name: {
        en: 'Width of buff icons (px)',
        de: 'Weite des Buff Icons (px)',
        fr: 'Largeur des icônes de buff (pixel)',
        ja: 'シナジースキルのアイコンの広さ (pixel)',
        cn: '團輔監控圖標寬度 (像素)',
        ko: '버프 아이콘 너비 (pixel)',
      },
      type: 'integer',
      default: 44,
    },
    {
      id: 'BigBuffIconHeight',
      name: {
        en: 'Height of buff icons (px)',
        de: 'Höhe des Buff Icons (px)',
        fr: 'Hauteur des icônes de buff (pixel)',
        ja: 'シナジースキルのアイコンの高さ (pixel)',
        cn: '團輔監控圖標高度 (像素)',
        ko: '버프 아이콘 높이 (pixel)',
      },
      type: 'integer',
      default: 32,
    },
    {
      id: 'BigBuffBarHeight',
      name: {
        en: 'Height of buff timer bars (px)',
        de: 'Höhe der Buff-Timer Leisten (px)',
        fr: 'Hauteur des barres de temps de buff (pixel)',
        ja: 'シナジースキルのタイムバーの高さ (pixel)',
        cn: '團輔監控計時條高度 (像素)',
        ko: '버프 타이머 바 높이 (pixel)',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'BigBuffTextHeight',
      name: {
        en: 'Height of buff text (px)',
        de: 'Höhe des Buff-Text (px)',
        fr: 'Hauteur du texte de buff (pixel)',
        ja: 'シナジースキルのテキストの高さ (pixel)',
        cn: '團輔監控文字高度 (像素)',
        ko: '버프 텍스트 높이 (pixel)',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'BigBuffBorderSize',
      name: {
        en: 'Size of buff borders (px)',
        de: 'Größe der Buff-Ränder (px)',
        fr: 'Taille des bordures de buff (pixel)',
        ja: 'シナジースキルのボーダーの広さ (pixel)',
        cn: '團輔監控邊框尺寸 (像素)',
        ko: '버프 아이콘 테두리 크기 (pixel)',
      },
      type: 'integer',
      default: 1,
    },
    {
      id: 'GpAlarmPoint',
      name: {
        en: 'GP alarm threshold (0 to disable)',
        de: 'SP Alarm Grenze (0 to disable)',
        fr: 'Seuil d\'alarme PR (0 pour désactiver)',
        ja: 'GPが低い時に警告する (０＝無効)',
        cn: '低採集力提示閾值 (0為禁用)',
        ko: 'GP 알람 설정값 (0 = 기능 정지)',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'GpAlarmSoundVolume',
      name: {
        en: 'GP alarm sound (0-1)',
        de: 'SP Alarm Sound (0-1)',
        fr: 'Son d\'alarme PR (0-1)',
        ja: '低いGPの警告音量 (0-1)',
        cn: '低採集力提示音量 (0-1)',
        ko: 'GP 알람 소리 크기 (0-1)',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'NotifyExpiredProcsInCombat',
      name: {
        en:
          'Flash procs boxes of inactive dots/etc. up to n times while in combat. (-1: disabled, 0: infinite)',
        de:
          'Dot/etc. boxen blinken bis zu n mal wenn im Kampf und dot ist nicht aktiv. (-1: deaktiviert, 0: ohne Limit)',
        fr: 'Faire clignoter n fois les DoT/Buffs inactifs en combat (-1 : désactivé, 0 : infini)',
        ja: '戦闘中でDoT/バフが切ったらprocボックスをｎ回点滅させる(-1：無効、0：無限回数)',
        cn: '戰鬥中模塊監控的重要DoT/Buff中斷時令對應計時器閃爍N次（-1：禁用，0：無限閃爍）',
        ko: '도트나 버프가 꺼지면 프록 박스를 n번 깜빡하게 합니다. (-1: 비활성화, 0: 무한)',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'NotifyExpiredProcsInCombatSound',
      name: {
        en: 'Play a sound notification if a proc box for dots/etc. expires while in combat.',
        de: 'Spiele einen Alarm Sound wenn eine dot/etc. box im Kampf inaktiv wird.',
        fr: 'Jouer un son si un Dot/Buff expire en combat.',
        ja: '戦闘中でDoT/バフが切ったら音を鳴らす',
        cn: '戰鬥中模塊監控的重要DoT/Buff中斷時播放提示音',
        ko: '도트나 버프가 꺼지면 소리로 알림을 줍니다.',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'When counter reaches 0.': 'expired',
          'When counter is close to 0.': 'threshold',
        },
        de: {
          'Deaktiviert': 'disabled',
          'Wenn der Countdown 0 erreicht.': 'expired',
          'Wenn der Countdown nahe 0 ist.': 'threshold',
        },
        fr: {
          'Désactivé': 'disabled',
          'Quand le compteur arrive à 0.': 'expired',
          'Quand le compteur est proche de 0.': 'threshold',
        },
        ja: {
          '無効': 'disabled',
          '残り時間 → 0': 'expired',
          '残り時間 → しきい値': 'threshold',
        },
        cn: {
          '禁用': 'disabled',
          '計時器歸零時': 'expired',
          '計時器到達提示閾值時': 'threshold',
        },
        ko: {
          '비활성화': 'disabled',
          '카운트 다운이 0초일 때': 'expired',
          '리필하기 적절한 때에 알려주기': 'threshold',
        },
      },
      default: 'threshold',
    },
  ],
});
