type MaybeAsyncGenerator<T, TReturn, TNext> =
  | Generator<T, TReturn, TNext>
  | AsyncGenerator<T, TReturn, TNext>;

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

  private firstRequest = true;
  private key = "";
  private requestIterator: Iterator<
    EffectRequest<string, unknown>,
    unknown,
    unknown
  > = {
    next: (val: unknown) => {
      if (this.firstRequest) {
        this.firstRequest = false;
        return {
          done: false as const,
          value: this.key as EffectRequest<string, unknown>,
        };
      }
      this.firstRequest = true;
      return { done: true as const, value: val };
    },
  };

  baseRequest = <Key extends string, Value = unknown>(
    key: Key
  ): {
    [Symbol.iterator]: () => Iterator<EffectRequest<Key, Value>, Value, Value>;
    as: <Value>() => {
      [Symbol.iterator]: () => Iterator<EffectRequest<Key, Value>, Value>;
    };
  } => {
    this.key = key;
    return {
      [Symbol.iterator]: () =>
        this.requestIterator as Iterator<
          EffectRequest<Key, Value>,
          Value,
          Value
        >,
      as: <Value>() => ({
        [Symbol.iterator]: () =>
          this.requestIterator as Iterator<EffectRequest<Key, Value>, Value>,
      }),
    };
  };

  //static baseRequest = <Key extends string, Value = unknown>(key: Key) => ({
  //  *[Symbol.iterator](): Generator<EffectRequest<Key, Value>, Value, Value> {
  //    return yield key as EffectRequest<Key, Value>;
  //  },
  //  *as<Value>(): Generator<EffectRequest<Key, Value>, Value, Value> {
  //    return yield key as EffectRequest<Key, Value>;
  //  },
  //});
  // static *baseRequest<Key extends string, Value>(
  //   key: Key
  // ): Generator<EffectRequest<Key, Value>, Value, Value> {
  //   return yield { key } as EffectRequest<Key, Value>;
  // }

  constructor(
    private algebraicEffector: (
      request: InstanceType<typeof AlgebraBuilder>["baseRequest"],
      ...args: Args
    ) => MaybeAsyncGenerator<Reqs, Return, Reqs["__type"]>,
    private args: Args
  ) {}

  public case<Key extends Exclude<RequestKey<Reqs>, FilledReqs>>(
    key: Key,
    value: (Reqs & Key)["__type"]
  ): AlgebraBuilder<Reqs, FilledReqs | Key, Args, Return> {
    this.cases[key] = value;
    return this;
  }

  public async do(): Promise<Return> {
    let generator:
      | MaybeAsyncGenerator<Reqs, Return, Reqs["__type"]>
      | undefined = this.algebraicEffector(this.baseRequest, ...this.args);
    let currentKey: IteratorResult<Reqs, Return> = await generator.next();
    while (!currentKey.done) {
      if (!this.cases.hasOwnProperty(currentKey.value)) {
        throw new Error(`missing case "${currentKey.value}"`);
      }

      currentKey = await generator.next(
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
    request: InstanceType<typeof AlgebraBuilder>["baseRequest"],
    ...args: Args
  ) => MaybeAsyncGenerator<Reqs, Return, Reqs["__type"]>
): (...args: Args) => AlgebraBuilder<Reqs, never, Args, Return> {
  return function (...args: Args) {
    return new AlgebraBuilder(algebraicEffector, args);
  };
}
