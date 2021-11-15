import { algebra } from "./InferredGenerator";

const inferredAlgebraic = algebra(function* (request) {
  const val = yield "test";
  const otherVal = yield "secondTest";
  if (false) yield "third";
  const unknowable = yield "unknowable";
  return { vals: [val, otherVal], unknowable };
});

console.log(process.memoryUsage().heapTotal);
for (let i = 0; i < 10000; i++) {
  inferredAlgebraic()
    .case("test", 0)
    .case("secondTest", "sdf")
    .case("unknowable", "gotcha!")
    .do();
}
console.log(process.memoryUsage().heapTotal);
