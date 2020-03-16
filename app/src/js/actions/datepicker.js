'use strict';

import { DATEPICKER_DATECHANGE } from './types';

export const setEndDateTimeToNow = () => ({
  type: DATEPICKER_DATECHANGE,
  data: {endDateTime: new Date(Date.now() + 10000)}
});
