const https = require('https');
const request = require('request');

const Report = require('../models/MercadoPagoReport');

class MercadoPagoReport {

  constructor(reportData) {
    this.reportData = reportData;
  }

  verifyReport(date, shop) {
    return Report.findOne({ 'date': date, 'shop': shop }).then(result => result)
    .catch(err => false);
  }

  getReportByDate(date, shop) {
    return Report.findOne({ 'date': date, 'shop': shop }).then(result => result)
    .catch(err => false);
  }

  updateReport(shop, report) {
    return Report.findOneAndUpdate({ 'date': report.date, 'shop': shop }, report, {upsert: false}).then(result => {
      console.log(`Successfully updated report.`);
    })
    .catch(err => {
      console.error(`Failed to update a report: ${err}`);
      return false;
    });
  }

  createReport(report) {
    return Report.create(report).then(result => {
      console.log(`Successfully created report.`);
    })
    .catch(err => {
      console.error(`Failed to create a user: ${err}`)
      return false;
    });
  }

  async storeReport() {
    try {
      const { shop, date } = this.reportData;
      const reportExist = await this.getReportByDate(date, shop);
      if (reportExist) {
        return await this.updateReport(shop, this.reportData);
      } else {
        return await this.createReport(this.reportData);
      }
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = MercadoPagoReport;
