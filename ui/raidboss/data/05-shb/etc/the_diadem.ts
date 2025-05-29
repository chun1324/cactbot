import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheDiadem',
  zoneId: ZoneId.TheDiadem,
  comments: {
    en: 'Timed node spawn alert',
    ko: '시간제 노드 출현 알림',
  },
  resetWhenOutOfCombat: false,
  triggers: [
    // There is presumably a network packet to, at a minimum, spawn the legendary node.
    // But currently no associated log line other than GameLog (code: 003B).
    {
      id: 'Diadem Found Gather Point',
      type: 'GameLog',
      netRegex: {
        line:
          'You sense a grade .* clouded (?:mineral deposit|rocky outcrop|mature tree|lush vegetation patch).*?',
        capture: false,
      },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Found clouded gather point',
          de: 'Verhüllte Sammlerstelle gefunden',
          fr: 'Point de récolte évanescent détecté',
          ja: '幻の採集場探したよ！',
          cn: '夢幻採集點刷了！衝鴨！！',
          ko: '환상의 광맥/성목 발견',
        },
      },
    },
    // This one specifically uses player chat, so no replacement log line.
    {
      id: 'Diadem Flag Alert',
      type: 'GameLog',
      netRegex: { line: '.*\ue0bbThe Diadem *?', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Check coordinate on chat',
          de: 'Überprüfe die Koordinaten im Chat',
          fr: 'Vérifier les coordonnées sur le Tchat',
          ja: 'チャットに座標を確認',
          cn: '檢查聊天欄中的座標',
          ko: '디아뎀 좌표 채팅 올라옴',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'The Diadem': 'Das Diadem',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'The Diadem': 'Le Diadème',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'The Diadem': 'ディアデム諸島',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'The Diadem': '雲冠群島',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'The Diadem': '디아뎀 제도',
      },
    },
  ],
};

export default triggerSet;
