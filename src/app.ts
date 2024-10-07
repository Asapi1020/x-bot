import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
	appKey: process.env.X_API_KEY!,
	appSecret: process.env.X_API_SECRET!,
	accessToken: process.env.X_ACCESS_TOKEN!,
	accessSecret: process.env.X_ACCESS_SECRET!,
});

const tweetContent = 'Hello, this is a test tweet! #HelloWorld';

// Post a tweet
const postTweet = async () => {
  try {
    const tweet = await client.v2.tweet(tweetContent);
    console.log('Tweet posted:', tweet);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
};

postTweet();
