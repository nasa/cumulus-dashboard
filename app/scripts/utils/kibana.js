'use strict';

import { kibanaRoot } from '../config';

export const kibanaS3AccessErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-s3*',type:phrase),type:phrase,value:'${stackName}-s3*'),query:(match:(_index:(query:'${stackName}-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'NOT%20response:200'),sort:!('@timestamp',desc))`;
};

export const kibanaS3AccessSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-s3*',type:phrase),type:phrase,value:'${stackName}-s3*'),query:(match:(_index:(query:'${stackName}-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'response:200'),sort:!('@timestamp',desc))`;
};

export const kibanaApiLambdaErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2F${stackName}-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%20%2B(4%3F%3F%205%3F%3F)%20-(200%20307))'),sort:!('@timestamp',desc))`;
};

export const kibanaApiLambdaSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2F${stackName}-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%2B(2%3F%3F%203%3F%3F))'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayExecutionErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(4%3F%3F%205%3F%3F)'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayExecutionSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(2%3F%3F%203%3F%3F)'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayAccessErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'status:%5B400%20TO%20599%5D'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayAccessSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta || !cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'status:%5B200%20TO%20399%5D'),sort:!('@timestamp',desc))`;
};
