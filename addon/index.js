/*eslint no-console: ["error", { allow: ["debug"] }] */
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMilliseconds,
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  format,
  getDay,
  getISODay,
  isAfter as _isAfter,
  isBefore as _isBefore,
  isSameDay,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfWeek as _startOfWeek,
} from 'date-fns';
import locales from 'date-fns/locale';
import {DEBUG} from '@glimmer/env';

function unsupported(method, param, ...args) {
  throw `unsupported parameter: ${method}(${args.join(',')})`;
}

export function add(date, quantity, unit) {
  switch (unit) {
    case "day":
      return addDays(date, quantity);
    case "month":
      return addMonths(date, quantity);
    default:
      throw unsupported('add', ...arguments);
  }
}

export function formatDate(date, dateFormat, locale = null) {

  /* date-fns now uses [Unicode Tokens]{@link https://date-fns.org/v2.2.1/docs/Unicode-Tokens} so the following flags are required:
     - useAdditionalDayOfYearTokens is required to use the YYYY and YY tokens for year
     - useAdditionalWeekYearTokens is required to use the DD and D tokens for day
   */
  if (locale && locales[locale]) {
    return format(date, dateFormat, {
      locale: locales[locale],
      useAdditionalDayOfYearTokens: true,
      useAdditionalWeekYearTokens: true
    });
  } else {
    return format(date, dateFormat, {
      useAdditionalDayOfYearTokens: true,
      useAdditionalWeekYearTokens: true
    });
  }
}

export function startOf(date, unit) {
  switch (unit) {
    case "month":
      return startOfMonth(date);
    case "isoWeek":
      return startOfISOWeek(date);
    case "week":
      return _startOfWeek(date);
    case "day":
      return startOfDay(date);
    default:
      throw unsupported('startOf', ...arguments);
  }
}

export function endOf(date, unit) {
  switch (unit) {
    case "month":
      return endOfMonth(date);
    case "isoWeek":
      return endOfISOWeek(date);
    case "day":
      return endOfDay(date);
    default:
      throw unsupported('endOf', ...arguments);
  }
}

export function weekday(date) {
  return getDay(date);
}

export function isoWeekday(date) {
  return getISODay(date);
}

export function getWeekdaysShort() {
  if (DEBUG) {
    console.debug("Calling `getWeekdaysShort` with ember-power-calendar-date-fns is discouraged as date-fns has no locale detection implemented. " +
      "Please overwrite the power-calendar days component `weekdaysShort` method.");
  }
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export function getWeekdaysMin() {
  if (DEBUG) {
    console.debug("Calling `getWeekdaysMin` with ember-power-calendar-date-fns is discouraged as date-fns has no locale detection implemented. " +
      "Please overwrite the power-calendar days component `weekdaysMin` method.");
  }
  return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
}

export function getWeekdays() {
  if (DEBUG) {
    console.debug("Calling `getWeekdays` with ember-power-calendar-date-fns is discouraged as date-fns has no locale detection implemented. " +
      "Please overwrite the power-calendar days component `weekdays` method.");
  }
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
}

export function isAfter(date1, date2) {
  return _isAfter(date1, date2);
}

export function isBefore(date1, date2) {
  return _isBefore(date1, date2);
}

export function isSame(date1, date2, unit) {
  switch (unit) {
    case "day":
      return isSameDay(date1, date2);
    default:
      throw unsupported('isSame', ...arguments);
  }
}

export function isBetween(date, start, end) {
  // taken from calendar-luxon
  return +start <= +date && +date <= +end;
}

export function diff(date1, date2) {
  return differenceInMilliseconds(date1, date2);
}

export function normalizeDate(date) {
  // as everything is a Date, return it
  return date;
}

export function normalizeRangeActionValue(val) {
  return {
    date: val.date,
    _date: {
      start: val.date.start,
      end: val.date.end
    }
  };
}

export function normalizeMultipleActionValue(val) {
  return {
    date: val.date,
    _date: val.date,
  };
}

export function normalizeCalendarDay(day) {
  day._date = new Date(day.date);
  return day;
}

export function withLocale(locale, fn) {
  return fn();
}

export function normalizeCalendarValue(value) {
  if (value) {
    return {date: value.date, _date: value.date ? value.date : undefined}
  }
  return {date: undefined, _date: undefined};
}

export function normalizeDuration(value) {
  if (value === null) {
    return null;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    let [, quantity, units] = value.match(/(\d+)(.*)/);
    units = units.trim() || "days";

    const quantityNumber = parseInt(quantity, 10);
    const a = new Date();
    let b;

    switch (units) {
      case "days": {
        b = addDays(a, quantityNumber);
        break;
      }
      case "w":
      case "week": {
        b = addWeeks(a, quantityNumber);
        break;
      }
      default:
        unsupported("normalizeDuration", value);
    }

    return diff(a, b);
  }
}

export function getDefaultLocale() {
  if (DEBUG) {
    console.debug("Calling `getDefaultLocale` with ember-power-calendar-date-fns is discouraged as date-fns has no locale detection implemented. " +
      "Please overwrite the power-calendar service and set your own locale");
  }
  return 'en';
}

export function localeStartOfWeek(locale) {
  if (locale && locales[locale]) {
    return getDay(_startOfWeek(new Date(), {
      locale: locales[locale]
    }));
  } else {
    return 0;
  }
}

export function startOfWeek(day, startOfWeek) {
  while (isoWeekday(day) % 7 !== startOfWeek) {
    day = add(day, -1, "day");
  }
  return day;
}

export function endOfWeek(day, startOfWeek) {
  let eow = (startOfWeek + 6) % 7;
  while (isoWeekday(day) % 7 !== eow) {
    day = add(day, 1, "day");
  }
  return day;
}
