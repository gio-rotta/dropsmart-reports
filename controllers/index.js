
'use strict';

const fs = require('fs');
const path = require('path');

const Router = require('koa-router');
const session = require("koa-session2");

const router = new Router();

(function init() {
  readFolders().forEach(loadRoute);
}());

function readFolders(root = __dirname) {
  return fs
    .readdirSync(root)
    .map(dir => path.join(root, dir))
    .filter(dir => fs.statSync(dir).isDirectory());
}

function loadRoute(dir) {
  searchFiles(dir, 'index.js')
    .forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require
      require(file)(router);
    });
}

function searchFiles(dir, pattern) {
  return fs
    .readdirSync(dir)
    .filter(file => file.indexOf(pattern) !== -1)
    .map(file => path.join(dir, file));
}

module.exports = router;
