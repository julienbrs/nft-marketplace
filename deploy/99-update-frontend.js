const { ethers, network } = require("hardhat")
const fs = require("fs")

const PATH_TO_NETWORK_MAPPING =
    "../../frontend/frontend-marketplace-nfts/constants/networkMapping.json"
const PATH_TO_ABI = "../../frontend/frontend-marketplace-nfts/constants/"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating frontend constants...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(PATH_TO_NETWORK_MAPPING, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    fs.writeFileSync(PATH_TO_NETWORK_MAPPING, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${PATH_TO_ABI}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const EtherealNFTs = await ethers.getContract("EtherealNFTs")
    fs.writeFileSync(
        `${PATH_TO_ABI}EtherealNFTs.json`,
        EtherealNFTs.interface.format(ethers.utils.FormatTypes.json)
    )
}

module.exports.tags = ["all", "frontend"]
