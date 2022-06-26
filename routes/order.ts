import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { orderValidation } from "../validator/orderValidation";
const router = express.Router();
const { ForbiddenError } = require('@casl/ability');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'Order')) {
      const orders = await prisma.order.findMany({
        include: {
          item: true
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(orders);
    }else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "Order");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })


  .post( async (req: CustomRequest, res: Response) => {
    if (req.ability.can('create', 'Order')) {
      validator(req.body, orderValidation, {}).then(async (response: any) => {
       
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
        
      });
    }else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "Order");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/customerorder/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params;
    if (req.ability.can('read', 'Order')) {
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

  })

module.exports = router;