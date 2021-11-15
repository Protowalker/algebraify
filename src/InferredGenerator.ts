type EffectRequest<Key extends string, _Val> = Key & {
  readonly __type: _Val;
};
type RequestKey<E extends EffectRequest<string, unknown>> =
  E extends EffectRequest<infer K, unknown> ? `${K}` : never;

class AlgebraBuilder<
  Reqs extends EffectRequest<string, unknown>,
  FilledReqs extends RequestKey<Reqs>,
  Args extends unknown[],
  Return
> {
  private cases: Partial<{ [Req in Reqs as RequestKey<Req>]: Req["__type"] }> =
    {};

  static baseRequest = <Key extends string, Value = unknown>(key: Key) => ({
    *[Symbol.iterator](): Generator<EffectRequest<Key, Value>, Value, Value> {
      return yield key as EffectRequest<Key, Value>;
    },
    *as<Value>(): Generator<EffectRequest<Key, Value>, Value, Value> {
      return yield key as EffectRequest<Key, Value>;
    },
  });
  // static *baseRequest<Key extends string, Value>(
  //   key: Key
  // ): Generator<EffectRequest<Key, Value>, Value, Value> {
  //   return yield { key } as EffectRequest<Key, Value>;
  // }

  constructor(
    private algebraicEffector: (
      request: typeof AlgebraBuilder.baseRequest,
      ...args: Args
    ) => Generator<Reqs, Return, Reqs["__type"]>,
    private args: Args
  ) {}

  public case<Key extends Exclude<RequestKey<Reqs>, FilledReqs>>(
    key: Key,
    value: (Reqs & Key)["__type"]
  ): AlgebraBuilder<Reqs, FilledReqs | Key, Args, Return> {
    this.cases[key] = value;
    return this;
  }

  public do(): Return {
    let generator: Generator<Reqs, Return, Reqs["__type"]> | undefined =
      this.algebraicEffector(AlgebraBuilder.baseRequest, ...this.args);
    let currentKey: IteratorResult<Reqs, Return> = generator.next();
    while (!currentKey.done) {
      if (!this.cases.hasOwnProperty(currentKey.value)) {
        throw new Error(`missing case "${currentKey.value}"`);
      }

      currentKey = generator.next(
        (this.cases as { [key: string]: Reqs["__type"] })[currentKey.value]
      );
    }

    return currentKey.value;
  }
}

/** Takes a generator function and returns a builder for an algebraic effector. */
export function algebra<
  Args extends unknown[],
  Reqs extends EffectRequest<string, unknown>,
  Return
>(
  algebraicEffector: (
    request: typeof AlgebraBuilder.baseRequest,
    ...args: Args
  ) => Generator<Reqs, Return, Reqs["__type"]>
): (...args: Args) => AlgebraBuilder<Reqs, never, Args, Return> {
  return function (...args: Args) {
    return new AlgebraBuilder(algebraicEffector, args);
  };
}

//const inferredAlgebraic = algebra(function* (request) {
//  const val = yield* request("test").as<number>();
//  const otherVal = yield* request("secondTest").as<string>();
//  if (false) yield* request("third").as<boolean>();
//  const unknowable = yield* request("unknowable");
//  return { vals: [val, otherVal] as [number, string], unknowable };
//});
//
//console.log(process.memoryUsage().heapUsed);
//for (let i = 0; i < 10000; i++) {
//  inferredAlgebraic()
//    .case("test", 0)
//    .case("secondTest", "sdf")
//    .case("unknowable", "gotcha!")
//    .do();
//}
//console.log(process.memoryUsage().heapUsed);
