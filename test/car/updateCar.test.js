const request = require("supertest");
const app = require("../../app");
const { Car } = require("../../app/models");

describe("Cars", () => {
  let car;
  let accessToken;
  beforeAll(async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "Ilham@binar.co.id",
      password: "123456",
    });
    accessToken = response.body.accessToken;
    car = await Car.create({
      name: "tes before update",
      price: 20000,
      size: "SMALL",
      image: "https://source.unsplash.com/500x500",
      isCurrentlyRented: false,
    });
    return car;
  });

  afterAll(() => car.destroy());

  it("Update car", async () => {
    return await request(app)
      .put(`/v1/cars/${car.id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "tes after update",
        price: 3000000,
        image: "https://source.unsplash.com/500x500",
        size: "LARGE",
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          message: "succesfully updated",
          data: {
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            isCurrentlyRented: expect.any(Boolean),
            updatedAt: expect.any(String),
            createdAt: expect.any(String),
          },
        });
      });
  });
  it("Update car with wrong input id", () => {
    return request(app)
      .put("/v1/cars/-972362736")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Lamborgini after update",
        price: 3000000,
        image: "https://source.unsplash.com/500x500",
        size: "LARGE",
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({
          error: {
            name: "TypeError",
            message: "Cannot read properties of null (reading 'id')",
          },
        });
      });
  });
});
