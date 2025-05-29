import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {predictionMetrics} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getSnowplowIds() {
  // Find the cookie key that starts with "_sp_"
  const cookies = document.cookie.split("; ");
  const spCookie = cookies.find((c) => {
    const [name] = c.split("=");
    return name.startsWith("_sp_") && name.toLowerCase().split(".")[0].endsWith("id");
  });  
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

interface SignalsData {
  [key: string]: any[];
}

export function formatAttributes(data: SignalsData, includeAttributes: string[] = []) {
    return Object.entries(data)
      .filter(([name]) => includeAttributes.includes(name))
      .map(([name, valueArr]) => ({
        name,
        value:
          name === "num_sessions_l7d"
            ? (Array.isArray(valueArr) ? valueArr.length : 0)
            : Array.isArray(valueArr) ? valueArr[0] : valueArr
      }));
  }

export function getPredictionScore(data: SignalsData) {
  let prediction = 0;

  for (const metric of predictionMetrics) {
    // Each metric is an array with one value, e.g. [0] or [10]
    if (
      Array.isArray(data[metric]) &&
      data[metric][0] > 0
    ) {
      prediction += 0.25;
    }
  }
  return prediction * 100;
}

export function getProgress(data: Record<string, any>): "solutions" | "pricing" | "form" | "submit" | undefined {
  if (!data) return undefined;
  if (!Array.isArray(data["num_use_cases_views_l7d"]) || data["num_use_cases_views_l7d"][0] == 0) return "solutions";
  if (!Array.isArray(data["num_pricing_views_l7d"]) || data["num_pricing_views_l7d"][0] == 0) return "pricing";
  if (!Array.isArray(data["num_form_engagements_l7d"]) || data["num_form_engagements_l7d"][0] == 0) return "form";
  if (!Array.isArray(data["num_conversions_l7d"]) || data["num_conversions_l7d"][0] == 0) return "submit";
  return undefined;
}