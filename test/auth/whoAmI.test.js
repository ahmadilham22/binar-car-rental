const request = require("supertest");
const app = require("../../app");
const { User } = require("../../app/models");

let accessTokenAdmin;
let accessTokenCustomer;
let user;
describe("WHOAMI", () => {
  beforeAll(async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "Ilham@binar.co.id",
      password: "123456",
    });
    accessTokenAdmin = response.body.accessToken;
    user = await request(app).post("/v1/auth/register").send({
      name: "ang",
      email: "vision@binar.co.id",
      password: "ang",
    });
    accessTokenCustomer = user.body.accessToken;
  });
  afterAll(async () => {
    await User.destroy({
      where: {
        email: "vision@binar.co.id",
      },
    });
  });
  it("Define who logged in (CUSTOMER)", () => {
    return request(app)
      .get("/v1/auth/whoami")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessTokenCustomer}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          image: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
  });
  it("Define who logged in (ADMIN)", () => {
    return request(app)
      .get("/v1/auth/whoami")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessTokenAdmin}`)
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
          error: {
            name: "Error",
            message: "Access forbidden!",
            details: {
              role: "ADMIN",
              reason: "ADMIN is not allowed to perform this operation.",
            },
          },
        });
      });
  });
  describe("Define deleted user response", () => {
    beforeEach(async () => {
      await User.destroy({
        where: {
          email: "vision@binar.co.id",
        },
      });
    });
    it("Define who logged in while user already deleted", async () => {
      return request(app)
        .get("/v1/auth/whoami")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${accessTokenCustomer}`)
        .then((res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body).toEqual({
            error: {
              name: "ang",
              message: "ang not found!",
              details: { name: "ang" },
            },
          });
        });
    });
  });
});
