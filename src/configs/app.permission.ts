export const resourceScopes = {
  CREATE: 'create',
  VIEW: 'view',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const resourcesV1 = {
  // Quản lý người dùng
  SCOPE: {
    name: 'scope',
    displayName: 'Thao tác',
    parent: 'Quản lý người dùng',
  },
  ROLE: {
    name: 'role',
    displayName: 'Nhóm người dùng',
    parent: 'Quản lý người dùng',
  },
  RESOURCE: {
    name: 'resource',
    displayName: 'Menu',
    parent: 'Quản lý người dùng',
  },
  USER: {
    name: 'user',
    displayName: 'Người dùng',
    parent: 'Quản lý người dùng',
  },
  PERMISSION: {
    name: 'permission',
    displayName: 'Permission',
    parent: 'Quản lý người dùng',
  },

  REGION: {
    name: 'region',
    displayName: 'Khu vực',
    parent: 'GLOBAL',
  },
  UPLOAD: {
    name: '',
    displayName: 'Xử lý hình ảnh trên Minio',
    parent: 'Upload',
  },
  CLASSIFY: {
    name: '',
    displayName: 'Thông tin phân loại chất luợng container',
    parent: 'Danh mục',
  },
  CLEAN_METHOD: {
    name: '',
    displayName: 'Thông tin phương thức vệ sinh container',
    parent: 'Danh mục',
  },
  CLEAN_MODE: {
    name: '',
    displayName: 'Thông tin phương án vệ sinh container',
    parent: 'Danh mục',
  },
  COM_DAM_REP: {
    name: '',
    displayName: 'Thông tin kết hợp COM-DAM-REP',
    parent: 'Danh mục',
  },
  COMPONENT: {
    name: '',
    displayName: 'Thông tin bộ phận container',
    parent: 'Danh mục',
  },
  CONDITION: {
    name: '',
    displayName: 'Thông tin tình trạng container',
    parent: 'Danh mục',
  },
  CONDITION_REEFER: {
    name: '',
    displayName: 'Thông tin mapping phân loại container lạnh',
    parent: 'Danh mục',
  },
  CONT_SIZE_MAP: {
    name: '',
    displayName: 'Thông tin loại container ( mapping kích thước local - ISO )',
    parent: 'Danh mục',
  },
  CONTAINER: {
    name: '',
    displayName: 'Thông tin container',
    parent: 'Danh mục',
  },
  DAMAGE: {
    name: '',
    displayName: 'Thông tin hư hỏng container',
    parent: 'Danh mục',
  },
  DAMAGE_LOCAL: {
    name: '',
    displayName: 'Thông tin hư hỏng nội bộ container',
    parent: 'Danh mục',
  },
  ESTIMATE: {
    name: '',
    displayName: 'Thông tin báo giá',
    parent: 'Danh mục',
  },
  GROUP_LOCATION_LOCAL: {
    name: '',
    displayName: 'Thông tin nhóm vị trí nội bộ',
    parent: 'Danh mục',
  },
  INFO_CONT: {
    name: '',
    displayName: 'Thông tin thuộc tính container',
    parent: 'Danh mục',
  },
  JOB_REPAIR_CLEAN: {
    name: '',
    displayName: 'Thông tin hiện trường sửa chữa - vệ sinh',
    parent: 'Danh mục',
  },
  LOCATION_LOCAL: {
    name: '',
    displayName: 'Thông tin vị trí nội bộ container',
    parent: 'Danh mục',
  },
  LOCATION: {
    name: '',
    displayName: 'Thông tin vị trí container',
    parent: 'Danh mục',
  },
  LOCAL_DMG_DETAIL: {
    name: '',
    displayName: 'Thông tin chi tiết hư hỏng nội bộ',
    parent: 'Danh mục',
  },
  AGENT: {
    name: 'agent',
    displayName: 'Thông tin đại lý',
    parent: 'Danh mục',
  },
  OPERATION: {
    name: '',
    displayName: 'Thông tin hãng tàu',
    parent: 'Danh mục',
  },
  PAYER: {
    name: '',
    displayName: 'Thông tin phân định trách nhiệm / Đối tượng thanh toán',
    parent: 'Danh mục',
  },
  REPAIR: {
    name: '',
    displayName: 'Thông tin sửa chữa container',
    parent: 'Danh mục',
  },
  REPAIR_CONT: {
    name: '',
    displayName: 'Thông tin container sửa chữa',
    parent: 'Danh mục',
  },
  REPORT: {
    name: 'report',
    displayName: 'Báo cáo',
    parent: 'Báo cáo',
  },
  MANAGE: {
    name: 'manage',
    displayName: 'Quản lý',
    parent: 'Quản lý',
  },
  SURVEY: {
    name: '',
    displayName: 'Thông tin giám định container',
    parent: 'Danh mục',
  },
  SURVEY_LOCATION: {
    name: '',
    displayName: 'Thông tin vị trí giám định container',
    parent: 'Danh mục',
  },
  STATUS: {
    name: '',
    displayName: 'Thông tin trạng thái giám định - báo giá - sửa chữa',
    parent: 'Danh mục',
  },
  TARIFF_GROUP: {
    name: '',
    displayName: 'Thông tin nhóm biểu cước',
    parent: 'Danh mục',
  },
  TARIFF: {
    name: '',
    displayName: 'Thông tin biểu cước',
    parent: 'Danh mục',
  },
  TERMINAL: {
    name: 'terminal',
    displayName: 'Đơn vị cảng / DEPOT / ICD',
    parent: 'Danh mục',
  },
  VENDOR_TYPE: {
    name: '',
    displayName: 'Thông tin loại nhà thầu',
    parent: 'Danh mục',
  },
  VENDOR: {
    name: '',
    displayName: 'Thông tin danh sách đơn vị nhà thầu',
    parent: 'Danh mục',
  },
  STATUS_TYPE: {
    name: '',
    displayName: 'DANH MỤC TIÊU CHÍ M&R',
    parent: 'Danh mục',
  },
  MNR_OVER: {
    name: '',
    displayName: 'CẤU HÌNH THỜI HẠN M&R',
    parent: 'Cấu hình',
  },
  SYMBOL: {
    name: '',
    displayName: 'Thông tin phân định trách nhiệm',
    parent: 'Danh mục',
  },
  JOB_TASK: {
    name: '',
    displayName: 'DANH MỤC TÁC NGHIỆP',
    parent: 'Danh mục',
  },
  SYS_CONFIG_OPR: {
    name: '',
    displayName: 'DANH MỤC CẤU HÌNH HÃNG TÀU',
    parent: 'Danh mục',
  },
};
