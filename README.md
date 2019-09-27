@makepanic/ember-power-calendar-date-fns
==============================================================================

[![Build Status](https://travis-ci.org/makepanic/ember-power-calendar-date-fns.svg?branch=master)](https://travis-ci.org/makepanic/ember-power-calendar-date-fns)
[![npm version](https://badge.fury.io/js/%40makepanic%2Fember-power-calendar-date-fns.svg)](https://badge.fury.io/js/%40makepanic%2Fember-power-calendar-date-fns)

Date manipulation, formatting and parsin is too complex for ember-power-calendar to reinvent, so it
has to rely on other well tested libraries for that.

This is the addon that exposes the utils used internally by [ember-power-calendar](https://www.ember-power-calendar.com),
using [date-fns](https://date-fns.org/) underneath.

You will want to install this addon if you already use date-fns in your application already, or if
you don't want to use moment.js or [Luxon](https://moment.github.io/luxon/).


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.11 or above
* Node.js v10 or above

| ember | date-fns | ember-power-calendar-date-fns |
| -------:| -------------:| -----:|
| ? | 1.x | &lt; 0.3 |
| ? | 2.x | &ge; 0.3 |
| &ge; 3.11 | 2.x | &ge; 0.4 |

Installation
------------------------------------------------------------------------------

```
ember install @makepanic/ember-power-calendar-date-fns
```


Usage
------------------------------------------------------------------------------

**Don't use it.**

This library is meant to be used internally by `ember-power-calendar` only.

The API can change in breaking ways based on the needs of Ember Power Calendar.

## I18n

This addon provides multiple ways to localize the calendar.

### Using date-fns/locale

By default, all of `date-fns/locale` is imported and used if you configured the power-calendar locale.
**Note**: this will include ~360 KB of Javascript.

---

If you only want to support only a subset of all `date-fns/locale` locales, you can pass them as a list to the addon options:

```js
const app = new EmberApp(defaults, {
    'ember-power-calendar-date-fns': {
      // include only 'en-US', 'en-GB', 'zh-CN' and 'de' locale
      includeLocales: ['en-US', 'en-GB', 'zh-CN', 'de']
    }
});
```

This will cause the addon to build imports that directly load the specified locales.

**Note**: 
* you can only include locales that date-fns exports. See [locale](https://github.com/date-fns/date-fns/tree/master/src/locale) for locales that this addon can import. (See also [Supported Languages](https://date-fns.org/v1.30.1/docs/I18n#supported-languages)).

### DIY

Alternatively, if you don't want to ship all of `date-fns/locale`, you can localize the calendar yourself.
To do this, configure the addon by setting the `'ember-power-calendar-date-fns'` field as ember option: 

```js
const app = new EmberApp(defaults, {
    'ember-power-calendar-date-fns': {
      includeLocales: false
    }
});
```

Setting `includeLocales` to `false` excludes the date-fns localized modules.

By default, this adapter implements any localization feature as a fallback, using the `en` locale.

If you want to localize the dates yourself, extend the `DaysComponent` and implement localized methods, like `startOfWeek`, `weekdaysShort`:

```ts
import DaysComponent from 'ember-power-calendar/components/power-calendar/days';
import layout from 'ember-power-calendar/templates/components/power-calendar/days';

export default class PowerCalendarDays extends DaysComponent {
  layout = layout;

  startOfWeek = 1;

  @service intl!: IntlService;

  @computed('calendar.locale')
  get weekdaysShort(): string[] {
    const { intl } = this;
    const prefix = 'calendar.days.short';

    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      .map(k => intl.t(`${prefix}.${k}`));
  }

  @alias('weekdaysShort') weekdaysMin!: string[];

  @computed('calendar.locale')
  get weekdays(): string[] {
    const { intl } = this;
    const prefix = 'calendar.days.long';

    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      .map(k => intl.t(`${prefix}.${k}`));
  }
}
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
