import Banner from "../../../DB/Models/banner.model.js"
import ApiFeatures from "../../utils/api-feature.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import uniqueString from "../../utils/generate-unique-string.js"
import generateQrCode from "../../utils/qrcode.js"

export const singleBanner = async (req,res,next) => {
  // destructuring the required data from request params
  const {bannerId} = req.params
  // get the banner data
  const banner = await Banner.findById(bannerId)
  if(!banner) return next(new Error('Banner not found',{cause:404}))
    // QrCode 
    const qrcode = await generateQrCode(banner)
  // return the banner data
  res.status(200).json({message:'fetched Banner details',data:banner,qrcode,success:true})
}

export const banners = async (req,res,next) => {
  const {page,size,...search} = req.query
  const apiFeature = new ApiFeatures(req.query,Banner.find()).pagination({page,size}).search(search)
  const banner = await apiFeature.mongooseQuery
  res.status(200).json({message:'fetched banners details',data:banner,success:true})
}

export const addBanner = async (req,res,next) => {
  // destructuring the required data from request params
  const {name,description,link} = req.body
  // get the banner data
  const banner = await Banner.findOne({name})
  if(banner) return next(new Error('Banner is exist',{cause:404}))
    // create new banner
  const folderId = uniqueString(4)
  // uploud image in cloudinary 
  
  const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
    folder: `${process.env.MAIN_FOLDER}/banners/${folderId}`
  })
  req.folder = `${process.env.MAIN_FOLDER}/banners/${folderId}`

  const newBanner = await Banner.create({name,description,image:{public_id,secure_url},folderId,link})
  if(!newBanner) return next(new Error('Banner is not created',{cause:404}))
    // QrCode 
    const qrcode = await generateQrCode(banner)
  // return the banner data
  res.status(200).json({message:'fetched Banner details',data:banner,qrcode,success:true})
}

export const updateBanner = async (req,res,next) => {
  // destructuring the required data from request params
  const {bannerId} = req.params
  const {name,description,link} = req.body

  // get the banner data
  const banner = await Banner.findById(bannerId)
  if(!banner) return next(new Error('Banner not found',{cause:404}))
  // uploud image in cloudinary 
  if(name) banner.name = name
  if(description) banner.description = description
  if(link) banner.link = link
  if(req.file){

    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
      folder: `${process.env.MAIN_FOLDER}/banners/${banner.folderId}`
    })
    banner.image.public_id = public_id
    banner.image.secure_url = secure_url
  }
  req.folder = `${process.env.MAIN_FOLDER}/banners/${banner.folderId}`

  res.status(200).json({message:'updated Banner details',data:banner,success:true})

}

export const deleteBanner = async (req,res,next) => {
  // destructuring the required data from request params
  const {bannerId} = req.params
  // get the banner data
  const banner = await Banner.findByIdAndDelete(bannerId)
  if(!banner) return next(new Error('Banner not found',{cause:404}))
  // return the banner data
  res.status(200).json({message:'deleted Banner details',data:banner,success:true})
}