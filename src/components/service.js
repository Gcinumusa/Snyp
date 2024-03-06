import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Service.css"; // Make sure your CSS file is correctly imported

const Service = () => {
  const { barberId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [barber, setBarber] = useState(null);

  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    return days[now.getDay()];
  };

  const handleBookAppointment = () => {
    if (cart.length > 0) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.append("cart", JSON.stringify(cart));
      queryParams.append("totalPrice", totalPrice);
      queryParams.append("totalDuration", totalDuration);
      queryParams.append("day", getCurrentDay());

      navigate("/schedules", { state: { queryParams: queryParams.toString() } });
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`http://192.168.8.111:3000/services/${barberId}`);
        setServices(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServices();
  }, [barberId]);

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const res = await axios.get(`http://192.168.8.111:3000/getbarber/${barberId}`);
        setBarber(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBarber();
  }, [barberId]);

  const addToCart = (service) => {
    const newCart = cart.some((s) => s.ServiceID === service.ServiceID) ? cart.filter((s) => s.ServiceID !== service.ServiceID) : [...cart, service];
    setCart(newCart);

    const newTotalPrice = newCart.reduce((acc, curr) => acc + Number(curr.Price), 0);
    const newTotalDuration = newCart.reduce((acc, curr) => acc + curr.Duration, 0);

    setTotalPrice(newTotalPrice);
    setTotalDuration(newTotalDuration);
  };

  const formatPrice = (price) => new Intl.NumberFormat("en-US", { style: "currency", currency: "ZAR" }).format(price);
  const formatDuration = (duration) => `${duration} mins`;
  const truncateServiceName = (name) => {
    return name.length > 10 ? name.substring(0, 30) + "..." : name;
  };
  
  return (
    <div className="services-container">
      <h1>Services</h1>
      <div className="services-grid">
        {services.map((service) => (
          <div className="service-item" key={service.ServiceID} onClick={() => addToCart(service)}>
            <button className="info-button" onClick={(e) => {
      e.stopPropagation(); // Prevent addToCart when clicking the button
      // Handle info action here, for example, show details about the service
      console.log("Info for", service.ServiceID);
    }}>
      <i className="fas fa-info"></i> {/* FontAwesome Info Icon */}
    </button>
           <span className="service-name">{truncateServiceName(service.ServiceName)}</span>
           <span className="service-price">{formatDuration(service.Duration)}</span>
           <span className="service-duration">{formatPrice(service.Price)}</span>
           
           
          </div>
        ))}
      </div>
      <h2>Your Order</h2>
      <div>
        {barber && (
          <div>
            <h3>{barber.Name}</h3>
            <img src={barber.profilepic} alt={barber.BarberName} width={150} />
          </div>
        )}
        {cart.map((service) => (
          <div key={service.ServiceID}>
            {service.ServiceName} ------------- {formatPrice(service.Price)}
          </div>
        ))}
      </div>
      <p>Total Price: {formatPrice(totalPrice)}</p>
      <p>Total Duration: {formatDuration(totalDuration)}</p>
      <button onClick={handleBookAppointment}>Book Appointment</button>
    </div>
  );
};

export default Service;
