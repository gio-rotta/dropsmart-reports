
'use strict';

const config = require('config').server.jwt;
const jwt = require('jsonwebtoken');

async function create({ shop }) {
  return jwt.sign({ shop }, config.secret, {
    audience: 'dropsmart-report',
    expiresIn: config.expiresIn,
    issuer: 'dropsmart-report',
    subject: shop,
  });
}

async function validate(token) {
  return jwt.verify(token, config.secret, {
    audience: 'dropsmart-report',
    issuer: 'dropsmart-report',
    maxAge: config.expiresIn,
  });
}

module.exports = {
  create,
  validate,
};
