import React, { useState } from "react";
import moment from "moment";
import { useLocation } from "react-router-dom";
import "./slot.css";
import "./cart.css";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "./StatusMessages.js";
import visa from './visa.jpeg'

const SlotsDisplay = ({ selectedDate, result, handleSlotSelection }) => {
  if (!selectedDate) return null; // Don't display slots if no date is selected

  return (
    <div className="slots-section">
      <h3>{selectedDate}</h3>
      <div className="slots-container">
        {result && result.length > 0 ? (
          result.map((time, index) => (
            <button
              key={index}
              className="time-button"
              onClick={() => handleSlotSelection(time)}
            >
              <p>{time}</p>
            </button>
          ))
        ) : (
          <p>No available slots for this date.</p>
        )}
      </div>
    </div>
  );
};

export const Schedule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.state?.queryParams || "");

  let intime = "12:00 Pm";
  let outtime = "01:00 Pm";
  const [result, setResult] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTipAndContinue, setShowTipAndContinue] = useState(false); // Added state to control the visibility of the tip section and continue button

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const [messages, addMessage] = useMessages();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  
  const handleCreditCardClick = () => {
    setShowCheckout(true);
    // Assuming you want to close the booking modal when showing the checkout
  };
  const CancellationPolicyModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <h2>Cancellation Policy</h2>
          <p>
            You have time until 6:45 AM CST on February 28, 2024, to cancel this
            appointment without being charged.
          </p>
          <button
            className="continue-button"
            onClick={() => {
              setIsModalVisible(false);
              setIsBookingModalVisible(true);
            }}
          >
            I Agree
          </button>
        </div>
      </div>
    );
  };
  const BookingConfirmationModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
      <div className="modal-overlayB">
        <div className="modal-contentB">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <h2>Confirm booking</h2>
          {/* Content based on the uploaded image */}
          <div className="booking-details">
            <div className="booking-info">
              <div className="payment-methods">
                <button
                  className="payment-method-button"
                  onClick={handleCreditCardClick}
                >
                  <span className="icon">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 38 24"
                      width="38px"
                      height="24px"
                      class="Icon__StyledIcon-sc-43a46f19-0 goHVlK Icon__CheckoutV2PaymentMethodCard-sc-43a46f19-78 jOryCU"
                      alt="iconAlt.checkoutV2PaymentMethodCard"
                    >
                      <rect width="38" height="24" fill="#000" rx="3"></rect>
                      <path
                        fill="#fff"
                        d="M24.47 6.6H13.53c-1.018 0-1.53.658-1.53 1.96v.588h14V8.56c0-1.302-.507-1.96-1.53-1.96zm-10.476 8.84c-.288 0-.478-.253-.478-.607v-1.17c0-.36.19-.607.478-.607h1.194c.287 0 .477.247.477.607v1.17c0 .354-.19.607-.477.607zm-.463 1.96h10.938c1.024 0 1.53-.651 1.53-1.954v-4.862H12v4.862c0 1.303.512 1.954 1.53 1.954z"
                      ></path>
                    </svg>
                  </span>
                  Credit or debit card
                </button>
                {showCheckout && (
                  <>
                    <form onSubmit={handleSubmit} className="booking-form">
  
                    <div className="custom-input-container">
                        <input
                          type="text"
                          id="firstName"
                          className="custom-input"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          id="lastName"
                          className="custom-input"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="custom-input-container">
                        <input
                          type="email"
                          id="email"
                          className="custom-input"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="custom-input-container phone-number-input">
                        {/* Country flag dropdown component goes here */}
                        <input
                          type="tel"
                          id="phoneNumber"
                          className="custom-input"
                          placeholder="082 268"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
 
</form>
<form id="payment-form" onSubmit={handleSubmitCard}>
        <div className="card-details-modal">
          <div className="modal-header">
            <h2>Credit card </h2>
          </div>
          <div className="card-entry">
            <h3><img src={visa} alt="Visa" width={60} />  and more...</h3>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          <button type="submit" className="pay-button">Confirm</button>
        </div>
      </form>
                    <StatusMessages messages={messages} />
                  </>
                )}

                <button className="payment-method-button">
                  <span className="icon">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 38 24"
                      width="38px"
                      height="24px"
                      class="Icon__StyledIcon-sc-43a46f19-0 goHVlK Icon__CheckoutV2PaymentMethodPayInPerson-sc-43a46f19-80 YoBop"
                      alt="iconAlt.checkoutV2PaymentMethodPayInPerson"
                    >
                      <rect width="38" height="24" fill="#000" rx="3"></rect>
                      <g fill="#fff">
                        <path d="M22.8 6h-7.6L13 9v1.5a1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0V9z"></path>
                        <path
                          fill-rule="evenodd"
                          d="M14 13.966V17a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.035a3.538 3.538 0 0 1-2-.302c-.455.216-.963.337-1.5.337s-1.045-.121-1.5-.337c-.455.216-.963.337-1.5.337s-1.045-.121-1.5-.337a3.487 3.487 0 0 1-2 .302zM20.5 15v3h-3v-3z"
                          clip-rule="evenodd"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  Pay in Person
                </button>
              </div>
            </div>
            <button onClick={onClose}>Book</button>
          </div>
        </div>
      </div>
    );
  };
  function generateDates(startDate) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(startDate).add(i, "days");
      dates.push(date.format("YYYY-MM-DD"));
    }
    return dates;
  }
  function intervals(startString, endString) {
    var startTime = moment(startString, "hh:mm a");
    var endTime = moment(endString, "hh:mm a");
    startTime.minutes(Math.ceil(startTime.minutes() / 15) * 15);

    var times = [];
    var current = moment(startTime);

    while (current < endTime) {
      times.push(current.format("hh:mm a"));
      current.add(15, "minutes");
    }

    return times;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
  };
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        },
        iconColor: "#666EE8"
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    },
    hidePostalCode: true
  };
  const handleSubmitCard = async (e) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      addMessage("Stripe.js has not yet loaded.");
      return;
    }
    const totalPriceInCents = Math.round(totalPrice * 100); // Assuming totalPrice is a float representing dollars

    const { error: backendError, clientSecret } = await fetch(
      "http://192.168.8.111:3000/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodType: "card",
          currency: "ZAR",
          totalPrice: totalPriceInCents,
        }),
      }
    ).then((r) => r.json());

    if (backendError) {
      addMessage(backendError.message);
      return;
    }
    addMessage("Client secret returned");

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Gcinumusa Duma",
          },
        },
      });

    if (stripeError) {
      // Show error to your customer (e.g., insufficient funds)
      addMessage(stripeError.message);

      return;
    }
    addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    // Call saveOpenSlot here after successful payment
    saveOpenSlot();
  };
  const handleSlotSelection = (time) => {
    setSelectedTime(moment(time, "hh:mmA").format("HH:mm"));
    setShowTipAndContinue(true); // Show the tip section and continue button when a time slot is selected
  };
  const dates = generateDates(moment());
  intervals(intime, outtime);

  const cart = JSON.parse(queryParams.get("cart") || "[]");
  const totalPrice = parseFloat(queryParams.get("totalPrice") || "0");
  const totalDuration = parseFloat(queryParams.get("totalDuration") || "0");
  const day = queryParams.get("day");

  // Function to handle date selection and load slots
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    loadSlotsForDate(date); // Load slots for the selected date
  };

  // Function to load slots for a specific date
  const loadSlotsForDate = (date) => {
    // Logic to load slots based on the selected date
    // For example, you can call the intervals function here
    // Use setResult to update the slots
    const slots = intervals(intime, outtime); // Replace with actual logic
    setResult(slots);
  };
  const saveOpenSlot = async () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    // Prepare the data to be sent
    const bookingData = {
      barbershopID: 1, // Example ID, replace with actual data
      barberID: 1, // Example ID, replace with actual data
      chosenServices: JSON.stringify(cart.map((service) => service.ServiceID)),
      serviceDuration: totalDuration,
      totalPrice: totalPrice,
      chosenDate: formattedDate, // Ensure this is formatted correctly as per your database requirements
      chosenTime: selectedTime,
      firstName: firstName,
      lastName: lastName,
      phone: phoneNumber,
      email: email,
    };

    try {
      const response = await fetch("http://192.168.8.111:3000/saveOpenSlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save booking");
      }

      // Handle success
      console.log("Booking saved successfully:", responseData);
      // Redirect to a success page or show a success message
    } catch (error) {
      console.error("Error saving booking:", error);
      // Handle error (e.g., show error message)
    }
  };
  return (
    <div className="schedule-page">
      <h1>Schedule</h1>
      <div className="schedule-content">
        <div className="date-picker-section">
          <h2>Select a Date</h2>
          {dates.map((date, index) => (
            <button
              key={index}
              className={`date-button ${
                selectedDate === date ? "selected" : ""
              }`}
              onClick={() => handleDateSelection(date)}
            >
              <p>{date}</p>
            </button>
          ))}
        </div>
        <SlotsDisplay
          selectedDate={selectedDate}
          result={result}
          handleSlotSelection={handleSlotSelection}
        />
      </div>

      <div className="cart-container">
        <h2>Your order</h2>
        <div className="cart-details">
          <p>Today is: {day}</p>
          <p>Total Price: {totalPrice}</p>
          <p>Total Duration: {totalDuration}</p>
          {cart.map((service, index) => (
            <div key={index} className="cart-item">
              <div className="service-name"> + {service.ServiceName}</div>
              <div className="service-price">{`R${service.Price}`}</div>
            </div>
          ))}{" "}
          {selectedTime && (
            <p>
              {selectedDate} {selectedTime}
            </p>
          )}
          {showTipAndContinue && (
            <div className="cart-tip">
              <div>Tip</div>
              <div className="tip-options">
                <button>20%</button>
                <button>25%</button>
                <button>30%</button>
                <button>35%</button>
                <button>Custom</button>
              </div>
              <div className="cart-total">
                <div>Total</div>
                <div>{`R${totalPrice}`}</div>
              </div>
              <button
                className="continue-button"
                onClick={() => setIsModalVisible(true)}
              >
                Continue
              </button>
            </div>
          )}{" "}
          <CancellationPolicyModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
          <BookingConfirmationModal
            isVisible={isBookingModalVisible}
            onClose={() => setIsBookingModalVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
