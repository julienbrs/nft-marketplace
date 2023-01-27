const { assert, expect } = require("chai")

const { network, deployments } = require("hardhat")

const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Unit tests for NFT Marketplace", function () {
          let nftMarketplace, marketplaceContract, etherealNft, etherealContract
          const TOKEN_ID = 1
          const LISTING_PRICE = ethers.utils.parseEther("0.1")

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]

              await deployments.fixture(["all"])
              marketplaceContract = await ethers.getContract("NftMarketplace")
              etherealContract = await ethers.getContract("EtherealNFTs")
              etherealNft = etherealContract.connect(deployer)
              nftMarketplace = marketplaceContract.connect(deployer)

              const mintFee = await etherealNft.getMintFee()
              /* We need NFT to interact */
              await etherealNft.mintNFT({ value: mintFee })
              await etherealNft.approve(marketplaceContract.address, TOKEN_ID)
          })

          describe("listItem", function () {
              it("reverts if listing price isn't strictly positive", async function () {
                  const WRONG_PRICE = 0
                  await expect(
                      nftMarketplace.listItem(etherealNft.address, TOKEN_ID, WRONG_PRICE)
                  ).to.be.revertedWith("NftMarketplace__PriceShouldBeAboveZero")
              })
              it("effectively list item and emits an event", async function () {
                  expect(
                      await nftMarketplace.listItem(etherealNft.address, TOKEN_ID, LISTING_PRICE)
                  ).to.emit("ItemListed")
              })
              it("reverts if nft already listed", async function () {
                  const error = `NftMarketplace__AlreadyListed("${etherealContract.address}", ${TOKEN_ID})`

                  await nftMarketplace.listItem(etherealNft.address, TOKEN_ID, LISTING_PRICE)
                  await expect(
                      nftMarketplace.listItem(etherealNft.address, TOKEN_ID, LISTING_PRICE)
                  ).to.be.revertedWith(error)
              })
              it("reverts if not the owner of the NFT", async function () {
                  nftMarketplace = marketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.listItem(etherealNft.address, TOKEN_ID, LISTING_PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
          })
      })
