const request = require("supertest");
const dayjs = require("dayjs");
const app = require("../../app");
const { Car } = require("../../app/models");

dayjs().format();

describe("POST /v1/cars/:id/rent", () => {
  let carResponse;
  let accessTokenAdmin;
  let accessTokenCustomer;
  let customer;
  const rentStartedAt = dayjs().add(1, "day");
  // const rentStartedAt = '2022-06-07T22:20:55.029Z';
  const rentEndedAt = dayjs(rentStartedAt).add(1, "day");
  // const rentEndedAt = '2022-06-07T22:20:55.029Z';

  beforeAll(async () => {
    accessTokenAdmin = await request(app).post("/v1/auth/login").send({
      email: "ilham@binar.co.id",
      password: "123456",
    });

    accessTokenCustomer = await request(app).post("/v1/auth/login").send({
      email: "Fikri@binar.co.id",
      password: "123456",
    });

    carResponse = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessTokenAdmin.body.accessToken}`)
      .send({
        name: "Lamborghini Aniisah Baru",
        price: 2500000,
        size: "LARGE",
        image: "https://source.unsplash.com/500x500",
      });

    return carResponse;
  });

  // afterAll(async () => {
  //   await Car.destroy({
  //     where: { id: carResponse.body.id },
  //   });
  // });

  it("pinjam mobil belum auth", () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(res.body);
      });
  });
  it("pinjam mobil tanpa input", () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set("Authorization", `Bearer ${accessTokenCustomer.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({})
      .then((response) => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
          error: {
            name: "Error",
            message: "rentStartedAt must not be empty!!",
            details: null,
          },
        });
      });
  });
  it("pinjam mobil", () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set("Authorization", `Bearer ${accessTokenCustomer.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt })
      .then((response) => {
        expect(response.statusCode).toBe(201);
        // expect(res.body).toEqual(res.body);
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          carId: expect.any(Number),
          userId: expect.any(Number),
          rentStartedAt: expect.any(String),
          rentEndedAt: expect.any(String),
        });
      });
  });

  it("pinjam mobil yg udah dipinjem", () => {
    return request(app)
      .post(`/v1/cars/${carResponse.body.id}/rent`)
      .set("Authorization", `Bearer ${accessTokenCustomer.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt })
      .then((response) => {
        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
          error: {
            name: expect.any(String),
            message: expect.any(String),
          },
        });
      });
  });
});
