
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, X, ArrowLeftFromLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { SnowplowLogo } from "./SnowplowLogo"
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';

interface AttributeItem {
    name: string
    value: string
}

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
    progress: string | null
}

interface ExploreComponentProps {
    className?: string
    title: string
    description: string
    onClick: () => void
    nextStep: string
}

interface ExploreProps {
    className?: string
    progress: string | null
}

function ExploreComponent({ className, title, description, onClick, nextStep }: ExploreComponentProps) {
    return (
        <div className={cn("bg-white rounded-lg p-4 h-[300px] w-[360px] border border-slate-200", className)}>
            <div className="bg-slate-100 rounded-sm p-4 h-[130px]">
            </div>
            <div className="space-y-3">
                <h3 className="pt-2 text-lg font-semibold">
                    <SignpostOutlinedIcon fontSize="small" className="h-[25px] inline-block mr-2" style={{ verticalAlign: 'middle' }} />
                    {title}
                </h3>
                <p className="text-slate-500 text-sm">
                    {description}
                </p>
                <Button
                    variant="outline"
                    className="bg-[#6638B8] text-white border-slate-200 hover:bg-[#6638B8] hover:text-white justify-center font-normal"
                    onClick={onClick}
                >
                    {nextStep}
                </Button>
            </div>
        </div>
    )
}
function Explore({ className, progress }: ExploreProps) {
    return (
        <>
            {(progress == null || progress == "solutions") && (
                <ExploreComponent
                    className={className}
                    title="Continue the tour"
                    description="Copy about a feature or functionality the tip is near. Be specific and suggest  actions if possible."
                    onClick={() => (window.location.href = "/use-cases")}
                    nextStep="Visit the Solutions Page"
                />
            )}

            {progress == "pricing" && (
                <ExploreComponent
                    className={className}
                    title="Continue the tour"
                    description="Copy about a feature or functionality the tip is near. Be specific and suggest  actions if possible."
                    onClick={() => (window.location.href = "/pricing")}
                    nextStep="Visit the Pricing Page"
                />
            )}
            {progress == "form" && (
                <ExploreComponent
                    className={className}
                    title="Continue the tour"
                    description="Copy about a feature or functionality the tip is near. Be specific and suggest  actions if possible."
                    onClick={() => (window.location.href = "/get-started/book-a-demo-of-snowplow-bdp")}
                    nextStep="Contact Us"
                />
            )}
            {progress == "submit" && (
                <h1>Completed</h1>
            )}


        </>
    )
}

export function SignalsWidget({ conversionScore = 50, isOpen, onToggle, browserAttributes = [], clickAttributes = [], progress }: SignalsWidgetProps) {
    const [attributesOpen, setAttributesOpen] = useState(false)
    const [interventionsOpen, setInterventionsOpen] = useState(false)
    const [browserAnimatedIndices, setBrowserAnimatedIndices] = useState<number[]>([]);
    const [clickAnimatedIndices, setClickAnimatedIndices] = useState<number[]>([]);
    const browserPrevValues = useRef<{ [key: number]: any }>({});
    const clickPrevValues = useRef<{ [key: number]: any }>({});

    useEffect(() => {
        browserAttributes.forEach((attribute, idx) => {
            if (browserPrevValues.current[idx] !== undefined && browserPrevValues.current[idx] !== attribute.value) {
                setBrowserAnimatedIndices((indices) => [...indices, idx]);
                setTimeout(() => {
                    setBrowserAnimatedIndices((indices) => indices.filter(i => i !== idx));
                }, 2000);
            }
            browserPrevValues.current[idx] = attribute.value;
        });
    }, [browserAttributes]);

    useEffect(() => {
        clickAttributes.forEach((attribute, idx) => {
            if (clickPrevValues.current[idx] !== undefined && clickPrevValues.current[idx] !== attribute.value) {
                setClickAnimatedIndices((indices) => [...indices, idx]);
                setTimeout(() => {
                    setClickAnimatedIndices((indices) => indices.filter(i => i !== idx));
                }, 2000);
            }
            clickPrevValues.current[idx] = attribute.value;
        });
    }, [clickAttributes]);


    // Sample intervention data to match the screenshot
    const interventions: InterventionItem[] = [
        { name: "Request a Demo", value: true },
        { name: "Intervention two", value: false },
    ]

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
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed bg-brand top-[95px] right-6 text-white hover:text-white transition-colors z-50 w-50 h-50 flex items-center justify-center rounded shadow-lg p-2"
                    aria-label="Open signals panel"
                >
                    <ArrowLeftFromLine size={20} />
                </button>)

            }

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

                    {/* Attributes Accordion */}
                    <div className="bg-[#282828] border border-border rounded-lg mb-4">
                        <button
                            onClick={() => setAttributesOpen(!attributesOpen)}
                            className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                            aria-expanded={attributesOpen}
                            aria-controls="attributes-content"
                        >
                            <div className="flex items-center">
                                <h3 className="font-semibold text-white">Behaviour Attributes</h3>
                            </div>
                            <div>
                                {attributesOpen ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                        </button>
                        <AnimatePresence initial={false}>
                            {attributesOpen && (
                                <motion.div
                                    id="attributes-content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4">
                                        <div className="p-2">
                                            <h1 className="text-lg text-white font-bold">Browsing</h1>
                                            {browserAttributes.map((attribute, index) => (
                                                <div key={index} className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-foreground">{attribute.name}</span>
                                                    <motion.span
                                                        className="w-[80px] text-center bg-background text-sm border border-border rounded-full text-foreground px-4 py-1 transition-colors duration-300"
                                                        animate={
                                                            browserAnimatedIndices.includes(index)
                                                                ? { backgroundColor: "#bbf7d0", borderColor: "#4ade80", opacity: 1 }
                                                                : { backgroundColor: "#000000", borderColor: "#000000", opacity: 1 }
                                                        }
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {attribute.value != null && attribute.value !== "" ? attribute.value : "N/A"}                                            </motion.span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2">
                                            <h1 className="text-lg text-white font-bold">Click Behaviour</h1>
                                            {clickAttributes.map((attribute, index) => (
                                                <div key={index} className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-foreground">{attribute.name}</span>
                                                    <motion.span
                                                        className="w-[80px] text-center bg-background text-sm border border-border rounded-full text-foreground px-4 py-1 transition-colors duration-300"
                                                        animate={
                                                            clickAnimatedIndices.includes(index)
                                                                ? { backgroundColor: "#bbf7d0", borderColor: "#4ade80", opacity: 1 }
                                                                : { backgroundColor: "#000000", borderColor: "#000000", opacity: 1 }
                                                        }
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {attribute.value != null && attribute.value !== "" ? attribute.value : "N/A"}                                            </motion.span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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
                </div>
            </motion.div>
        </>
    )
}