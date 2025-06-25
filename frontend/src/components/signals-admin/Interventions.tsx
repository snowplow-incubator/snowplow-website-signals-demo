
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, } from "lucide-react"
import CallMadeIcon from '@mui/icons-material/CallMade';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InterventionStatusDict } from "@/lib/types"
interface InterventionsProps {
    statusDict?: InterventionStatusDict
}
interface InterventionRowProps {
    name: string
    icon: React.ReactNode
    description: string
    customIndex?: number
}

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08 }
    }),
};



function InterventionRow({ name, icon, description, customIndex = 0 }: InterventionRowProps) {
    return (
        <motion.div
            className="flex items-center mb-4"
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={customIndex}
        >

            <div className="flex items-center mb-4 ">
                <div className="mr-2 p-2 bg-[#282828]">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                </div>
            </div>
        </motion.div>

    )
}

const defaultStatusDict: InterventionStatusDict = {
    waited_on_landing_page: false,
    customers_page_viewed: false,
    demo_complete: false,
};
export function Interventions({ statusDict = defaultStatusDict }: InterventionsProps) {
    const [interventionsOpen, setInterventionsOpen] = useState(() => {
        const stored = localStorage.getItem("interventionsOpen");
        return stored === "true";
    });


    useEffect(() => {
        localStorage.setItem("interventionsOpen", interventionsOpen ? "true" : "false");
    }, [interventionsOpen]);

    // If triggered tour not true return loading Widget


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
                                <>
                                    <div className="relative pl-4">
                                        {/* Vertical line */}
                                        <div className="absolute left-[46px] top-0 bottom-0 w-px bg-[#737373] z-0" />
                                        <div className="relative z-10 flex flex-col gap-3 ">
                                            {statusDict.waited_on_landing_page && statusDict.customers_page_vistited && statusDict.demo_complete && (
                                                <InterventionRow
                                                    customIndex={0}

                                                    name="Demo Completed"
                                                    icon={<CheckCircleIcon
                                                        fontSize="large" className="h-[45px] inline-block mr-2"
                                                        style={{ verticalAlign: 'middle', color: '#fff', fill: "#FFF" }} />}
                                                    description="You've completed the Snowplow Signals demo."
                                                />
                                            )}
                                            {(statusDict.waited_on_landing_page && statusDict.customers_page_vistited) && (
                                                <InterventionRow
                                                    customIndex={1}
                                                    name="Viewed Ecommerce Pages"
                                                    icon={<PlayCircleOutlineIcon
                                                        fontSize="large" className="h-[45px] inline-block mr-2"
                                                        style={{ verticalAlign: 'middle', color: '#fff', fill: "#FFF" }} />}
                                                    description="Viewed 2 ecommerce case studies, "
                                                />

                                            )}
                                            {statusDict.waited_on_landing_page && (
                                                <InterventionRow
                                                    customIndex={2}
                                                    name="Redirected to Customers Page"
                                                    icon={<ScreenshotMonitorIcon
                                                        color="inherit"
                                                        fontSize="large" className="h-[45px] text-[#FFF] inline-block mr-2"
                                                        style={{ fill: "#FFF", verticalAlign: 'middle', color: '#FFF' }} />}
                                                    description="Waited 20 seconds on the landing page, redirected to the customers page."
                                                />

                                            )}
                                            {/* <InterventionRow
                                                customIndex={3}

                                                name="Triggered Tour"
                                                icon={
                                                    <ScreenshotMonitorIcon
                                                        fontSize="large"
                                                        style={{ color: "#fff", verticalAlign: 'middle', fill: "#FFF" }}
                                                        className="h-[45px] inline-block mr-2"
                                                    />
                                                }
                                                description="Browsed more than 10 seconds"
                                            /> */}
                                        </div>

                                    </div>

                                </>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

