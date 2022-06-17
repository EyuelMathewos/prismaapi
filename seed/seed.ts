import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
    const user = await prisma.user.create({
        data: {
            name: "eyuels",
            email: "eyuels@gmail.com",
            password: "1234",
            role: 1
          },
        
        })
        const item = await prisma.item.create({
            data: {
              itemname: "item name",
              itemprice: 123
            },
          })
          const order = await prisma.order.create({
            data: {
              itemId: 1,
              itemAmount: 2,
              customerId: 1
            },
          })



  console.log(user);
  console.log(item);
  console.log(order);

}

main().catch((error: Error)=>{
    console.error(error)
    process.exit(1)
}).finally(async ()=>{
    await prisma.$disconnect()
})