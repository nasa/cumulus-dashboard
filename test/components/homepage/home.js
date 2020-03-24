'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/src/js/components/home';
import { tally } from '../../../app/src/js/utils/format';
import config from '../../../app/src/js/config';

configure({ adapter: new Adapter() });

test('CUMULUS-799 Home page contains distribution error report', async (t) => {
  const dist = {
    apiGateway: {
      execution: { errors: 10, successes: 123 },
      access: { errors: 20, successes: 456 }
    },
    apiLambda: { errors: {}, successes: 789343 },
    teaLambda: { errors: 10, successes: 31 },
    s3Access: { errors: {}, successes: 1011 }
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
  config.kibanaRoot = 'https://fake.com/linktokibana/';
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
  t.is(errorMetrics.at(1).key(), 'Gateway Execution Errors');
  t.is(errorMetrics.at(2).key(), 'Gateway Access Errors');
  t.is(errorMetrics.at(1).find('a').text(), `${tally(dist.apiGateway.execution.errors)} Gateway Execution Errors`);
  t.is(errorMetrics.at(2).find('a').text(), `${tally(dist.apiGateway.access.errors)} Gateway Access Errors`);
  const successMetrics = home.find('#distributionSuccesses li');
  t.is(successMetrics.length, 5);
  t.is(successMetrics.at(0).key(), 'S3 Access Successes');
  t.is(successMetrics.at(1).key(), 'TEA Lambda Successes');
  t.is(successMetrics.at(2).key(), 'Distribution API Lambda Successes');
  t.is(successMetrics.at(3).key(), 'Gateway Execution Successes');
  t.is(successMetrics.at(4).key(), 'Gateway Access Successes');
  t.is(successMetrics.at(0).find('a').text(), `${tally(dist.s3Access.successes)} S3 Access Successes`);
  t.is(successMetrics.at(1).find('a').text(), `${tally(dist.teaLambda.successes)} TEA Lambda Successes`);
  t.is(successMetrics.at(2).find('a').text(), `${tally(dist.apiLambda.successes)} Distribution API Lambda Successes`);
  t.is(successMetrics.at(3).find('a').text(), `${tally(dist.apiGateway.execution.successes)} Gateway Execution Successes`);
  t.is(successMetrics.at(4).find('a').text(), `${tally(dist.apiGateway.access.successes)} Gateway Access Successes`);
});
