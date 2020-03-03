
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
      uri: 'mongodb://heroku_whmrx1z4:9gsqkhhps9aq3p31jlu6ub2cln@ds223379-a0.mlab.com:23379,ds223379-a1.mlab.com:23379/heroku_whmrx1z4?replicaSet=rs-ds223379&retryWrites=false'
    },
    facebook: {
      secret: '3f19a398f049644fcc5fd1e8fc0889ce',
      accountId: process.env.ACCOUNTID,
      appId: process.env.APPID,
      appSecret: process.env.APPSECRET,
      callbackUrl: process.env.CALLBACKURL,
    },
    jwt: {
      secret: '9999u014MD8ePQ6gvEtJ1hUU2usc0GAt186vKziuEQuRbRmkZUp0KSFeuvNe3',
      expiresIn: '9999 days',
    },
    bcrypt: {
      saltRounds: 5,
    },
  },
};
