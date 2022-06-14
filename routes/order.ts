import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { orderValidation } from "../validator/orderValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requiresAuth } = require('express-openid-connect');
const prisma = new PrismaClient()

router.route("/")
  .get(async (req: Request, res: Response) => {
      const orders = await prisma.order.findMany({
        include: {
          item: true
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(orders);
  })


  .post(requiresAuth(), async (req: Request, res: Response) => {
      validator(req.body, orderValidation, {}, async (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {
          const order = await prisma.order.create({
            data: {
              itemId: parseInt(req.body.itemId),
              itemAmount: parseInt(req.body.itemAmount),
              customerId: parseInt(req.body.customerId)
            },
          }).catch((error: string) => {
            res.send(error);
          })
          res.json(order)
        }
      });
  })

router.route("/customerorder/:id")
  .get(async (req: Request, res: Response) => {
    const {
      id
    } = req.params;
      const users = await prisma.user.findMany({
        where: {
          id,
        },
        include: {
          orders: true
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(users);

  })

module.exports = router;