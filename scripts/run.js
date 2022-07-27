var AudioContract = artifacts.require("AudioContract");
var Marketplace = artifacts.require("Marketplace");

async function logNftLists(marketplace) {
    let listedNfts = await marketplace.getListedNfts.call()
    const accountAddress = '0xEE1ee6529eb69Be0E5105686021410EB45E4302E'
    let myNfts = await marketplace.getMyNfts.call({from: accountAddress})
    let myListedNfts = await marketplace.getMyListedNfts.call({from: accountAddress})
    console.log(`listedNfts: ${listedNfts.length}`)
    console.log(`myNfts: ${myNfts.length}`)
    console.log(`myListedNfts ${myListedNfts.length}\n`)
}

const main = async (cb) => {
  try {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    console.log('MINT AND LIST 3 NFTs')
    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await audioContract.mint("URI1")
    let tokenId1 = txn1.logs[2].args[0].toNumber()
    await marketplace.listAudio(audioContract.address, tokenId1, {value: listingFee})
    let txn2 = await audioContract.mint("URI2")
    let tokenId2 = txn2.logs[2].args[0].toNumber()
    await marketplace.listAudio(audioContract.address, tokenId2, {value: listingFee})
    let txn3 = await audioContract.mint("URI3")
    let tokenId3 = txn3.logs[2].args[0].toNumber()
    await marketplace.listAudio(audioContract.address, tokenId3, {value: listingFee})
    await logNftLists(marketplace)

    // console.log('BUY 2 NFTs')
    // await marketplace.buyNft(audioContract.address, tokenId1, {value: 1})
    // await marketplace.buyNft(audioContract.address, tokenId2, {value: 1})
    // await logNftLists(marketplace)

    // console.log('RESELL 1 NFT')
    // await marketplace.resellNft(audioContract.address, tokenId2, 1, {value: listingFee})
    // await logNftLists(marketplace)
  } catch(err) {
    console.log('Doh! ', err);
  }
  cb();
}

module.exports = main;