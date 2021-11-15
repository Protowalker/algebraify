export function hasProperty<
  Obj extends Record<string, unknown>,
  Key extends string
>(obj: Obj, prop: Key): obj is Obj & { [key in Key]: unknown } {
  return obj.hasOwnProperty(prop);
}
