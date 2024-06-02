import Stripe from "stripe";


export const createCheckOutSession = async({line_items,customer_email,metadata,discounts})=>{
  const stripe = new Stripe(process.env.STRIPE_CONNECTION)
  const paymentMethod = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    line_items,
    customer_email,
    success_url:process.env.SUCCESS_URL,
    cancel_url:process.env.CANCEL_URL,
    mode:'payment',
    metadata,
    discounts
  })
  return paymentMethod
}



export const createPaymentMethod = async(token)=>{
  const stripe = new Stripe(process.env.STRIPE_CONNECTION)
  const paymentMethod = await stripe.paymentMethods.create({
    type:'card',
    card:{
      token
    }
  })  
  return paymentMethod
}

export const createPaymentIntent = async ({amount})=>{
  const stripe = new Stripe(process.env.STRIPE_CONNECTION)
  // create payment method 
  const paymentMethod = await createPaymentMethod('tok_visa')
  const paymentIntent = await stripe.paymentIntents.create({
    amount:amount * 100,
    currency: 'EGP',
    automatic_payment_methods:{
      enabled:true,
      allow_redirects:'never'
    },
    payment_method:paymentMethod.id
  })
  return paymentIntent
}
  const retrievePaymentIntent = async (paymentIntentId)=>{
  const stripe = new Stripe(process.env.STRIPE_CONNECTION)
  const retrieve = await stripe.paymentIntents.retrieve(paymentIntentId)
  return retrieve
  }
  export const confimedPaymentIntent = async ({paymentIntentId})=>{
  const stripe = new Stripe(process.env.STRIPE_CONNECTION)
  // get payment_method 
  const retrieve = await retrievePaymentIntent(paymentIntentId)
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId,{
    payment_method:retrieve.payment_method
  })
  return paymentIntent
  }