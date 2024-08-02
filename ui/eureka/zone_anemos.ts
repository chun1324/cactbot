import anemosMap from './anemos.png';
import { EurekaZoneInfo } from './eureka';

// https://xivapi.com/search?indexes=Fate&filters=ID>=1328,ID<=1348&columns=Description,Name,Url

export const zoneInfoAnemos: EurekaZoneInfo = {
  mapImage: anemosMap,
  mapWidth: 1300,
  mapHeight: 950,
  shortName: 'anemos',
  hasTracker: true,
  primaryWeather: ['Gales'],
  // TODO: these could be a little better tuned :C
  mapToPixelXScalar: 41.12,
  mapToPixelXConstant: -224.7,
  mapToPixelYScalar: 41.09,
  mapToPixelYConstant: -457.67,
  fairy: {
    en: 'Anemos Elemental',
    de: 'Anemos-Elementar',
    fr: 'Élémentaire Anemos',
    ja: 'アネモス・エレメンタル',
    cn: '常風元靈',
    ko: '아네모스 정령',
  },
  nms: {
    sabo: {
      label: {
        en: 'Sabo',
        de: 'Sabo',
        fr: 'Pampa',
        ja: 'サボ',
        cn: '仙人掌',
        ko: '사보텐더',
      },
      trackerName: {
        en: 'Sabo',
        de: 'Sabo',
        fr: 'Pampa',
        ja: 'サボテン',
        cn: '仙人掌',
        ko: '사보',
      },
      x: 13.9,
      y: 21.9,
      fateId: 1332,
    },
    lord: {
      label: {
        en: 'Lord',
        de: 'Prinz',
        fr: 'Seigneur',
        ja: 'ロード',
        cn: '章魚',
        ko: '문어',
      },
      trackerName: {
        en: 'Lord',
        de: 'Prinz',
        fr: 'Seigneur',
        ja: 'ロード',
        cn: '章魚',
        ko: '대왕',
      },
      x: 29.7,
      y: 27.1,
      fateId: 1348,
    },
    teles: {
      label: {
        en: 'Teles',
        de: 'Teles',
        fr: 'Teles',
        ja: 'テレス',
        cn: '鳥',
        ko: '텔레스',
      },
      trackerName: {
        en: 'Teles',
        de: 'Teles',
        fr: 'Teles',
        ja: 'テレス',
        cn: '鳥',
        ko: '텔레스',
      },
      x: 25.6,
      y: 27.4,
      fateId: 1333,
    },
    emperor: {
      label: {
        en: 'Emp',
        de: 'Kaiser',
        fr: 'Empereur',
        ja: 'アネモス',
        cn: '蜻蜓',
        ko: '잠자리',
      },
      trackerName: {
        en: 'Emperor',
        de: 'Kaiser',
        fr: 'Empereur',
        ja: 'エンペラ',
        cn: '蜻蜓',
        ko: '황제',
      },
      x: 17.2,
      y: 22.2,
      fateId: 1328,
    },
    callisto: {
      label: {
        en: 'Calli',
        de: 'Callisto',
        fr: 'Callisto',
        ja: 'カリスト',
        cn: '熊',
        ko: '칼리스토',
      },
      trackerName: {
        en: 'Callisto',
        de: 'Callisto',
        fr: 'Callisto',
        ja: 'カリスト',
        cn: '熊',
        ko: '칼리스토',
      },
      // 25.5, 22.3 from the tracker, but collides with number
      x: 26.2,
      y: 22.0,
      fateId: 1344,
    },
    number: {
      label: {
        en: 'Number',
        de: 'Zahl',
        fr: 'Number',
        ja: 'ナンバーズ',
        cn: '群偶',
        ko: '넘버즈',
      },
      trackerName: {
        en: 'Number',
        de: 'Zahl',
        fr: 'Number',
        ja: 'ナンバ',
        cn: '群偶',
        ko: '넘버즈',
      },
      // 23.5, 22.7 from the tracker, but collides with callisto
      x: 23.5,
      y: 23.4,
      fateId: 1347,
    },
    jaha: {
      label: {
        en: 'Jaha',
        de: 'Jaha',
        fr: 'Jahann',
        ja: 'ジャハ',
        cn: '颱風',
        ko: '자하남',
      },
      trackerName: {
        en: 'Jaha',
        de: 'Jaha',
        fr: 'Jahann',
        ja: 'ジャハ',
        cn: '颱風',
        ko: '자하남',
      },
      x: 17.7,
      y: 18.6,
      fateId: 1345,
      weather: 'Gales',
    },
    amemet: {
      label: {
        en: 'Amemet',
        de: 'Amemet',
        fr: 'Amemet',
        ja: 'アミメット',
        cn: '暴龍',
        ko: '아메메트',
      },
      trackerName: {
        en: 'Amemet',
        de: 'Amemet',
        fr: 'Amemet',
        ja: 'アミメ',
        cn: '暴龍',
        ko: '아메메트',
      },
      x: 15.0,
      y: 15.6,
      fateId: 1334,
    },
    caym: {
      label: {
        en: 'Caym',
        de: 'Caym',
        fr: 'Caym',
        ja: 'カイム',
        cn: '蓋因',
        ko: '카임',
      },
      trackerName: {
        en: 'Caym',
        de: 'Caym',
        fr: 'Caym',
        ja: 'カイム',
        cn: '蓋因',
        ko: '카임',
      },
      x: 13.8,
      y: 12.5,
      fateId: 1335,
    },
    bomb: {
      label: {
        en: 'Bomb',
        de: 'Bomba',
        fr: 'Bomba',
        ja: 'ボンバ',
        cn: '舉高高',
        ko: '봄바딜',
      },
      trackerName: {
        en: 'Bomba',
        de: 'Bomba',
        fr: 'Bomba',
        ja: 'ボンバ',
        cn: '舉高高',
        ko: '봄바',
      },
      x: 28.3,
      y: 20.4,
      fateId: 1336,
      time: 'Night',
    },
    serket: {
      label: {
        en: 'Serket',
        de: 'Serket',
        fr: 'Serket',
        ja: 'セルケト',
        cn: '蠍子',
        ko: '전갈',
      },
      trackerName: {
        en: 'Serket',
        de: 'Serket',
        fr: 'Serket',
        ja: 'セルケト',
        cn: '蠍子',
        ko: '세르케트',
      },
      x: 24.8,
      y: 17.9,
      fateId: 1339,
    },
    juli: {
      label: {
        en: 'Juli',
        de: 'Julika',
        fr: 'Julika',
        ja: 'ジュリカ',
        cn: '魔界花',
        ko: '줄리카',
      },
      trackerName: {
        en: 'Julika',
        de: 'Julika',
        fr: 'Julika',
        ja: 'ジュリカ',
        cn: '魔界花',
        ko: '줄리카',
      },
      x: 21.9,
      y: 15.6,
      fateId: 1346,
    },
    rider: {
      label: {
        en: 'Rider',
        de: 'Reiter',
        fr: 'Cavalier',
        ja: 'ライダー',
        cn: '白騎士',
        ko: '기수',
      },
      trackerName: {
        en: 'Rider',
        de: 'Reiter',
        fr: 'Cavalier',
        ja: 'ライダー',
        cn: '白騎士',
        ko: '기수',
      },
      x: 20.3,
      y: 13.0,
      fateId: 1343,
      time: 'Night',
    },
    poly: {
      label: {
        en: 'Poly',
        de: 'Poly',
        fr: 'Poly',
        ja: 'ポリ',
        cn: '獨眼',
        ko: '외눈',
      },
      trackerName: {
        en: 'Poly',
        de: 'Poly',
        fr: 'Poly',
        ja: 'ポリュ',
        cn: '獨眼',
        ko: '폴리',
      },
      x: 26.4,
      y: 14.3,
      fateId: 1337,
    },
    strider: {
      label: {
        en: 'Strider',
        de: 'Simurghs',
        fr: 'Trotteur',
        ja: 'シームルグ',
        cn: '闊步西牟鳥',
        ko: '즈',
      },
      trackerName: {
        en: 'Strider',
        de: 'Läufer',
        fr: 'Trotteur',
        ja: 'シムルグ',
        cn: '祖',
        ko: '시무르그',
      },
      x: 28.6,
      y: 13.0,
      fateId: 1342,
    },
    hazmat: {
      label: {
        en: 'Hazmat',
        de: 'Hazmat',
        fr: 'Hazmat',
        ja: 'ハズマット',
        cn: '極其危險物質',
        ko: '하즈마트',
      },
      trackerName: {
        en: 'Hazmat',
        de: 'Hazmat',
        fr: 'Hazmat',
        ja: 'ハズマ',
        cn: '爆彈',
        ko: '하즈마트',
      },
      x: 35.3,
      y: 18.3,
      fateId: 1341,
    },
    fafnir: {
      label: {
        en: 'Fafnir',
        de: 'Fafnir',
        fr: 'Fafnir',
        ja: 'ファヴニル',
        cn: '法夫納',
        ko: '파프니르',
      },
      trackerName: {
        en: 'Fafnir',
        de: 'Fafnir',
        fr: 'Fafnir',
        ja: 'ファヴ',
        cn: '法夫納',
        ko: '파프니르',
      },
      x: 35.5,
      y: 21.5,
      fateId: 1331,
      time: 'Night',
    },
    amarok: {
      label: {
        en: 'Amarok',
        de: 'Amarok',
        fr: 'Amarok',
        ja: 'アマロック',
        cn: '阿瑪洛克',
        ko: '아마록',
      },
      trackerName: {
        en: 'Amarok',
        de: 'Amarok',
        fr: 'Amarok',
        ja: 'アマロ',
        cn: '狗',
        ko: '아마록',
      },
      x: 7.6,
      y: 18.2,
      fateId: 1340,
    },
    lama: {
      label: {
        en: 'Lama',
        de: 'Lama',
        fr: 'Lama',
        ja: 'ラマ',
        cn: '拉瑪什圖',
        ko: '라마슈투',
      },
      trackerName: {
        en: 'Lamashtu',
        de: 'Lamashtu',
        fr: 'Lamashtu',
        ja: 'ラマシュ',
        cn: '嫂子',
        ko: '라마슈투',
      },
      // 7.7, 23.3 from the tracker but mobs are farther south.
      x: 7.7,
      y: 25.3,
      fateId: 1338,
      time: 'Night',
    },
    pazu: {
      label: {
        en: 'Pazu',
        de: 'Pazuzu',
        fr: 'Pazuzu',
        ja: 'パズズ',
        cn: '帕祖祖',
        ko: '파주주',
      },
      trackerName: {
        en: 'Paz',
        de: 'Paz',
        fr: 'Pazuzu',
        ja: 'パズズ',
        cn: 'Pzz',
        ko: '파주주',
      },
      x: 7.4,
      y: 21.7,
      fateId: 1329,
      weather: 'Gales',
    },
  },
};
