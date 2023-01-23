// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error EtherealNFTs__NeedMoreEthToMint();
error EtherealNFTs__WithdrawFailed();

contract EtherealNFTs is ERC721, Ownable {
    /* NFT Variables */
    uint256 internal immutable i_mintFee;
    uint256 internal s_tokenCounter;
    bool private s_isInitialized;
    string[] internal s_tokenURIs;

    mapping(uint256 => string) public tokenURIs;

    /* Events */
    event NftMinted(address minter, uint256 tokenId);

    constructor(
        string[25] memory gradienttokenURIs,
        uint256 mintFee
    ) ERC721("Ethereal Gradient", "EGR") {
        i_mintFee = mintFee;
        s_tokenURIs = gradienttokenURIs;
    }

    function mintNFT() public payable {
        if (msg.value < i_mintFee) {
            revert EtherealNFTs__NeedMoreEthToMint();
        }
        s_tokenCounter++;
        uint256 tokenId = s_tokenCounter;
        bytes32 seed = keccak256(abi.encodePacked(block.number));
        uint256 idURI = uint256(seed) % s_tokenURIs.length;

        setTokenURI(tokenId, s_tokenURIs[idURI]);
        _safeMint(msg.sender, tokenId);
        emit NftMinted(msg.sender, tokenId);
    }

    /* Maybe not the best way to forbid setTokenURI if already init */
    function setTokenURI(uint256 _tokenId, string memory _uri) internal {
        require(_tokenId > 0, "Invalid token ID");
        require(
            keccak256(abi.encodePacked(tokenURIs[_tokenId])) == keccak256(abi.encodePacked("")),
            "Token already initialized"
        );

        tokenURIs[_tokenId] = _uri;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance to withdraw");
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert EtherealNFTs__WithdrawFailed();
        }
    }

    /* Getter functions */

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return tokenURIs[_tokenId];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
