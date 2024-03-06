import express, { query } from "express";
import mysql from "mysql2";
import cors from "cors";
import Stripe from 'stripe';
import bodyParser from "body-parser"
import mysqlp from 'mysql2/promise'


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const stripe = Stripe("sk_test_51OKdzKIO5u1pqsD26ftt2rV5GOsiQeAZn0ZXrIY1SGrW4YZnj1owlp7sPIarNZn1qanfhJmnGHX2APWmtbId0Mju008L0ONENR");

const db = mysql.createConnection({
// host:"ozzicleaningservices.co.za",
// user:"aatzhvut_gcina",
// password:"!Qaz2wsx",
// database:"aatzhvut_snyp" 

// host:"snyp.co.za",
// user:"fapnzlbn_snypuser",
// password:"!Qaz2wsx",
// database:"fapnzlbn_snypDB" 

host: "localhost",
  user: "root",
  password: "!Qaz2wsx",
  database: "snypdb",
});
// Create a connection pool for MySQL
const pool = mysqlp.createPool({

  // host:"snyp.co.za",
  // user:"fapnzlbn_snypuser",
  // password:"!Qaz2wsx",
  // database:"fapnzlbn_snypDB" 

  host: "localhost",
  user: "root",
  password: "!Qaz2wsx",
  database: "snypdb",
});
//fetch Barbershops
app.get("/barbershops", (req, res) => {
  const q = "SELECT * FROM barbershops";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
//Fetch Barbershop Name to display in Barber.js
app.get("/barbershops/:barbershopId", (req, res) => {
  const barbershopId = req.params.barbershopId;
  const q = "SELECT b.*, bs.Name as BarbershopName FROM barbershops b INNER JOIN barbershops bs ON b.BarbershopID = bs.BarbershopID WHERE b.BarbershopID = ?";
  db.query(q, [barbershopId], (err, data) => {
      if(err) return res.json(err);
      return res.json(data);
  });
});
//Fetch Barbers
app.get("/barbers/:barbershopId", (req, res) => {
  const barbershopId = req.params.barbershopId;
  const q = "SELECT * FROM barbers WHERE BarbershopID = ?";
  db.query(q, [barbershopId], (err, data) => {
      if(err) return res.json(err);
      return res.json(data);
  });
});
//Fetch Barber name and image to display in services
app.get("/getbarber/:barberId", (req, res) => {
  const barberId = req.params.barberId;
  const q = "SELECT BarberID, Name, profilepic FROM barbers WHERE BarberID = ?";
  db.query(q, [barberId], (err, data) => {
    if(err) return res.json(err);
    return res.json(data[0]);
  });
});
//Fetch Services
app.get("/services/:barberId", (req, res) => {
  const barberId = req.params.barberId;
  // Directly query the Services table since it now contains a BarberID column
  const q = "SELECT ServiceID, ServiceName, Description, Price, Duration FROM Services WHERE BarberIDs = ?";
  db.query(q, [barberId], (err, data) => {
      if(err) return res.json(err);
      return res.json(data);
  });
});

 //Save timeslot data
 app.post('/saveOpenSlot', async (req, res) => {
  try {
    const { barbershopID, barberID, chosenServices, serviceDuration, totalPrice, chosenDate, chosenTime, firstName, lastName, phone, email } = req.body;
    const timeSlotCheck = await pool.query(
      "SELECT COUNT(*) AS count FROM openslot WHERE chosenDate = ? AND chosenTime = ?",
      [chosenDate, chosenTime]
    );
    if (timeSlotCheck[0].count > 0) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }
    if (!barbershopID || !barberID || !chosenServices || !serviceDuration || !totalPrice || !chosenDate || !chosenTime || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await pool.query(
      'INSERT INTO openslot (BarbershopsID, BarbersID, chosenServices, serviceDuration, totalPrice, chosenDate, chosenTime, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [barbershopID, barberID, chosenServices, serviceDuration, totalPrice, chosenDate, chosenTime, firstName, lastName, phone, email]
    );

    res.json({ message: 'Open slot saved successfully', openslotID: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving open slot to the database' });
  }
});
// ... Payment Stripe ...

app.post('/create-payment-intent', async (req, res) => {
  const {paymentMethodType, currency,paymentMethodOptions, totalPrice } = req.body;

  // Each payment method type has support for different currencies. In order to
  // support many payment method types and several currencies, this server
  // endpoint accepts both the payment method type and the currency as
  // parameters. To get compatible payment method types, pass 
  // `automatic_payment_methods[enabled]=true` and enable types in your dashboard 
  // at https://dashboard.stripe.com/settings/payment_methods.
  //
  // Some example payment method types include `card`, `ideal`, and `link`.
  const params = {
    payment_method_types: paymentMethodType === 'card' ? ['card'] : [paymentMethodType],
    amount: totalPrice,
    currency: currency,
  }

  // If this is for an ACSS payment, we add payment_method_options to create
  // the Mandate.
  if(paymentMethodType === 'acss_debit') {
    params.payment_method_options = {
      acss_debit: {
        mandate_options: {
          payment_schedule: 'sporadic',
          transaction_type: 'personal',
        },
      },
    }
  } else if (paymentMethodType === 'konbini') {
    /**
     * Default value of the payment_method_options
     */
    params.payment_method_options = {
      konbini: {
        product_description: 'Tシャツ',
        expires_after_days: 3,
      },
    }
  } else if (paymentMethodType === 'customer_balance') {
    params.payment_method_data = {
      type: 'customer_balance',
    }
    params.confirm = true
    params.customer = req.body.customerId || await stripe.customers.create().then(data => data.id)
  }

  /**
   * If API given this data, we can overwride it
   */
  if (paymentMethodOptions) {
    params.payment_method_options = paymentMethodOptions
  }

  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      nextAction: paymentIntent.next_action,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});
app.listen(3000, () => {
  console.log("SnypWeb is Online");
});
