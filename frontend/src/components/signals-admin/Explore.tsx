import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';


interface ExploreComponentProps {
    className?: string
    title: string
    description: string
    onClick: () => void
    nextStep: string
}

interface ExploreProps {
    className?: string
    progress: string | null | undefined
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
export function Explore({ className, progress }: ExploreProps) {
    const exploreSteps = {
        solutions: { href: "/use-cases", nextStep: "Visit the Solutions Page" },
        pricing: { href: "/pricing", nextStep: "Visit the Pricing Page" },
        form: { href: "/get-started/book-a-demo-of-snowplow-bdp", nextStep: "Contact Us" },
    };

    const step = progress == null ? "solutions" : progress;
    const stepConfig = exploreSteps[step as keyof typeof exploreSteps];

    return (
        <>
            {stepConfig ? (
                <ExploreComponent
                    className={className}
                    title="Continue the tour"
                    description="Copy about a feature or functionality the tip is near. Be specific and suggest  actions if possible."
                    onClick={() => (window.location.href = stepConfig.href)}
                    nextStep={stepConfig.nextStep}
                />
            ) : progress === "submit" ? (
                <h1>Completed</h1>
            ) : null}
        </>
    );
}