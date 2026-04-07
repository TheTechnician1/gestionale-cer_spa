export function isEmptyArray<T>(value: T[] | null | undefined): boolean {
  return !value || value.length === 0;
}

export function isEmptyObject(value: Record<string, unknown> | null | undefined): boolean {
  return !value || Object.keys(value).length === 0;
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
