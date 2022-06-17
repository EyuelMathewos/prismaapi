import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validator } from "../validator/index";
import { validationRule,loginValidation } from "../validator/userValidation";
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('@casl/ability');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require("../service/auth")

interface CustomRequest extends Request {
  ability ? : any
}

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'User')) {
      const users = await prisma.user.findMany({}).catch((error: string) => {
        res.send(error);
      })
      res.json(users);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })


  .post(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('create', 'User')) {
      req.body.role = parseInt(req.body.role)
      validator(req.body, validationRule, {}, async (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {
          var hash = await auth.generateHash(req.body.password)
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
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {

    if (req.ability.can('create', 'User')) {
      validator(req.body, loginValidation, {}, async (err, status) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {
          const users = await auth.getUser(req.body.email).catch((error: object) => {
            res.status(404).send("user not found");
          });
          let isPass = users[0]?.password != null ? bcrypt.compareSync(req.body.password, users[0].password) : false;
          if (isPass) {
            const accessTokens = await prisma.accessTokens.create({
              data: {
                clientId: users[0].id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
              },
            }).catch((error: string) => {
              res.send(error);
            })


            let encrypt = jwt.sign(accessTokens, process.env.SECRET);
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

    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }






  })


router.route("/accesstokens")
  //Access Token 
  .get(async (req: CustomRequest, res: Response) => {
    if (req.ability.can('read', 'accessTokes')) {
      const accessTokens = await prisma.accessTokens.findMany({

      }).catch((error: string) => {
        res.send(error);
      })
      res.send(accessTokens);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "accessTokes");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

  .patch(async (req: CustomRequest, res: Response) => {
    // console.log(req.body);
    if (req.ability.can('update', 'accessTokes')) {
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
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('update', "accessTokes");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/:id/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    if (req.ability.can('read', 'accessTokes')) {
      const accessTokens = await prisma.accessTokens.findMany({
        where: {
          id,
        },
      }).catch((error: string) => {
        console.log("server error" + error)
      })
      res.json(accessTokens);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "accessTokes");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/:id/accesstokens/:tokenid")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    if (req.ability.can('read', 'accessTokes')) {
      const accessTokens = await prisma.accessTokens.findMany({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(accessTokens);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "accessTokes");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    if (req.ability.can('delete', 'accessTokes')) {
      const accessTokens = await prisma.accessTokens.delete({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.send(error);
      })
      res.json(accessTokens);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('delete', "accessTokes");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params;
    if (req.ability.can('read', 'user')) {
      const users = await prisma.user.findMany({
        where: {
          id,
        },
        // include: { tokens: true },
      }).catch((error: string) => {
        res.json(error)
      })
      res.json(users);
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

  .put(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    if (req.ability.can('update', 'user')) {
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
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('read', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const {
      id
    } = req.params
    if (req.ability.can('update', 'user')) {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      }).catch((error: string) => {
        res.json(error);
      })
      res.json(user)
    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('update', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }
  })




module.exports = router;