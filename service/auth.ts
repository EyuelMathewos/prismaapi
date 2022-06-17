import bcrypt from 'bcryptjs';
const  { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function authHandler(){

}

module.exports = {
getUser: async function ( email:string ){
    return new Promise(async  (resolve, reject) => {
    const users = await prisma.user.findMany({
        where: {
          email: email
        }
      }).catch((error:any)=>{
        reject(error);
      })
      resolve(users);
})
},
generateHash: async ( password : string ) => {
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


}
