import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.someDate = new Date('2019-04-15');
  }
});
