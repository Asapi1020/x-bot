import type { VercelRequest, VercelResponse } from "@vercel/node";
import { convertToNodeReadable } from "../../src/streamHelper";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { url } = req.query;

	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "URL is required" });
	}

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		if (!response.body) {
			throw new Error("Response body is null");
		}

		res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

		const nodeReadableStream = await convertToNodeReadable(response.body);
		nodeReadableStream.pipe(res);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Error downloading video" });
	}
}
