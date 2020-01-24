
'use strict'

const jwt = require('jsonwebtoken');
const mpModel = require('../../lib/MercadoPagoReport');
const fbAdsModel = require('../../lib/FacebookAdsReport');

const MercadoPagoLib = require('../../lib/MercadoPago');
const FacebookAdsLib = require('../../lib/FacebookAds');
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
      
      if (report && report.include_withdraw) {
        await mercadopago.updateReportConfig();
      } else {
        await mercadopago.setReportConfig(); 
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
        var d = new Date();     
        var date = d.getUTCDate();
        var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
        var year = d.getUTCFullYear();
        var formatData = date + "/" + month + "/" + year;

        //Mercado Pago
        const mercadopago = new MercadoPagoLib(user.mercadoPagoAccessToken, user.shop);
        const fileName = await mercadopago.getLastReportName();
        const mpReport = await mercadopago.getReport(fileName);
        try {
          const mercadoPago = await new mpModel({date: formatData , shop, report: mpReport}).storeReport();
        } catch(err) {
          console.log(err);
        }

        //FaceInsights
        const faceInsight = new FacebookAdsLib(user.faceAdsAccessToken, user.accountId);
        const fbReport = await faceInsight.getReport();
        try {
          const facebookAds = await new fbAdsModel({date: formatData , shop, report: fbReport}).storeReport();
        } catch(err) {
          console.log(err);
        }

        ctx.body = {
          facebookAds: fbReport,
          mercadoPago: mpReport
        }
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });
};

//http://localhost:8000/api/reportuser/signup?name=dropsmart&email=gerenciamento@dropsmart.com.br&shop=dropsmart-oficial.myshopify.com&phone=4899817803&mercadoPagoAccessToken=TEST-5086945385345978-071913-131ff992b357d63b93dc032e4c74a5ab-433196903
