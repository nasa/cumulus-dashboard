'use strict';

const { seedEverything } = require('../cypress/plugins/seedEverything');

seedEverything()
  .then(() => console.log('Seeded Database with cypress fixtures'))
  .catch((e) => console.error(`unable to seed database ${e}`));
