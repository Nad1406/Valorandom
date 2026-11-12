import type { TranslationKey } from './vi';

export const en: Record<TranslationKey, string> = {
  // App shell & Nav
  'app.title': 'VALORANDOM',
  'app.subtitle': 'Randomize Agents, Maps, Weapons & Squads',
  'nav.single': 'Single Random',
  'nav.squad': 'Squad Random',
  'lang.current': 'English',
  'lang.switch': 'Switch to {lang}',
  'footer.dataFrom': 'Data from',
  'footer.updatedAt': 'Updated on: {date}',
  'footer.disclaimer': 'VALORANDOM is a fan project and is not endorsed by or affiliated with Riot Games.',

  // Common UI
  'common.loading': 'Loading...',
  'common.random': 'Randomize',
  'common.reroll': 'Re-roll',
  'common.all': 'All',
  'common.empty': 'No data found',
  'common.clearFilter': 'Clear filter',
  'common.close': 'Close',
  'common.free': 'Free',

  // Roles
  'role.duelist': 'Duelist',
  'role.initiator': 'Initiator',
  'role.controller': 'Controller',
  'role.sentinel': 'Sentinel',
  'role.flex': 'Flex / Any',
  'role.all': 'All Roles',

  // Weapon Categories
  'weapon.category.sidearm': 'Sidearms',
  'weapon.category.smg': 'SMGs',
  'weapon.category.shotgun': 'Shotguns',
  'weapon.category.rifle': 'Rifles',
  'weapon.category.sniper': 'Sniper Rifles',
  'weapon.category.lmg': 'Heavy / LMG',
  'weapon.category.melee': 'Melee',
  'weapon.allCategories': 'All Categories',

  // Single Random
  'single.agent.title': 'Agent',
  'single.agent.desc': 'Randomize 1 agent filtered by role',
  'single.map.title': 'Map',
  'single.map.desc': 'Randomize 1 map from current or all rotation',
  'single.weapon.title': 'Weapon',
  'single.weapon.desc': 'Randomize 1 weapon by category and cost',
  'single.filter.role': 'Filter by Role',
  'single.filter.activeMapsOnly': 'Active rotation only',
  'single.filter.allMaps': 'All maps',
  'single.filter.category': 'Weapon Category',
  'single.filter.cost': 'Cost range',
  'single.filter.poolCount': 'Available: {count} items',
  'single.empty.hint': 'Try relaxing your filters to see results',

  // Squad Random
  'squad.title': '5-Player Squad Randomizer',
  'squad.desc': 'Randomize 5 unique agents with lock and share link support',
  'squad.slot.name': 'Player Name',
  'squad.slot.defaultName': 'Player {n}',
  'squad.slot.role': 'Desired Role',
  'squad.slot.lock': 'Lock Agent',
  'squad.slot.unlock': 'Unlock',
  'squad.slot.remove': 'Remove slot',
  'squad.addSlot': 'Add Player',
  'squad.lockAll': 'Lock All',
  'squad.share': 'Share Link',
  'squad.copied': 'Link copied!',
  'squad.allLocked': 'All slots are locked',
  'squad.error.insufficientRole': 'Need {needed} {role} but only {count} available',
  'squad.error.invalidLink': 'Invalid or expired share link',

  // Stats & Card labels
  'stats.cost': 'Cost',
  'stats.fireRate': 'Fire Rate',
  'stats.magSize': 'Magazine',
  'stats.headDamage': 'Head',
  'stats.bodyDamage': 'Body',
  'stats.sites': 'Sites: {sites}',
  'stats.active': 'In rotation',
  'stats.inactive': 'Out of rotation',

  // A11y
  'a11y.resultAnnounce': 'Result: {name}',
};
