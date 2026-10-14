import { cookies } from "next/headers";

type CookiesOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
  expires?: Date;
};

export async function setCookies(headers: Headers): Promise<void> {
  const setCookieHeaders = headers.getSetCookie();
  const cookieStore = await cookies();

  for (const header of setCookieHeaders) {
    const parts = header.split(";").map((part) => part.trim());
    const [name, ...valueParts] = parts[0].split("=");

    const value = valueParts.join("=");

    const options: CookiesOptions = {};

    for (const attribute of parts.slice(1)) {
      const separatorIndex = attribute.indexOf("=");
      const key = (
        separatorIndex === -1 ? attribute : attribute.slice(0, separatorIndex)
      ).toLowerCase();

      const attributeValue =
        separatorIndex === -1 ? "" : attribute.slice(separatorIndex + 1);

      switch (key) {
        case "httponly":
          options.httpOnly = true;
          break;
        case "secure":
          options.secure = true;
          break;
        case "samesite":
          options.sameSite = attributeValue as "lax" | "strict" | "none";
          break;
        case "path":
          options.path = attributeValue;
          break;
        case "max-age":
          options.maxAge = Number(attributeValue);
          break;
        case "expires":
          options.expires = new Date(attributeValue);
          break;
      }
    }
    if (name && value) {
      cookieStore.set(name, value, options);
    }
  }
}
