// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Post {
    struct PostStruct {
        address author;
        string content;
        uint256 timestamp;
    }

    PostStruct[] public posts;

    // Function to create a post
    function createPost(string memory content) public {
        posts.push(PostStruct(msg.sender, content, block.timestamp));
    }

    // Get a post by index
    function getPost(uint256 index) public view returns (PostStruct memory) {
        require(index < posts.length, "Index out of bounds");
        return posts[index];
    }

   uint public postCount;

 function getPostCount() public view returns (uint) {
    return posts.length;
}
}

