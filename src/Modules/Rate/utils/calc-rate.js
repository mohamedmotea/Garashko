import Parking from "../../../../DB/Models/parking.model.js"
import Rate from "../../../../DB/Models/rate.model.js"

export const calcRate = async({parkingId})=>{
  let rateArr = []
  const rates = await Rate.find({parkingId})
  const park = await Parking.findById(parkingId)
  for (const rate of rates) {rateArr.push(rate.rating)}
  const reduceRate = rateArr.reduce((accumulator,currentValue)=> accumulator + currentValue,0 ) / rates.length
  park.rate = reduceRate.toFixed(1)
  await park.save()
  return park
}