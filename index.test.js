const nextdoorApi = require('./index');

describe('index.js', () => {
  test('Check getPersonalizedFeed', async () => {

    const nextdoor = new nextdoorApi(
      process.env.NEXTDOOR_CSFR_TOKEN,
      process.env.NEXTDOOR_ID_TOKEN,
      process.env.NEXTDOOR_AT_TOKEN
    );

    const result = await nextdoor.getPersonalizedFeed();

    console.log(result);

    expect(result).toHaveProperty('data');
    expect(result.data).toHaveProperty('me');
    expect(result.data.me).toHaveProperty('personalizedFeed');
    expect(result.data.me.personalizedFeed).toHaveProperty('feedItems');

    console.log(result.data.me.personalizedFeed.feedItems);

  });
});