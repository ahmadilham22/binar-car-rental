const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
dotenv.config();

describe("Cars", () => {
  it("Get all car list", () =>
    request(app)
      .get("/v1/cars")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            cars: expect.arrayContaining([expect.any(Object)]),
            meta: expect.objectContaining({ pagination: expect.any(Object) }),
          })
        );
      }));
});
