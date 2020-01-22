
'use strict';

const auth = require('../../middleware/auth');
const mpModel = require('../../lib/MercadoPagoReport');
const fbAdsModel = require('../../lib/FacebookAdsReport');

const MercadoPagoLib = require('../../lib/MercadoPago');
const FacebookAdsLib = require('../../lib/FacebookAds');

const BASE_URL = '';

module.exports = (router) => {
  router.get(`${BASE_URL}`, async (ctx) => {
    try {
      ctx.body = {
        success: true
      };
    } catch (err) {
      console.log(err);
    }
  });

  router.post(`${BASE_URL}/api/report`, auth, async (ctx) => {
    try {
      var d = new Date();     
      var date = d.getUTCDate();
      var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
      var year = d.getUTCFullYear();
      var formatData = date + "/" + month + "/" + year;
      
      //Mercado Pago
      const shop = ctx.request.body.shop;
      const mercadopago = new MercadoPagoLib(ctx.request.body.mercadoPagoAccessToken, ctx.request.body.shop);
      const fileName = await mercadopago.getLastReportName();
      const mpReport = await mercadopago.getReport(fileName);
      const mercadoPago = await new mpModel({date: formatData , shop, report: mpReport}).storeReport();

      //FaceInsights
      const faceInsight = new FacebookAdsLib(ctx.request.body.faceAdsAccessToken, ctx.request.body.accountId);
      const fbReport = await faceInsight.getReport();
      const reducer = (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue);
      const facebookAds = await new fbAdsModel({date: formatData , shop, report: fbReport}).storeReport();

      ctx.body = {
        facebookAds: fbReport,
        mercadoPago: mpReport
      }
    } catch (err) {
      console.log(err);
    }
  });
};
