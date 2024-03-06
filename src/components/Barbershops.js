import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for routing
import "./barbershop.css";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";

const Barbershops = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const res = await axios.get("http://192.168.8.111:3000/barbershops");
        setBarbershops(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBarbershops();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMarkerClick = (shop) => {
    setSelectedShop(shop);
  };

  const handleAddressSelect = (place) => {
    if (place && place.geometry) {
      setUserLocation({
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    }
  };

  const filteredBarbershops = barbershops.filter((shop) =>
    shop.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="barbershops-container">
        <h1 className="title">Barbershops</h1>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div>
          <Autocomplete
            apiKey={"AIzaSyDSmZSSGgFqyEElCvQ9NsXpmCilVs3JZAQ"}
            onPlaceSelected={handleAddressSelect}
            types={["address"]}
            placeholder="Enter your address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            options={{
              componentRestrictions: { country: "ZA" },
              types: ["geocode"],
              fields: ["address_components", "geometry", "icon", "name"],
              origin: new window.google.maps.Point(0, 0),
              strictBounds: false,
            }}
          />
        </div>
        <div className="shop-list">
          <GoogleMap
            mapContainerStyle={{ width: "1800px", height: "500px" }}
            zoom={16}
            center={
              userLocation || {
                lat: -29.84070004871264,
                lng: 31.013305225128306,
              }
            }
          >
            {userLocation && (
              <Marker
                position={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(22, 22),
                }}
              />
            )}
            {barbershops.map((shop) => (
              <Marker
                key={shop.BarbershopID}
                position={{
                  lat: parseFloat(shop.latitude),
                  lng: parseFloat(shop.longitude),
                }}
                onClick={() => handleMarkerClick(shop)}
              />
            ))}
            {selectedShop && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedShop.latitude),
                  lng: parseFloat(selectedShop.longitude),
                }}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div>
                  <h2>{selectedShop.Name}</h2>
                  <p>
                    <strong>Address:</strong> {selectedShop.Address}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedShop.contact}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        <div className="barbershops-container">
        {filteredBarbershops.map((shop) => (
          <div key={shop.BarbershopID} className="shop-card">
            <div className="shop-card-header">
              <Link
                to={{
                  pathname: `/barbers/${shop.BarbershopID}`,
                  state: {
                    barbershopName: shop.Name,
                  },
                }}
                className="shop-link"
              >
                <img
                  src={shop.imageurl}
                  alt={shop.Name}
                  className="shop-image"
                />
                <div className="shop-info-container">
                  <h2 className="shop-name">{shop.Name}</h2>
                  <p>
                    <strong>Address:</strong> {shop.Address}
                  </p>
                  <p>
                    <strong>Contact:</strong> {shop.contact}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Barbershops;
