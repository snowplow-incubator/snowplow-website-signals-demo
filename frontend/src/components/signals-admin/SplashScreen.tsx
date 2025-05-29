import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { SnowplowLogo } from "./SnowplowLogo"

interface SplashScreenProps {
    onClose: () => void
}

export function SplashScreen({ onClose }: SplashScreenProps) {
    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.6,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    }

    // Animation for the number circles
    const circleVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: (custom: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.6 + custom * 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
            },
        }),
    }

    return (
        <motion.div
            className="fixed inset-0 bg-foreground/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:bg-muted"
                onClick={onClose}
            >
                <X className="h-6 w-6" />
            </Button>

            <motion.div
                className="bg-background bg-white rounded-xl px-10 py-10 max-w-[640px] w-full shadow-lg border border-gray-200"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className=" text-left mb-2">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex mb-2"
                    >
                        <SnowplowLogo variant="full" size="md" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-brand tracking-wide mb-3"
                    >
                        SIGNALS DEMO
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-brand text-lg mb-3"
                    >
                        See real-time personalization powered by your behavioral data.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-muted-foreground text-base/8 mb-8"
                    >
                        This interactive demo shows how Snowplow Signals can dynamically adapt your website experience—in real
                        time—based on how users interact with your site.
                    </motion.p>

                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 text-left p-2 text-sm/6">
                        <motion.div variants={itemVariants} className="flex gap-4">
                            <motion.div
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 border border-gray-100 flex items-center justify-center"
                                variants={circleVariants}
                                initial="initial"
                                animate="animate"
                                custom={0}
                            >
                                <span className="font-bold text-foreground">01</span>
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-foreground">Browse the Site</h3>
                                <p className="text-muted-foreground">
                                    Simulate typical user journeys and watch how recommendations evolve.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex gap-4">
                            <motion.div
                                className="flex-shrink-0 w-10 h-10 rounded-full  bg-gray-100 border border-gray-100  flex items-center justify-center"
                                variants={circleVariants}
                                initial="initial"
                                animate="animate"
                                custom={1}
                            >
                                <span className="font-bold text-foreground">02</span>
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-foreground">Watch the Data Flow</h3>
                                <p className="text-muted-foreground">
                                    The panel will show you view real-time data, conversion scores, and behavior-driven updates as they
                                    happen.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex gap-4">
                            <motion.div
                                className="flex-shrink-0 w-10 h-10 rounded-full  bg-gray-100 border border-gray-100  flex items-center justify-center"
                                variants={circleVariants}
                                initial="initial"
                                animate="animate"
                                custom={2}
                            >
                                <span className="font-bold text-foreground">03</span>
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-foreground">Stay a While</h3>
                                <p className="text-muted-foreground">
                                    Linger on pages or explore deeper—see how time-on-site and engagement shape the experience.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }} // Delay after all steps have animated
                    className="flex flex-col items-end"
                >
                    <Button onClick={onClose} className="w-full max-w-xs bg-brand text-white hover:bg-brand/90 transition-colors">
                        Start your personalized demo
                    </Button>
                    <p className="text-muted-foreground text-sm mt-3">Explore the power of behavioral intelligence.</p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}