'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/src/js/components/home';
import { tally } from '../../../app/src/js/utils/format';

configure({ adapter: new Adapter() });

/** 
 * Link values are generated with functions from app/src/js/utils/kibana.js
 * They return '' if `kibanaConfigured = false` which is determined from:
 * `const kibanaConfigured = (cumulusInstanceMeta) => 
 *   !!cumulusInstanceMeta && !!cumulusInstanceMeta.stackName && !!_config.kibanaRoot;`
 */

test('Home page does not link to distribution metrics when KIBANAROOT is not passed', async (t) => {
  const dist = {
    apiGateway: {
      execution: { errors: 10, successes: 123 },
      access: { errors: 20, successes: 456 }
    },
    apiLambda: { errors: null, successes: 789343 },
    teaLambda: { errors: 10, successes: 31 },
    s3Access: { errors: null, successes: 1011 }
  };
  const granules = { list: [] };
  const stats = {
    stats: {
      data: {}
    },
    count: {
      data: {}
    }
  };

  const emptyLinkToProp = {
    pathname: '',
    search: '',
  }

  const expectedErrorMetrics = [
    {
      key: 'TEA Lambda Errors',
      text: `${tally(dist.teaLambda.errors)} TEA Lambda Errors`,
    },
    {
      key: 'Gateway Execution Errors',
      text: `${tally(dist.apiGateway.execution.errors)} Gateway Execution Errors`,
    },
    {
      key: 'Gateway Access Errors',
      text: `${tally(dist.apiGateway.access.errors)} Gateway Access Errors`
    }
  ];

  const expectedSuccessMetrics = [
    {
      key: 'S3 Access Successes',
      text: `${tally(dist.s3Access.successes)} S3 Access Successes`
    },
    {
      key: 'TEA Lambda Successes',
      text: `${tally(dist.teaLambda.successes)} TEA Lambda Successes`,
    },
    {
      key: 'Distribution API Lambda Successes',
      text: `${tally(dist.apiLambda.successes)} Distribution API Lambda Successes`
    },
    {
      key: 'Gateway Execution Successes',
      text: `${tally(dist.apiGateway.execution.successes)} Gateway Execution Successes`,
    },
    {
      key: 'Gateway Access Successes',
      text: `${tally(dist.apiGateway.access.successes)} Gateway Access Successes`
    }
  ];

  const cumulusInstance = {stackName: 'stackName'};
  const dispatch = () => Promise.resolve();
  const home = shallow(
    <Home
      dispatch={dispatch}
      dist={dist}
      granules={granules}
      stats={stats}
      cumulusInstance={cumulusInstance}
      location={{search: ''}}
    />
  );

  const errorMetrics = home.find('#distributionErrors li');
  t.is(errorMetrics.length, 3);
  errorMetrics.forEach((errorNode, index) => {
    t.is(errorNode.key(), expectedErrorMetrics[index].key);
    t.is(errorNode.find('Link').text(), expectedErrorMetrics[index].text);
    t.deepEqual(errorNode.find('Link').props().to, emptyLinkToProp);
  });
  const successMetrics = home.find('#distributionSuccesses li');
  t.is(successMetrics.length, 5);
  successMetrics.forEach((successNode, index) => {
    t.is(successNode.key(), expectedSuccessMetrics[index].key);
    t.is(successNode.find('Link').text(), expectedSuccessMetrics[index].text);
    t.deepEqual(successNode.find('Link').props().to, emptyLinkToProp);
  });
});


test('Home page does not display distribution metrics when values are null', async (t) => {
  const dist = {
    apiGateway: {
      execution: { errors: null, successes: null },
      access: { errors: null, successes: null }
    },
    apiLambda: { errors: null, successes: null },
    teaLambda: { errors: null, successes: null },
    s3Access: { errors: null, successes: null }
  };
  const granules = { list: [] };
  const stats = {
    stats: {
      data: {}
    },
    count: {
      data: {}
    }
  };

  const cumulusInstance = {stackName: 'stackName'};
  const dispatch = () => Promise.resolve();
  const home = shallow(
    <Home
      dispatch={dispatch}
      dist={dist}
      granules={granules}
      stats={stats}
      cumulusInstance={cumulusInstance}
      location={{search: ''}}
    />
  );

  const errorMetrics = home.find('#distributionErrors li');
  t.is(errorMetrics.length, 0);
  const successMetrics = home.find('#distributionSuccesses li');
  t.is(successMetrics.length, 0);
});