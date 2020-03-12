'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportUserSchema = new Schema({
  email: String,
  name: String,
  shop: { type: String, unique: true },
  phone: String,
  dropsmartId: String,
  mercadoPagoAccessToken: String,
  faceAdsAccessToken: String,
  token: String,
  accountId: String,
  adAccountId: String
});

module.exports = mongoose.model('reportUser', ReportUserSchema);
