module.exports = class NextdoorApi {

  constructor(csrfToken, idToken, atToken) {
    this.nextdoorApiUrl = 'https://api.uk.nextdoor.com/api/gql/';

    this.csrfToken = csrfToken;
    this.idToken = idToken;
    this.atToken = atToken;

  }

  async getPersonalizedFeed() {

    const axios = require('axios');

    var data = {
      "operationName": "PersonalizedFeed",
      "variables": {
        "pagedCommentsMode": "FEED",
        "facepileArgs": {
            "variant": "TRIMMED"
        },
        "mainFeedArgs": {
            "pageSize": 3,
            "nextPage": null,
            "supportedFeatures": {
                "rollupTypes": [
                    "CAROUSEL",
                    "LIST"
                ],
                "rollupItemTypes": [
                    "IMAGE_CARD",
                    "LIST_CARD"
                ],
                "isNMARollupEnabled": true
            },
            "feedRequestId": "317DC102-E5BF-45CC-A46F-F16C1839D361"
        },
        "timeZone": "Europe/London",
        "nuxStates": [
            "GOOD_NEIGHBOR_PLEDGE",
            "PHONE_NUMBER_NUDGE"
        ]
    },
      "query": `
      
      fragment feedItemPostFragment on FeedItemPost {
        post {
          subject
          body
          photos {
            url
            __typename
          }
          links {
            url
            __typename
          }
          comments (mode: DETAILS) {
            pagedComments {
              edges {
                node {
                  comment {
                    id,
                    body
                  }
                }
              }
            }
            totalCommentCount
          }
        }
      }
      
      query PersonalizedFeed($mainFeedArgs: MainFeedArgs!) {
        me {
          personalizedFeed(mainFeedArgs: $mainFeedArgs) {
            feedItems {
              feedItemType
              legacyAnalyticsId
              trackingId
              contentId
              contentType
              ...feedItemPostFragment
            }
          }
        }
      }
      `
    };

    const cookies = {
      'csrftoken': this.csrfToken,
      'ndbr_idt': this.idToken,
      'ndbr_at': this.atToken
    }

    const cookieHeader = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
 
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: this.nextdoorApiUrl + 'PersonalizedFeed?',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0', 
        'Referer': 'https://nextdoor.co.uk/news_feed/', 
        'content-type': 'application/json', 
        'x-csrftoken': this.csrfToken, 
        'Cookie': cookieHeader, 
      },
      data : data
    };

    const response = await axios.request(config);

    return response.data;

  }
  
}
