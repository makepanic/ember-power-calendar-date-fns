'use strict';

const Funnel = require('broccoli-funnel');
const Replace = require('broccoli-string-replace');

const optionsField = 'ember-power-calendar-date-fns';
const defaultOptions = {
  includeLocales: true,
};

function localeVarName(locale) {
  return locale.replace(/-/g, '_');
}

function buildLocaleImport(includeLocales) {
  // include only configured locales
  if (Array.isArray(includeLocales)) {
    // build locale variable name pairs: Array<[string, string]>
    const localePairs = includeLocales.map(locale => [locale, localeVarName(locale)]);
    // build imports list
    const localeImports = localePairs.map(([locale, varName]) => `import ${varName} from "date-fns/locale/${locale}";`);
    // create locale lookup table that is later used: locales = {'en-GB': enGB, 'de': de}
    const localesAlias = localePairs.map(([locale, varName]) => {
      return `"${locale}": ${varName},`;
    });

    return `
${localeImports.join('\n')}
const locales = { ${localesAlias.join('\n')} };`;
  } else {
    // include all locales
    return 'import locales from "date-fns/locale";';
  }
}

module.exports = {
  name: require('./package').name,

  /**
   * This method tries to rename the import path of the addon from
   * `ember-power-calendar-date-fns` to `ember-power-calendar-util`.
   * This "agnostic" import path should make easy to swap this addon
   * by another one that exposes the same API from the same import path.
   */
  treeForAddon(tree) {
    const options = (this.parent && this.parent.options) || (this.app && this.app.options) || {};
    const addonOptions = options[optionsField] || {};
    const {includeLocales} = {
      ...defaultOptions,
      ...addonOptions,
    };

    const localeModuledTree = Replace(tree, {
      files: ['localized.js'],
      pattern: {
        match: /\/\/ DATE_FNS_LOCALE_START.*DATE_FNS_LOCALE_END/gs,
        replacement: buildLocaleImport(includeLocales),
      }
    });

    let namespacedTree = new Funnel(localeModuledTree, {
      srcDir: '/',
      destDir: `/ember-power-calendar-utils`,
      annotation: `Addon#treeForVendor (${this.name})`,
      getDestinationPath(relativePath) {
        // if we include locales, handle localized.js as index file, else unlocalized
        if (includeLocales) {
          if (relativePath === 'localized.js') {
            return 'index.js';
          }
        } else {
          if (relativePath === 'unlocalized.js') {
            return 'index.js';
          }
        }

        return relativePath;
      },
      exclude: [function (file) {
        // we exclude localized.js if we don't want to include locale
        if (file === 'localized.js' && !includeLocales) {
          return true;
        }
        return false;
      }]
    });

    return this.preprocessJs(namespacedTree, '/', 'ember-power-calendar-utils', {
      registry: this.registry
    });
  }
};
