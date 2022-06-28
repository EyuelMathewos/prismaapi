import bcrypt from 'bcryptjs';
import { access } from 'fs';
const  { PrismaClient } = require('@prisma/client');
const  { accesslist } = require('@prisma/client');
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
        // let permissions = await prisma.permissions.findMany({
        //  // include: { access: true },
        //   where: {
        //     roleId: users[0].role
        //   },
        //   include: { access: true },           
        // });

        let permissions = await prisma.$queryRaw`SELECT * FROM 
        permissions FULL OUTER JOIN accesslist ON permissions."accessId" = accesslist.id WHERE permissions."roleId"= ${users[0].role}`

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
