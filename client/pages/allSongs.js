import { useEffect } from "react"
import Web3 from 'web3'
import Marketplace from '../contracts/Marketplace.json';

function allSongs() {

	useEffect(() => {
		getSongs()
	}, [])

	const getSongs = async () => {
		console.log("sf");
    const web3 = new Web3(window.ethereum)
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, "0x686C2fE9D3706CBC0BCf2830fF53319D62F39be4")
	}

	return (
		<>
			<div>
				All Listed Songs
			</div>
		</>
	)
}

export default allSongs