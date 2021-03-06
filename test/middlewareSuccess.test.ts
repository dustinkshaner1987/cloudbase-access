import { HttpResult, Middleware, Router } from "../src/index";
import { MiddlewareType } from "../src/Middleware";

test("middleware test success", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const event = {
    body: {},
    path: "/actions/router",
  };
  const router = new Router(event, null, "test");

  router.configure(new BeforeStartMdw(stepResult));
  router.configure(new BeforeActionMdw(stepResult));
  router.configure(new BeforeSuccessEndMdw(stepResult));
  router.configure(new BeforeErrEndMdw(stepResult));

  console.log("mdw", MiddlewareType.BeforeAction, MiddlewareType.BeforeErrEnd);

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect(stepResult.step).toBe(111);
});

class BeforeStartMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeStart);
  }

  do(): Promise<HttpResult> {
    console.log("before start  ---   step", this.stepResult.step);
    this.stepResult.step += 1;
    return null;
  }
}

class BeforeActionMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeAction);
  }

  do(): Promise<HttpResult> {
    this.stepResult.step += 10;
    return null;
  }
}

class BeforeSuccessEndMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeSuccessEnd);
  }

  do(): Promise<HttpResult> {
    this.stepResult.step += 100;
    return null;
  }
}

class BeforeErrEndMdw extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super(MiddlewareType.BeforeErrEnd);
  }

  do(): Promise<HttpResult> {
    this.stepResult.step += 1000;
    return null;
  }
}
