import { createReadStream, createWriteStream, mkdtempSync } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { createGzip } from "zlib";
import archiver from "archiver";

const tempDir = path.join(os.tmpdir(), "zefhub");

export type FileBuffer = {
  name: string;
  type: "graphql" | "hooks";
  data: Buffer;
};

export const zipFiles = async (fileBuffers: FileBuffer[]): Promise<string> => {
  try {
    const dir = await mkdtempSync(tempDir);
    const outPath = dir + "/" + crypto.randomUUID() + ".zip";

    await new Promise<void>((resolve, reject) => {
      // create a file to stream archive data to.
      const output = createWriteStream(outPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on("close", () => {
        // console.debug(archive.pointer() + " total bytes");
        resolve();
      });

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on("end", () => {
        console.debug("Data has been drained");
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          // throw error
          throw err;
        }
      });

      // good practice to catch this error explicitly
      archive.on("error", (err) => {
        throw err;
      });

      // pipe archive data to the file
      archive.pipe(output);

      // append a file from buffer
      for (let fileIndex = 0; fileIndex < fileBuffers.length; fileIndex++) {
        const fileBuffer = fileBuffers[fileIndex];
        archive.append(fileBuffer.data, { name: fileBuffer.name });
      }

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();
    });

    return outPath;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const compressFile = (filePath: string) => {
  const stream = createReadStream(filePath);
  stream
    .pipe(createGzip())
    .pipe(createWriteStream(`${filePath}.gz`))
    .on("finish", () =>
      console.log(`Successfully compressed the file at ${filePath}`)
    );
};
