'use strict';

import { kibanaRoot } from '../config';

export const kibanaErrorsLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(),index:${stackName},interval:auto,query:(language:lucene,query:'((_index:${stackName}-s3*%20AND%20operation:REST.GET.OBJECT)%20AND%20(response:%5B400%20TO%20*%5D))%20OR%20((_index:${stackName}-cloud*)%20AND%20(NOT(message:(status%20AND%20200)%20OR%20message:(status%20AND%20307))%20AND%20message:status))'),sort:!('@timestamp',desc))`;
};

export const kibanaSuccessesLink = (cumulusInstanceMeta) => {
  if (!cumulusInstanceMeta.stackName) return '';
  if (!kibanaRoot) return '';
  const stackName = cumulusInstanceMeta.stackName;
  return `${kibanaRoot}app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),index:${stackName},interval:auto,query:(language:lucene,query:'((_index:${stackName}-s3*%20AND%20operation:REST.GET.OBJECT)%20AND%20(response:%5B200%20TO%20400%7D))%20OR%20((_index:${stackName}-cloud*)%20AND%20(message:status%20AND%20(message:(status%20AND%20200)%20OR%20message:(status%20AND%20307))))'),sort:!('@timestamp',desc))`;
};
