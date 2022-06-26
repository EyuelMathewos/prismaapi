import bcrypt from 'bcryptjs';
const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function authHandler(){

}

export function getUser  ( email : string ) {
  return new Promise(async  (resolve, reject) => {
      try{
        const users = await prisma.user.findMany({
          where: {
            email: email
          }
        })
        resolve(users);
      }catch( error ){
        reject(error);
      }
  })
}

export function getUserRoles  ( clientId : any ) {
  return new Promise(async  (resolve, reject) => {
      try{
        const users = await prisma.user.findMany({
          where: {
            id: clientId
          }
        });
        let permissions = await prisma.permissions.findMany({
          where: {
            roleId: users[0].role
          },
          include: { access: true },
        });
        resolve(permissions);
      }catch( error ){
        reject(error);
      }
  })
}

export function generateHash ( password : string ) {
  return new Promise(async  (resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password , salt, async function (err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve ( hash );
          }
        });
      });
    }
)}
