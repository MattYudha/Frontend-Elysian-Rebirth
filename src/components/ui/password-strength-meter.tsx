import { Progress } from "@/components/ui/progress";
import { checkPasswordStrength, PasswordStrength } from "@/lib/password-strength";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
    password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const { score, strength, messages } = checkPasswordStrength(password);

    const getColor = (score: number) => {
        if (score <= 1) return "bg-red-500";
        if (score === 2) return "bg-yellow-500";
        if (score >= 3) return "bg-green-500";
        return "bg-slate-200";
    };

    const strengthText = {
        'Too Weak': 'Sangat Lemah',
        'Weak': 'Lemah',
        'Medium': 'Sedang',
        'Strong': 'Kuat'
    };

    return (
        <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-500">Kekuatan Password</span>
                <span className={cn("text-xs font-bold transition-colors duration-300",
                    score <= 1 ? "text-red-500" :
                        score === 2 ? "text-yellow-600" : "text-green-600"
                )}>
                    {strengthText[strength]}
                </span>
            </div>

            <div className="flex gap-1 h-1">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-full flex-1 rounded-full transition-all duration-500",
                            score > index ? getColor(score) : "bg-slate-200"
                        )}
                    />
                ))}
            </div>

            {messages.length > 0 && (
                <ul className="space-y-1 mt-2">
                    {messages.map((msg, i) => (
                        <li key={i} className="text-[10px] text-red-500 flex items-start gap-1">
                            <span>•</span> {msg}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
