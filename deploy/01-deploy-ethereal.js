const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const { handleTokenUris } = require("../utils/createTokenURIs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenUris = [
        "ipfs://QmUVbgaG1ziRiz1jbAGSZzCiGe72BV41Vx2G7cCHLoLFcW",
        "ipfs://QmQDQPEejgDogp6epwc14JQLFXffQ545VrFD2s2KbSpSZ3",
        "ipfs://QmQX17PhVZZARFnQMnvYBCTpcM2tSeoRUDW3PFjcJrU7cy",
        "ipfs://QmX8j1gKzkF4ttERNm1FaBzbGG7BxP1z6a8PXE4BWocSK3",
        "ipfs://QmZuYnCZF2yVNKGSrVL9jK3fLAbr3nuzJL4CkVGeXGKprE",
        "ipfs://QmbQ9CqVNzesHgSvMp6xDYq86EJrFSwfmkqVu7tB4bjPx3",
        "ipfs://QmdsqWZGCrkpjhCgCepEtFePmkvxkXda7P7w3z7Y13dxvH",
        "ipfs://QmYNExeWLHAmCaUZhHvYEct63GuoiVyAmnNZett9k2Uazf",
        "ipfs://QmXetXA1eCy8F9exsvfq71W3pvG6nMtzFgBanJQBYEdzBM",
        "ipfs://QmTeRGb4RVd1JSEUnDcuhJW6cj7Dprp49EGnM4aXcyJCeC",
        "ipfs://QmTGN9uAGnGaLagUj5gzy8zSU6x9puFVauRYty8wekc1bm",
        "ipfs://QmVNnq2cAhikNaACpn8KezhAq3PRbHAKz5Bx76585uzkNM",
        "ipfs://QmSjNpMESa28KeTLBbubZim5FfNoR8GGpJmVMXmAkZHvBR",
        "ipfs://QmS19SBTo9WvmdAZEQjM7ovTgmmSRGq69tWcZvCZUGzTbJ",
        "ipfs://QmfYVM5rUyzgzFXSLvUn44z6GdvhS3iR9MDETaoAQ9YDai",
        "ipfs://QmY21P7Y6jn8yE7QEjPDW9xDRfVXFLrYLgtFsAdHT1t7u3",
        "ipfs://QmS7Cvs9eckP6DRpqCz63uhofiWGb1kZmkfKaiTPtoxcjc",
        "ipfs://QmbgxM97CvLeVW9kzVSuEv7aB2MZRkUGdCYBFAuQkvjEhy",
        "ipfs://QmTwHwasim9fEj923bAwoiX92T5NcAqvhr895H4mhErMK2",
        "ipfs://QmXpcff2RBUwxN2PuzybLDfvMaqKq5YrpX1JiFJ4nwVpa3",
        "ipfs://QmRLCEkHzX14KPGpELWqdKJYy8weQeyDgMsKzDFNYU6JwY",
        "ipfs://QmQijeMdtAAq2nqrNg5xpiDWEWs27x6vZGrYYdpSCmU2e1",
        "ipfs://QmRfB6rmGfmGM2aTEgBWd6GmgyX74GMc7ihYkCAayq1Bs9",
        "ipfs://QmPNfuJH8AoHgDxheDvxrWmD99NgHcMHJ8iBzpeDByk71Z",
        "ipfs://QmVamnim9p1oQHCJGtZKY5yGtCnsSCSwMigYyW9mgTcycn",
    ]

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    const args = [tokenUris, networkConfig[chainId].mintFee]

    const contractEthereal = await deploy("EtherealNFTs", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying the contract...")
        await verify(contractEthereal.address, args)
    }
    log("===========")
}

module.exports.tags = ["all", "etherealNFTs", "main"]
