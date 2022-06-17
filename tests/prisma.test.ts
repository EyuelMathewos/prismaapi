const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
describe('Prisma client test',()=>{
    test('test query',async()=>{
        const data = await prisma.user.findMany({take: 1, select:{id:true}})
        expect(data).toBeTruthy()
    })

})
