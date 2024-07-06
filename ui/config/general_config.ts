import { isLang } from '../../resources/languages';
import UserConfig from '../../resources/user_config';

UserConfig.registerOptions('general', {
  options: [
    {
      id: 'CactbotUserDirectory',
      name: {
        en: 'Cactbot user directory',
        de: 'Cactbot Benutzerverzeichnis',
        fr: 'Répertoire utilisateur de Cactbot',
        ja: 'Cactbot ユーザーディレクトリ',
        cn: 'Cactbot user目錄',
        ko: 'Cactbot 사용자 디렉토리',
      },
      type: 'directory',
      default: '',
    },
    {
      id: 'ShowDeveloperOptions',
      name: {
        en: 'Show developer options',
        de: 'Zeige Entwickleroptionen',
        fr: 'Afficher les options développeur',
        ja: '開発者向けオプション',
        cn: '顯示開發者選項',
        ko: '개발자 옵션 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'DisplayLanguage',
      name: {
        en: 'Display language',
        de: 'Displaysprache',
        fr: 'Langue d\'affichage',
        ja: '表示言語',
        cn: '顯示語言',
        ko: '주 사용 언어',
      },
      type: 'select',
      options: {
        en: {
          'Use FFXIV Plugin Language': 'default',
          'English (en)': 'en',
          'Chinese (cn)': 'cn',
          'German (de)': 'de',
          'French (fr)': 'fr',
          'Japanese (ja)': 'ja',
          'Korean (ko)': 'ko',
        },
        de: {
          'Benutze FFXIV Plugin Sprache': 'default',
          'Englisch (en)': 'en',
          'Chinesisch (cn)': 'cn',
          'Deutsch (de)': 'de',
          'Französisch (fr)': 'fr',
          'Japanisch (ja)': 'ja',
          'Koreanisch (ko)': 'ko',
        },
        fr: {
          'Utiliser la langue du Plugin FFXIV': 'default',
          'Anglais (en)': 'en',
          'Chinois (cn)': 'cn',
          'Allemand (de)': 'de',
          'Français (fr)': 'fr',
          'Japonais (ja)': 'ja',
          'Coréen (ko)': 'ko',
        },
        ja: {
          'FFXIV Pluginの言語設定': 'default',
          '英語 (en)': 'en',
          '中国語 (cn)': 'cn',
          'ドイツ語 (de)': 'de',
          'フランス語 (fr)': 'fr',
          '日本語 (ja)': 'ja',
          '韓国語 (ko)': 'ko',
        },
        cn: {
          '使用最終幻想XIV解析插件設置的語言': 'default',
          '英文 (en)': 'en',
          '中文 (cn)': 'cn',
          '德文 (de)': 'de',
          '法文 (fr)': 'fr',
          '日文 (ja)': 'ja',
          '韓文 (ko)': 'ko',
        },
        ko: {
          'FFXIV Plugin 언어 사용': 'default',
          '영어 (en)': 'en',
          '중국어 (cn)': 'cn',
          '독일어 (de)': 'de',
          '프랑스어 (fr)': 'fr',
          '일본어 (ja)': 'ja',
          '한국어 (ko)': 'ko',
        },
      },
      default: 'default',
      debug: true,
      setterFunc: (value) => {
        if (typeof value !== 'string')
          return;
        if (value === 'default')
          return;
        if (isLang(value))
          return value;
      },
    },
  ],
});
