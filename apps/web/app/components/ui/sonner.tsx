"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!border !border-(--Text)/15 !bg-(--Layout) !text-(--Text) shadow-lg",
          title: "!text-(--Text)",
          description: "!text-(--Text)/75",
          success: "!border-(--ThemaVerdeEscuro)/40",
          error: "!border-red-500/40",
          warning: "!border-amber-500/40",
          info: "!border-(--ThemaAzul)/40",
        },
      }}
      {...props}
    />
  );
}
