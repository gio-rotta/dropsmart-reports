'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MercadoPagoSchema = new Schema({
  shop: String,
  report: Schema.Types.Mixed,
  date: { type: String, unique: true },
});

module.exports = mongoose.model('mercadoPagoReport', MercadoPagoSchema);
