
'use strict';

const Passport = require('../../lib/Passport');

const FacebookAdsLib = require('../../lib/FacebookAds');

const auth = require('../../middleware/auth');

const BASE_URL = '/api/facebook';

const { validate } = require('../../lib/Tokenizer');
const UserLib = require('../../lib/ReportUser');

module.exports = (router) => {

  router.post(`${BASE_URL}`, auth, async (ctx) => {
    try {
      const faceInsight = new FacebookAdsLib(ctx.request.body.faceAdsAccessToken, ctx.request.body.accountId);
      const report = await faceInsight.getReport();
      const reducer = (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue);
      ctx.body = {
        success: true,
        data: report,
        total: report.map(item => item.spend).reduce(reducer)
      };
    } catch (err) {
      console.log(err);
    }
  });

  router.get(`${BASE_URL}/login`, Passport.authenticate('facebook', {
    scope: [
      'public_profile',
      'email',
      'ads_read',
      'read_insights'
    ],
  }));

  router.get(`${BASE_URL}/callback`, Passport.authenticate('facebook', {
    successRedirect : `${BASE_URL}/success`,
    failureRedirect : `${BASE_URL}/failure`,
  }));

  router.get(`${BASE_URL}/success`, async (ctx) => {
    const token = await validate(ctx.session.userToken);
    console.log(token.shop);
    const user = await new UserLib({shop: token.shop}).updateUser(token.shop, {faceAdsAccessToken: ctx.session.passport.user});
    ctx.body = {
      status: 'success',
      data: ctx.session.userToken
    };
  });

  router.get(`${BASE_URL}/failure`, function *(next) {
    this.body = {
      status: 'failure',
      message: 'Por favor aceite a permissão do facebook'
    };
  });
};
