// lookup table for faster conversion
// power-calendar format -> date-fns format (see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)
const knownFormats = {
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMMM YYYY': 'MMMM yyyy',
  'MMMM': 'MMMM',
  'YYYY': 'yyyy'
};

export function normalizeDateFormat(formatString) {
  if (knownFormats[formatString]) return knownFormats[formatString];

  // In other cases, we just pass the format as we don't know if the developer used the unicode tokens or not.
  // This might be misleading but we can't transform them by default to avoid breaking developer intentions.
  return formatString;
}
