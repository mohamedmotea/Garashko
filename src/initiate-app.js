import cors from 'cors'
import db_connection from '../DB/connection.js'
import * as router from './Modules/index.routers.js'
import globalResponse from './Middlewares/global-response.middleware.js';
import rollbackSavedDocuments from './Middlewares/rollback-saved-documents.middleware.js';

const initiateApp = async (app,express)=>{

  // cors 
  app.use(cors());
  app.use(express.json())
  const port = process.env.PORT
  await db_connection()

  // routers
  app.use('/api/v1/auth', router.authRouter)
  app.use('/api/v1/user', router.userRouter)
  app.use('/api/v1/vehicle', router.vehicleRouter)
  app.use('/api/v1/parking', router.parkingRouter)
  app.use('/api/v1/reservation', router.reservationRouter)
  app.use('/api/v1/rate', router.rateRouter)
  // Handle middlewares
  app.use(globalResponse,rollbackSavedDocuments)
  app.use('*',(req,res,next)=> res.status(404).json({message:'page not found'}))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default initiateApp;