const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
dotenv.config();

describe("create car", () => {
  it("return 201 created", async () => {
    const loginAuth = {
      email: "Ilham@binar.co.id",
      password: "123456",
    };

    await request(app).post("/v1/auth/register").send(loginAuth);

    const response = await request(app).post("/v1/auth/login").send(loginAuth);

    const token = `Bearer ${response.body.accessToken}`;

    const carPayload = {
      name: "Mazda RX4",
      price: 300000,
      size: "small",
    };

    await request(app)
      .post("/v1/cars")
      .set("Authorization", token)
      .send(carPayload)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
  });
});
