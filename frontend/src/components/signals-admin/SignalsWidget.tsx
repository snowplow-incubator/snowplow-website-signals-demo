
import { motion } from "framer-motion"
import { X } from "lucide-react"
import Confetti from "react-confetti"
import { SnowplowLogo } from "./SnowplowLogo"
import { Explore } from "./Explore"
import { Attributes } from "./Attributes"
import { Interventions } from "./Interventions"
import { AttributeItem } from "@/lib/types"
import { getInterventionStatusDict, getProgress, clearSpIdCookie } from "@/lib/utils"
import { handleRestartDemo } from "@/lib/constants"

interface SignalsWidgetProps {
    conversionScore: number
    isOpen: boolean
    onToggle: () => void
    browserAttributes?: AttributeItem[]
    clickAttributes?: AttributeItem[]
    interventionsAttributes?: AttributeItem[]
    loading?: boolean
}


export function SignalsWidget({ conversionScore = 50, isOpen, onToggle, browserAttributes = [], clickAttributes = [], interventionsAttributes = [], loading }: SignalsWidgetProps) {
    const statusDict = getInterventionStatusDict(interventionsAttributes)
    const progress = getProgress(statusDict, interventionsAttributes)
    console.log(progress, "Progress in SignalsWidget")

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
                <div className="p-6 flex flex-col ">
                    {statusDict.demo_complete && <Confetti
                        width={450}
                        height={window.innerHeight}
                        numberOfPieces={300}
                        recycle={false}
                        initialVelocityX={10}
                        initialVelocityY={-20}
                    />}

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                            <div className="flex flex-col items-start gap-2 mb-1">
                                <SnowplowLogo variant="icon" size="sm" />
                                <h2 className="text-primary text-xl font-bold">SIGNALS</h2>
                            </div>
                            <p className="text-muted-foreground text-sm/6">
                                You're now seeing a live stream of behavioral attributes according to your current browsing and interactions.
                                Note: Every attribute, scoring rule and intervention is fully customizable and defined to fit your business.
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
                                <h3 className="text-foreground font-bold text-sm mb-2">This score updates live based on your behavior</h3>
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
                            <br />
                            <Interventions statusDict={statusDict} />
                        </>
                    )}
                    {/* Restart Demo Button at the bottom */}
                    <div className="mt-auto pt-6 flex justify-center">
                        <button
                            onClick={handleRestartDemo}
                            className="px-4 py-2 bg-[#282828] text-white rounded hover:bg-[#282828]  transition"
                        >
                            Restart Demo
                        </button>
                    </div>

                </div>
            </motion.div>
        </>
    )
}