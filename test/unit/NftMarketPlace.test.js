const { assert, expect } = require("chai")

const { network, deployments } = require("hardhat")

const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Unit tests for NFT Marketplace", function () {
          let nftMarketplace, marketplaceContract, etherealNft, etherealContract
          const TOKEN_ID = 1
          const LISTING_PRICE = ethers.utils.parseEther("0.1")
          const PRICE = ethers.utils.parseEther("0.01")

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
              it("reverts if nft isn't approved", async function () {
                  const mintFee = await etherealNft.getMintFee()
                  await etherealNft.mintNFT({ value: mintFee })
                  await expect(
                      nftMarketplace.listItem(etherealNft.address, TOKEN_ID + 1, LISTING_PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketPlace")
              })
          }),
              describe("buyItem", function () {
                  it("reverts if nft not listed", async function () {
                      const mintFee = await etherealNft.getMintFee()
                      const error = `NftMarketplace__notListed("${etherealContract.address}", ${
                          TOKEN_ID + 1
                      })`
                      await etherealNft.mintNFT({ value: mintFee })
                      await expect(
                          nftMarketplace.buyItem(etherealNft.address, TOKEN_ID + 1, {
                              value: mintFee,
                          })
                      ).to.be.revertedWith(error)
                  })
                  it("reverts if msg.value is less than the listing price", async function () {
                      await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                      error = `NftMarketplace__RequiredPriceIsHigher("${etherealContract.address}", ${TOKEN_ID}, ${PRICE})`
                      await expect(
                          nftMarketplace.buyItem(etherealNft.address, TOKEN_ID, {
                              value: PRICE / 10,
                          })
                      ).to.be.revertedWith(error)
                  })
                  it("emits an event when nft bought", async function () {
                      await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                      expect(
                          await nftMarketplace.buyItem(etherealNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                      ).to.emit("ItemBought")
                  })
                  it("nft is deleted from the marketplace after bought", async function () {
                      const error = `NftMarketplace__notListed("${etherealContract.address}", ${TOKEN_ID})`
                      await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                      await nftMarketplace.buyItem(etherealNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                      await expect(
                          nftMarketplace.buyItem(etherealNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                      ).to.be.revertedWith(error)
                  })
              })
          describe("cancelListing", function () {
              it("reverts if not the NFT Owner", async function () {
                  nftMarketplace = marketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.cancelListing(etherealNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("reverts if nft isn't listed", async function () {
                  const error = `NftMarketplace__notListed("${etherealContract.address}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.cancelListing(etherealNft.address, TOKEN_ID)
                  ).to.be.revertedWith(error)
              })
              it("emit event when cancelling listing", async function () {
                  await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(etherealNft.address, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
              })
          })
          describe("updateListing", function () {
              const newPrice = ethers.utils.parseEther("0.02")
              it("reverts if not the NFT Owner", async function () {
                  await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                  nftMarketplace = marketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.updateListing(etherealNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("reverts if nft isn't listed", async function () {
                  const error = `NftMarketplace__notListed("${etherealContract.address}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.updateListing(etherealNft.address, TOKEN_ID, newPrice)
                  ).to.be.revertedWith(error)
              })
              it("is updating listing and emit an event", async function () {
                  await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                  expect(
                      await nftMarketplace.updateListing(etherealNft.address, TOKEN_ID, newPrice)
                  ).to.emit("ItemListed")
              })
          })
          describe("withdrawProceeds", function () {
              it("withdrawing proceeds correctly", async function () {
                  await nftMarketplace.listItem(etherealContract.address, TOKEN_ID, PRICE)
                  nftMarketplace = marketplaceContract.connect(user)
                  await nftMarketplace.buyItem(etherealNft.address, TOKEN_ID, {
                      value: PRICE,
                  })
                  nftMarketplace = marketplaceContract.connect(deployer)
                  const beforeWithdraw = (
                      await nftMarketplace.getProceeds(deployer.address)
                  ).toString()
                  assert.equal(beforeWithdraw, PRICE)

                  await nftMarketplace.withdrawProceeds()

                  const afterWithdraw = (
                      await nftMarketplace.getProceeds(deployer.address)
                  ).toString()
                  assert.equal(afterWithdraw, 0)
              })
              it("reverts when there is no proceeds", async function () {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketplace__NoProceeds"
                  )
              })
          })
      })
