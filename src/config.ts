import type { TwitterApiTokens } from "twitter-api-v2";

export const twitterApiConfig: TwitterApiTokens = (() => {
	const appKey = process.env.X_API_KEY;
	const appSecret = process.env.X_API_SECRET;
	const accessToken = process.env.X_ACCESS_TOKEN;
	const accessSecret = process.env.X_ACCESS_SECRET;
	if (!appKey || !appSecret || !accessToken || !accessSecret) {
		throw new Error("環境変数に不備があります");
	}

	return { appKey, appSecret, accessToken, accessSecret };
})();
