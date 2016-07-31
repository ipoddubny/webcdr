'use strict';

const fs = require('fs');

const defaultLang = string => string;
defaultLang.getJSON = () => '{}';

const locales = {
  en: defaultLang,
  en_US: defaultLang
};

function init () {
  let dir = fs.readdirSync(`${__dirname}/../locales`);
  let names = dir
    .filter((name) => name.match(/^[\w_]+\.js$/))
    .map((name) => name.match(/^[\w_]+/)[0]);

  for (let lang of names) {
    let dict = require(`../locales/${lang}`);
    locales[lang] = string => dict[string] || string;
    locales[lang].getJSON = () => JSON.stringify(dict);
  }
}

function supported () {
  return Object.keys(locales);
}

function getTranslator (lang) {
  return locales[lang] || defaultLang;
}

module.exports = {
  init,
  supported,
  getTranslator
};
