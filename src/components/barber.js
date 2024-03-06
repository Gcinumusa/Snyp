import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Barbers.css";

const Barber = () => {
  const { barbershopId } = useParams();
  const [barbers, setBarbers] = useState([]);
  const [barbershopName, setBarbershopName] = useState("");

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await axios.get(`http://192.168.8.111:3000/barbers/${barbershopId}`);
        setBarbers(res.data);
        console.log("Barber data", res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBarbershopName = async () => {
      try {
        const res = await axios.get(`http://192.168.8.111:3000/barbershops/${barbershopId}`);
        const barbershop = res.data.find(item => item.BarbershopID === parseInt(barbershopId));
        setBarbershopName(barbershop.Name);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchBarbers();
    fetchBarbershopName();
  }, [barbershopId]);

  return (
    <div className="container">
    
    <div className="barber-grid">
      {barbers.map((barber, index) => (
        <div key={barber.BarberID} className="barber-card">
          <Link to={`/barbers/${barbershopId}/services/${barber.BarberID}`} state={{ barberImage: barber.profilepic }}>
            <img src={barber.profilepic} alt={`${barber.Name}`} />
            <h3>{barber.Name}</h3>
            <p>Available Today</p> {/* You'll need to adjust this based on actual availability */}
          </Link>
        </div>
      ))}
       {barbers.map((barber, index) => (
        <div key={barber.BarberID} className="barber-card">
          <Link to={`/barbers/${barbershopId}/services/${barber.BarberID}`} state={{ barberImage: barber.profilepic }}>
            <img src={barber.profilepic} alt={`${barber.Name}`} />
            <h3>{barber.Name}</h3>
            <p>Available Today</p> {/* You'll need to adjust this based on actual availability */}
          </Link>
        </div>
      ))}
       {barbers.map((barber, index) => (
        <div key={barber.BarberID} className="barber-card">
          <Link to={`/barbers/${barbershopId}/services/${barber.BarberID}`} state={{ barberImage: barber.profilepic }}>
            <img src={barber.profilepic} alt={`${barber.Name}`} />
            <h3>{barber.Name}</h3>
            <p>Available Today</p> {/* You'll need to adjust this based on actual availability */}
          </Link>
        </div>
      ))}
    </div>

    

    <div className="barbershop-layout">
      <h1 className="barbershop-title">{barbershopName}</h1>
      <div className="cards-container">
      <img alt="Barber Image." src="https://getsquire.com/booking/img/gallery_default_image.svg" decoding="async" data-nimg="fill" class="Image-sc-2d2e9dc9-0 VjNcK ImageWithShimmer__StyledImage-sc-f228a98f-0 gaHpWW" 
        style={{
          
          width: '200px',
          height: '100px',
       
        }} sizes="100vw" srcset="https://getsquire.com/booking/img/gallery_default_image.svg 640w, https://getsquire.com/booking/img/gallery_default_image.svg 750w, https://getsquire.com/booking/img/gallery_default_image.svg 828w, https://getsquire.com/booking/img/gallery_default_image.svg 1080w, https://getsquire.com/booking/img/gallery_default_image.svg 1200w, https://getsquire.com/booking/img/gallery_default_image.svg 1920w, https://getsquire.com/booking/img/gallery_default_image.svg 2048w, https://getsquire.com/booking/img/gallery_default_image.svg 3840w"/>
      <img alt="Barber Image." src="https://getsquire.com/booking/img/gallery_default_image.svg" decoding="async" data-nimg="fill" class="Image-sc-2d2e9dc9-0 VjNcK ImageWithShimmer__StyledImage-sc-f228a98f-0 gaHpWW" 
        style={{
          
          width: '200px',
          height: '100px',
       
        }} sizes="100vw" srcset="https://getsquire.com/booking/img/gallery_default_image.svg 640w, https://getsquire.com/booking/img/gallery_default_image.svg 750w, https://getsquire.com/booking/img/gallery_default_image.svg 828w, https://getsquire.com/booking/img/gallery_default_image.svg 1080w, https://getsquire.com/booking/img/gallery_default_image.svg 1200w, https://getsquire.com/booking/img/gallery_default_image.svg 1920w, https://getsquire.com/booking/img/gallery_default_image.svg 2048w, https://getsquire.com/booking/img/gallery_default_image.svg 3840w"/>
      <img alt="Barber Image." src="https://getsquire.com/booking/img/gallery_default_image.svg" decoding="async" data-nimg="fill" class="Image-sc-2d2e9dc9-0 VjNcK ImageWithShimmer__StyledImage-sc-f228a98f-0 gaHpWW" 
        style={{
          position: 'absolute',
          width: '400px',
          height: '100px',
       
        }} sizes="100vw" srcset="https://getsquire.com/booking/img/gallery_default_image.svg 640w, https://getsquire.com/booking/img/gallery_default_image.svg 750w, https://getsquire.com/booking/img/gallery_default_image.svg 828w, https://getsquire.com/booking/img/gallery_default_image.svg 1080w, https://getsquire.com/booking/img/gallery_default_image.svg 1200w, https://getsquire.com/booking/img/gallery_default_image.svg 1920w, https://getsquire.com/booking/img/gallery_default_image.svg 2048w, https://getsquire.com/booking/img/gallery_default_image.svg 3840w"/>
     
    
        
      </div>
    </div>
  </div>
  );
};

export default Barber;