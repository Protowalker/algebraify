# Algebraify

## Algebraic Effects Are Here! (sort of)

(If you're unfamiliar with algebraic effects, here's a great article: [Algebraic Effects for the Rest of Us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/))

This is a single-goal library that utilizes generators to add algebraic effects to javascript and typescript.

## Examples

Here's an example using javascript:
```js
import algebra from "algebraic";
const getUser = algebraic(function* getUser(_, id) => {
  
});
