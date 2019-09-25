'use strict';

const optionsField = 'ember-power-calendar-date-fns';
const defaultOptions = {
  includeLocales: true,
};

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

    const Funnel = require('broccoli-funnel');

    let namespacedTree = new Funnel(tree, {
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
