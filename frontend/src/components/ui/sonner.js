"use client";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  return (
    <Sonner
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-white text-black border border-gray-200 rounded-lg p-4 flex items-center gap-2 w-full",
          title: "text-sm font-medium",
          error: "bg-white text-red-700 border-red-200",
          success: "bg-green-50 text-green-700 border-green-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
