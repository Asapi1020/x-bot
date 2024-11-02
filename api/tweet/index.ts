import type { VercelRequest, VercelResponse } from "@vercel/node";
import { TwitterApiClient } from "../../src/TwitterApiClient";
import { twitterApiConfig } from "../../src/config";
import { streamToBuffer } from "../../src/streamHelper";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === "POST") {
		const authHeader = req.headers.authorization;
		if (!authHeader || authHeader !== process.env.AUTH_KEY) {
			return res
				.status(401)
				.json({ error: "認証されていないリクエストです。" });
		}

		const { text, videoUrl, replyText } = req.body;

		if (!text || !videoUrl || !replyText) {
			return res.status(400).json({ error: "データが不足しています" });
		}

		try {
			const videoResponse = await fetch(videoUrl);
			if (!videoResponse.ok || !videoResponse.body) {
				return res.status(500).json({ error: "動画の取得に失敗しました" });
			}

			const videoBuffer = await streamToBuffer(videoResponse.body);
			const twitter = new TwitterApiClient(twitterApiConfig);
			const mediaId = await twitter.uploadVideo(videoBuffer);
			if (!mediaId) {
				return res
					.status(500)
					.json({ error: "動画のアップロードに失敗しました" });
			}

			const tweet = await twitter.postTweet({
				text,
				media: { media_ids: [mediaId] },
			});
			if (!tweet) {
				return res.status(500).json({ error: "ツイートの投稿に失敗しました" });
			}

			const tweetId = tweet.data.id;
			const reply = await twitter.postTweet({
				text: replyText,
				reply: {
					in_reply_to_tweet_id: tweetId,
				},
			});

			return res.status(200).json({
				message: "ツイートに成功しました",
				tweet,
				reply,
			});
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).json({ error });
		}
	}

	res.status(405).json({ error: "Method Not Allowed" });
}
