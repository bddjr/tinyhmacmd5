/**
 * Computes the MD5 hash of the input data.  
 * If a key is provided, computes HMAC-MD5.  
 * By default, returns the hash as a lowercase hexadecimal string.  
 * If `raw` is true, returns a Uint8Array.  
 *
 * @param data The input data to hash. Strings are UTF‑8 encoded.
 * @param key Optional HMAC key. When given, HMAC‑MD5 is calculated instead of plain MD5.
 * @param raw If true, the hash is returned as raw bytes (Uint8Array); otherwise, as a hex string.
 * @returns The MD5 (or HMAC‑MD5) digest, either as a hex string or a Uint8Array.
 */
declare var md5: {
    (
        data: string | Uint8Array | Uint8ClampedArray,
        key?: string | Uint8Array | Uint8ClampedArray | null,
        raw?: false
    ): string;
    <T extends boolean = false>(
        data: string | Uint8Array | Uint8ClampedArray,
        key: string | Uint8Array | Uint8ClampedArray | null | undefined,
        raw: T
    ): T extends true ? Uint8Array<ArrayBuffer> : string;
};
export default md5;
