
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, X, ArrowLeftFromLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { SnowplowLogo } from "./SnowplowLogo"
import { Explore } from "./Explore"
import { Attributes } from "./Attributes"

interface InterventionItem {
    name: string
    value: boolean
}


export function Interventions({ }) {
    const [interventionsOpen, setInterventionsOpen] = useState(false)

    // Sample intervention data to match the screenshot
    const interventions: InterventionItem[] = [
        { name: "Request a Demo", value: true },
        { name: "Intervention two", value: false },
    ]

    return (
        <>
            {/* Interventions Accordion */}
            <div className="bg-[#282828] border border-border rounded-lg mb-4">
                <button
                    onClick={() => setInterventionsOpen(!interventionsOpen)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                    aria-expanded={interventionsOpen}
                    aria-controls="interventions-content"
                >
                    <div className="flex items-center">
                        <h3 className="font-semibold text-white">Interventions</h3>
                    </div>
                    <div>
                        {interventionsOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </button>
                <AnimatePresence initial={false}>
                    {interventionsOpen && (
                        <motion.div
                            id="interventions-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4">
                                <div className="text-sm text-foreground font-bold mb-2">Rule-based</div>
                                {interventions.map((intervention, index) => (
                                    <div key={index} className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-foreground">{intervention.name}</span>
                                        <span
                                            className={cn(
                                                "text-sm px-4 py-1 rounded-full bg-background border",
                                                intervention.value
                                                    ? "bg-primary/20 text-primary"
                                                    : "border-border rounded-full text-foreground",
                                            )}
                                        >
                                            {intervention.value ? "True" : "False"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}