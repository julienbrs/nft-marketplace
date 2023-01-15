const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

async function mint() {
    const { deployer } = await getNamedAccounts()
    console.log("Address of the minter is: ", deployer)

    // Simplest NFT
    const EtherealNFTs = await ethers.getContract("EtherealNFTs", deployer)
    const mintFee = await EtherealNFTs.getMintFee()

    const EtherealNFTsMintTx = await EtherealNFTs.mintNFT({ value: mintFee.toString() })
    const EtherealNFTsMintTxReceipt = await EtherealNFTsMintTx.wait(1)
    const tokenId = EtherealNFTsMintTxReceipt.events[0].args.tokenId
    console.log(`TokenId: ${tokenId}`)
    console.log(`tokenURI of EtherealNFT minted is ${await EtherealNFTs.tokenURI(tokenId)}`)
    console.log(`Address of minted: ${EtherealNFTs.address}`)
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
