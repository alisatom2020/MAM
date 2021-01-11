import React, {useState, useEffect} from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import About from "./About.js"


const MapContainer = () => {
    
    const [ selected, setSelected ] = useState({});
    const [ currentPosition, setCurrentPosition ] = useState({});

    const [ artworks, setArtworks ] = useState(undefined)
    const onSelect = (artwork) => {
        setSelected(artwork);
      }
    
    const success = position => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
      };
      

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success);
    })

    // on mount
    useEffect(() => {
        axios.get("data.json")//update to be actual endpoint once backend api working
            .then((res) => {
                setArtworks(res.data)
            })
            .catch(console.log)
        }, [])

    const mapStyles = {        
        height: "100vh",
        width: "100%"};
    
    const defaultCenter = {
        lat: -37.813600, lng: 144.963100
    }
  
  return (
     <LoadScript
       googleMapsApiKey={process.env.REACT_APP_GOOGLE_API}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          >
            {
            currentPosition.lat && 
            (
            <Marker position={currentPosition} />
            ) 
          }
        {/* artwork markers */}
          {
            artworks && artworks.map(artwork => 
                <Marker key={artwork._id} position={{lat: parseFloat(artwork.geom.latitude), lng: parseFloat(artwork.geom.longitude)}} onClick={() => onSelect(artwork)}/>
            )
          }
          {/* infoWindows */}
          {
            selected.geom && 
            (
            <InfoWindow
            position={{lat: parseFloat(selected.geom.latitude), lng: parseFloat(selected.geom.longitude)}}
            clickable={true}
            onCloseClick={() => setSelected({})}
            >
            <div>
                {/* <img src={selected.image} /> */}
                <p>{selected.name}</p>
                <p>{selected.addresspt}</p>
                <p>ARTIST: {selected.artist}</p>
                <p>{selected.artdate}</p>
                <p>{selected.structure}</p>
            </div>
            </InfoWindow>
            )
          }
          </GoogleMap>
     </LoadScript>
  )
}

export default MapContainer;
