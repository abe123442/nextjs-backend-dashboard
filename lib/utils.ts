;import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// HTTP response status codes are grouped in five categories:
// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)

export async function postData(url: string, payload: Object) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Based on the POST request to create a new table in `Store` (supabase)
    // Guard against responses from the api that RETURN errors as opposed to throwing them.
    if (res.status >= 400) {
      const json = await res.json();
      throw new Error(String(json));
    }

    const text = await res.text();
    const response = text === "" ? {} : JSON.parse(text);
    return response;
  } catch (error) {
    throw error;
  }
}
