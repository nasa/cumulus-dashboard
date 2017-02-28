'use strict';
import moment from 'moment';
import numeral from 'numeral';

export const nullValue = '--';

export const fullDate = function (datestring) {
  if (!datestring) { return nullValue; }
  return moment(datestring).format('MMM. Do, YYYY hh:mm:ss');
};

export const bigTally = function (numberString) {
  if ((!numberString && numberString !== 0) || numberString === nullValue || isNaN(numberString)) { return nullValue; }
  numberString = +numberString;
  if (numberString >= 1000) {
    return numeral(numberString / 1000).format('0,0') + 'K';
  } else {
    return numeral(numberString / 1000000).format('0,0') + 'M';
  }
};

export const tally = function (numberString) {
  if ((!numberString && numberString !== 0) || numberString === nullValue || isNaN(numberString)) { return nullValue; }
  numberString = +numberString;
  if (numberString < 1000) {
    return numberString;
  } else if (numberString < 100000) {
    return numeral(numberString).format('0,0');
  } else {
    return bigTally(numberString);
  }
};

export const seconds = function (numberString) {
  if (isNaN(numberString)) { return nullValue; }
  return numberString + 's';
};
