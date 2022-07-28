import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { create } from 'ipfs-http-client'

export default function Home() {
  const api = create("https://ipfs.infura.io:5001/api/v0")
  const [artist, setArtist] = useState("NA")
  const [song, setSong] = useState("NA")
  const [date, setDate] = useState("No Des")
  const [allsong, setallSong] = useState([]);
  const [file, setFile] = useState()
  const [fileHash, setfileHash] = useState("");
  const [toggle, setToggle] = useState(false)
  const router = useRouter()
  const web3 = router.query;
  console.log(web3)

  const CreateSong = async () => {
    console.log(artist);
    console.log(song);
    console.log(date);

    await setallSong(preArray => [...preArray, { artist: artist, songName: song, date: date, file: file.name, hash: fileHash }])
    // await localStorage.setItem("mySong", JSON.stringify(ls))
    console.log(allsong)
    // Contract call:

  };

  const changeFile = async (e) => {
    const fil = e.target.files[0];
    setFile(fil)
    if (fil !== "undefined") {
      console.log(fil.type)
      if (fil.type === "audio/mpeg") {
        api.add(fil)
          .then(get => {
            console.log(get)
            console.log(`https://ipfs.io/ipfs/${get.path}`)
            setfileHash(get.path)
            setToggle(!toggle)
          })
          .catch(er => {
            console.log(er)
            alert("Upload Failed")
          });
      } else {
        alert("Needs to be a mp3 file")
      }
    }
  }




  return (
    <>
      <h1>Ownership Agreement</h1>
      <div className="main">
        <div className="create-song">
          <div style={{ "marginTop": "5px" }}>
            <h5>Artist:<input required placeholder="Artist" onChange={(e) => setArtist(e.target.value)}></input></h5>
          </div>
          <div style={{ "marginTop": "2px" }}>
            <h5>Song Tittle:<input required placeholder="Song Tittle" onChange={(e) => setSong(e.target.value)}></input>  </h5>
          </div>
          <div style={{ "marginTop": "2px" }}>
            <h5>Date:<input required type="date" placeholder="" onChange={(e) => setDate(e.target.value)}></input>  </h5>
          </div>
          <div style={{ "marginTop": "2px" }}>
            <input required type="file" onChange={changeFile}></input>
          </div>
          {toggle && <button style={{ "marginTop": "2px" }} variant="success" onClick={CreateSong}>Create</button>}

        </div>
      </div>

      {allsong.length > 0 ?

        (

          (<div>
            <h2>My Uploaded Songs</h2>

            <div className='display-flex'>
              {
                allsong.map((i, key) => {
                  return (
                    <div key={key} className="show-song">
                      <p>artist: {i.artist}</p>
                      <h5>Song Name: {i.songName}</h5>
                      <h5>Date: {i.date}</h5>
                      <h5>File Uploaded: {i.file}</h5>
                      <p style={{ "margin": "2px", "wordWrap": "break-word" }}>File Hash: {i.hash}</p>
                    </div>
                  );
                })
              }
            </div>
          </div>)
        ) :

        (<div></div>)

      }
    </>
  );
}