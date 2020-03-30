'use strict';
export default function assignDate (object) {
  return Object.assign({ queriedAt: Date.now() }, object);
}
