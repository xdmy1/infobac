"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  X,
  Image as ImageIcon,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CourseIcon } from "@/components/shared/course-icon";
import { cn } from "@/lib/utils";
import {
  approvePaymentRequestAction,
  rejectPaymentRequestAction,
} from "@/lib/actions/payment";
import type { AdminPaymentRequestRow } from "@/lib/queries/payment";
import { SubscriptionPlanLabels } from "@/lib/supabase/types";

interface Props {
  row: AdminPaymentRequestRow;
}

const COURSE_LABEL: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  devices: "Devices",
};

export function AdminPaymentRow({ row }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approvePaymentRequestAction(row.id);
      if (result.ok) {
        toast.success("Cerere aprobată — abonament activat.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Motivează respingerea (vede userul).");
      return;
    }
    startTransition(async () => {
      const result = await rejectPaymentRequestAction(row.id, rejectReason);
      if (result.ok) {
        toast.success("Cerere respinsă.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const isPending_ = row.status === "pending";

  return (
    <li className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold">
              {row.user_full_name ?? "—"}
            </p>
            <span className="text-xs text-muted-foreground">
              {row.user_email}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Cerere acum {timeSince(row.created_at)} · ID{" "}
            <span className="font-mono">{row.id.slice(0, 8)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            {SubscriptionPlanLabels[row.plan]}
          </span>
          <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[11px] font-bold text-background">
            {row.amount_mdl} MDL
          </span>
          {row.selected_course_slug && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold">
              <CourseIcon
                slug={row.selected_course_slug}
                src={`/courses/${
                  row.selected_course_slug === "devices"
                    ? "networking-devices"
                    : row.selected_course_slug
                }.png`}
                size={14}
              />
              {COURSE_LABEL[row.selected_course_slug] ?? row.selected_course_slug}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {row.proof_via === "telegram" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold text-accent">
            <MessageCircle className="size-3" />
            Trimis pe Telegram
          </span>
        )}
        {row.proof_via === "upload" && row.proof_signed_url && (
          <a
            href={row.proof_signed_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/5 px-2.5 py-1 text-[11px] font-semibold text-success hover:bg-success/10"
          >
            <ImageIcon className="size-3" />
            Vezi screenshot
          </a>
        )}
        {row.proof_via === "none" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/5 px-2.5 py-1 text-[11px] font-semibold text-warning">
            Fără dovadă
          </span>
        )}
        {row.user_notes && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          >
            Mesaj user
            {open ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
        )}
        {!isPending_ && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
              row.status === "approved" && "bg-success/15 text-success",
              row.status === "rejected" && "bg-destructive/15 text-destructive",
            )}
          >
            {row.status === "approved" ? "Aprobat" : "Respins"}
          </span>
        )}
      </div>

      {open && row.user_notes && (
        <p className="mt-3 rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground/80">
          {row.user_notes}
        </p>
      )}

      {isPending_ && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {rejectMode ? (
            <>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motiv respingere (vizibil userului)"
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-foreground/30"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectMode(false);
                    setRejectReason("");
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 px-3 text-sm",
                  )}
                >
                  Anulează
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isPending}
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "h-10 gap-2 px-4 text-sm",
                    isPending && "cursor-wait",
                  )}
                >
                  Confirmă respingere
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setRejectMode(true)}
                disabled={isPending}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 gap-1.5 px-3 text-sm",
                )}
              >
                <X className="size-3.5" />
                Respinge
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPending}
                className={cn(
                  buttonVariants(),
                  "h-10 gap-1.5 bg-success px-4 text-sm font-semibold text-white hover:bg-success/90",
                  isPending && "cursor-wait",
                )}
              >
                <Check className="size-3.5" />
                {isPending ? "Se aprobă..." : "Aprobă"}
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "câteva secunde";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? "zi" : "zile"}`;
}
