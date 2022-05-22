import express,{ Request, Response} from 'express';
import bcrypt from 'bcryptjs';
var jwt = require('jsonwebtoken'); 

var router = express.Router();
var { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()



router.route("/")
.get( async (req:Request, res:Response) => {
  
  const orders = await prisma.order.findMany({
  //   where: { published : (true) },
    include: { item: true },
  }).catch((error:string) => {
    console.log("server error" + error)
  })
  res.json(orders);
})


.post (async (req:Request, res:Response) => {
  console.log(req.body);
  const order =  await prisma.order.create({
    data: {
      itemId: req.body.itemId,
      itemAmount: parseInt(req.body.itemAmount),
      customerId: req.body.customerId
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })

 res.json(order)

})

router.route("/customerorder/:id")
.get( async (req:Request, res:Response) => {
  const { id } = req.params;
  
  const users = await prisma.user.findMany({
    where: {
      id,
    },
    include: { orders: true },
  }).catch((error: string) => {
    console.log("server error pme" + error)
  })
  res.json(users);
})

module.exports = router;
