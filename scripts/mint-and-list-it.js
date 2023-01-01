const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.001")

async function mintAndList() {
    const NftMarketplace = await ethers.getContract("NftMarketplace")
    const testNft = await ethers.getContract("TestNft")

    console.log("Minting...")
    const mintTx = await testNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log("Approving Nft...")
    const approvalTx = await testNft.approve(NftMarketplace.address, tokenId)
    await approvalTx.wait(1)

    console.log("Listing NFT...")
    const tx = await NftMarketplace.listItem(testNft.address, tokenId, PRICE)
    console.log("Listed!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
