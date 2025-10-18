"use client";

import { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-orange-500";
      case "info":
        return "text-blue-500";
    }
  };

  const getIcon = () => {
    const iconClass = `w-6 h-6 flex-shrink-0 ${getIconColor()}`;
    
    switch (type) {
      case "success":
        return <CheckCircleIcon className={iconClass} />;
      case "error":
        return <ExclamationCircleIcon className={iconClass} />;
      case "warning":
        return <ExclamationTriangleIcon className={iconClass} />;
      case "info":
        return <InformationCircleIcon className={iconClass} />;
    }
  };

  return (
    <div
      className="button-gradient text-white rounded-lg shadow-lg p-4 mb-3 animate-toast-in flex items-center gap-3 min-w-[300px] max-w-md"
      role="alert"
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
        aria-label="Close"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;