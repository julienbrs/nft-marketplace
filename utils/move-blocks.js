const { network } = require("hardhat")

function sleep(timeMs) {
    return new Promise((resolve) => setTimeout(resolve, timeMs))
}
async function moveBlocks(amount, sleepAmount = 1) {
    console.log("Mining blocks...")
    for (let i = 0; i < amount; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            console.log(`Waiting for ${sleepAmount} seconds`)
            await sleep(sleepAmount) // sleepAmount in ms
        }
    }
}

module.exports = {
    moveBlocks,
    sleep,
}
