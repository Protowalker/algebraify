export function hasProperty<Obj extends object, Key extends PropertyKey>(
  obj: Obj,
  prop: Key
): obj is Obj & { [key in Key]: unknown } {
  return obj.hasOwnProperty(prop);
}
