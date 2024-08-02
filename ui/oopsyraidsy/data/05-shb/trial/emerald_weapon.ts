import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.CastrumMarinum,
  damageWarn: {
    'Emerald Weapon Heat Ray': '4F9D', // Emerald Beam initial conal
    'Emerald Weapon Photon Laser 1': '5534', // Emerald Beam inside circle
    'Emerald Weapon Photon Laser 2': '5536', // Emerald Beam middle circle
    'Emerald Weapon Photon Laser 3': '5538', // Emerald Beam outside circle
    'Emerald Weapon Heat Ray 1': '5532', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Heat Ray 2': '5533', // Emerald Beam rotating pulsing laser
    'Emerald Weapon Magnetic Mine Explosion': '5B04', // repulsing mine explosions
    'Emerald Weapon Sidescathe 1': '553F', // left/right cleave
    'Emerald Weapon Sidescathe 2': '5540', // left/right cleave
    'Emerald Weapon Sidescathe 3': '5541', // left/right cleave
    'Emerald Weapon Sidescathe 4': '5542', // left/right cleave
    'Emerald Weapon Bit Storm': '554A', // "get in"
    'Emerald Weapon Emerald Crusher': '553C', // blue knockback puck
    'Emerald Weapon Pulse Laser': '5548', // line aoe
    'Emerald Weapon Energy Aetheroplasm': '5551', // hitting a glowy orb
    'Emerald Weapon Divide Et Impera Ground': '556F', // party targeted ground cones
    'Emerald Weapon Primus Terminus Est': '4B3E', // ground circle during arrow headmarkers
    'Emerald Weapon Secundus Terminus Est': '556A', // X / + headmarkers
    'Emerald Weapon Tertius Terminus Est': '556D', // triple swords
    'Emerald Weapon Shots Fired': '555F', // line aoes from soldiers
  },
  shareWarn: {
    'Emerald Weapon Divide Et Impera P1': '554E', // tankbuster, probably cleaves, phase 1
    'Emerald Weapon Divide Et Impera P2': '5570', // tankbuster, probably cleaves, phase 2
  },
  triggers: [
    {
      id: 'Emerald Weapon Emerald Crusher Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '553E' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '擊退墜落',
            ko: '넉백',
          },
        };
      },
    },
    {
      // Getting knocked into a wall from the arrow headmarker.
      id: 'Emerald Weapon Primus Terminus Est Wall',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['5563', '5564'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Poussé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '擊退至牆',
            ko: '넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
