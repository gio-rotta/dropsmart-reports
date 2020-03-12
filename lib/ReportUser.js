const https = require('https');
const request = require('request');
const tokenizer = require('./Tokenizer');

const User = require('../models/ReportUser');

class UserLib {

  constructor(userData) {
    this.userData = userData;
  }

  verifyUser(email) {
    return User.findOne({ 'email': email }).then(result => result)
    .catch(err => false);
  }

  getUserById(id) {
    return User.findById(id).then(result => result)
    .catch(err => false);
  }

  getUserByShop(shop) {
    return User.findOne({ 'shop': shop }).then(result => result)
    .catch(err => false);
  }

  updateUser(shop, userData) {
    return User.findOneAndUpdate({ 'shop': shop }, userData, {upsert: false}).then(result => {
      console.log(`Successfully updated user.`);
       return tokenizer.create({ shop: result.shop });
    })
    .catch(err => {
      console.error(`Failed to update a user: ${err}`);
      return false;
    });
  }

  createUser(userData) {
    const token = tokenizer.create({ shop: userData.shop });
    return User.create({...userData, token}).then(result => {
      console.log(`Successfully created user.`);
      return token;
    })
    .catch(err => {
      console.error(`Failed to create a user: ${err}`)
      return false;
    });
  }

  async storeUser() {
    try {
      const { shop } = this.userData;
      const userExist = await this.getUserByShop(shop);
      if (userExist) {
        return await this.updateUser(shop, this.userData);
      } else {
        return await this.createUser(this.userData);
      }
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = UserLib;
