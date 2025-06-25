import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {predictionMetrics} from "./constants";
import { AttributeItem, InterventionStatusDict } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Add this at the top of your utils.ts or in a global.d.ts file
declare global {
  interface Window {
    snowplowTracker?: (...args: any[]) => void;
  }
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

export function clearSpCookies() {
    document.cookie
    .split("; ")
    .forEach(cookie => {
      const [name] = cookie.split("=");
      if (name.startsWith("_sp")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    document.cookie
    .split("; ")
    .forEach(cookie => {
      const [name] = cookie.split("=");
      if (name.startsWith("sp")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    if (typeof window !== "undefined" && typeof window.snowplowTracker === "function") {
      window.snowplowTracker('clearUserData');
    }

    window.location.reload();
    console.log("Clearing SP ID cookie:");
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

export function getProgress(
  statusDict: InterventionStatusDict,
  interventionsAttributes: AttributeItem[]
): "landing" | "ecommerce" | "contact" | "submit" | "completed" | undefined {
  if (!interventionsAttributes || interventionsAttributes.length === 0) return undefined;
  // if (!statusDict.triggered_tour) return undefined;

  const getValue = (name: string, value: number) => {
    const attr = interventionsAttributes.find(a => a.name === name);
    const attr_value = attr ? Number(attr.value) : 0;
    return attr_value >= value
  };

  const waited_on_landing_page = getValue("waited_on_landing_page", 2);
  const customers_page_viewed = getValue("customers_page_viewed", 2);
  // 1. Must finish landing page first
  if (!waited_on_landing_page) 
    {
      return undefined;
    }

  // 2. Then customers page
  if (!customers_page_viewed)
    {
      return "landing";
    }
  
  // 4. Only after all above, allow submit and completed
  if (statusDict.demo_complete) return "completed";
  if (statusDict.visited_contact) return "submit";

  return "ecommerce" ;
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
    // const keyVisits = ["waited_on_landing_page", "customers_page_viewed"];
    // result["key_visits"] = keyVisits.every(key => result[key]);

    // const remove = ["visited_pricing", "visited_use_cases"];

    // // Remove the individual keys from the result
    // remove.forEach(key => delete result[key]);

    return result;
}