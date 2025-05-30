import {clearSpIdCookie} from "./utils";

export const clickAttributesList = [    
          "num_sessions_l7d",
          "num_page_views_l7d",
          "num_page_pings_l7d",
          "num_pricing_views_l7d",
          "num_use_cases_views_l7d",
          "num_conversions_l7d",
          "num_form_engagements_l7d",
]

export const browserAttributesList = [
          "latest_app_id",
          "latest_device_class",
          "first_mkt_medium_l30d",
          "first_refr_medium_l30d"
]

export const interventionsList = [
        "demo_complete",
        "contact_page_landing",
        "triggered_tour",
        "visited_contact",
        "visited_pricing",
        "visited_use_cases",
]

export const predictionMetrics = [
          "num_pricing_views_l7d",
          "num_form_engagements_l7d",
          "num_conversions_l7d",
          "num_use_cases_views_l7d",
]

export const exploreSteps = {
        solutions: { 
            href: "/use-cases", 
            nextStep: "Visit the Solutions Page", 
            title: "Continue the tour", 
            description: "",
            videoSrc: undefined,
            onClick: () => (window.location.href = "/use-cases")
        },
        pricing: { 
            href: "/pricing", 
            nextStep: "Visit the Pricing Page", 
            title: "Continue the tour", 
            description: "" ,
            videoSrc: undefined,
            onClick: () => (window.location.href = "/pricing")

        },
        video: { 
            href: "", 
            nextStep: "Watch the Video", 
            title: "Value Video", 
            description: "", 
            videoSrc: "https://www.youtube.com/embed/_o-TO1GB1Bo?autoplay=1&mute=1",
            onClick: () => {}
         },
        submit: { 
            href: "/get-started/book-a-demo-of-snowplow-bdp", 
            nextStep: "Contact Us", 
            title: "Convert", 
            description: "" ,
            videoSrc: undefined,
            onClick: () => (window.location.href = "/get-started/book-a-demo-of-snowplow-bdp")


        },
        completed: { 
            href: "/", 
            nextStep: "Return to Main Page", 
            title: "Demo Complete!",
            description: "You've been classified as likely to convert based on your behaviour",
            videoSrc: undefined,
            onClick: handleRestartDemo
    }
};

export function handleRestartDemo() {
    // Clear relevant localStorage keys
    localStorage.removeItem("openWidget");
    localStorage.removeItem("attributesOpen");
    localStorage.removeItem("interventionsOpen");
    localStorage.removeItem("signals-demo");
    // Clear Snowplow cookie and reload
    clearSpIdCookie();
}