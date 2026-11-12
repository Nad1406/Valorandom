export const vi = {
  // App shell & Nav
  'app.title': 'VALORANDOM',
  'app.subtitle': 'Random đặc vụ, bản đồ, vũ khí & đội hình',
  'nav.single': 'Random đơn',
  'nav.squad': 'Random đội',
  'lang.current': 'Tiếng Việt',
  'lang.switch': 'Chuyển sang {lang}',
  'footer.dataFrom': 'Dữ liệu từ',
  'footer.updatedAt': 'Cập nhật: {date}',
  'footer.disclaimer': 'VALORANDOM là dự án cộng đồng phi lợi nhuận, không liên kết hay tài trợ bởi Riot Games.',

  // Common UI
  'common.loading': 'Đang tải...',
  'common.random': 'Random',
  'common.reroll': 'Random lại',
  'common.all': 'Tất cả',
  'common.empty': 'Không tìm thấy dữ liệu',
  'common.clearFilter': 'Xóa bộ lọc',
  'common.close': 'Đóng',
  'common.free': 'Miễn phí',

  // Roles
  'role.duelist': 'Duelist',
  'role.initiator': 'Initiator',
  'role.controller': 'Controller',
  'role.sentinel': 'Sentinel',
  'role.flex': 'Flex / Bất kỳ',
  'role.all': 'Mọi Role',

  // Weapon Categories
  'weapon.category.sidearm': 'Vũ khí phụ',
  'weapon.category.smg': 'Tiểu liên',
  'weapon.category.shotgun': 'Shotgun',
  'weapon.category.rifle': 'Súng trường',
  'weapon.category.sniper': 'Bắn tỉa',
  'weapon.category.lmg': 'Súng máy',
  'weapon.category.melee': 'Cận chiến',
  'weapon.allCategories': 'Mọi loại vũ khí',

  // Single Random
  'single.agent.title': 'Đặc vụ',
  'single.agent.desc': 'Random 1 đặc vụ theo role mong muốn',
  'single.map.title': 'Bản đồ',
  'single.map.desc': 'Random 1 bản đồ trong hoặc ngoài rotation',
  'single.weapon.title': 'Vũ khí',
  'single.weapon.desc': 'Random 1 vũ khí theo phân loại và giá tiền',
  'single.filter.role': 'Lọc theo Role',
  'single.filter.activeMapsOnly': 'Chỉ map trong rotation',
  'single.filter.allMaps': 'Tất cả bản đồ',
  'single.filter.category': 'Phân loại vũ khí',
  'single.filter.cost': 'Khoảng giá',
  'single.filter.poolCount': 'Khả dụng: {count} mục',
  'single.empty.hint': 'Thử nới lỏng bộ lọc để có thêm kết quả',

  // Squad Random
  'squad.title': 'Random đội hình 5 người',
  'squad.desc': 'Random 5 đặc vụ không trùng lặp, hỗ trợ khóa và chia sẻ link',
  'squad.slot.name': 'Tên người chơi',
  'squad.slot.defaultName': 'Người chơi {n}',
  'squad.slot.role': 'Role mong muốn',
  'squad.slot.lock': 'Khóa đặc vụ',
  'squad.slot.unlock': 'Mở khóa',
  'squad.slot.remove': 'Xóa slot',
  'squad.addSlot': 'Thêm người chơi',
  'squad.lockAll': 'Khóa tất cả',
  'squad.share': 'Chia sẻ link',
  'squad.copied': 'Đã sao chép link!',
  'squad.allLocked': 'Tất cả slot đã được khóa',
  'squad.error.insufficientRole': 'Cần {needed} {role} nhưng chỉ có {count} khả dụng',
  'squad.error.invalidLink': 'Link chia sẻ không hợp lệ hoặc đã hết hạn',

  // Stats & Card labels
  'stats.cost': 'Giá',
  'stats.fireRate': 'Tốc độ bắn',
  'stats.magSize': 'Băng đạn',
  'stats.headDamage': 'Đầu',
  'stats.bodyDamage': 'Thân',
  'stats.sites': 'Khu vực: {sites}',
  'stats.active': 'Trong rotation',
  'stats.inactive': 'Ngoài rotation',

  // A11y
  'a11y.resultAnnounce': 'Kết quả: {name}',
} as const;

export type TranslationKey = keyof typeof vi;
