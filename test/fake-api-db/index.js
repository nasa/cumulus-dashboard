const fs = require('fs-extra');
const path = require('path');

const rulesJson = require('../fake-api-fixtures/rules/index.json');
const rulesFilePath = path.join(__dirname, 'db-rules.json');

const seed = (filePath, data) => fs.outputJson(filePath, data);
const resetState = () => {
  return Promise.all([
    seed(rulesFilePath, rulesJson)
    // add seeding to reset other state
  ]);
};

class FakeDb {
  constructor (filePath) {
    this.filePath = filePath;
  }

  addItem (record) {
    return fs.readJson(this.filePath)
      .then((data) => {
        data.meta.count += 1;
        data.results.push(record);
        return data;
      })
      .then((data) => seed(this.filePath, data));
  }

  getItems () {
    return fs.readJson(this.filePath);
  }

  deleteItem (name) {
    return fs.readJson(this.filePath)
      .then((data) => {
        data.meta.count -= 1;
        data.results = data.results.filter(rule => rule.name !== name);
        return data;
      })
      .then((data) => seed(this.filePath, data));
  }
}

class FakeRulesDb extends FakeDb {}
const fakeRulesDb = new FakeRulesDb(rulesFilePath);

module.exports.resetState = resetState;
module.exports.fakeRulesDb = fakeRulesDb;
