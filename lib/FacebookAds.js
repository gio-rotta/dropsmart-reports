const bizSdk = require('facebook-nodejs-business-sdk');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const { formatDate } = require('./Utils');

class FacebookAds {

  constructor(access_token, accountId, adAccountId) {
    this.access_token = access_token;
    this.accountId = adAccountId ? "act_"+ adAccountId : "act_" + accountId;
    this.api = bizSdk.FacebookAdsApi.init(access_token);
    this.AdAccount = bizSdk.AdAccount;
    this.Campaign = bizSdk.Campaign;
    this.account = new this.AdAccount(this.accountId);
  }

  getReport(created_from, created_to) {
    try {
      created_from = (!created_from) ? new Date("2016-05-18T16:00:00Z") : new Date(created_from);
      created_to = (!created_to) ? new Date() : new Date(created_to);

      const insightsFields = ['spend']
      const insightsParams = { 
        time_increment: '1',
        time_range: {'since': formatDate(created_from), 'until': formatDate(created_to) }
      }

      return this.account.read().then((account) => {
        account.getInsights(insightsFields, insightsParams)
          .then((actInsights) => {
            return actInsights;
          })
          .catch(console.error)
        return account.getCampaigns([''], { limit: 999 }) // fields array and params
      })
      .then((result) => {
        const campaigns = result
        const campaign_ids = campaigns.map((campaign) => campaign.id)
        const campaignInsightsParams = Object.assign({
          level: 'campaign',
          limit: 999,
          filtering: [{ field: 'campaign.id', operator: 'IN', value: campaign_ids }]
        }, insightsParams)
        const campaigsInsightsFields = insightsFields.concat('campaign_id')
        return this.account.getInsights(campaigsInsightsFields, campaignInsightsParams)
      })
      .then((insights) => {
        return insights.map((insight) => {
          return insight._data;
        });
      })
      .catch(console.error);
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = FacebookAds;
