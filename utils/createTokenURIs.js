const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./images/"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Mystery",
            value: "",
        },
        {
            trait_type: "Depth",
            value: "",
        },
    ],
}

async function handleTokenUris() {
    let tokenDescription = [
        "Get lost in mesmerizing gradients",
        "Experience the ethereal beauty of smoke and clouds",
        "Explore the beauty of monochrome in abstract forms",
        "Be mesmerized by the dreamy pastel hues in art",
        "Embrace the unpredictable beauty of chaotic abstract",
        "Be transported to a world of color and movement",
        "Experience the fantastical shades of colours",
        "Embrace the simplicity and purity of waves",
        "Get lost in the abstract creature shapes",
        "Experience the silence and serenity of fantasy",
        "Embrace the beauty of monochrome abstractions",
        "Dive into the pastel world of abstract forms",
        "Embrace the chaotic beauty of white abstractions",
        "Be transported to a world of movement and change",
        "Embark on a journey of exploration and discovery",
        "Experience the ethereal movement and gradients",
        "Be transported to a world of transcendent hues",
        "Embrace the chaotic beauty of pastel abstractions",
        "Take a journey through the limitless colors",
        "Fantasy and imagination come to life in shades",
        "Transcendence and purity in white abstract forms",
        "Get lost in the mystical shapes and forms of art",
        "Experience the silence and serenity abstractions",
        "Dive into the ethereal pastel dreamscapes of art",
        "Embrace the chaotic beauty of gradient abstractions",
    ]

    let tokenName = [
        "Mesmerizing Gradients",
        "Smokey Abstract Landscapes",
        "Monochrome Abstraction",
        "Dreamy Pastel Abstracts",
        "Chaotic Abstract Beauty",
        "Color Waves in Abstraction",
        "Fantastical Abstract Shades",
        "White Abstract Spaces",
        "Abstract Creature Forms",
        "Silence in Abstraction",
        "Monochromatic Serenity",
        "Pastel Abstraction Dream",
        "Chaotic White Abstract",
        "Abstraction in Motion",
        "Exploration of the Unknown",
        "Ethereal Movement",
        "Transcendent Hues",
        "Ethereal Chaos in Pastel",
        "Journey through Colors",
        "Fantasy in Gradients",
        "Transcendence in White",
        "Mystical Abstract Shapes",
        "Ethereal Monochrome Silence",
        "Ethereal Pastel Dreams",
        "Chaotic Gradients",
    ]

    let valueMystery = ["Illuminated", "Veiled", "Obscured", "Mystical"]

    tokenUris = []

    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)

    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = tokenName[imageUploadResponseIndex]
        tokenUriMetadata.description = tokenDescription[imageUploadResponseIndex]
        tokenUriMetadata.attributes[0].value =
            valueMystery[Math.floor(Math.random() * valueMystery.length)]

        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const medataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${medataUploadResponse.IpfsHash}`)
    }

    console.log("Token URIs Uploaded: ")
    console.log(tokenUris)
    return tokenUris
}

module.exports = { handleTokenUris }
