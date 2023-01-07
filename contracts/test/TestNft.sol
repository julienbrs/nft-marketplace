// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNft is ERC721 {
    string public constant TOKEN_URI = "ipfs://QmeAhHnhd1ktLvAsKQmkAkQSDXST81qz16SUWvuRcxrfkT";
    uint256 private s_tokenCounter;

    constructor() ERC721("Gradient", "GRAD") {}

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    function getTokenURI() public pure returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
