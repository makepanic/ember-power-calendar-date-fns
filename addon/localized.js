// DATE_FNS_LOCALE_START
// Please don't remove the comments. We want the user to configure which date-fns/locale it wants.
import locales from "date-fns/locale";
// DATE_FNS_LOCALE_END

import _startOfWeek from "date-fns/startOfWeek";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import {
  getWeekdaysShort as unlocalizedWeekdaysShort,
  getWeekdaysMin as unlocalizedWeekdaysMin,
  getWeekdays as unlocalizedWeekdays,
  localeStartOfWeek as unlocalizedStartOfWeek,
} from './unlocalized';
import {normalizeDateFormat} from "./format-util";
export {
  add,
  startOf,
  endOf,
  weekday,
  isAfter,
  isBefore,
  isSame,
  diff,
  normalizeDate,
  normalizeRangeActionValue,
  normalizeMultipleActionValue,
  normalizeCalendarDay,
  normalizeCalendarValue,
  normalizeDuration,
  getDefaultLocale,
  withLocale,
  isBetween,
  isoWeekday,
  startOfWeek,
  endOfWeek
} from './unlocalized';

export function formatDate(date, dateFormat, locale = null) {
  /* date-fns now uses [Unicode Tokens]{@link https://date-fns.org/v2.2.1/docs/Unicode-Tokens} so the following flags are required:
     - useAdditionalDayOfYearTokens is required to use the YYYY and YY tokens for year
     - useAdditionalWeekYearTokens is required to use the DD and D tokens for day
   */
  const normalizedFormat = normalizeDateFormat(dateFormat);
  if (locale && locales[locale]) {
    return format(date, normalizedFormat, {
      locale: locales[locale],
      useAdditionalDayOfYearTokens: false,
      useAdditionalWeekYearTokens: false
    });
  } else {
    return format(date, normalizedFormat, {
      useAdditionalDayOfYearTokens: false,
      useAdditionalWeekYearTokens: false
    });
  }
}

export function getWeekdaysShort(locale = null) {
  if (locale && locales[locale]) {
    const weekdaysShort = [];
    for (let i = 0; i < 7; i++) {
      weekdaysShort.push(locales[locale].localize.day(i, {
        width: "abbreviated"
      }))
    }

    return weekdaysShort;
  } else {
    return unlocalizedWeekdaysShort();
  }
}


export function getWeekdaysMin(locale = null) {
  if (locale && locales[locale]) {
    const weekdaysMin = [];
    for (let i = 0; i < 7; i++) {
      weekdaysMin.push(locales[locale].localize.day(i, {
        width: "narrow"
      }))
    }
    return weekdaysMin;
  } else {
    return unlocalizedWeekdaysMin();
  }
}

export function getWeekdays(locale = null) {
  if (locale && locales[locale]) {
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
      weekdays.push(locales[locale].localize.day(i, {
        width: "wide"
      }))
    }

    return weekdays;
  } else {
    return unlocalizedWeekdays();
  }
}

export function localeStartOfWeek(locale) {
  if (locale && locales[locale]) {
    return getDay(_startOfWeek(new Date(), {
      locale: locales[locale]
    }));
  } else {
    return unlocalizedStartOfWeek();
  }
}
