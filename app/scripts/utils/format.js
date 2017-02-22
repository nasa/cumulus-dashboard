'use strict';
import moment from 'moment';
import numeral from 'numeral';

export const nullValue = '--';

export const fullDate = function (datestring) {
  if (!datestring) { return nullValue; }
  return moment(datestring).format('MMM. Do, YYYY hh:mm:ss');
};

export const tally = function (numberString) {
  if (!numberString || numberString === nullValue || isNaN(numberString)) { return nullValue; }
  return numeral(+numberString).format('0,0');
};
