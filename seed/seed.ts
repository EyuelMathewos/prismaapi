import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){
  const createMany = await prisma.accesslist.createMany({
    data: [
      { name: 'read user', action: 'read', subject: 'users', conditions:{}, fields:"" },
      { name: 'create user', action: 'create', subject: 'users', conditions:{}, fields:"" },
      { name: 'update user', action: 'update', subject: 'users', conditions:{ id: '${user.id}'}, fields:"" },
      { name: 'delete user', action: 'delete', subject: 'users', conditions:{ id: '${user.id}'}, fields:"" },
  
      { name: 'read accesstokens', action: 'read', subject: 'accesstokens', conditions:{}, fields:"" },
      { name: 'create accesstokens', action: 'create', subject: 'accesstokens', conditions:{}, fields:"" },
      { name: 'update accesstokens', action: 'update', subject: 'accesstokens', conditions:{}, fields:"" },
      { name: 'delete accesstokens', action: 'delete', subject: 'accesstokens', conditions:{}, fields:"" },
  
      { name: 'read permissions', action: 'read', subject: 'permissions', conditions:{}, fields:"" },
      { name: 'create permissions', action: 'create', subject: 'permissions', conditions:{}, fields:"" },
      { name: 'update permissions', action: 'update', subject: 'permissions', conditions:{}, fields:"" },
      { name: 'delete permissions', action: 'delete', subject: 'permissions', conditions:{}, fields:"" },
  
      { name: 'read roles', action: 'read', subject: 'roles', conditions:{}, fields:"" },
      { name: 'create roles', action: 'create', subject: 'roles', conditions:{}, fields:"" },
      { name: 'update roles', action: 'update', subject: 'roles', conditions:{}, fields:"" },
      { name: 'delete roles', action: 'delete', subject: 'roles', conditions:{}, fields:"" },
  
      { name: 'read Item', action: 'read', subject: 'Item', conditions:{}, fields:"" },
      { name: 'create Item', action: 'create', subject: 'Item', conditions:{}, fields: "" },
      { name: 'update Item', action: 'update', subject: 'Item', conditions:{ id: '${user.id}'}, fields:"" },
      { name: 'delete Item', action: 'delete', subject: 'Item', conditions:{ id: '${user.id}'}, fields:"" },
  
      { name: 'read accesslist', action: 'read', subject: 'accesslist', conditions:{}, fields:"" },
      { name: 'create accesslist', action: 'create', subject: 'accesslist', conditions:{}, fields:"" },
      { name: 'update accesslist', action: 'update', subject: 'accesslist', conditions:{}, fields:"" },
      { name: 'delete accesslist', action: 'delete', subject: 'accesslist', conditions:{}, fields:"" },
    ],
  })
  const rol = await prisma.roles.createMany({
    data: [
      { name: 'admin' },
      { name: 'member' },
      { name: 'ANONYMOUS_ABILITY' }
    ]
    })  
    const permissions = await prisma.permissions.createMany({
      data: [
        { accessId: 1, roleId: 1  },
        { accessId: 2, roleId: 1  },
        { accessId: 3, roleId: 1  },
        { accessId: 4, roleId: 1  },
    
        { accessId: 5, roleId: 1  },
        { accessId: 6, roleId: 1  },
        { accessId: 7, roleId: 1  },
        { accessId: 8, roleId: 1  },
    
        { accessId: 9, roleId: 1  },
        { accessId: 10, roleId: 1  },
        { accessId: 11, roleId: 1  },
        { accessId: 12, roleId: 1  },
    
        { accessId: 13, roleId: 1  },
        { accessId: 14, roleId: 1  },
        { accessId: 15, roleId: 1  },
        { accessId: 16, roleId: 1  },
    
        { accessId: 17, roleId: 1  },
        { accessId: 18, roleId: 1  },
        { accessId: 19, roleId: 1  },
        { accessId: 20, roleId: 1  },
    
        { accessId: 21, roleId: 1  },
        { accessId: 22, roleId: 1  },
        { accessId: 23, roleId: 1  },
        { accessId: 24, roleId: 1  },
    
        { accessId: 1, roleId: 2  },
        { accessId: 2, roleId: 2  },
        { accessId: 3, roleId: 2  },
        { accessId: 4, roleId: 2  },
    
        { accessId: 5, roleId: 2  },
        { accessId: 6, roleId: 2  },
        { accessId: 7, roleId: 2  },
        { accessId: 8, roleId: 2  },
    
        { accessId: 17, roleId: 2  },
        { accessId: 18, roleId: 2  },
        { accessId: 19, roleId: 2  },
        { accessId: 20, roleId: 2  },
    
        { accessId: 2, roleId: 3  },
        { accessId: 17, roleId: 3 }
      ]
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