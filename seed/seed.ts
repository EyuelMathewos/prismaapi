import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){

    const rol = await prisma.roles.createMany({
    data: [
      { name: 'admin' },
      { name: 'member' },
      { name: 'ANONYMOUS_ABILITY' }
    ]
    })  

  const createMany = await prisma.permissions.createMany({
    data: [
      /**
       * 
   roleId       Int
    name         String      
    action       String
    subject      String
    conditions   Json
    fields       Json
       */
      { roleId: 1, name: 'read user', action: 'read', subject: 'user', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'create user', action: 'create', subject: 'user', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'update user', action: 'update', subject: 'user', conditions:{ id: '${user.id}'}, fields: "[{}]" },
      { roleId: 1, name: 'delete user', action: 'delete', subject: 'user', conditions:{ id: '${user.id}'}, fields: "[{}]" },
  
      { roleId: 1, name: 'read permissions', action: 'read', subject: 'permissions', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'create permissions', action: 'create', subject: 'permissions', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'update permissions', action: 'update', subject: 'permissions', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'delete permissions', action: 'delete', subject: 'permissions', conditions:{}, fields: "[{}]" },
  
      { roleId: 1, name: 'read roles', action: 'read', subject: 'roles', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'create roles', action: 'create', subject: 'roles', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'update roles', action: 'update', subject: 'roles', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'delete roles', action: 'delete', subject: 'roles', conditions:{}, fields: "[{}]" },
  
      { roleId: 1, name: 'read Item', action: 'read', subject: 'Item', conditions:{}, fields: "[{}]" },
      { roleId: 1, name: 'create Item', action: 'create', subject: 'Item', conditions:{}, fields: "" },
      { roleId: 1, name: 'update Item', action: 'update', subject: 'Item', conditions:{ id: '${user.id}'}, fields: "[{}]" },
      { roleId: 1, name: 'delete Item', action: 'delete', subject: 'Item', conditions:{ id: '${user.id}'}, fields: "[{}]" },
    ],
  })

    const user = await prisma.user.createMany({
        data: [
          { name:"admin", email: 'admin@casl.io', password: '$2a$10$610kHDOd83wTjDENcHreQestQ3PtoSsN.0PXg2D5mh74TIcsWXae6', role: 1 },
          { name:"author",email: 'author@casl.io', password: '$2a$10$610kHDOd83wTjDENcHreQestQ3PtoSsN.0PXg2D5mh74TIcsWXae6', role: 2 },
          ]
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
}

main().catch((error: Error)=>{
    console.error(error)
    process.exit(1)
}).finally(async ()=>{
    await prisma.$disconnect()
})