import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { createRule, updateRule } from "../validator/rolesValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');
// import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
const prisma = new PrismaClient();

interface CustomRequest extends Request {
  ability ? : any
}

//const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields || "*" };

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
      try{
            // ForbiddenError.from(req.ability).throwUnlessCan('read', "roles");
            // let fields = permittedFieldsOf(req.ability, 'read', "roles" , options);
            const roles = await prisma.roles.findMany({});
            res.json(roles);
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
          // ForbiddenError.from(req.ability).throwUnlessCan('create', "roles");
          validator(req.body, createRule, {}).then(async (response: any) => {
            const valdationStatus: boolean = response.status;
            if( valdationStatus ){
                    const roles = await prisma.roles.create({
                      data: {
                           name: req.body.name
                      },
                    });
                    res.json(roles)
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
      const id = parseInt(req.params.id);
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "roles");
        const roles = await prisma.roles.findMany({
          where: {
            id,
          },
        }).catch((error: string) => {
          res.json(error)
        })
        res.json(roles);
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
    console.log({id})
      try{
          // ForbiddenError.from(req.ability).throwUnlessCan('update', "roles");
          validator(req.body, createRule, {}).then(async (response: any) => {
          const roles = await prisma.roles.update({
            where: {
              id
            },
            data: {
              name: req.body.name
            },
          });
          res.json(roles)
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

  .delete(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
      try {
          ForbiddenError.from(req.ability).throwUnlessCan('delete', "roles");
          const roles = await prisma.roles.delete({
            where: {
              id,
            },
          });
          res.json(roles)
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