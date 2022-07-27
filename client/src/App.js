import React, { useEffect, useState }  from "react";
import OwnershipAgreement from "./contracts/OwnershipAgreement.json";
import Web3 from "web3";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import ipfs from "ipfs-api";
import { Route, Routes, Link  } from "react-router-dom";
import "./App.css";


const App = () => {


  const api = new ipfs({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  const [artist, setArtist] = useState("NA");
  const [song, setSong] = useState("NA");
  const [date, setDate] = useState("No Des");
  const [file, setFile] = useState();
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [contractAddress, setcontractAddress] = useState("");
  const [contract, setContract] = useState({});
  const [status, setStatus] = useState("NO STATUS");
  
  useEffect( async () => {
    if (window.ethereum) {
      console.log("Nice");
    } else {
      alert("MetaMask Not Found");
    }
    


    const web_3 = new Web3(window.ethereum);
    const ac = await web_3.eth.getAccounts();
    setAccount(ac[0]);
    setWeb3(web_3);
    // console.log(JSON.stringify(OwnershipAgreement.abi));
    const contr = await new web_3.eth.Contract(OwnershipAgreement.abi, "0x7Dfae75f7B3a96a5123A859b20ad9f742f6979a0");
    setcontractAddress(contr.options.address);
    console.log(contr);
  }, []);

  const CreateSong = async (e) => {
    setFile(e.target.files[0]);
    const f = e.target.files[0];
    console.log(artist);
    console.log(song);
    console.log(date);

    // Contract call:

  };

  return (
    <>
      {!web3 ?
        (<div>"Can't find MetaMask"</div>)
        :
        (
        <div className="App">
          <Navbar bg="dark">
          <Container>
          <div className="navbar">
            Account: {account}
          </div>
          <div>
            <Link to="/" style={{"margin":"5px", "color":"white"}}>Home</Link>
            <Link to="/allSongs" style={{"margin":"5px", "color":"white"}}>Songs</Link>
          </div>
          </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={
            <>
            <h1>Ownership Agreement</h1>
            <div className="main">
            <div className="create-song">
              <div style={{"marginTop": "50px"}}>
              <h5>Artist:<input required placeholder="Artist" onChange={(e) => setArtist(e.target.value)}></input>  </h5>
              </div>
              <div style={{"marginTop": "20px"}}>
              <h5>Song Tittle:<input required placeholder="Song Tittle" onChange={(e) => setSong(e.target.value)}></input>  </h5>
              </div>
              <div style={{"marginTop": "20px"}}>
              <h5>Date:<input required type="date" placeholder="" onChange={(e) => setDate(e.target.value)}></input>  </h5>
              </div>
              <div style={{"marginTop": "20px"}}>
                <input required type="file" onChange={CreateSong}></input>
              </div>
              <Button style={{"marginTop": "20px"}} variant="success">Create</Button>
            </div>
            </div>
            </>
            }/>
            <Route path="/allSongs" element={
              <>
              <h1>All Songs:</h1>
              </>
            }></Route>
          </Routes>
        </div>
      )
      }
    </>
    
  );
};

export default App;
