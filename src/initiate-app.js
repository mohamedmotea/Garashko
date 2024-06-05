import cors from 'cors'
import db_connection from '../DB/connection.js'
import * as router from './Modules/index.routers.js'
import globalResponse from './Middlewares/global-response.middleware.js';
import rollbackSavedDocuments from './Middlewares/rollback-saved-documents.middleware.js';
import morgan from 'morgan';

const initiateApp = async (app,express)=>{

  // cors 
  app.use(cors());
  app.use(express.json())
  const port = process.env.PORT
  await db_connection()
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

  // routers
  app.use('/api/v1/auth', router.authRouter)
  app.use('/api/v1/user', router.userRouter)
  app.use('/api/v1/vehicle', router.vehicleRouter)
  app.use('/api/v1/parking', router.parkingRouter)
  app.use('/api/v1/reservation', router.reservationRouter)
  app.use('/api/v1/rate', router.rateRouter)
  app.use('/api/v1/service', router.serviceRouter)
  app.use('/api/v1/order', router.OrderRouter)
  app.use('/api/v1/wallet', router.walletRouter)
  app.use('/api/v1/analysis', router.analysisRouter)
  app.use('/api/v1/banner', router.bannerRouter)
  app.use('/api/v1/payment', router.paymentMethodRouter)
  
  // Handle middlewares
  app.use(globalResponse,rollbackSavedDocuments)
  app.use('*',(req,res,next)=> res.status(404).json({message:'page not found'}))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default initiateApp;