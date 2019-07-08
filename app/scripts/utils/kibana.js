'use strict';

import { kibanaRoot } from '../config';


export const kibanaS3AccessErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-s3*',type:phrase),type:phrase,value:'${stackName}-s3*'),query:(match:(_index:(query:'${stackName}-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'NOT%20response:200'),sort:!('@timestamp',desc))`;
};

export const kibanaS3AccessSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-s3*',type:phrase),type:phrase,value:'${stackName}-s3*'),query:(match:(_index:(query:'${stackName}-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'response:200'),sort:!('@timestamp',desc))`;
};

export const kibanaApiLambdaErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2F${stackName}-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20-(200%20307))'),sort:!('@timestamp',desc))`;
};

export const kibanaApiLambdaSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2F${stackName}-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2F${stackName}-ApiDistribution,type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%2B(200%20307))'),sort:!('@timestamp',desc))`;
};


export const kibanaGatewayExecutionErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20-%22Method%20completed%20with%20status:%20307%22'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayExecutionSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%20307%22'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayAccessErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'-(%22status%20%5C:%20307%22%20%22status%20%5C:%20200%22)%20%2Bprotocol'),sort:!('@timestamp',desc))`;
};

export const kibanaGatewayAccessSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:_index,negate:!f,params:(query:'${stackName}-cloudwatch*',type:phrase),type:phrase,value:'${stackName}-cloudwatch*'),query:(match:(_index:(query:'${stackName}-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:${stackName},key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:${stackName},interval:auto,query:(language:lucene,query:'%2B(%22status%20%5C:%20307%22%20%22status%20%5C:%20200%22)%20%2Bprotocol'),sort:!('@timestamp',desc))`;
};
