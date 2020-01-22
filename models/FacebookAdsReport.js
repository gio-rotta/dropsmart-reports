'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacebookReportSchema = new Schema({
  shop: String,
  report: Schema.Types.Mixed,
  date: { type: String, unique: true },
});

module.exports = mongoose.model('facebookReport', FacebookReportSchema);
