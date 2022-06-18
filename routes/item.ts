import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { itemValidation } from "../validator/itemValidation";

var router = express.Router();
var { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');

const prisma = new PrismaClient()

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'Item')) {
      const items = await prisma.item.findMany({}).catch((error: string) => {
        res.send(error);
      })
      res.json(items);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "Item");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })


  .post(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('create', 'Item')) {
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
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "Item");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }


  })

module.exports = router;