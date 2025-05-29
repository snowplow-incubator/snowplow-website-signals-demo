import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getSnowplowIds() {
  // Find the cookie key that starts with "_sp_"
  const cookies = document.cookie.split("; ");
  const spCookie = cookies.find(
    (c) => c.startsWith("_sp_") && c.trim().toLowerCase().endsWith("_id")
  );  
  if (!spCookie) return null;

  // Get the value part after '='
  const value = spCookie.split("=")[1];
  if (!value) return null;

  const split = value.split(".");
  return {
    domain_userid: split[0],
    domain_sessionid: split[5],
  };
}
