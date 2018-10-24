const resetState = require('../../test/fake-api-db').resetState;

module.exports = function (on) {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    resetState: function () {
      return resetState();
    }
  });
};
