// import supertest from "supertest";
// const userapi = require("../app");
// const request = supertest(userapi);
// const { auth } = require('express-openid-connect');

// describe('user status test',()=>{
//     beforeAll( async()=>{
//         const response = await request.post("/users").send({
//             name: "eyuelmathewos@gmail.com",
//             password: "12345678"
//         });
//     })

//     test('validation error check user',async()=>{
//         const response = await request.post("/users").send({
//             name:"eyuel@gmail.com",
//             password:12345678
//         });
//         expect(response.status).toBe(412);
//     })

//     // test('get user',async()=>{
//     //     const response = await request.get("/users");
//     //     expect(response.status).toBe(200);
//     // })

//     test('create user',async()=>{
//         const response = await request.post("/users").send({
//             name:"eyuel@gmail.com",
//             email: "test@gmail.com",
//             password: "1234567",
//             role: "1"
//         });
//         expect(response.status).toBe(200);
//     })


// })