// api/auth/noms.js
export default function handler(req, res) {
  const nonces = handler.nonces || {};
  handler.nonces = nonces; // persist in memory between calls

  const { address } = req.query;
  if (!address) return res.status(400).json({ error: "Address required" });

  const nonce = `Sign this message to log in: ${Date.now()}`;
  nonces[address] = nonce;

  res.status(200).json({ nonce });
}
