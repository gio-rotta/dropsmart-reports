
'use strict'

const jwt = require('jsonwebtoken');

const MercadoPagoLib = require('../../lib/MercadoPago');
const UserLib = require('../../lib/ReportUser');
const config = require('config').server.jwt;

const BASE_URL = '/api/reportuser';

module.exports = (router) => {
  router.get(`${BASE_URL}/signup`, async (ctx) => {
    try {
      const { name, email, shop, phone, mercadoPagoAccessToken, accountId } = ctx.request.query;

      if (!name || !email || !shop || !phone || !mercadoPagoAccessToken || !accountId) {
        ctx.throw(500, 'Missing parameters');
        return;
      }

      const mercadopago = new MercadoPagoLib(mercadoPagoAccessToken, shop);
      
      const report = await mercadopago.getReportConfig();
      
      if (report.include_withdraw) {
        await mercadopago.setReportConfig();
        await mercadopago.updateReportConfig();
        await mercadopago.autoGenerateReport();
      }

      await mercadopago.generateReport();

      const userToken = await new UserLib({name, email, shop, phone, mercadoPagoAccessToken, accountId}).storeUser();
      ctx.session.userToken = userToken;
      ctx.redirect('/api/facebook/login') // redirect to another page
      ctx.body = {
        token: userToken
      };

    } catch (err) {
      ctx.throw(500, err);
    }
  });

  router.get(`${BASE_URL}/login`, async (ctx) => {
    try {
      const { token } = ctx.request.query;
      let decoded;
      try {
        decoded = jwt.verify(token, config.secret);
      } catch(err) {
        ctx.status = 401;
        ctx.throw(401, 'Invalid request');
      }

      const { shop } = decoded;

      // check if a user exists
      const user = await new UserLib().getUserByShop(shop);

      if (!user) {
        ctx.status = 401;
        ctx.throw(401, 'Invalid request');
      } else {
        ctx.status = 200;
        ctx.throw(200, 'Token is valid');
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });
};

//http://localhost:8000/api/reportuser/signup?name=dropsmart&email=gerenciamento@dropsmart.com.br&shop=dropsmart-oficial.myshopify.com&phone=4899817803&mercadoPagoAccessToken=TEST-5086945385345978-071913-131ff992b357d63b93dc032e4c74a5ab-433196903