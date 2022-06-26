import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { createRule, updateRule } from "../validator/accesslistValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');
import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
const prisma = new PrismaClient();

interface CustomRequest extends Request {
  ability ? : any
}

const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields || "*" };

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
      try{
            // ForbiddenError.from(req.ability).throwUnlessCan('read', "accesslist");
            let fields = permittedFieldsOf(req.ability, 'read', "accesslist" , options);
            const accesslist = await prisma.accesslist.findMany({});
            res.json(accesslist);
      }catch (error: any) {
            if ( error instanceof ForbiddenError ) {
              return res.status(403).send({
                status: 'forbidden',
                message: error.message
              });
            } else {
              res.send(error);
            }
      }
  })


  .post(async (req: CustomRequest, res: Response) => {
      try{
          // ForbiddenError.from(req.ability).throwUnlessCan('create', "accesslist");
          validator(req.body, createRule, {}).then(async (response: any) => {
            let valdationStatus: Boolean = response.status;
            if( valdationStatus ){
                    const accesslist = await prisma.accesslist.create({
                      data: {
                           name: req.body.name,
                           action: req.body.action,
                           subject: req.body.subject,
                           conditions: [req.body.conditions],
                           fields: [req.body.fields]
                      },
                    });
                    res.json(accesslist)
            }
          }).catch((error: Error) => {
            res.status(412)
            res.send(error)
          });
    } catch (error: any) {
      if ( error instanceof ForbiddenError ) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      }
    }
  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
      const id = parseInt(req.params.id);;
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "accesslist");
        const accesslist = await prisma.accesslist.findMany({
          where: {
            id,
          },
        }).catch((error: string) => {
          res.json(error)
        })
        res.json(accesslist);
      } catch (error: any) {
        if ( error instanceof ForbiddenError ) {
          return res.status(403).send({
            status: 'forbidden',
            message: error.message
          });
        } else {
          res.send(error);
        }
      }
  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
      try{
        validator(req.body, updateRule, {}).then(async (response: any) => {
          // ForbiddenError.from(req.ability).throwUnlessCan('update', "accesslist");
          const accesslist = await prisma.accesslist.update({
            where: {
              id
            },
            data: {
              name: req.body.name,
              action: req.body.action,
              subject: req.body.subject,
              conditions: req.body.conditions,
              fields: req.body.fields,
            },
          });
          res.json(accesslist);
        })
        .catch((error: Error) => {
          res.status(412)
          res.send(error)
        });
      } catch (error: any) {
        if ( error instanceof ForbiddenError ) {
          return res.status(403).send({
            status: 'forbidden',
            message: error.message
          });
        } else {
          res.send(error);
        }
      }
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
      try {
          ForbiddenError.from(req.ability).throwUnlessCan('delete', "accesslist");
          const accesslist = await prisma.accesslist.delete({
            where: {
              id,
            },
          });
          res.json(accesslist)
      } catch (error: any) {
        if ( error instanceof ForbiddenError ) {
          return res.status(403).send({
            status: 'forbidden',
            message: error.message
          });
        } else {
          res.send(error);
        }
      }
  })

module.exports = router;