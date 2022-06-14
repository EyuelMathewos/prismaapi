import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validator } from "../validator/index";
import { validationRule, loginValidation } from "../validator/userValidation";
const { requiresAuth } = require('express-openid-connect');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

interface CustomRequest extends Request {
  oidc ?: any
}

router.route("/")

  .get( requiresAuth(),async (req: CustomRequest, res: Response, ) => {
    const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields };
      const users = await prisma.user.findMany({


      }).catch((error: string) => {
        res.send(error);
      })
      res.json(users);
   

  })


  .post(async (req: CustomRequest, res: Response) => {

      req.body.role = parseInt(req.body.role)
      validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
              // Store hash in your password DB.
              if (err) {
                console.log(`ERROR : ${err}`);
              } else {
                const user = await prisma.user.create({
                  data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: req.body.role
                  },
                }).catch((error: string) => {
                  res.send(error);
                })

                res.json(user)
              }
            });
          });
        }
      });
  })

router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {

      validator(req.body, loginValidation, {}, async (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {

          const users = await prisma.user.findMany({
            where: {
              email: req.body.email
            }
          }).catch((error: string) => {
            res.send(error);
          })

          let isPasswordMatch = bcrypt.compareSync(req.body.password, users[0].password);
          //console.log(value);
          if ( isPasswordMatch ) {
            const accessTokens = await prisma.accessTokens.create({
              data: {
                clientId: users[0].id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600,
              },
            }).catch((error: string) => {
              res.send(error);
            })


            let encrypt = jwt.sign(
              accessTokens,
              process.env.SECRET
            );
            res.json({
              // id: accessTokens[0].id,
              clientId: users[0].id,
              token: encrypt
            });

          } else {
            res.status(401);
            res.send("Incorrect Password or Account Name")
          }
        }
      });
  })


router.route("/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
      const accessTokens = await prisma.accessTokens.findMany({

      }).catch((error: string) => {
        res.send(error);
      })
      res.send(accessTokens);
  })

  .patch(async (req: CustomRequest, res: Response) => {
      const accessTokens = await prisma.accessTokens.update({
        data: {
          id: req.body.id,
          clientId: req.body.clientId,
          iat: 0,
          ext: parseInt(req.body.ext),
        },
      }).catch((error: string) => {
        res.send(error);
      })

      res.json(accessTokens)
  })

router.route("/:id/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    const accessTokens = await prisma.accessTokens.findMany({
      where: {
        id,
      },
    }).catch((error: string) => {
      console.log("server error" + error)
    })
    res.json(accessTokens);
  })

router.route("/:id/accesstokens/:tokenid")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
      const accessTokens = await prisma.accessTokens.findMany({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(accessTokens);
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
      const accessTokens = await prisma.accessTokens.delete({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(accessTokens);
  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params;
      const users = await prisma.user.findMany({
        where: {
          id,
        },
        // include: { tokens: true },
      }).catch((error: string) => {
        res.json(error)
      })
      res.json(users);
  })

  .put(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params

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

  })

  .delete(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params

      const user = await prisma.user.delete({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.json(error);
      })
      res.json(user)

  })




module.exports = router;