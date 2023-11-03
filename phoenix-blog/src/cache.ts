let etagsCage = new Map<string, string>;

export function useEtagsCache(): Map<string, string> {
  return etagsCage;
}
