/*eslint no-console: ["error", { allow: ["debug"] }] */
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import addWeeks from "date-fns/addWeeks";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import endOfDay from "date-fns/endOfDay";
import endOfISOWeek from "date-fns/endOfISOWeek";
import endOfMonth from "date-fns/endOfMonth";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import getISODay from "date-fns/getISODay";
import isSameDay from "date-fns/isSameDay";
import startOfDay from "date-fns/startOfDay";
import startOfISOWeek from "date-fns/startOfISOWeek";
import startOfMonth from "date-fns/startOfMonth";
import _isAfter from "date-fns/isAfter";
import _isBefore from "date-fns/isBefore";
import _startOfWeek from "date-fns/startOfWeek";
import {DEBUG} from '@glimmer/env';
import {normalizeDateFormat} from "./format-util";

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

export function formatDate(date, dateFormat) {
  const normalizedFormat = normalizeDateFormat(dateFormat);
  return format(date, normalizedFormat, {
    useAdditionalDayOfYearTokens: false,
    useAdditionalWeekYearTokens: false
  });
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
  return fn(locale);
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

export function localeStartOfWeek() {
  if (DEBUG) {
    console.debug("Can't detect start of week automatically. Please configure `startOfWeek` in `calendar.days`. See https://ember-power-calendar.com/docs/the-days");
  }
  return 0;
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
