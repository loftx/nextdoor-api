module.exports = class NextdoorApi {

  constructor(bearerToken, idToken) {
    this.nextdoorApiUrl = 'https://api.uk.nextdoor.com/api/gql/';

    const requiredOptions = ['BearerToken', 'IdToken'];

    // Set suitable user agent to allow access as nextdoor block others
    this.axiosOptions = {
      headers: {
        'User-Agent': 'Nextdoor/6.2.2 (iPad; iPadOS 15.5; v1; 382532; production build) Apple; iPad12,1; ; ',
        'x-nd-id-token': idToken,
        'Authorization': 'Bearer ' + bearerToken,
      }
    };
  }
  
  async getPersonalizedFeed(sessionId, account, loanId) {

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
    }

    const response = await axios.post(this.nextdoorApiUrl + 'PersonalizedFeed', data, this.axiosOptions);

    return response.data;

  }
  
}