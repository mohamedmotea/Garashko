import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as RC from './reservation.controller.js'
import * as validationSchema from './reservation.validation.js'
import auth from './../../Middlewares/auth.middleware.js';
import vld from './../../Middlewares/validation.middleware.js';
import { role } from "../../utils/system-rules.js";


const router = Router()

router.post('/:parkingId',vld(validationSchema.addReservation),auth([role.USER,role.SUPERADMIN]),expressAsyncHandler(RC.reservation))


// payment -> stripe
.post('/checkout/:reservationId',auth([role.USER,role.SUPERADMIN,role.ADMIN]),expressAsyncHandler(RC.payWithStripe))
// .post('/webhook',expressAsyncHandler(OC.webhookLocal))
export default router