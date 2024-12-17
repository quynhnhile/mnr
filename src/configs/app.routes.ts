/**
 * Application routes with its versions
 */

// Health check
const healthCheck = 'health-check';

const baseRoutes = (root: string) => {
  return {
    root,
    getOne: `/${root}/:id`,
    update: `/${root}/:id`,
    delete: `/${root}/:id`,
  };
};

// Api Versions
const v1 = 'v1';

// Root
const authRoot = 'auth';
const regionRoot = 'regions';
const uploadRoot = 'upload';
const classifyRoot = 'classifies';
const cleanMethodRoot = 'clean-methods';
const cleanModeRoot = 'clean-modes';
const comDamRepRoot = 'com-dam-reps';
const componentRoot = 'components';
const conditionRoot = 'conditions';
const conditionReeferRoot = 'condition-reefers';
const contSizeMapRoot = 'cont-size-maps';
const containerRoot = 'containers';
const damageRoot = 'damages';
const damageLocalRoot = 'damage-locals';
const localDmgDetailRoot = 'local-dmg-details';
const estimateRoot = 'estimates';
const estimateDetailRoot = `${estimateRoot}/:estimateId/details`;
const infoContRoot = 'info-conts';
const jobRepairCleanRoot = 'job-repair-cleans';
const locationLocalRoot = 'location-locals';
const locationRoot = 'locations';
const groupLocationLocalRoot = 'group-location-locals';
const agentRoot = 'agents';
const operationRoot = 'operations';
const payerRoot = 'payers';
const repairRoot = 'repairs';
const repairContRoot = 'repair-conts';
const reportRoot = 'reports';
const manageRoot = 'manages';
const surveyRoot = 'surveys';
const surveyDetailRoot = `${surveyRoot}/:surveyId/details`;
const surveyLocationRoot = 'survey-locations';
const statusRoot = 'statuses';
const tariffGroupRoot = 'tariff-groups';
const tariffRoot = 'tariffs';
const terminalRoot = 'terminals';
const vendorTypeRoot = 'vendor-types';
const vendorRoot = 'vendors';
const userRoot = 'users';
const statusTypeRoot = 'status-types';
const mnrOverTypeRoot = 'mnr-overs';
const symbolRoot = 'symbols';
const jobTaskRoot = 'jobtask';
const sysConfigOprRoot = 'sys-config-opr';
const saRoot = 'sa';

export const routesV1 = {
  version: v1,

  healthCheck: {
    root: healthCheck,
  },

  auth: {
    root: authRoot,
    register: `/${authRoot}/register`,
    login: `/${authRoot}/login`,
    logout: `/${authRoot}/logout`,
    exchangeToken: `/${authRoot}/exchange-token`,
    permissions: `/${authRoot}/permissions`,
    refreshToken: `/${authRoot}/refresh-token`,
    deviceAuth: `/${authRoot}/device-auth`,
    deviceAuthExchange: `/${authRoot}/device-auth/exchange-token`,
  },

  // Quản lý người dùng
  sa: {
    role: {
      root: `/${saRoot}/role`,
      update: `/${saRoot}/role/:roleName`,
      delete: `/${saRoot}/role/:roleName`,
      getOne: `/${saRoot}/role/:roleName`,
      findUsersInRole: `/${saRoot}/role/find-users-in-role/:roleName`,
    },
    resource: {
      ...baseRoutes(`${saRoot}/resource`),
    },
    scope: {
      ...baseRoutes(`${saRoot}/scope`),
    },
    user: {
      root: `/${saRoot}/user`,
      updateProfile: `/${saRoot}/user/profile/:id`,
      updatePass: `/${saRoot}/user/password/:id`,
      delete: `/${saRoot}/user/:id`,
      getOne: `/${saRoot}/user/:id`,
    },
    permission: {
      root: `/${saRoot}/permission`,
      update: `/${saRoot}/permission/:roleName`,
      getOne: `/${saRoot}/permission/:roleName`,
    },
  },

  region: {
    ...baseRoutes(regionRoot),
  },
  upload: {
    root: uploadRoot,
    createSignedUrl: `/${uploadRoot}/create-signed-url`,
    getObject: `/${uploadRoot}/get-object`,
    moveObject: `/${uploadRoot}/move-object`,
    deleteObject: `/${uploadRoot}/delete-object`,
  },
  classify: {
    ...baseRoutes(classifyRoot),
  },
  cleanMethod: {
    ...baseRoutes(cleanMethodRoot),
  },
  cleanMode: {
    ...baseRoutes(cleanModeRoot),
  },
  comDamRep: {
    ...baseRoutes(comDamRepRoot),
  },
  component: {
    ...baseRoutes(componentRoot),
  },
  condition: {
    ...baseRoutes(conditionRoot),
  },
  conditionReefer: {
    ...baseRoutes(conditionReeferRoot),
  },
  contSizeMap: {
    ...baseRoutes(contSizeMapRoot),
  },
  container: {
    getOneByContNo: `/${containerRoot}/container-number/:containerNo`,
    ...baseRoutes(containerRoot),
  },
  damage: {
    ...baseRoutes(damageRoot),
  },
  damageLocal: {
    ...baseRoutes(damageLocalRoot),
  },
  localDmgDetail: {
    create: `/${localDmgDetailRoot}/:surveyId`,
    ...baseRoutes(localDmgDetailRoot),
  },
  estimate: {
    ...baseRoutes(estimateRoot),
    approveLocal: `/${estimateRoot}/:id/approve-local`,
    sendOperation: `/${estimateRoot}/:id/send-operation`,
    approve: `/${estimateRoot}/:id/approve`,
    cancel: `/${estimateRoot}/:id/cancel`,
    requestActive: `/${estimateRoot}/:id/request-active`,
    complete: `/${estimateRoot}/:id/complete`,
    start: `/${estimateRoot}/:id/start`,
    calculateTariff: `/${estimateRoot}/calculate-tariff`,
    estimateDetail: {
      ...baseRoutes(estimateDetailRoot),
      startable: `/${estimateRoot}/:estimateId/startable-estimate-details`,
      approveLocal: `/${estimateDetailRoot}/:id/approve-local`,
      approve: `/${estimateDetailRoot}/:id/approve`,
      cancel: `/${estimateDetailRoot}/:id/cancel`,
      requestActive: `/${estimateDetailRoot}/:id/request-active`,
      sendOpr: `/${estimateDetailRoot}/:id/send-opr`,
    },
  },
  infoCont: {
    ...baseRoutes(infoContRoot),
  },
  jobRepairClean: {
    ...baseRoutes(jobRepairCleanRoot),
    start: `/${jobRepairCleanRoot}/:id/start-item`,
    finish: `/${jobRepairCleanRoot}/:id/finish`,
    cancel: `/${jobRepairCleanRoot}/:id/cancel-item`,
    complete: `/${jobRepairCleanRoot}/:id/complete`,
    kcs: `/${jobRepairCleanRoot}/:id/kcs`,
  },
  locationLocal: {
    ...baseRoutes(locationLocalRoot),
  },
  location: {
    ...baseRoutes(locationRoot),
  },
  groupLocationLocal: {
    ...baseRoutes(groupLocationLocalRoot),
  },
  agent: {
    ...baseRoutes(agentRoot),
  },
  operation: {
    ...baseRoutes(operationRoot),
  },
  payer: {
    ...baseRoutes(payerRoot),
  },
  repair: {
    ...baseRoutes(repairRoot),
  },
  repairCont: {
    ...baseRoutes(repairContRoot),
    getOneByContNo: `/${repairContRoot}/container-number/:containerNo`,
    queryInfoCont: `/${repairContRoot}/query-info-cont`,
    getManyByContNos: `/${repairContRoot}/containernos`,
    updateConditionAndClassify: `/${repairContRoot}/update-condition-classify`,
    updateData: `/${repairContRoot}/update-data`,
    queryContByContNos: `/${repairContRoot}/query-conts`,
  },
  report: {
    cleaningAndRepair: `/${reportRoot}/cleaning-and-repair`,
  },
  manage: {
    manageRepairContainer: `/${manageRoot}/manage-repair-container`,
  },
  survey: {
    ...baseRoutes(surveyRoot),
    finish: `/${surveyRoot}/:id/finish`,
    surveyDetail: {
      ...baseRoutes(surveyDetailRoot),
    },
  },
  surveyLocation: {
    ...baseRoutes(surveyLocationRoot),
  },
  status: {
    ...baseRoutes(statusRoot),
  },
  tariffGroup: {
    ...baseRoutes(tariffGroupRoot),
    updateOperation: `/${tariffGroupRoot}/:id/update-operation`,
  },
  tariff: {
    ...baseRoutes(tariffRoot),
  },
  terminal: {
    ...baseRoutes(terminalRoot),
  },
  vendorType: {
    ...baseRoutes(vendorTypeRoot),
  },
  vendor: {
    ...baseRoutes(vendorRoot),
  },
  user: {
    ...baseRoutes(userRoot),
    addQueue: `/${userRoot}/:id/queue`,
  },
  statusType: {
    ...baseRoutes(statusTypeRoot),
  },
  mnrOver: {
    ...baseRoutes(mnrOverTypeRoot),
  },
  symbol: {
    ...baseRoutes(symbolRoot),
  },
  sysConfigOpr: {
    ...baseRoutes(sysConfigOprRoot),
  },
  jobTask: {
    ...baseRoutes(jobTaskRoot),
  },
};
