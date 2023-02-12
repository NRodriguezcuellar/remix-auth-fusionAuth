import { createCookieSessionStorage } from "@remix-run/node";
import { FusionAuthStrategy } from "../src";

describe(FusionAuthStrategy, () => {
  let verify = jest.fn();
  // You will probably need a sessionStorage to test the strategy.
  let sessionStorage = createCookieSessionStorage({
    cookie: { secrets: ["s3cr3t"] },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should have the name of the strategy", () => {
    let strategy = new FusionAuthStrategy(
      {
        callbackURL: "https://example.app/oauth2/authorize",
        clientId: "exampleId",
        clientSecret: "exampleSecret",
        host: "example.app",
      },
      verify
    );
    expect(strategy.name).toBe("FusionAuth");
  });

  test.todo("Write more tests to check everything works as expected");
});
