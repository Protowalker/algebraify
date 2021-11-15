export { algebra } from "./InferredGenerator";

//type ProfileMap = {
//  userName: string;
//  age: number;
//  material: "skin" | "metal";
//};
//
//export type EffectRequest<Key extends string, _Val> = {
//  key: Key;
//  readonly __type: _Val;
//};
//
//export type EffectRequestRecord<
//  Requests extends EffectRequest<string, unknown>[]
//> = {
//  [K in Requests[number] as K["key"]]: K;
//};
//
//type EffectRequestRecordRequests<Rec extends EffectRequestRecord<[]>> =
//  Rec extends EffectRequestRecord<infer T> ? T : never;
//
//function* baseRequest<Key extends string, Value>(
//  key: Key
//): Generator<EffectRequest<Key, Value>, Value, Value> {
//  return yield { key } as EffectRequest<Key, Value>;
//}
//
//type ValueRequest<KeyMap extends Record<string, unknown>> = <
//  Key extends keyof KeyMap & string,
//  Value extends KeyMap[Key]
//>(
//  key: Key
//) => KeyMap extends EffectRequestRecord<EffectRequest<string, unknown>[]>
//  ? Generator<KeyMap[Key], KeyMap[Key]["__type"], KeyMap[Key]["__type"]>
//  : Generator<EffectRequest<Key, KeyMap[Key]>, KeyMap[Key], KeyMap[Key]>;
//type AlgebraicEffector<
//  Args extends unknown[],
//  KeyMap extends EffectRequestRecord<EffectRequest<string, unknown>[]>,
//  Return
//> = (
//  request: ValueRequest<KeyMap>,
//  ...args: Args
//) => Generator<KeyMap[keyof KeyMap], Return, KeyMap[keyof KeyMap]["__type"]>;
//
//class AlgebraBuilder<
//  Args extends unknown[],
//  KeyMap extends EffectRequestRecord<EffectRequest<string, unknown>[]>,
//  Return
//> {
//  private cases: Partial<KeyMap> = {};
//  private args: Args;
//  private func: AlgebraicEffector<Args, KeyMap, Return>;
//
//  constructor(
//    algebraicEffector: AlgebraicEffector<Args, KeyMap, Return>,
//    args: Args
//  ) {
//    this.args = args;
//    this.func = algebraicEffector;
//  }
//
//  case<Key extends keyof KeyMap>(
//    key: Key,
//    value: KeyMap[Key] | (() => KeyMap[Key])
//  ): this {
//    if (value instanceof Function) {
//      this.cases[key] = value();
//    } else {
//      this.cases[key] = value;
//    }
//    return this;
//  }
//  get(): Return {
//    const generator = this.func(baseRequest, ...this.args);
//    let currentKey: IteratorResult<
//      EffectRequestRecordRequests<KeyMap>[number],
//      Return
//    > = generator.next();
//    while (!currentKey.done) {
//      if (!this.cases.hasOwnProperty(currentKey.value.key)) {
//        throw new Error(`missing case "${currentKey.value}"`);
//      }
//      currentKey = generator.next(this.cases[currentKey.value.key]!);
//    }
//
//    return currentKey.value;
//  }
//}
//
//export function algebraic<
//  Args extends unknown[],
//  KeyMap extends EffectRequestRecord<EffectRequest<string, unknown>[]>,
//  Return
//>(
//  algebraicEffector: AlgebraicEffector<Args, KeyMap, Return>
//): (...args: Args) => AlgebraBuilder<Args, KeyMap, Return> {
//  return function (...args: Args) {
//    return new AlgebraBuilder(algebraicEffector, args);
//  };
//}
//
//const getUser = algebraic(function* (
//  request: ValueRequest<ProfileMap>,
//  newUserMessage: string
//) {
//  console.log(newUserMessage);
//  const userName = yield* request("userName");
//  console.log(userName);
//  const age = yield* request("age");
//  console.log(age);
//  const material = yield* request("material");
//  console.log(material);
//
//  return { userName: userName, age: age, material: material };
//});
//
//console.log(
//  getUser("Hello")
//    .case("userName", () => "Protowalker")
//    .case("age", 10)
//    .case("material", "skin")
//    .get()
//);
