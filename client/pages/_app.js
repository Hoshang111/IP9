import '../styles/App.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Web3 from 'web3';
import AudioContract from '../contracts/audioContract.json';
import Marketplace from '../contracts/Marketplace.json';

function MyApp({ Component, pageProps }) {
  const [acct, setAcct] = useState()  
  const [web3, setWeb3] = useState()

  useEffect(() => {
    getAcc()
  }, [])

  const getAcc = async () => {

    if (window.ethereum) {
      console.log("Nice")
    } else {
      alert("MetaMask Not Found!")
    }
    console.log("hahaha")
    const web3 = await new Web3(window.ethereum)
    setWeb3(web3)
    const a = await web3.eth.getAccounts()
    setAcct(a[0])
    console.log(a[0])
  }

  const web3Modal = new Web3Modal()
  const provider = await web3Modal.connect()
  const url = await uploadToIPFS()
  const networkId = await web3.eth.net.getId()

  // Mint the Audio
  const AudioContractAddress = AudioContract.networks[networkId].address
  const audioContract = new web3.eth.Contract(AudioContract.abi, AudioContractAddress)
  const accounts = await web3.eth.getAccounts()
  const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)
  let listingFee = await marketPlaceContract.methods.getListingFee().call()
  listingFee = listingFee.toString()
  audioContract.methods.mint(url).send({ from: accounts[0] }).on('receipt', function (receipt) {
      console.log('minted');
      // Add the Audio
      const tokenId = receipt.events.AudioMinted.returnValues[0];
      marketPlaceContract.methods.addAudio(AudioContractAddress, tokenId, Web3.utils.toWei(formInput.price, "ether"))
          .send({ from: accounts[0], value: listingFee }).on('receipt', function () {
              console.log('listed')
              router.push('/')
          })


  return (
    <div>
      <div className="navbar">
        <div style={{"display":"flex", "justifyContent":"center", "alignItems":"center"}}>
        <h2 style={{"margin":"20px"}}>IP9</h2>
          <Link href={{
            pathname: "/",
            query: web3,
          }}>
            <a>
              Home
            </a>
          </Link>
          <Link href="/allSongs">
            <a>
             All Songs 
            </a>
          </Link>
        </div>
        <div>

        <h5 style={{"margin":"20px"}}>Account: {acct}</h5>
        </div>
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp