import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { itemValidation } from "../validator/itemValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requiresAuth } = require('express-openid-connect');
const prisma = new PrismaClient()



router.route("/")
  .get(async (req: Request, res: Response) => {

      const items = await prisma.item.findMany({}).catch((error: string) => {
        res.send(error);
      })
      res.json(items);

  })


  .post( requiresAuth(), async (req: Request, res: Response ) => {

      validator(req.body, itemValidation, {}, async (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {
          const item = await prisma.item.create({
            data: {
              itemname: req.body.itemname,
              itemprice: parseInt(req.body.itemprice)
            },
          }).catch((error: string) => {
            res.send(error);
          })

          res.json(item)
        }
      });



  })

module.exports = router;