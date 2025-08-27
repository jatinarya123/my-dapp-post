const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { ethers } = require('ethers');

const Route = express.Router();

Route.use(express.json());
Route.use(cors());

const nonces = {};
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";


Route.get('/noms', (req, res) => {
  const address = req.query.address;
  const nonce = `Sign this message to log in: ${Date.now()}`;
  nonces[address] = nonce;
  res.json({ nonce });
});


Route.post('/verify', (req, res) => {
  const { address, signature } = req.body;

  console.log("Incoming POST /verify", { address, signature });

  if (!address || !signature) {
    console.error("Missing data");
    return res.status(400).json({ error: 'Address and signature are required' });
  }

  const nonce = nonces[address];
  console.log("Retrieved nonce:", nonce);

  if (!nonce) {
    return res.status(400).json({ error: 'Nonce not found for this address' });
  }

  try {
    const recovered = ethers.verifyMessage(nonce, signature); 
    if (recovered.toLowerCase() === address.toLowerCase()) {
      const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error("Signature verification failed:", err.message);
    return res.status(400).json({ error: 'Verification failed', detail: err.message });
  }
});


module.exports = Route