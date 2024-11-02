import { TwitterApi } from "twitter-api-v2";

const appKey = process.env.X_API_KEY;
const appSecret = process.env.X_API_SECRET;
const accessToken = process.env.X_ACCESS_TOKEN;
const accessSecret = process.env.X_ACCESS_SECRET;
if (!appKey || !appSecret || !accessToken || !accessSecret) {
	throw new Error("環境変数に不備があります");
}

const client = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });

const tweetContent = "Hello, this is a test tweet! #HelloWorld";

// Post a tweet
const postTweet = async () => {
	try {
		const tweet = await client.v2.tweet(tweetContent);
		console.log("Tweet posted:", tweet);
	} catch (error) {
		console.error("Error posting tweet:", error);
	}
};

postTweet();
