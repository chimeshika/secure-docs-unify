import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, CheckCircle } from "lucide-react";

type DocumentStatus = "received" | "processing" | "completed";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

const statusConfig = {
  received: {
    label: "Received",
    icon: Clock,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
  },
};

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`gap-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
