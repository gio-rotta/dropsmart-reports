const https = require('https');
const request = require('request-promise');
const csv = require('csvtojson')

const model = require('../models/MercadoPagoReport');

class MercadoPago {

  constructor(access_token, shop) {
    this.access_token = access_token;
    this.shop = shop;
    this.headers = {};
    if (access_token) {
      this.headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      };
    }
  }

  getReport(fileName) {
    try {
      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/'+fileName+'?access_token='+this.access_token,
      };

      return request.get(optionsObject)
       .then(function (parsedBody) {
          console.log('Report received');
          return csv()
          .fromString(parsedBody)
          .then((jsonObj)=> {
            return jsonObj;
          })
        })
        .catch(function (err) {
          console.log(err, 'Error during report receiving');
        });
    } catch(err) {
      console.log(err);
    }
  }

  getLastReportName() {
    try {
      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/list?access_token='+this.access_token
      };

      return request.get(optionsObject)
       .then(function (parsedBody) {
          console.log('Get Report Config Name', parsedBody[0].file_name);
          return parsedBody[0].file_name;
        })
        .catch(function (err) {
          console.log(err, 'Error during get last report name');
        });
    } catch(err) {
      console.log(err);
    }
  }

  generateReport(endDate, beginDate) {
    try {
      const end_date = endDate || new Date().toISOString().split('.')[0]+"Z";
      var begin_date;

      if (!beginDate) { 
        begin_date = new Date();
        begin_date.setMonth(begin_date.getMonth()-1);
        begin_date = begin_date.toISOString().split('.')[0]+"Z";
      } else {
        begin_date = beginDate;
      }
      
      const dataString = { "begin_date": begin_date, "end_date": end_date };

      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "body": dataString,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/?access_token='+this.access_token,
      };

      return request.post(optionsObject)
       .then(function (parsedBody) {
          console.log('Report request generation');
          return parsedBody;
        })
        .catch(function (err) {
          console.log('Error during report request');
        });
    } catch(err) {
      console.log(err);
    }
  }

  autoGenerateReport() {
    try {
      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/schedule?access_token='+this.access_token,
      };

      return request.get(optionsObject)
       .then(function (parsedBody) {
          console.log('Report auto generated started');
          return parsedBody;
        })
        .catch(function (err) {
          console.log('Error during auto generated');
        });
    } catch(err) {
      console.log(err);
    }
  }

  setReportConfig() {
    try {
      var dataString = {
        "file_name_prefix": "bank-report-"+this.shop,
        "include_withdraw": true,
        "coupon_detailed": false,
        "detailed": true,
        "extended": true,
        "frequency": {
          "hour": 0,
          "type": "monthly",
          "value": 1
        }
      };

      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/config?access_token='+this.access_token,
        "body": dataString
      };

      return request.post(optionsObject)
       .then(function (parsedBody) {
          console.log('Set Report Config');
          return parsedBody;
        })
        .catch(function (err) {
          console.log('Error during setting report config');
        });
    } catch(err) {
      console.log(err);
    }
  }

  updateReportConfig() {
    try {
      var dataString = {
        "file_name_prefix": "bank-report-"+this.shop,
        "include_withdraw": true,
        "coupon_detailed": false,
        "detailed": true,
        "extended": true,
        "frequency": {
          "hour": 0,
          "type": "daily",
          "value": 1
        }
      };

      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/config?access_token='+this.access_token,
        "body": dataString
      };

      return request.put(optionsObject)
       .then(function (parsedBody) {
          console.log('Update Report Config');
          return parsedBody;
        })
        .catch(function (err) {
          console.log('Error during update report');
        });
    } catch(err) {
      console.log(err);
    }
  }

  getReportConfig() {
    try {
      const optionsObject = {
        "headers": this.headers,
        "json": true,
        "url": 'https://api.mercadopago.com/v1/account/settlement_report/config?access_token='+this.access_token,
      };

      return request.get(optionsObject)
       .then(function (parsedBody) {
          console.log('Get Report Config');
          return parsedBody;
        })
        .catch(function (err) {
          console.log('Error during get report config');
        });
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = MercadoPago;
