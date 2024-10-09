import {
	EUploadMimeType,
	type SendTweetV2Params,
	type TUploadableMedia,
	type TweetV2PostTweetResult,
	TwitterApi,
	type TwitterApiTokens,
} from "twitter-api-v2";

export class TwitterApiClient {
	private client: TwitterApi;
	constructor(twitterApiConfig: TwitterApiTokens) {
		this.client = new TwitterApi(twitterApiConfig);
	}

	public async postTweet(
		params: SendTweetV2Params,
	): Promise<TweetV2PostTweetResult | null> {
		try {
			const tweet = await this.client.v2.tweet(params);
			console.log("Tweet posted:", tweet);
			return tweet;
		} catch (error) {
			console.error("Error posting tweet:", error);
			return null;
		}
	}

	public async uploadVideo(buffer: TUploadableMedia): Promise<string | null> {
		try {
			const mediaId = await this.client.v1.uploadMedia(buffer, {
				mimeType: EUploadMimeType.Mp4,
			});
			console.log("Uploaded video:", mediaId);
			return mediaId;
		} catch (error) {
			console.error("Error uploading video:", error);
			return null;
		}
	}
}
