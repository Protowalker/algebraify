import algebra from "../dist/index";
import "jest";

test("Should return string interpolated with fallback values", () => {
  const getNameOfUser = jest.fn((id): string | undefined => undefined);
  const getAgeOfUser = jest.fn((id): number | undefined => undefined);

  const getUser = algebra(function* getUser(request, id: number) {
    const name = getNameOfUser(id) ?? (yield* request("name").as<string>());
    const age = getAgeOfUser(id) ?? (yield* request("age").as<number>());
    return `USER ${name}: ${age} years old`;
  });
  const userString = getUser(100)
    .case("name", "John Smith")
    .case("age", 18)
    .do();
  expect(userString).toBe("USER John Smith: 18 years old");
});
test("Should return string interpolated with fallback values -- ASYNC", async () => {
  const getNameOfUser = jest.fn(
    async (id): Promise<string | undefined> => undefined
  );
  const getAgeOfUser = jest.fn(
    async (id): Promise<number | undefined> => undefined
  );

  const getUser = algebra(async function* getUser(request, id: number) {
    const name =
      (await getNameOfUser(id)) ?? (yield* request("name").as<string>());
    const age =
      (await getAgeOfUser(id)) ?? (yield* request("age").as<number>());
    return `USER ${name}: ${age} years old`;
  });
  const userString = await getUser(100)
    .case("name", "John Smith")
    .case("age", 18)
    .do();
  expect(userString).toBe("USER John Smith: 18 years old");
});
