
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown } from "lucide-react"
import { AttributeItem } from "@/lib/types"

interface AttributesProps {
    browserAttributes?: AttributeItem[]
    clickAttributes?: AttributeItem[]
}

const AttributeRow = ({ attribute }: { attribute: AttributeItem }) => {
    const [animated, setAnimated] = useState(false);
    const prevValue = useRef(attribute.value);

    useEffect(() => {
        if (prevValue.current !== attribute.value) {
            setAnimated(true);
            const timeout = setTimeout(() => setAnimated(false), 2000);
            return () => clearTimeout(timeout);
        }
        prevValue.current = attribute.value;
    }, [attribute.value]);

    return (
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-foreground">{attribute.name}</span>
            <motion.span
                className="w-[90px] text-center bg-background text-sm border border-border rounded-full text-foreground px-4 py-1 transition-colors "
                animate={
                    animated
                        ? {
                            backgroundColor: "#bbf7d0", borderColor: "#4ade80", opacity: 1,
                            color: '#000'
                        }
                        : { backgroundColor: "#101010", borderColor: "#101010", opacity: 1 } // dark background
                }
            >
                {attribute.value != null && attribute.value !== "" ? attribute.value : "N/A"}
            </motion.span>
        </div>
    )
};

export function Attributes({ browserAttributes = [], clickAttributes = [] }: AttributesProps) {
    const [attributesOpen, setAttributesOpen] = useState(() => {
        const stored = localStorage.getItem("attributesOpen");
        return stored === "true";
    });
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        localStorage.setItem("attributesOpen", attributesOpen ? "true" : "false");
    }, [attributesOpen]);
    return (
        <>
            {/* Attributes Accordion */}


            <div className="bg-[#282828] border border-border rounded-lg mb-1">
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
                                        <AttributeRow attribute={attribute} />
                                    ))}
                                </div>
                                <div className="p-2">
                                    <h1 className="text-lg text-white font-bold">Click Behaviour</h1>
                                    {clickAttributes.map((attribute, index) => (
                                        <AttributeRow attribute={attribute} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </>
    )
}