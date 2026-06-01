"use client";

import { Bell } from "lucide-react";
import { Button } from "@DevsNossoLar/ui-theme/components/common";
import { ViewTransitionToggle } from "@DevsNossoLar/ui-theme/components/animated";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@DevsNossoLar/ui-theme/components/shadcn";

interface HeaderActionsProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function HeaderActions({
  isDark,
  onToggleTheme
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">

      <div className="flex items-center bg-muted/30 rounded-xl p-1 gap-1">

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg relative hover:bg-(--LayoutSecundary) transition-colors cursor-not-allowed"
            >
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--Layout)" />
              <Bell size={18} className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          
          <TooltipContent
            side="bottom"
            className="bg-(--foreground) text-(--TextReverse)"
          >
            Notificações
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border/60 mx-1" />

        <ViewTransitionToggle
          isDark={isDark}
          onToggle={onToggleTheme}
          className="h-8 w-8 rounded-lg hover:bg-(--LayoutSecundary)"
        />
      </div>
    </div>
  );
}