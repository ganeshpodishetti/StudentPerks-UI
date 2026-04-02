import { LucideIcon } from "lucide-react";
import React from "react";

interface DealInfoBoxProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "blue" | "purple";
}

const DealInfoBox: React.FC<DealInfoBoxProps> = ({ title, description, icon: Icon, variant }) => {
  const bgColor = variant === "blue" ? "bg-brand-100/30 dark:bg-brand-900/30" : "bg-brand-100/30 dark:bg-brand-900/30"; // Using brand colors for both based on redesign scripts
  const borderColor = "border-brand-300 dark:border-brand-700";
  const iconColor = "text-brand-700 dark:text-brand-300";
  const titleColor = "text-brand-900 dark:text-brand-100";
  const textColor = "text-brand-700 dark:text-brand-300";

  return (
    <div className={`${bgColor} p-3 rounded-xl border ${borderColor}`}>
      <div className="flex items-start gap-2">
        <Icon className={`h-3.5 w-3.5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="min-w-0">
          <h4 className={`text-xs font-medium ${titleColor} mb-0.5`}>{title}</h4>
          <p className={`text-xs ${textColor} leading-relaxed`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DealInfoBox;
