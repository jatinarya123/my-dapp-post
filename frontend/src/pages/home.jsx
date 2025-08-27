import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { OrbitControls } from "@react-three/drei";

const Home = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

const handelLogin = async () => {
  if (connecting) return;
  setConnecting(true);

  try {
  
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // const userAddress = accounts[0];
    // setAddress(userAddress);

    // const res = await fetch(
    //   `/auth/noms?address=${userAddress}`
    // );
    // const { nonce } = await res.json();

    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await provider.getSigner();
    // const signature = await signer.signMessage(nonce);

    // const verifyRes = await fetch("/auth/verify", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     address: userAddress,
    //     signature,
    //   }),
    // });

    // const data = await verifyRes.json();

    // if (data.token) {
    //   localStorage.setItem("token", data.token);
    setError("");
    navigate("/main");
    // } else {
      //setError(data.error || "Login failed");
    //}
  } catch (err) {
    if (err.code === -32002) {
      setError("MetaMask already processing request. Please check the wallet.");
    } else {
      setError("Login failed: " + err.message);
    }
  } finally {
    setConnecting(false);
  }
};

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden flex">
      
      <div
        className="w-2/5 flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1746468659017-6f1ec22bb1f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGh5cG5vc2lzfGVufDB8fDB8fHww')",
        }}
      >
      
        <div className="relative z-10 flex flex-col items-center px-4">
          <h1 className="text-3xl text-white font-bold text-center drop-shadow-lg">
            Decentralized Post Platform
          </h1>
          <button
            onClick={handelLogin}
            disabled={connecting}
            className={`mt-6 px-6 py-2 rounded transition-all ${
              connecting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-200"
            }`}
          >
            {connecting ? "Waiting for MetaMask..." : "Connect with Wallet"}
          </button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </div>

      
      <div className="w-px bg-gray-300 h-full"></div>

    
      <div className="w-3/5 bg-slate-800 relative overflow-hidden flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <mesh rotation={[0.5, 0.5, 0]}>
            <torusGeometry args={[1, 0.4, 16, 100]} />
            <meshStandardMaterial color="purple" />
          </mesh>
          <OrbitControls enableZoom={false} />
        </Canvas>

       
        <div className="absolute top-10 w-full flex justify-center pointer-events-none">
          <svg width="80%" height="100" viewBox="0 0 1000 100">
            <defs>
              <path
                id="curve"
                d="M 100 100 Q 500 0 900 100"
                fill="transparent"
              />
            </defs>
            <text fill="white" fontSize="30" fontWeight="bold">
              <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                Welcome — You're Entering the Decentralized World
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
