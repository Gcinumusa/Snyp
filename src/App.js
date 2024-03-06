import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Barbershops from "./components/Barbershops.js";
import Barber from "./components/barber.js";
import Service from "./components/service.js";
import Schedule from "./components/schedule.js";
import Success from "./components/Success.js";
import Register from "./components/Register.js";
import Detail from "./components/Detail.js";
import Home from "./components/Home.js";
import FoodGrid  from "./components/FoodGrid.js";
import Header from "./components/Header.js"; 
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51OKdzKIO5u1pqsD2UrO0ycpEWUkXOT6OvGzZWXiIqp9KI4FclQC8dWHaBgifn6cJs9UtrcjO3FBQCQzGnZ1HUCan00djYYkY17');

function App() {
  
  return (
    <div className="app">
     <Elements stripe={stripePromise}  >    
      <Router>
      <Header /> 
        <Routes> 
          {/* <Route path="/" element={<FoodGrid />} /> */}
          <Route path="/" element={<Barbershops />} />
          <Route path="/barbers/:barbershopId" element={<Barber />} />
          <Route path="/barbers/:barbershopId/services/:barberId"  element={<Service />} />
          <Route path="/schedules" element={<Schedule />} />
          <Route path="/success" element={<Success />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </Router>
      </Elements>
    </div>
  );
}

export default App;