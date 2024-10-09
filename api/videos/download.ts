import { Readable, type ReadableOptions } from "node:stream";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { url } = req.query;

	try {
		const response = await fetch(url as string);
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

async function convertToNodeReadable(
	readableStream: ReadableStream<Uint8Array>,
) {
	const reader = readableStream.getReader();
	return new Readable({
		async read() {
			const { done, value } = await reader.read();
			if (done) {
				this.push(null);
			} else {
				this.push(Buffer.from(value));
			}
		},
	});
}
