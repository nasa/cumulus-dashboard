const rulesJson = require('./fake-api-fixtures/rules/index.json');

class FakeDataStore {
  constructor () {
    this.origRulesJson = rulesJson;
    this.rulesJson = JSON.parse(JSON.stringify(rulesJson));
  }

  reset () {
    // console.log('test state reset');
    // console.log(this.origRulesJson.results.length);
    // console.log(`test, original rules length: ${this.origRulesJson.results.length}`);
    this.rulesJson = JSON.parse(JSON.stringify(rulesJson));
    // console.log(`test, rules length: ${this.rulesJson.results.length}`);
    return this.rulesJson;
  }

  addRule (rule) {
    this.rulesJson.meta.count += 1;
    this.rulesJson.results.push(rule);
  }

  getRules () {
    // if (req.query.name) {
    //   const rule = rulesJson.results.find(rule => rule.name === req.query.name);
    //   return res.send(rule);
    // }
    return this.rulesJson;
  }

  deleteRule (name) {
    this.rulesJson.meta.count -= 1;
    this.rulesJson.results = this.rulesJson.results.filter(rule => rule.name !== name);
  }
}

const fakeDataStore = new FakeDataStore();
module.exports.fakeDataStore = fakeDataStore;
