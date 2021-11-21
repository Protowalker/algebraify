# Algebraify

## Algebraic Effects Are Here! (sort of)

(If you're unfamiliar with algebraic effects, here's a great article: [Algebraic Effects for the Rest of Us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/))

This is a single-goal library that utilizes generators to add algebraic effects to javascript and typescript.

## Examples

### Javascript
```js
import algebra from "algebraify";
const getUser = algebra(function* getUser(_, id) => {
  
  const name = getNameOfUser(id) ?? yield "name";
  const age = getAgeOfUser(id) ?? yield "age";
  
  return `USER ${name}: ${age} years old`;
});

const userString = getUser(100)
  .case("name", "John Smith")
  .case("age", 18)
  .do();
// userString will fallback to using the name john smith and the age 18 if those respective calls fail

// Same setup, but async:

// Just change to an async generator function
const getUser = algebra(async function* getUser(_, id) => {
  
  const name = await getNameOfUser(id) ?? yield "name";
  const age = await getAgeOfUser(id) ?? yield "age";
  
  return `USER ${name}: ${age} years old`;
});

// And then await the promise returned by do()
const userString = await getUser(100)
  .case("name", "John Smith")
  .case("age", 18)
  .do();
```


### Typescript
```ts
import algebra from "algebraify";
const getUser = algebra(function* getUser(request, id: number) => {
  
  // Note the calls to request and subsequent calls to as
  const name = getNameOfUser(id) ?? yield* request("name").as<string>();
  const age = getAgeOfUser(id) ?? yield* request("age").as<number>();
  
  return `USER ${name}: ${age} years old`;
});

const userString = getUser(100)
  .case("name", "John Smith")
  .case("age", 18)
  .do();

// userString will have the type `USER: ${string}: ${number} years old`

// Async changes are identical in ts
```

The request parameter is a function that returns a narrowly typed iterator. You don't need to know the details of how it works to use it; `yield* request("name").as<string>()` is basically the same as doing `yield "name"`, but using some type magic to tell typescript to trust us on the return type.


## Contributing
Please contribute! I've never made a library that I wanted other people to use before, and my experience with JS/TS is small compared to my programming career. I'd appreciate it a ton!

