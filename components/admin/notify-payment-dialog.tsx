"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notifyPaymentAction } from "@/lib/actions/admin";

interface NotifyPaymentDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotifyPaymentDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: NotifyPaymentDialogProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    startTransition(async () => {
      const result = await notifyPaymentAction({
        userId,
        message: message.trim() || undefined,
      });
      if (result.ok) {
        toast.success(
          result.mode === "dev"
            ? "Email pregătit (dev mode — n-a plecat)."
            : `Reminder trimis către ${userName.split(" ")[0]}.`
        );
        setMessage("");
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reminder de plată</DialogTitle>
          <DialogDescription>
            Trimite un email lui <strong>{userName}</strong> cu un link la
            pagina de prețuri. Poți adăuga un mesaj scurt opțional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="message">Mesaj (opțional, max 500)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Am observat că abonamentul a expirat săptămâna trecută…"
            maxLength={500}
            disabled={isPending}
            rows={4}
          />
          <p className="text-right font-mono text-[10px] tabular-nums text-muted-foreground">
            {message.length}/500
          </p>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8"
            )}
          >
            Anulează
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 gap-1.5"
            )}
          >
            <Mail className="size-3.5" />
            {isPending ? "Se trimite…" : "Trimite"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
