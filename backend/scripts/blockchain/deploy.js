require('dotenv').config();
const hre = require("hardhat");


async function main() {
  const Post = await hre.ethers.getContractFactory("Post");
  const post = await Post.deploy();
  await post.waitForDeployment();
  console.log("Contract deployed to:", post.address);
}

main().catch((error) => {
  console.error("Error in deployment:", error);
  process.exitCode = 1;
});
