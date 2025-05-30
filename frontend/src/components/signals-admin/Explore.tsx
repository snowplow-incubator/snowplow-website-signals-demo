import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';
import { exploreSteps } from "@/lib/constants"

interface ExploreComponentProps {
    className?: string
    title: string
    description: string
    onClick: () => void
    nextStep: string
    videoSrc?: string | undefined
}

interface ExploreProps {
    className?: string
    progress: string | null | undefined
}

function ExploreComponent({ className, title, description, onClick, nextStep, videoSrc = undefined }: ExploreComponentProps) {
    return (
        <div className={cn("bg-white rounded-lg p-4 h-[300px] w-[360px] border border-slate-200", className)}>
            <div className="bg-slate-100 rounded-sm p-4 h-[130px]">
                {/* {videoSrc ? (
                    <iframe
                        width="220"
                        height="120"
                        src="https://www.youtube.com/embed/_o-TO1GB1Bo?autoplay=1&mute=1"
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                    />
                ) : null
                } */}
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
export function Explore({ className, progress }: ExploreProps) {
    const step = progress == null ? "solutions" : progress;
    const stepConfig = exploreSteps[step as keyof typeof exploreSteps];

    return (
        <>
            {stepConfig ? (
                <ExploreComponent
                    className={className}
                    title={stepConfig.title}
                    description={stepConfig?.description}
                    onClick={stepConfig.onClick}
                    nextStep={stepConfig.nextStep}
                    videoSrc={stepConfig.videoSrc}
                />
            ) : null}
        </>
    );
}