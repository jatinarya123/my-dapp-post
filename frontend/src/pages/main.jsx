import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { ABI } from '../abi/ABI';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const Main = () => {
  const [message, setMessage] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState('');

 
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Install MetaMask to use this app');
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWallet(accounts[0]);
  };

 
  const ensureSepolia = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }
    } catch (err) {
      console.error("Network switch failed:", err);
      alert('Please switch your MetaMask to Sepolia Testnet manually.');
    }
  };

  const postMessage = async () => {
    try {
      if (!message.trim()) {
        return alert('Please write a message before posting.');
      }

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, ABI, signer);

      const tx = await contract.createPost(message);
      await tx.wait();

      setMessage('');
      await loadPosts();
    } catch (err) {
      console.error('Error posting message:', err);
      alert('Failed to post. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all posts
  const loadPosts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, ABI, provider);

      const count = Number(await contract.getPostCount());

      const posts = [];

      for (let i = count - 1; i >= 0; i--) {
        const post = await contract.getPost(i);
        posts.push({
          author: post.author,
          content: post.content,
          timestamp: new Date(Number(post.timestamp) * 1000).toLocaleString(),
        });
      }

      setAllPosts(posts);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  useEffect(() => {
    ensureSepolia();
    connectWallet();
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-start p-6">

      {/* Share Box */}
      <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-xl shadow-md mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">💬 Share a Thought</h1>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring focus:ring-indigo-400 resize-none h-28"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something insightful..."
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          onClick={postMessage}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
        {wallet && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </p>
        )}
      </div>

      {/* Posts */}
      <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-4">📜 Previous Posts</h2>

        {allPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          allPosts.map((post, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 shadow-sm"
            >
              <p className="text-gray-800 mb-2">{post.content}</p>
              <p className="text-sm text-gray-500">
                By {post.author.slice(0, 6)}...{post.author.slice(-4)} • {post.timestamp}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Main;
