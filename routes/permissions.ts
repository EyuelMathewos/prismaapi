import express, { Request, Response } from 'express';
import { validator } from "../validator/index";
import { createRule, updateRule } from "../validator/permissionValidation";

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require('@casl/ability');
// import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
const prisma = new PrismaClient();

interface CustomRequest extends Request {
  ability ? : any
}

// const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields || "*" };

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
      try{
            // ForbiddenError.from(req.ability).throwUnlessCan('read', "permissions");
            // let fields = permittedFieldsOf(req.ability, 'read', "permissions" , options);
            const permissions = await prisma.permissions.findMany({});
            res.json(permissions);
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
          // ForbiddenError.from(req.ability).throwUnlessCan('create', "permissions");
          validator(req.body, createRule, {}).then(async (response: any) => {
            const accessId: number = parseInt(req.body.accessId);
            const roleId: number = parseInt(req.body.roleId);
            const data = {
              accessId,
              roleId
            }
            const valdationStatus: boolean = response.status;
            if( valdationStatus ){
                    const permissions = await prisma.permissions.create({
                       data,
                    });
                    res.json(permissions)
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
        ForbiddenError.from(req.ability).throwUnlessCan('read', "permissions");
        const permissions = await prisma.permissions.findMany({
          where: {
            id,
          },
        }).catch((error: string) => {
          res.json(error)
        })
        res.json(permissions);
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
    const accessId: number = parseInt(req.body.accessId);
    const roleId: number = parseInt(req.body.roleId);
    const data = {
      accessId,
      roleId
    }
      try{
          // ForbiddenError.from(req.ability).throwUnlessCan('update', "permissions");
          validator(req.body, createRule, {}).then(async (response: any) => {
          const permissions = await prisma.permissions.update({
            where: {
              id
            },
            data,
          });
          res.json(permissions)
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
          ForbiddenError.from(req.ability).throwUnlessCan('delete', "permissions");
          const permissions = await prisma.permissions.delete({
            where: {
              id,
            },
          });
          res.json(permissions)
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