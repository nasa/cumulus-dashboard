'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/scripts/components/home';
import { tally } from '../../../app/scripts/utils/format';

configure({ adapter: new Adapter() });

test('CUMULUS-799 Home page contains distribution error report', async (t) => {
  const dist = {
    apiGateway: {
      execution: { errors: 10, successes: 123 },
      access: { errors: 20, successes: 456 }
    },
    apiLambda: { errors: {}, successes: 789343 },
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

  const home = shallow(
    <Home
      dispatch={dispatch}
      dist={dist}
      granules={granules}
      stats={stats}
      cumulusInstance={cumulusInstance}
    />
  );

  const errorMetrics = home.find('#distributionErrors li');
  t.is(errorMetrics.length, 2);
  t.is(errorMetrics.at(0).key(), 'Gateway Execution Errors');
  t.is(errorMetrics.at(1).key(), 'Gateway Access Errors');
  t.is(errorMetrics.at(0).find('Link').dive().text(), `${tally(dist.apiGateway.execution.errors)} Gateway Execution Errors`);
  t.is(errorMetrics.at(1).find('Link').dive().text(), `${tally(dist.apiGateway.access.errors)} Gateway Access Errors`);
  const successMetrics = home.find('#distributionSuccesses li');
  t.is(successMetrics.length, 4);
  t.is(successMetrics.at(0).key(), 'S3 Access Successes');
  t.is(successMetrics.at(1).key(), 'Distribution API Lambda Successes');
  t.is(successMetrics.at(2).key(), 'Gateway Execution Successes');
  t.is(successMetrics.at(3).key(), 'Gateway Access Successes');
  t.is(successMetrics.at(0).find('Link').dive().text(), `${tally(dist.s3Access.successes)} S3 Access Successes`);
  t.is(successMetrics.at(1).find('Link').dive().text(), `${tally(dist.apiLambda.successes)} Distribution API Lambda Successes`);
  t.is(successMetrics.at(2).find('Link').dive().text(), `${tally(dist.apiGateway.execution.successes)} Gateway Execution Successes`);
  t.is(successMetrics.at(3).find('Link').dive().text(), `${tally(dist.apiGateway.access.successes)} Gateway Access Successes`);
});
