
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SnowplowLogo } from "./SnowplowLogo"
import { Explore } from "./Explore"
import { Attributes } from "./Attributes"
import { Interventions } from "./Interventions"
import { AttributeItem } from "@/lib/types"

interface InterventionItem {
    name: string
    value: boolean
}

interface SignalsWidgetProps {
    conversionScore: number
    isOpen: boolean
    onToggle: () => void
    browserAttributes?: AttributeItem[]
    clickAttributes?: AttributeItem[]
    progress: string | null | undefined
    loading?: boolean
}

export function SignalsWidget({ conversionScore = 50, isOpen, onToggle, browserAttributes = [], clickAttributes = [], progress, loading }: SignalsWidgetProps) {
    return (
        <>
            {/* Fixed Explore component */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-[500px]  z-40"
                    style={{ pointerEvents: "auto", width: "320px" }}
                >
                    <div style={{ pointerEvents: "auto", width: "100%" }}>
                        <Explore progress={progress} className="shadow-lg" />
                    </div>
                </div>
            )}

            <motion.div
                className="dark h-screen right-0 w-[450px] bg-[#101010] shadow-xl z-50 overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                            <div className="flex flex-col items-start gap-2 mb-1">
                                <SnowplowLogo variant="icon" size="sm" />
                                <h2 className="text-primary text-xl font-bold">SIGNALS</h2>
                            </div>
                            <p className="text-muted-foreground text-sm/6">
                                You're now seeing a live view of how your browsing shapes your personalized experience—instantly and in
                                real time.
                            </p>
                        </div>
                        <button
                            onClick={onToggle}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close signals panel"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Loading skeleton or real content */}
                    {loading ? (
                        <div>
                            {/* Skeleton for Predicted Conversion Score */}
                            <div className="mb-6 animate-pulse">
                                <div className="h-4 bg-[#282828] rounded-full w-full mb-2" />
                                <div className="h-4 bg-[#282828] rounded-full w-1/4" />
                            </div>
                            {/* Skeleton for Attributes */}
                            <div className="mb-6 animate-pulse">
                                <div className="h-6 bg-[#282828] rounded w-1/2 mb-2" />
                                <div className="h-4 bg-[#282828] rounded w-full mb-1" />
                                <div className="h-4 bg-[#282828] rounded w-full mb-1" />
                                <div className="h-4 bg-[#282828] rounded w-full mb-1" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Predicted Conversion Score */}
                            <div className="mb-6">
                                <h3 className="text-foreground font-bold text-sm mb-2">Predicted Conversion Score</h3>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-[#282828] rounded-full overflow-hidden mb-1 w-full">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${conversionScore}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-foreground font-bold">{Math.round(conversionScore)}%</span>
                                    </div>
                                </div>
                            </div>
                            <Attributes browserAttributes={browserAttributes} clickAttributes={clickAttributes} />
                            <Interventions />
                        </>
                    )}
                </div>
            </motion.div>
        </>
    )
}