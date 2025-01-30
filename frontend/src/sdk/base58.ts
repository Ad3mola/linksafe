import bs58 from "bs58";
import { Buffer } from "buffer";

export default class B58 {
  encodeBase58(input: string): string {
    return bs58.encode(Buffer.from(input, "hex"));
  }

  decodeBase58(input: string): string {
    return Buffer.from(bs58.decode(input)).toString("hex");
  }
}
