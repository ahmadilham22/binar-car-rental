const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
dotenv.config();

describe("get car", () => {
  it("return 200", async () => {
    request(app)
      .get("/v1/cars/150")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
          })
        );
      });
  });
});
