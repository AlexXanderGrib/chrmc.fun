import { normalize as _normalize } from "@xxhax/strings";

export function normalize(string = "") {
  return _normalize(
    string.replace(/&#(\d+);/g, (_full, match: any) =>
      String.fromCharCode(parseInt(match))
    )
  );
}
