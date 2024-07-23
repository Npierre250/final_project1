import axios from "axios"
import dotenv from "dotenv"
import Subscription from "../models/Subscription.js"
const paypackJs = require("paypack-js").default

dotenv.config()

// const paypack = paypackJs.config({
//   client_id: "ce6f7f28-16ae-11ef-a940-deade826d28d",
//   client_secret:
//     "e53b53631cf0b72f62ea9cc4eb2ea05cda39a3ee5e6b4b0d3255bfef95601890afd80709"
// })

export const createSubscription = async (req, res) => {
  const user = req.user
  const {
    amount,
    currency,
    beneficiaryName,
    sender,
    senderCountry,
    mobileNumber
  } = req.body

  try {
    const details = {
      account_bank: "MPS",
      account_number: "2540782773934",
      amount,
      currency,
      beneficiary_name: beneficiaryName,
      meta: {
        sender,
        sender_country: senderCountry,
        mobile_number: mobileNumber
      }
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/transfers",
      details,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    )

    const subscriptionDate = new Date()
    const expiryDate = new Date(subscriptionDate)
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    const subscription = new Subscription({
      userId: user._id,
      amount,
      currency,
      subscriptionDate,
      expiryDate,
      status: response.data.status,
      transactionId: response.data.data.id,
      sender: user.name,
      mobileNumber
    })

    await subscription.save()

    res.status(200).json(subscription)
  } catch (error) {
    console.log(error.message)
    res
      .status(500)
      .json({ message: "Subscription creation failed", error: error.message })
  }
}

export const getAllSubscriptions = async (req, res) => {
  try {
    const user = req.user
    if (!user || user.role !== "superAdmin") {
      return res.status(403).json({ message: "unauthorized user!" })
    }
    const subscriptions = await Subscription.find()
    res.status(200).json(subscriptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error. Please try again later." })
  }
}

const { client_id, client_secret } = process.env

const paypack = paypackJs.config({
  client_id: client_id,
  client_secret: client_secret
})

export const payment = async (req, res) => {
  try {
    // const { number, amount } = req.body
    let paymentRef = ""

    const result = await paypack.cashin({
      number: req.body.number,
      amount: 100,
      // amount: req.body.amount,
      environment: "development"
    })

    console.log(result)

    paymentRef = result.data.ref

    setTimeout(async () => {
      try {
        console.log("Helloooooooo")

        const result = await paypack.transactions({ offset: 0, limit: 100 })
        const transactions = result.data.transactions

        if (!Array.isArray(transactions)) {
          return res.status(400).json("Invalid data format")
        }

        const isPaid = transactions.some(
          (transaction) => transaction.ref === paymentRef
        )

        if (isPaid) {
          return res.status(200).json({
            status: "paid",
            message: "user paid",
            paymentRef
          })
        } else {
          return res.status(500).json({
            message: "User didn't pay yet"
          })
        }
      } catch (err) {
        return res.status(500).json({
          error: true,
          message: "Error fetching transactions",
          error: err
        })
      }
    }, 120000)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
