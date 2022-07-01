import bcrypt from 'bcryptjs';
const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function authHandler(){

}

export function getUser  ( email : string ) {
  return new Promise(async  (resolve, reject) => {
      try{
        const users = await prisma.user.findUnique({
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
        const users = await prisma.user.findUnique({
          where: {
            id: clientId
          }
        });
        const permissions = await prisma.permissions.findMany({
          where: {
            roleId : users.role
          },
        });
        resolve(permissions);
      }catch( error ){
        reject(error);
      }
  })
}
// ANONYMOUS_ABILITY
export function anonymousAbility  ( ) {  
  return new Promise(async  (resolve, reject) => {
      try{
        const anonymousrole = await prisma.roles.findFirst({
          where: {
            name: "ANONYMOUS_ABILITY"
          }
        });
        const permissions = await prisma.permissions.findMany({
          where: {
            roleId : anonymousrole.id
          },
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
