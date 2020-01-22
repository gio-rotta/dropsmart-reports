
'use strict';

const config = require('config').server;
const indexRoutes = require('./controllers/index');
const Router = require('koa-router');
const session = require("koa-session2");
const Passport = require('./lib/Passport');
const db = require('./db');
const Koa = require('koa'),
  app = new Koa();

const dotenv = require('dotenv').config();

app.use(require('koa-response-time')());
app.use(require('koa-bodyparser')());

app.use(session({
  key: "SESSIONID"
}));

app.use(Passport.initialize());
app.use(Passport.session());

app.use(indexRoutes.routes());

const server = require('http').createServer(app.callback());

const start = new Promise((resolve) => {
  server.listen(config.port, resolve);
  console.log('Listen on port '+config.port);
})

process.once('SIGTERM', stop);


function stop(sig) {
  server.close(err => process.exit(err ? 1 : 0));
}

module.exports = {
  app,
  start,
  server,
};
