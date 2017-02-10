'use strict';
import moment from 'moment';

const nullValue = '--';

export const fullDate = function (datestring) {
  if (!datestring) { return nullValue; }
  return moment(datestring).format('MMM. Do, YYYY hh:mm:ss');
};
