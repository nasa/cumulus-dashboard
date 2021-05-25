import _config from '../config';

const formatKibanaDate = (datepicker = {}) => {
  const startTime = datepicker.startDateTime;
  const endTime = datepicker.endDateTime;
  let kibanaDate = '';

  if (startTime && endTime) {
    kibanaDate = `from:'${new Date(startTime).toISOString()}',to:'${new Date(endTime).toISOString()}'`;
  } else if (startTime && !endTime) {
    kibanaDate = `from:'${new Date(startTime).toISOString()}',to:now`;
  } else if (!startTime && endTime) {
    kibanaDate = `from:'${new Date(0).toISOString()}',to:'${new Date(endTime).toISOString()}'`;
  } else {
    kibanaDate = `from:'${new Date(0).toISOString()}',to:now`;
  }

  return kibanaDate;
};

const kibanaConfigured =
  (cumulusInstanceMeta) => !!cumulusInstanceMeta && !!cumulusInstanceMeta.stackName && !!_config.kibanaRoot;

export const kibanaS3AccessErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(key,response),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${_config.kibanaDistributionUUID}',key:operation,negate:!f,params:(query:REST.GET.OBJECT),type:phrase),query:(match_phrase:(operation:REST.GET.OBJECT)))),index:'${_config.kibanaDistributionUUID}',interval:auto,query:(language:lucene,query:'NOT%20response:200'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaS3AccessSuccessesLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(key,response),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${_config.kibanaDistributionUUID}',key:operation,negate:!f,params:(query:REST.GET.OBJECT),type:phrase),query:(match_phrase:(operation:REST.GET.OBJECT)))),index:'${_config.kibanaDistributionUUID}',interval:auto,query:(language:lucene,query:'response:200'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaTEALambdaErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const { stackName } = cumulusInstanceMeta;
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(s3,code,response_status,redirect_URL),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-thin-egress-app-EgressLambda),type:phrase),query:(match_phrase:(logGroup:%2Faws%2Flambda%2F${stackName}-thin-egress-app-EgressLambda)))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'response_status:failure'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaTEALambdaSuccessesLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const { stackName } = cumulusInstanceMeta;
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(s3,code,response_status,redirect_URL),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-thin-egress-app-EgressLambda),type:phrase),query:(match_phrase:(logGroup:%2Faws%2Flambda%2F${stackName}-thin-egress-app-EgressLambda)))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'response_status:success'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaApiLambdaErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const { stackName } = cumulusInstanceMeta;
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution),type:phrase),query:(match_phrase:(logGroup:%2Faws%2Flambda%2F${stackName}-ApiDistribution)))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%20%2B(4%3F%3F%205%3F%3F)%20-(200%20307))'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaApiLambdaSuccessesLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const { stackName } = cumulusInstanceMeta;
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution),type:phrase),query:(match_phrase:(logGroup:%2Faws%2Flambda%2F${stackName}-ApiDistribution)))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%2B(2%3F%3F%203%3F%3F))'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaGatewayExecutionErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:'API-Gateway-Execution-.*'),type:phrase),query:(match_phrase:(logGroup:'API-Gateway-Execution-.*')))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(4%3F%3F%205%3F%3F)'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaGatewayExecutionSuccessesLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:'API-Gateway-Execution-.*'),type:phrase),query:(match_phrase:(logGroup:'API-Gateway-Execution-.*')))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(2%3F%3F%203%3F%3F)'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaGatewayAccessErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(message,statusCode),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:'API-Gateway-Execution.*'),type:phrase),query:(match_phrase:(logGroup:'API-Gateway-Execution.*')))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'statusCode:%5B400%20TO%20599%5D'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaGatewayAccessSuccessesLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(message,statusCode),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${_config.kibanaCloudwatchUUID},key:logGroup,negate:!f,params:(query:'API-Gateway-Execution.*'),type:phrase),query:(match_phrase:(logGroup:'API-Gateway-Execution.*')))),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'statusCode:%5B200%20TO%20399%5D'),sort:!(!('@timestamp',desc)))`;
};

export const kibanaAllLogsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/discover#/?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(_source),filters:!(),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:''),sort:!(!('@timestamp',desc)))`;
};

export const kibanaGranuleErrorsLink = (cumulusInstanceMeta, datepicker) => {
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  const { stackName } = cumulusInstanceMeta;
  const timeInterval = formatKibanaDate(datepicker);
  return `${_config.kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(${timeInterval}))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-granule*'),type:phrase),query:(match_phrase:(_index:'${stackName}-granule*')))),index:${stackName},interval:auto,query:(language:lucene,query:'status:%20failed'),sort:!('@timestamp',desc))`;
};

export const kibanaExecutionLink = (cumulusInstanceMeta, executionNameOrArn) => {
  const executionName = executionNameOrArn.split(':').pop();
  if (!kibanaConfigured(cumulusInstanceMeta)) return '';
  return `${_config.kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-10y,to:now))&_a=(columns:!(_source),index:${_config.kibanaCloudwatchUUID},interval:auto,query:(language:lucene,query:'executions:${executionName}'),sort:!('@timestamp',desc))`;
};
