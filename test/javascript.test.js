"use strict";
import algebra from "../dist/index.js";

test("Should return string interpolated with fallback values", () => {
  const getNameOfUser = jest.fn((_) => undefined);
  const getAgeOfUser = jest.fn((_) => undefined);

  const getUser = algebra(function* getUser(_, id) {
    const name = getNameOfUser(id) ?? (yield "name");
    const age = getAgeOfUser(id) ?? (yield "age");

    return `USER ${name}: ${age} years old`;
  });
  const userString = getUser(100)
    .case("name", "John Smith")
    .case("age", 18)
    .do();
  expect(userString).toBe("USER John Smith: 18 years old");
});

test("Should return string interpolated with fallback values -- ASYNC", async () => {
  const getNameOfUser = jest.fn(async (id) => undefined);
  const getAgeOfUser = jest.fn(async (id) => undefined);

  const getUser = algebra(async function* getUser(_, id) {
    const name = (await getNameOfUser(id)) ?? (yield "name");
    const age = (await getAgeOfUser(id)) ?? (yield "age");

    return `USER ${name}: ${age} years old`;
  });
  const userString = await getUser(100)
    .case("name", "John Smith")
    .case("age", 18)
    .do();
  expect(userString).toBe("USER John Smith: 18 years old");
});
