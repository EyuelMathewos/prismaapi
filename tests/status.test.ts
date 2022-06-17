const apis = require("../app");
const supertest = require("supertest");
const request = supertest(apis);

describe('status code check',()=>{
    test('status check for unAuthenticated user',async()=>{
        const response = await request.get("/users");
        expect(response.status).toBe(403);
    })

})