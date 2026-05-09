import { Clock, CheckCircle, Package, Truck, XCircle, AlertCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; dot: string }> = {
  pending: {
    label: "En attente",
    icon: <Clock className="w-3 h-3" />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmée",
    icon: <CheckCircle className="w-3 h-3" />,
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  preparing: {
    label: "En préparation",
    icon: <Package className="w-3 h-3" />,
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  shipped: {
    label: "Expédiée",
    icon: <Truck className="w-3 h-3" />,
    bg: "bg-bordeaux/10",
    text: "text-bordeaux",
    dot: "bg-bordeaux",
  },
  delivered: {
    label: "Livrée",
    icon: <CheckCircle className="w-3 h-3" />,
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Annulée",
    icon: <XCircle className="w-3 h-3" />,
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

const OrderStatusBadge = ({ status, size = "sm", showIcon = true }: OrderStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    icon: <AlertCircle className="w-3 h-3" />,
    bg: "bg-gray-100",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-1" : "text-xs px-3 py-1.5";

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} ${sizeClasses} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
