const PREFIX = "sma:";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStorage(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(`${PREFIX}${key}`);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(`${PREFIX}${key}`, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStorage(key: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(`${PREFIX}${key}`);
  } catch {
    /* ignore */
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readStorage(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  writeStorage(key, JSON.stringify(value));
}
