import {clearSpCookies} from "./utils";

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
        "waited_on_landing_page",
        "customers_page_viewed",
]

export const predictionMetrics = [
          "waited_on_landing_page",
          "num_form_engagements_l7d",
          "num_conversions_l7d",
          "customers_page_viewed",
]

export const exploreSteps = {
        landing: { 
            href: "/use-cases", 
            nextStep: "Go to Case Studies", 
            title: "Read Case Studies", 
            description: "Curious to read more about our customers? See how they use Snowplow to power their data strategy",
            videoSrc: undefined,
            onClick: () => (window.location.href = "/customers")
        },
        ecommerce: { 
            href: "/get-started/book-a-demo-of-snowplow-bdp", 
            nextStep: "Talk to one of our experts", 
            title: "Snowplow for Ecommerce", 
            description: "Want to understand how Snowplow can help your ecommerce business?" ,
            videoSrc: undefined,
            onClick: () => (window.location.href = "/get-started/book-a-demo-of-snowplow-bdp")

        },
        // video: { 
        //     href: "", 
        //     nextStep: "Watch the Video", 
        //     title: "Value Video", 
        //     description: "", 
        //     videoSrc: "https://www.youtube.com/embed/_o-TO1GB1Bo?autoplay=1&mute=1",
        //     onClick: () => window.open("https://www.youtube.com/watch?v=_o-TO1GB1Bo", "_blank")         },
        submit: { 
            href: "/get-started/book-a-demo-of-snowplow-bdp", 
            nextStep: "Submit your details", 
            title: "Convert", 
            description: "" ,
            videoSrc: undefined,
            onClick: () => (window.location.href = "/get-started/book-a-demo-of-snowplow-bdp")


        },
        completed: { 
            href: "https://snowplow.io", 
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
    localStorage.removeItem("clickedSteps");
    // Clear Snowplow cookie and reload
    clearSpCookies();
}