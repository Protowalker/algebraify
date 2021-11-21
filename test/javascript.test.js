const algebra = require("../dist/index.js").default;
const inferredAlgebraic = algebra(async function* () {
  const val = yield "test";
  const otherVal = yield "secondTest";
  const unknowable = yield "unknowable";
  return { vals: [val, otherVal], unknowable };
});

(async () => {
  for (let i = 0; i < 10; i++) {
    const val = await inferredAlgebraic()
      .case("test", 0)
      .case("secondTest", "sdf")
      .case("unknowable", "gotcha!")
      .do();
    console.log(val);
  }
})();
