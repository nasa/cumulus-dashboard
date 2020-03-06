'use strict';

import test from 'ava';
import _config from '../../app/src/js/config';
import {
  kibanaS3AccessErrorsLink,
  kibanaS3AccessSuccessesLink,
  kibanaTEALambdaErrorsLink,
  kibanaTEALambdaSuccessesLink,
  kibanaApiLambdaErrorsLink,
  kibanaApiLambdaSuccessesLink,
  kibanaGatewayExecutionErrorsLink,
  kibanaGatewayExecutionSuccessesLink,
  kibanaGatewayAccessErrorsLink,
  kibanaGatewayAccessSuccessesLink,
  kibanaAllLogsLink,
  kibanaExecutionLink
} from '../../app/src/js/utils/kibana';

const cumulusInstanceMeta = { stackName: 'cumulus-stack' };

const startDateString = '2020-02-20T17:43:26.281Z';
const endDateString = '2020-02-21T17:43:26.281Z'

test.beforeEach(() => {
  _config.kibanaRoot = 'http://example.com';
});

test('Kibana links will return a range for the last 24 hours when no time is provided', function (t) {
  const datepicker = {};
  const expectedRegEx = /from:now-24h,mode:quick,to:now/;

  const kibanaLink = kibanaS3AccessSuccessesLink(cumulusInstanceMeta, datepicker);
  t.regex(kibanaLink, expectedRegEx);
});

test('Kibana links will return a range with start date and end date when both are provided', function (t) {
  const datepicker = {
    startDateTime: new Date(startDateString),
    endDateTime: new Date(endDateString)
  };
  const expectedRegEx = /from:'2020-02-20T17:43:26.281Z',to:'2020-02-21T17:43:26.281Z'/;

  const kibanaLink = kibanaS3AccessSuccessesLink(cumulusInstanceMeta, datepicker);
  t.regex(kibanaLink, expectedRegEx);
});

test('Kibana links will return a range of start time to now when only start time is provided', function (t) {
  const datepicker = {
    startDateTime: new Date(startDateString)
  };
  const expectedRegEx = /from:'2020-02-20T17:43:26.281Z',to:now/;

  const kibanaLink = kibanaS3AccessSuccessesLink(cumulusInstanceMeta, datepicker);
  t.regex(kibanaLink, expectedRegEx);
});

test('Kibana links will return a range from Jan 1, 1970 until the end time when just end time is provided', function (t) {
  const datepicker = {
    endDateTime: new Date(endDateString)
  };
  const expectedRegEx = /from:'1970-01-01T00:00:00.000Z',to:'2020-02-21T17:43:26.281Z'/;

  const kibanaLink = kibanaS3AccessSuccessesLink(cumulusInstanceMeta, datepicker);
  t.regex(kibanaLink, expectedRegEx);
});

test('kibanaS3AccessErrorsLink() will return a Kibana link to query for S3 Access Errors', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-s3*',type:phrase),type:phrase,value:'cumulus-stack-s3*'),query:(match:(_index:(query:'cumulus-stack-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'NOT%20response:200'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaS3AccessErrorsLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaS3AccessSuccessesLink() will return a Kibana link to query for S3 Acess Successes', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(response,key),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-s3*',type:phrase),type:phrase,value:'cumulus-stack-s3*'),query:(match:(_index:(query:'cumulus-stack-s3*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:operation,negate:!f,params:(query:REST.GET.OBJECT,type:phrase),type:phrase,value:REST.GET.OBJECT),query:(match:(operation:(query:REST.GET.OBJECT,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'response:200'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaS3AccessSuccessesLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaTEALambdaErrorsLink() will return a Kibana link to query for TEA Lambda Errors', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda,type:phrase),type:phrase,value:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda),query:(match:(logGroup:(query:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'%22Could%20not%20download%22'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaTEALambdaErrorsLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaTEALambdaSuccessesLink() will return a Kibana link to query for TEA Lambda Successes', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda,type:phrase),type:phrase,value:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda),query:(match:(logGroup:(query:%2Faws%2Flambda%2Fcumulus-stack-thin-egress-app-EgressLambda,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:%22to_url%22),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaTEALambdaSuccessesLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaApiLambdaErrorsLink() will return a Kibana link to query for API Lambda Errors', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%20%2B(4%3F%3F%205%3F%3F)%20-(200%20307))'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaApiLambdaErrorsLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaApiLambdaSuccessesLink() will return a Kibana link to query for API Lambda Successes', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution,type:phrase),type:phrase,value:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution),query:(match:(logGroup:(query:%2Faws%2Flambda%2Fcumulus-stack-ApiDistribution,type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'message:(%2BGET%20%2BHTTP%20%2B(2%3F%3F%203%3F%3F))'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaApiLambdaSuccessesLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaGatewayExecutionErrorsLink() will return a Kibana link to query for Gateway Execution Errors', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(4%3F%3F%205%3F%3F)'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaGatewayExecutionErrorsLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaGatewayExecutionSuccessesLink() will return a Kibana link to query for Gateway Execution Successes', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'%2B%22Method%20completed%20with%20status:%22%20%2B(2%3F%3F%203%3F%3F)'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaGatewayExecutionSuccessesLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaGatewayAccessErrorsLink() will return a Kibana link to query for Gateway Access Errors', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'status:%5B400%20TO%20599%5D'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaGatewayAccessErrorsLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaGatewayAccessSuccessesLink() will return a Kibana link to query for Gateway Access Successes', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-24h,mode:quick,to:now))&_a=(columns:!(message),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:_index,negate:!f,params:(query:'cumulus-stack-cloudwatch*',type:phrase),type:phrase,value:'cumulus-stack-cloudwatch*'),query:(match:(_index:(query:'cumulus-stack-cloudwatch*',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:cumulus-stack,key:logGroup,negate:!f,params:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase),type:phrase,value:'%22API%5C-Gateway%5C-Execution*%22'),query:(match:(logGroup:(query:'%22API%5C-Gateway%5C-Execution*%22',type:phrase))))),index:cumulus-stack,interval:auto,query:(language:lucene,query:'status:%5B200%20TO%20399%5D'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaGatewayAccessSuccessesLink(cumulusInstanceMeta, {});
  t.is(kibanaLink, expectedLink);
});

test('kibanaAllLogsLink() will return a link to all logs in Kibana', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-48h,to:now))&_a=(columns:!(_source),index:cumulus-stack,interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaAllLogsLink(cumulusInstanceMeta);
  t.is(kibanaLink, expectedLink);
});

test('kibanaExecutionLink() will return a Kibana link to query for a specific execution', function (t) {
  const expectedLink = "http://example.com/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-10y,to:now))&_a=(columns:!(_source),index:cumulus-stack,interval:auto,query:(language:lucene,query:'executions:4f7e7390-c0e5-46b4-8b5d-429ef53198b4'),sort:!('@timestamp',desc))";

  const kibanaLink = kibanaExecutionLink(cumulusInstanceMeta, '4f7e7390-c0e5-46b4-8b5d-429ef53198b4');
  t.is(kibanaLink, expectedLink);
});
