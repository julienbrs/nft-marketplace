const { ethers } = require("hardhat")

async function mint() {
    const NftMarketplace = await ethers.getContract("NftMarketplace")
    const testNft = await ethers.getContract("TestNft")

    console.log("Minting...")
    const mintTx = await testNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(`TokenId minted: ${tokenId}`)
    console.log(`Address of minted: ${testNft.address}`)
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
