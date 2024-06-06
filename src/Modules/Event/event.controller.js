import Banner from "../../../DB/Models/banner.model.js"
import Event from "../../../DB/Models/event.model.js"
import User from "../../../DB/Models/user.model.js"
import ApiFeatures from "../../utils/api-feature.js"
import generateQrCode from "../../utils/qrcode.js"

export const singleEvent = async (req,res,next) => {
  // destructuring the required data from request params
  const {eventId} = req.params
  // get the event data
  const event = await Event.findById(eventId).populate(['users','banner'])
  if(!event) return next(new Error('event not found',{cause:404}))
    // QrCode 
    const qrcode = await generateQrCode(event)
  // return the event data
  res.status(200).json({message:'fetched event details',data:event,qrcode,success:true})
}

export const events = async (req,res,next) => {
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,Event.find().populate(['users','banner'])).pagination({page,size}).search(search)
  const event = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched event details',data:event,success:true})
}

export const addEvent = async (req,res,next) => {
  // destructuring the required data from request params
  const {name,description,link,banner} = req.body
  // get the event data
  const checkEvent = await Event.findOne({name})
  if(checkEvent) return next(new Error('Event is exist',{cause:404}))
  const checkBanner = await Banner.findById(banner)
  if(!checkBanner) return next(new Error('Banner Notfound',{cause:404}))

  const event = await Event.create({name,description,link,banner})
  if(!event) return next(new Error('event is not created',{cause:404}))
    // QrCode 
    const qrcode = await generateQrCode(event)
  // return the event data
  res.status(200).json({message:'fetched Banner details',data:event,qrcode,success:true})
}

export const updateEvent = async (req,res,next) => {
  // destructuring the required data from request params
  const {eventId} = req.params
  const {name,description,link,banner} = req.body

  // get the event data
  const event = await Event.findById(eventId).populate(['users','banner'])
  if(!event) return next(new Error('Event not found',{cause:404}))
  if(name) {
    const checkName = await Event.findOne({name})
    if(checkName) return next(new Error('Event is exist',{cause:404}))
      event.name = name
  }
  if(description)  event.description = description
  
  if(link) event.link = link
  if(banner) {
    const checkBanner = await Banner.findById(banner)
    if(checkBanner) return next(new Error('Banner Notfound',{cause:404}))
      event.banner = banner
  }
  await event.save()
  res.status(200).json({message:'updated Event details',data:event,success:true})

}

export const deleteEvent = async (req,res,next) => {
  // destructuring the required data from request params
  const {eventId} = req.params
  // get the event data
  const event = await Event.findByIdAndDelete(eventId)
  if(!event) return next(new Error('event not found',{cause:404}))
  // return the event data
  res.status(200).json({message:'deleted event details',data:event,success:true})
}

export const subscribeEvent = async (req,res,next) => {
  // destructuring the required data from request params
  const {eventId} = req.params
  const {id} = req.user
  // get the event data
  const event = await Event.findById(eventId).populate(['users','banner'])
  if(!event) return next(new Error('event not found',{cause:404}))
  const isInclude = event.users.includes(id)
  console.log(isInclude)
  isInclude ? event.users.pull(id) : event.users.push(id)
  await event.save()
  // return the event data
  res.status(200).json({message:`تم ${isInclude ? "الغاء الحجز" : "الحجز" } بنجاح`,data:event,success:true})
}

export const subscribeHandlerEvent = async(req, res,next) => {
  const {eventId} = req.params
  const {userId} = req.body
  const event = await Event.findById(eventId).populate(['users','banner'])
  if(!event) return next(new Error('event not found',{cause:404}))
    const user = await User.findById(userId)
  if(!user) return next(new Error('user not found',{cause:404}))
    const isInclude = event.users.includes(userId)
    isInclude? event.users.pull(userId) : event.users.push(userId)
    await event.save()
    res.status(200).json({message:`تم ${isInclude? "الغاء الحجز" : "الحجز" } بنجاح`,data:event,success:true})
}