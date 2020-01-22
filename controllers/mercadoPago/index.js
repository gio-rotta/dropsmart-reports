
'use strict';

const MercadoPagoLib = require('../../lib/MercadoPago');
const auth = require('../../middleware/auth');

const BASE_URL = '/api/mercadopago';

module.exports = (router) => {
  router.post(`${BASE_URL}/setReportConfig`, auth, async (ctx) => {
    try {
      const mercadopago = new MercadoPagoLib(ctx.request.body.mercadoPagoAccessToken, ctx.request.body.shop);
      
      const report = await mercadopago.getReportConfig();
      
      if (report.include_withdraw) {
        await mercadopago.setReportConfig();
        await mercadopago.updateReportConfig();
        await mercadopago.autoGenerateReport();
      }
      
      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });

  router.post(`${BASE_URL}/generateReport`, auth, async (ctx) => {
    try {
      const mercadopago = new MercadoPagoLib(ctx.request.body.mercadoPagoAccessToken, ctx.request.body.shop);
      const {endDate, beginDate} = ctx.request.body;
      await mercadopago.generateReport(endDate, beginDate);
      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });

  router.post(`${BASE_URL}/getReport`, auth, async (ctx) => {
    try {
      const mercadopago = new MercadoPagoLib(ctx.request.body.mercadoPagoAccessToken, ctx.request.body.shop);
      const fileName = await mercadopago.getLastReportName();
      const result = await mercadopago.getReport(fileName);
      ctx.body = {
        result: result
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });

  router.post(`${BASE_URL}/getReportConfig`, auth, async (ctx) => {
    try {
      const mercadopago = new MercadoPagoLib(ctx.request.body.mercadoPagoAccessToken, ctx.request.body.shop);
      const result = await mercadopago.getReportConfig();
      ctx.body = {
        result: result
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  });
};

