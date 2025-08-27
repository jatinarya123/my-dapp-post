// api/auth/verify.js
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { address, signature } = req.body;
  const nonces = require("./noms").handler?.nonces || {};

  if (!address || !signature) return res.status(400).json({ error: "Address and signature required" });

  const nonce = nonces[address];
  if (!nonce) return res.status(400).json({ error: "Nonce not found" });

  try {
    const recovered = ethers.verifyMessage(nonce, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: "1h" });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: "Invalid signature" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Verification failed", detail: err.message });
  }
}
