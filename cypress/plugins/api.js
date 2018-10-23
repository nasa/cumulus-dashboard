const FakeDataStore = require('../../test/fake-db-model').FakeDataStore;

module.exports = function (on) {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    resetState: function () {
      FakeDataStore.reset();
      return FakeDataStore.getTest();
    }
  });
};
