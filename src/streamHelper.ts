import { Readable } from "node:stream";

export async function convertToNodeReadable(
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

export async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
	const reader = stream.getReader();
	const chunks = [];
	let done = false;

	while (!done) {
		const { value, done: readerDone } = await reader.read();
		if (readerDone) {
			done = true;
		} else {
			chunks.push(value);
		}
	}

	const fullBuffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
	return fullBuffer;
}
