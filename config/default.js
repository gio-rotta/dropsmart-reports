
'use strict';

const dotenv = require('dotenv').config();

module.exports = {
  server: {
    name: 'dropsmart-reports',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 8000,
    timezone: 'America/Sao_Paulo',
    db: {
      uri: 'mongodb://heroku_470l5p0n:g8afr7c31a8oci4dei1cphce7l@ds337418.mlab.com:37418/heroku_470l5p0n'
    },
    facebook: {
      secret: '3f19a398f049644fcc5fd1e8fc0889ce',
      accountId: process.env.ACCOUNTID,
      appId: process.env.APPID,
      appSecret: process.env.APPSECRET,
      callbackUrl: process.env.CALLBACKURL,
    },
    jwt: {
      secret: '3zzu014MD8ePQ6gvEtJ1hUU2usc0GAt186vKziuEQuRbRmkZUp0KSFeuvNee',
      expiresIn: '9999 days',
    },
    bcrypt: {
      saltRounds: 5,
    },
  },
};
