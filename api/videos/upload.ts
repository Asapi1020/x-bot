import type { VercelRequest, VercelResponse } from "@vercel/node";
import { twitterApiConfig } from "../../src/Config";
import { TwitterApiClient } from "../../src/TwitterApiClient";
import { streamToBuffer } from "../../src/streamHelper";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { url } = req.query;

	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "URL is required" });
	}

	try {
		const response = await fetch(url);
		if (!response.ok || !response.body) {
			throw new Error("動画の取得に失敗しました");
		}

		const videoBuffer = await streamToBuffer(response.body);
		const twitter = new TwitterApiClient(twitterApiConfig);
		const mediaId = await twitter.uploadVideo(videoBuffer);
		if (!mediaId) {
			throw new Error("動画のアップロードに失敗しました");
		}

		const tweet = await twitter.postTweet({
			text: "test uploading video",
			media: { media_ids: [mediaId] },
		});

		return res.status(200).json({
			message: "動画は正常にツイートされました",
			tweet,
		});
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error });
	}
}
