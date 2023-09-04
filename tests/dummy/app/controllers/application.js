import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RedirectController extends Controller {
  @tracked someDate = new Date('2019-04-15');
  @tracked selected = null;
  @tracked selectedRange = null;
  @tracked selectedMultiple = null;

  @action
  onSelect(selected) {
    this.selected = selected.date;
  }

  @action
  onCenterChange(calendar) {
    this.someDate = calendar.date;
  }

  @action
  onSelectedRange(selected) {
    this.selectedRange = selected._date;
  }

  @action
  onSelectedMultiple(selected) {
    this.selectedMultiple = selected._date;
  }

  @action
  onCenterChangeMultiple(selected) {
    this.someDate = selected._date;
  }
}
