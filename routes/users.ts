import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validator } from "../validator/index";
import { validationRule,loginValidation } from "../validator/userValidation";
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { accessibleBy } = require('@casl/prisma');
const { permittedFieldsOf } = require('@casl/ability/extra');
const { ForbiddenError } = require('@casl/ability');


const prisma = new PrismaClient();
const { getUser, generateHash } = require("../service/auth");
const {selectedFields} = require("../service/selectFields")

interface CustomRequest extends Request {
  ability ? : any
}
const ALL_FIELDS = ["email","name"];
const options = { fieldsFrom: (rule: { fields? : JSON | any; }) => rule.fields } ;



router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
      try{
            ForbiddenError.from(req.ability).throwUnlessCan('read', "user");
            let fields = permittedFieldsOf(req.ability, 'read', "user" , options);
            const user = await prisma.user.findMany({
              where: accessibleBy(req.ability).user,
              select: selectedFields(fields, ALL_FIELDS)
            });
            res.json(user);
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
          ForbiddenError.from(req.ability).throwUnlessCan('create', "user");
          let role : Number = parseInt(req.body.role)
          validator(req.body, validationRule, {}).then(async (response: any) => {
            let valdationStatus: Boolean = response.status;
            if( valdationStatus ){
                    var hash = await generateHash(req.body.password);
                    const user = await prisma.user.create({
                      data: {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        role: role
                      },
                    });
                    res.json(user)
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

router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {
        try{
          ForbiddenError.from(req.ability).throwUnlessCan('create', "user");
          validator(req.body, loginValidation, {}).then(async (response: any) => {
            let valdationStatus: Boolean = response.status;
            if(valdationStatus){
                  const user = await getUser(req.body.email);
                  let isPass = user?.password != null ? bcrypt.compareSync(req.body.password, user.password) : false;
                  if (isPass) {
                    const accesstokens = {
                        clientId: user.id,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        role: user.role
                    };
                   
                    let encrypt = jwt.sign(accesstokens, process.env.SECRET);
                    res.json({
                      clientId: user.id,
                      token: encrypt
                    });
                  } 
                  else {
                    res.status(401);
                    res.json({message: "Incorrect Password or Account Name"})
                  }
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


router.route("/accesstokens")
  //Access Token 
  .get(async (req: CustomRequest, res: Response) => {
       try {
            ForbiddenError.from(req.ability).throwUnlessCan('read', "accesstokens");
            const accesstokens = await prisma.accesstokens.findMany({});
            res.send(accesstokens);
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

  .patch(async (req: CustomRequest, res: Response) => {
       try{ 
            ForbiddenError.from(req.ability).throwUnlessCan('update', "accesstokens");
            const accesstokens = await prisma.accesstokens.update({
              data: {
                id: req.body.id,
                clientId: req.body.clientId,
                iat: 0,
                ext: parseInt(req.body.ext),
              },
            });
            res.json(accesstokens)
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

router.route("/:id/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);;
        try{
            ForbiddenError.from(req.ability).throwUnlessCan('read', "accesstokens");
            const accesstokens = await prisma.accesstokens.findMany({
                where: {
                  id,
                },
            });
            res.json(accesstokens);
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

router.route("/:id/accesstokens/:tokenid")
  .get(async (req: CustomRequest, res: Response) => {
    const id = parseInt(req.params.id);
         try{
            ForbiddenError.from(req.ability).throwUnlessCan('read', "accesstokens");
            const accesstokens = await prisma.accesstokens.findMany({
              where: {
                id,
              },
            });
            res.json(accesstokens);
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
    const id = parseInt(req.params.id);;
           try{
              ForbiddenError.from(req.ability).throwUnlessCan('delete', "accesstokens");
              const accesstokens = await prisma.accesstokens.delete({
                  where: {
                    id,
                  },
              });
              res.json(accesstokens);
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
        ForbiddenError.from(req.ability).throwUnlessCan('read', "user");
        const user = await prisma.user.findMany({
          where: {
            id,
          },
          // include: { tokens: true },
        }).catch((error: string) => {
          res.json(error)
        })
        res.json(user);
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
          ForbiddenError.from(req.ability).throwUnlessCan('update', "user");
          const user = await prisma.user.update({
            where: {
              id
            },
            data: {
              name: req.body.name,
              email: req.body.email,
            },
          })
          res.json(user)
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
          ForbiddenError.from(req.ability).throwUnlessCan('delete', "user");
          const user = await prisma.user.delete({
            where: {
              id,
            },
          });
          res.json(user)
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