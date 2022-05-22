import express,{ Request, Response} from 'express';
import bcrypt from 'bcryptjs';
var jwt = require('jsonwebtoken'); 

var router = express.Router();
var { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()



router.route("/")
.get( async (req:Request, res:Response) => {
  
  const users = await prisma.user.findMany({
  //   where: { published : (true) },
  //   include: { author: true },
  }).catch((error:string) => {
    console.log("server error" + error)
  })
  res.json(users);
})


.post (async (req:Request, res:Response) => {
  console.log(req.body);




  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, async function(err, hash) {
        // Store hash in your password DB.
        if (err) {
          console.log(`ERROR : ${err}`);
        } else {
        req.body.password = hash;
        const user =  await prisma.user.create({
          data: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: parseInt( req.body.role )
          },
        }).catch((error: string) => {
          console.log("server error" + error)
        })
      
       res.json(user)
      }
    });
});





})

router.route("/login")
.post( async (req:Request, res:Response) => {
  const users = await prisma.user.findMany({
    where: {
      email: req.body.email
    }
  }).catch((error: string) => {
    console.log("server error" + error)
  })

  let value = bcrypt.compareSync(req.body.password, users[0].password);
  //console.log(value);
  if (value == true) {
    const accessTokens =  await prisma.accessTokens.create({
      data: {
        clientId: users[0].id,
        iat: 0,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
      },
    }).catch((error: string) => {
      console.log("server error" + error)
    })


let encrypt = jwt.sign(
  accessTokens,
  "shhhhh"
);
// console.log(accesstokenid);
res.json({
  // id: accessTokens[0].id,
  clientId: users[0].id,
  token: encrypt
});
    // res.send({
    //   id: users[0].id,
    //   name: users[0].name,
    //   email: users[0].email
    // });

  } else {
    res.status(401);
    res.send("Incorrect Password or Account Name")
  }
})


router.route("/accesstokens")
//Access Token 
.get( async (req:Request, res:Response) => {
  
  const accessTokens = await prisma.accessTokens.findMany({

  }).catch((error:string) => {
    console.log("server error" + error)
  })
  res.send(accessTokens);
})

.post (async (req:Request, res:Response) => {
  console.log(req.body);

  const accessTokens =  await prisma.accessTokens.create({
    data: {
      id: req.body.id,
      clientId: req.body.clientId,
      iat: 0,
      ext: parseInt(req.body.ext),
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })

 res.json(accessTokens)
})

router.route("/:id/accesstokens")
.get( async (req:Request, res:Response) => {
  const { id } = req.params
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
.get( async (req:Request, res:Response) => {
  const { id } = req.params
  const accessTokens = await prisma.accessTokens.findMany({
    where: {
      id,
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })
  res.json(accessTokens);
})

.delete( async (req:Request, res:Response) => {
  const { id } = req.params
  const accessTokens = await prisma.accessTokens.delete({
    where: {
      id,
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })
  res.json(accessTokens)
})

router.route("/:id")
.get( async (req:Request, res:Response) => {
  const { id } = req.params;
  
  const users = await prisma.user.findMany({
    where: {
      id,
    },
    // include: { tokens: true },
  }).catch((error: string) => {
    console.log("server error pme" + error)
  })
  res.json(users);
})

.put( async (req:Request, res:Response) => {
  const { id } = req.params
  const user = await prisma.user.update({
    where: { id },
    data: {  
      name: req.body.name,
      email: req.body.email,
    },
  })
  res.json(user)
})

.delete( async (req:Request, res:Response) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: {
      id,
    },
  }).catch((error: string) => {
    console.log("server error" + error)
  })
  res.json(user)
})




module.exports = router;
