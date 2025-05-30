import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {predictionMetrics} from "./constants";
import { AttributeItem, InterventionStatusDict } from "@/lib/types";

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

export function clearSpIdCookie() {
    const cookies = document.cookie.split("; ");
    const spIdCookie = cookies.find((c) => {
        const [name] = c.split("=");
        return name.startsWith("_sp_biz1_id") && name.toLowerCase().split(".")[0].endsWith("id");
    });
    console.log("Clearing SP ID cookie:", spIdCookie);
    if (spIdCookie) {
        const [name] = spIdCookie.split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    window.location.reload();
    console.log("Clearing SP ID cookie:", spIdCookie);

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

export function getProgress(statusDict: InterventionStatusDict, interventionsAttributes: Record<string, any>): "solutions" | "pricing" | "video"| "submit" | "completed" | undefined {
  console.log(interventionsAttributes)
  console.log(statusDict)
  if (!interventionsAttributes || Object.keys(interventionsAttributes).length === 0) return undefined;
  if (statusDict.demo_complete) return "completed";
  if (statusDict.contact_page_landing) return "submit";
  if (statusDict.visited_contact) return "video"
  if (statusDict.triggered_tour && !Array.isArray(interventionsAttributes["visited_pricing"]) || interventionsAttributes["visited_pricing"][0] == 0) return "pricing";
  if (statusDict.triggered_tour && !Array.isArray(interventionsAttributes["visited_use_cases"]) || interventionsAttributes["visited_use_cases"][0] == 0) return "solutions";
  return "solutions"
}

export function getInterventionStatusDict(attributes: AttributeItem[]): InterventionStatusDict {
    const result: Record<string, boolean> = {};
    attributes.forEach(attr => {
        let isTrue = false;
        if (typeof attr.value === "number") isTrue = attr.value > 0;
        else if (typeof attr.value === "boolean") isTrue = attr.value;
        else if (typeof attr.value === "string" && !isNaN(Number(attr.value))) isTrue = Number(attr.value) > 0;
        result[attr.name] = isTrue;
    });

    // Check if all three key visits are true
    const keyVisits = ["visited_contact", "visited_pricing", "visited_use_cases"];
    result["key_visits"] = keyVisits.every(key => result[key]);

    const remove = ["visited_pricing", "visited_use_cases"];

    // Remove the individual keys from the result
    remove.forEach(key => delete result[key]);

    return result;
}