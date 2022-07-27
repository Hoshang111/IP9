var AudioContract = artifacts.require("AudioContract");
var RightsManager = artifacts.require("RightsManager");

async function logNftLists(rightsmanager) {
    let rightsmanager = await rightsmanager.getListedNfts.call()
    const accountAddress = '0xEE1ee6529eb69Be0E5105686021410EB45E4302E'
    let myNfts = await rightsmanager.getMyNfts.call({from: accountAddress})
    let myListedNfts = await rightsmanager.getMyListedNfts.call({from: accountAddress})
    console.log(`listedNfts: ${listedNfts.length}`)
    console.log(`myNfts: ${myNfts.length}`)
    console.log(`myListedNfts ${myListedNfts.length}\n`)
}

const main = async (cb) => {
  try {
    const audioContract = await AudioContract.deployed()
    const rightsmanager = await RightsManager.deployed()

    console.log('MINT AND LIST 3 NFTs')
    let listingFee = await rightsmanager.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await rightsmanager.mint("URI1")
    let tokenId1 = txn1.logs[2].args[0].toNumber()
    await rightsmanager.listNft(rightsmanager.address, tokenId1, 1, {value: listingFee})
    let txn2 = await rightsmanager.mint("URI2")
    let tokenId2 = txn2.logs[2].args[0].toNumber()
    await rightsmanager.listNft(rightsmanager.address, tokenId2, 1, {value: listingFee})
    let txn3 = await rightsmanager.mint("URI3")
    let tokenId3 = txn3.logs[2].args[0].toNumber()
    await rightsmanager.listNft(rightsmanager.address, tokenId3, 1, {value: listingFee})
    await logNftLists(rightsmanager)

    console.log('BUY 2 NFTs')
    await rightsmanager.buyNft(rightsmanager.address, tokenId1, {value: 1})
    await rightsmanager.buyNft(rightsmanager.address, tokenId2, {value: 1})
    await logNftLists(rightsmanager)

    console.log('RESELL 1 NFT')
    await rightsmanager.resellNft(rightsmanager.address, tokenId2, 1, {value: listingFee})
    await logNftLists(rightsmanager)
  } catch(err) {
    console.log('Doh! ', err);
  }
  cb();
}

module.exports = main;