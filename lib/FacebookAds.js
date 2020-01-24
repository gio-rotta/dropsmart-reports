const bizSdk = require('facebook-nodejs-business-sdk');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

class FacebookAds {

  constructor(access_token, accountId) {
    this.access_token = access_token;
    this.accountId = "act_"+accountId;

    this.api = bizSdk.FacebookAdsApi.init(access_token);
    this.AdAccount = bizSdk.AdAccount;
    this.Campaign = bizSdk.Campaign;
    this.account = new this.AdAccount(this.accountId);
  }

  getReport() {
    try {
      const insightsFields = ['spend']
      const insightsParams = { date_preset: bizSdk.Campaign.DatePreset.last_30d }
      return this.account.read().then((account) => {
        account.getInsights(insightsFields, insightsParams)
          .then((actInsights) => {
            console.log(actInsights);
            return actInsights;
          })
          .catch(console.error)
        return account.getCampaigns([''], { limit: 55 }) // fields array and params
      })
      .then((result) => {
        const campaigns = result
        const campaign_ids = campaigns.map((campaign) => campaign.id)
        const campaignInsightsParams = Object.assign({
          level: 'campaign',
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
