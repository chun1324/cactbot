import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export interface Data extends OopsyData {
  vuln?: { [name: string]: boolean };
}

// TODO: could add Patch warnings for double/unbroken tethers
// TODO: Hello World could have any warnings (sorry)

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV40Savage,
  damageWarn: {
    'O12S Superliminal Motion 1': '3334', // 300+ degree cleave with back safe area
    'O12S Efficient Bladework 1': '3329', // Omega-M "get out" centered aoe after split
    'O12S Efficient Bladework 2': '332A', // Omega-M "get out" centered aoe during blades
    'O12S Beyond Strength': '3328', // Omega-M "get in" centered aoe during shield
    'O12S Superliminal Steel 1': '3330', // Omega-F "get front/back" blades phase
    'O12S Superliminal Steel 2': '3331', // Omega-F "get front/back" blades phase
    'O12S Optimized Blizzard III': '3332', // Omega-F giant cross

    'O12S Diffuse Wave Cannon': '3369', // back/sides lasers
    'O12S Right Arm Unit Hyper Pulse 1': '335A', // Rotating Archive Peripheral lasers
    'O12S Right Arm Unit Hyper Pulse 2': '335B', // Rotating Archive Peripheral lasers
    'O12S Right Arm Unit Colossal Blow': '335F', // Exploding Archive All hands
    'O12S Left Arm Unit Colossal Blow': '3360', // Exploding Archive All hands
  },
  damageFail: {
    'O12S Optical Laser': '3347', // middle laser from eye
    'O12S Advanced Optical Laser': '334A', // giant circle centered on eye

    'O12S Rear Power Unit Rear Lasers 1': '3361', // Archive All initial laser
    'O12S Rear Power Unit Rear Lasers 2': '3362', // Archive All rotating laser
  },
  shareWarn: {
    'O12S Optimized Fire III P1': '3337', // fire spread

    'O12S Hyper Pulse Tether': '335C', // Index And Archive Peripheral tethers
    'O12S Wave Cannon': '336B', // Index And Archive Peripheral baited lasers
    'O12S Optimized Fire III P2': '3379', // Archive All spread
  },
  shareFail: {
    'O12S Optimized Sagittarius Arrow': '334D', // Omega-M bard limit break

    'O12S Oversampled Wave Cannon': '3366', // Monitor tank busters
    'O12S Savage Wave Cannon': '336D', // Tank buster with the vuln first
  },
  triggers: [
    {
      id: 'O12S Discharger Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '3327' }),
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
      id: 'O12S Magic Vulnerability Up Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '472' }),
      run: (data, matches) => {
        data.vuln ??= {};
        data.vuln[matches.target] = true;
      },
    },
    {
      id: 'O12S Magic Vulnerability Up Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '472' }),
      run: (data, matches) => {
        data.vuln = data.vuln || {};
        data.vuln[matches.target] = false;
      },
    },
    {
      id: 'O12S Magic Vulnerability Damage',
      type: 'Ability',
      // 332E = Pile Pitch stack
      // 333E = Electric Slide (Omega-M square 1-4 dashes)
      // 333F = Electric Slide (Omega-F triangle 1-4 dashes)
      netRegex: NetRegexes.ability({ id: ['332E', '333E', '333F'], ...playerDamageFields }),
      condition: (data, matches) => data.vuln && data.vuln[matches.target],
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: {
            en: `${matches.ability} (with vuln)`,
            de: `${matches.ability} (mit Verwundbarkeit)`,
            fr: `${matches.ability} (avec Vulnérabilité)`,
            ja: `${matches.ability} (被ダメージ上昇)`,
            cn: `${matches.ability} (帶易傷)`,
            ko: `${matches.ability} (받피증 상태에서 피격)`,
          },
        };
      },
    },
  ],
};

export default triggerSet;
