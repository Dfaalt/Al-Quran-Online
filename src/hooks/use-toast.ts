import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

function toast({ title, description, variant = "default" }: ToastProps) {
  const message = title ?? description ?? "";

  if (variant === "destructive") {
    return sonnerToast.error(message, {
      description: title ? description : undefined,
    });
  }

  if (variant === "success") {
    return sonnerToast.success(message, {
      description: title ? description : undefined,
    });
  }

  if (variant === "warning") {
    return sonnerToast.warning(message, {
      description: title ? description : undefined,
    });
  }

  if (variant === "info") {
    return sonnerToast.info(message, {
      description: title ? description : undefined,
    });
  }

  return sonnerToast(message, {
    description: title ? description : undefined,
  });
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
