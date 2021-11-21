import algebra from "../src";

const inferredAlgebraic = algebra(function* (request) {
  const val = yield* request("test").as<number>();
  const otherVal = yield* request("secondTest").as<string>();
  if (false) yield* request("third").as<boolean>();
  const unknowable = yield* request("unknowable");
  return { vals: [val * 10, otherVal] as [number, string], unknowable };
});

(async () => {
  console.log(process.memoryUsage().heapUsed);
  for (let i = 0; i < 10000; i++) {
    await inferredAlgebraic()
      .case("test", 3)
      .case("secondTest", "sdf")
      .case("unknowable", "gotcha!")
      .do();
  }
  console.log(process.memoryUsage().heapUsed);
})();
