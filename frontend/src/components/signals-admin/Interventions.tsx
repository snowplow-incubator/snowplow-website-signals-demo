
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, } from "lucide-react"
import { cn, interventionStatusDict } from "@/lib/utils"
import { AttributeItem } from "@/lib/types"
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';
import CallMadeIcon from '@mui/icons-material/CallMade';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
interface InterventionsProps {
    interventionsAttributes?: AttributeItem[]
    progress?: string | null | undefined
}

interface InterventionRowProps {
    name: string
    icon: React.ReactNode
    description: string
}

function InterventionRow({ name, icon, description }: InterventionRowProps) {
    return (
        <div className="flex items-center mb-2">
            <div className="mr-2 bg-[#282828]">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
            </div>
        </div>
    )
}


export function Interventions({ interventionsAttributes = [] }: InterventionsProps) {
    const [interventionsOpen, setInterventionsOpen] = useState(() => {
        const stored = localStorage.getItem("interventionsOpen");
        return stored === "true";
    });
    console.log("Interventions component rendered with attributes:", interventionsAttributes);
    console.log("Interventions status dict:", interventionStatusDict(interventionsAttributes));


    useEffect(() => {
        localStorage.setItem("interventionsOpen", interventionsOpen ? "true" : "false");
    }, [interventionsOpen]);

    // If triggered tour not true return loading Widget


    const statusDict = interventionStatusDict(interventionsAttributes)
    console.log("Interventions status dictionary:", statusDict["triggered_tour"]);
    // If triggered tour true - Triggered Tour Intevetion
    // If visited 3 key pages true - Key Visits Intervention
    // If visited contact visited - Video
    // If demo complete - show converted

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
                                {!statusDict.triggered_tour ? (
                                    <div className="w-full p-4 text-muted-foreground flex items-center justify-around">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        Thinking of best intervention...
                                    </div>
                                ) : (
                                    <>
                                        {statusDict.triggered_tour && (
                                            <div className="relative pl-4">
                                                {/* Vertical line */}
                                                <div className="absolute left-[38px] top-0 bottom-0 w-px bg-[#737373] z-0" />
                                                <div className="relative z-10 flex flex-col gap-2">

                                                    {(statusDict.visited_contact && statusDict.key_visits) && (
                                                        <InterventionRow
                                                            name="Triggered Value Video"
                                                            icon={<PlayCircleOutlineIcon
                                                                fontSize="large" className="h-[45px] inline-block mr-2"
                                                                style={{ verticalAlign: 'middle', color: '#fff' }} />}
                                                            description="To improve conversion in the contact page triggered value video. Has been shown to improve conversion by 20%."
                                                        />

                                                    )}
                                                    {statusDict.key_visits && (
                                                        <InterventionRow
                                                            name="Redirected to Convert"
                                                            icon={<CallMadeIcon
                                                                color="inherit"
                                                                fontSize="large" className="h-[45px] text-[#FFF] inline-block mr-2"
                                                                style={{ verticalAlign: 'middle', color: '#FFF' }} />}
                                                            description="Visited 3 key pages"
                                                        />

                                                    )}
                                                    <InterventionRow
                                                        name="Triggered Tour"
                                                        icon={
                                                            <ScreenshotMonitorIcon
                                                                fontSize="large"
                                                                style={{ color: "#fff", verticalAlign: 'middle' }}
                                                                className="h-[45px] inline-block mr-2"
                                                            />
                                                        }
                                                        description="Browsed more than 10 seconds"
                                                    />
                                                </div>

                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}


// <div className="text-sm text-foreground font-bold mb-2">Rule-based</div>
// {interventionsAttributes.map((intervention, index) => (
//     <div key={index} className="flex justify-between items-center mb-2">
//         <span className="text-sm text-foreground">{intervention.name}</span>
//         <span
//             className={cn(
//                 "text-sm px-4 py-1 rounded-full bg-background border",
//                 intervention.value
//                     ? "bg-primary/20 text-primary"
//                     : "border-border rounded-full text-foreground",
//             )}
//         >
//             {intervention.value ? "True" : "False"}
//         </span>
//     </div>
// ))}
