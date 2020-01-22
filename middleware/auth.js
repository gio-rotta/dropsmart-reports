
'use strict';

const jwt = require('jsonwebtoken');
const UserLib = require('../lib/ReportUser');
const config = require('config').server.jwt;

/**
 *  The Auth Checker middleware function.
 */
module.exports = async function validate(ctx, next) {
  if (!ctx.headers.authorization) {
    ctx.status = 401;
    ctx.throw(401, 'Invalid signup request');
  }
  let token;
  // get the last part from a authorization header string like "bearer token-value"
  token = ctx.headers.authorization.match(/Bearer\s(\S+)/) ?
   ctx.headers.authorization.match(/Bearer\s(\S+)/)[1] : ctx.headers.authorization;

  // decode the token using a secret key-phrase
  const decoded = jwt.verify(token, config.secret);
  const { shop } = decoded;

  // check if a user exists
  const user = await new UserLib().getUserByShop(shop);

  if (!user) {
    ctx.status = 401;
    ctx.throw(401, 'Invalid signup request');
  } else {
    if (ctx.request.body) {
      ctx.request.body.shop = shop;
      ctx.request.body.mercadoPagoAccessToken = user.mercadoPagoAccessToken;
      ctx.request.body.faceAdsAccessToken = user.faceAdsAccessToken;
      ctx.request.body.accountId = user.accountId;
    }
    return next();
  }
};
