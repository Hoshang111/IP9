const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var AudioContract = artifacts.require("AudioContract");
var Marketplace = artifacts.require("Marketplace");


contract("AudioContract Tests for js", async accounts => {
  it("Add and List 3 Audio Files", async () => {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    
    let txn1 = await audioContract.mint("URI1", {from: accounts[0]})
    let tokenId1 = txn1.logs[2].args[0].toNumber()
    await marketplace.addAudio(audioContract.address, tokenId1, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[0], value: listingFee})
    
    let txn2 = await audioContract.mint("URI2", {from: accounts[0]})
    let tokenId2 = txn2.logs[2].args[0].toNumber()
    await marketplace.addAudio(audioContract.address, tokenId2, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId2, {from: accounts[0], value: listingFee})
    
    let txn3 = await audioContract.mint("URI3", {from: accounts[0]})
    let tokenId3 = txn3.logs[2].args[0].toNumber()
    await marketplace.addAudio(audioContract.address, tokenId3, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId3, {from: accounts[0], value: listingFee})

    let listedAudio = await marketplace.getListedAudio.call({from: accounts[0]})
    let myAudio = await marketplace.getMyAudio.call({from: accounts[0]})
    let myListedAudio = await marketplace.getMyListedAudio.call({from: accounts[0]})

    assert.equal(listedAudio.length, 3)
    assert.equal(myAudio.length, 3)
    assert.equal(myListedAudio.length, 3)
  });

  it("Bid for 2 Audio Rights from Two Accounts", async () => {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await audioContract.mint("URI1", {from: accounts[0]})
    let tokenId1 = txn1.logs[2].args[0].toNumber()
    await marketplace.addAudio(audioContract.address, tokenId1, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[0], value: listingFee})

    await marketplace.bidAudio(tokenId1, 1, {from: accounts[1]})
    await marketplace.bidAudio(tokenId1, 1, {from: accounts[2]})

    let offers = await marketplace.getOffers.call({from: accounts[1]})
    assert.equal(offers, 2)
  });

  it("Accept Offer", async () => {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await audioContract.mint("URI1", {from: accounts[0]})
    let tokenId1 = txn1.logs[2].args[0].toNumber()
    await marketplace.addAudio(audioContract.address, tokenId1, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[0], value: listingFee})
    await marketplace.bidAudio(tokenId1, 10000000000, {from: accounts[1]})
    await marketplace.acceptOffer(audioContract.address, tokenId1, {from: accounts[0]})
  });

  it("Buy Music", async () => {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await audioContract.mint("URI1", {from: accounts[0]})
    let tokenId1 = txn1.logs[2].args[0].toNumber()

    await marketplace.addAudio(audioContract.address, tokenId1, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[0], value: listingFee})
    await marketplace.bidAudio(tokenId1, 5, {from: accounts[1]})
    await marketplace.acceptOffer(audioContract.address, tokenId1, {from: accounts[0]})
    let value = (await marketplace.getOfferPrice(3)).toNumber()
    assert.equal(value, 5)
    await marketplace.buyAudio(3, audioContract.address, tokenId1, {from: accounts[1], value: 5})
  });

  it("Resell Audio", async () => {
    const audioContract = await AudioContract.deployed()
    const marketplace = await Marketplace.deployed()

    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    let txn1 = await audioContract.mint("URI1", {from: accounts[0]})
    let tokenId1 = txn1.logs[2].args[0].toNumber()

    await marketplace.addAudio(audioContract.address, tokenId1, {from: accounts[0]})
    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[0], value: listingFee})
    await marketplace.bidAudio(tokenId1, 5, {from: accounts[1]})
    await marketplace.acceptOffer(audioContract.address, tokenId1, {from: accounts[0]})
    

    let listedAudio = await marketplace.getListedAudio.call({from: accounts[0]})
    assert.equal(listedAudio.length, 6)

    await marketplace.buyAudio(3, audioContract.address, tokenId1, {from: accounts[1], value: 5})

    let listedAudio2 = await marketplace.getListedAudio.call({from: accounts[0]})
    assert.equal(listedAudio2.length, 5)

    await marketplace.listAudio(audioContract.address, tokenId1, {from: accounts[1], value: listingFee})
    
    let listedAudio3 = await marketplace.getListedAudio.call({from: accounts[1]})
    assert.equal(listedAudio3.length, 6)
  });
});