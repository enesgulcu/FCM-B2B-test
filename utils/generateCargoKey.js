import crypto from "crypto";

// 12 haneli büyük harf ve sayılardan oluşan (A-Z, 0-9) deterministik anahtar
// - SHA-256 hash → base36 (0-9a-z) → 12 karakter, büyük harfe çevrilir
export function generateDeterministic12CharKey(seed) {
	const base = typeof seed === "string" ? seed : String(seed ?? "");
	const hashHex = crypto.createHash("sha256").update(base).digest("hex");
	const big = BigInt("0x" + hashHex);
	let key = big.toString(36).toUpperCase(); // [0-9A-Z]
	if (key.length < 12) {
		key = (key + "ABCDEFGHIJKL").slice(0, 12);
	} else {
		key = key.slice(0, 12);
	}
	return key;
}

export default generateDeterministic12CharKey;


