import { Response } from "superagent";
import supertest from "supertest";
const userapi = require("../app");
const request = supertest(userapi);
let bearerToken: Response;

describe('user status test',()=>{
    beforeAll( async()=>{
            const response = await request.post("/users/login").send({
            email: "test12@gmail.com",
            password: "123456"
        });
        bearerToken = response.body.token
    })

    test('validation error check user',async()=>{
        const response = await request.post("/users").send({
            name:"eyuel@gmail.com",
            password:12345678
        });
        console.log(bearerToken)
        expect(response.status).toBe(412);
    })

    test('get user',async()=>{
        const response = await request.get("/users")
        .set('Authorization', `Bearer ${bearerToken}` );
        expect(response.status).toBe(200);
    })

    // test('create user',async()=>{
    //     const response = await request.post("/users").send({
    //         name:"eyuel@gmail.com",
    //         email: "test@gmail.com",
    //         password: "1234567",
    //         role: "1"
    //     });
    //     expect(response.status).toBe(200);
    // })


})
