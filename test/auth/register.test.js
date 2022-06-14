const request = require("supertest");
const app = require("../../app");
const { User } = require("../../app/models");

describe("User", () => {
  let user;
  afterAll(async () => {
    user = await User.destroy({
      where: {
        email: "hulk@binar.co.id",
      },
    });
  });
  it("Register user", () => {
    return request(app)
      .post("/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        name: "hulk",
        email: "hulk@binar.co.id",
        password: "hulk",
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          accessToken: expect.any(String),
        });
      });
  });
  it("Register user with already taken email", () => {
    return request(app)
      .post("/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        name: "aunur",
        email: "hulk@binar.co.id",
        password: "aunur",
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect.objectContaining({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: {
              email: expect.any(String),
            },
          },
        });
      });
  });
  it("Register user with empty input", () => {
    return request(app)
      .post("/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        name: "",
        email: "",
        password: "",
      })
      .then((res) => {
        expect(res.statusCode).toBe(500);
        expect.objectContaining({
          error: {
            name: expect.any(String),
            message: expect.any(String),
            details: null,
          },
        });
      });
  });
});
