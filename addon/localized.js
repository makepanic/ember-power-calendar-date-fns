import locales from "date-fns/locale";
import {startOfWeek as _startOfWeek, format, getDay} from "date-fns";
import {
  getWeekdaysShort as unlocalizedWeekdaysShort,
  getWeekdaysMin as unlocalizedWeekdaysMin,
  getWeekdays as unlocalizedWeekdays,
  localeStartOfWeek as unlocalizedStartOfWeek,
} from './unlocalized';

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

export function getWeekdaysShort(locale = null){
  if (locale && locales[locale]) {
    const weekdaysShort = [];
    for(let i=0; i<7; i++) {
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
