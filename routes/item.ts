import express,{ Request, Response} from 'express';
import bcrypt from 'bcryptjs';
var jwt = require('jsonwebtoken'); 

var router = express.Router();
var { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()



router.route("/")
.get( async (req:Request, res:Response) => {
  
  const items = await prisma.item.findMany({
  //   where: { published : (true) },
  //   include: { author: true },
  }).catch((error:string) => {
    console.log("server error" + error)
  })
  res.json(items);
})


.post (async (req:Request, res:Response) => {
  const item =  await prisma.item.create({
    data: {
      itemname: req.body.itemname,
      itemprice: parseFloat(req.body.itemprice)
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })

 res.json(item)

})

module.exports = router;
