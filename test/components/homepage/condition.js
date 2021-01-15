'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/src/js/components/home';
import { tally } from '../../../app/src/js/utils/format';

configure({ adapter: new Adapter() });

test('Home page links to KIBANAROOT when it is passed', async (t) => {
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
    t.is(errorNode.find('a').text(), expectedErrorMetrics[index].text);
    t.regex(errorNode.find('a').props().href, /https:\/\/fake.com\/linktokibana/);
  });
  const successMetrics = home.find('#distributionSuccesses li');
  t.is(successMetrics.length, 5);
  successMetrics.forEach((successNode, index) => {
    t.is(successNode.key(), expectedSuccessMetrics[index].key);
    t.is(successNode.find('a').text(), expectedSuccessMetrics[index].text);
    t.regex(successNode.find('a').props().href, /https:\/\/fake.com\/linktokibana/);
  });
});
