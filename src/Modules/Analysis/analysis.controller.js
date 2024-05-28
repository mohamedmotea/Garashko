import User from "../../../DB/Models/user.model.js"
import Vehicle from "../../../DB/Models/vehicle.model.js"
import Parking from './../../../DB/Models/parking.model.js';
import Reservation from '../../../DB/Models/reservation.model.js';

import limitAnalysisDate from "../../../functions/limitAnalysisDate.js"


export const users = async (req,res,next) => {
  const users = await User.find()
  const {data,labels} = limitAnalysisDate({documents:users})
  const total = data.reduce((a,b)=> a+b,0)
  // return the wallet data
  res.status(200).json({message:'fetched users details',data,labels,total,success:true})
}

export const vehicles = async (req,res,next) => {
  const vehicles = await Vehicle.find()
  const {data,labels} = limitAnalysisDate({documents:vehicles})
  const total = data.reduce((a,b)=> a+b,0)
  // return the wallet data
  res.status(200).json({message:'fetched vehicles details',data,labels,total,success:true})
}

export const parkings = async (req,res,next) => {
  const parkings = await Parking.find()

  const {data,labels} = limitAnalysisDate({documents:parkings})
  const total = data.reduce((a,b)=> a+b,0)
  // return the wallet data
  res.status(200).json({message:'fetched parkings details',data,labels,total,success:true})
}

export const reservation = async (req,res,next) => {
  const reservation = await Reservation.find()
  const {data,labels} = limitAnalysisDate({documents:reservation})
  const total = data.reduce((a,b)=> a+b,0)
  // return the wallet data
  res.status(200).json({message:'fetched reservation details',data,labels,total,success:true})
}