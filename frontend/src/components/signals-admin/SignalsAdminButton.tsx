import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignalsAdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onClick: () => void;
}

export function SignalsAdminButton({
  active,
  onClick,
}: SignalsAdminButtonProps) {
  return (
    <div className="fixed z-50 bottom-6 right-6">
      <Button
        variant="outline"
        className={`
          bg-white
          flex items-center gap-2 rounded-full 
          text-sm font-medium shadow-lg
          px-4 py-2.5 h-auto
          ${active ? "bg-background/20" : ""}
        `}
        onClick={onClick}
      >
        <Settings2 className="w-4 h-4" />
        Begin Signals Demo
      </Button>
    </div>
  );
}
