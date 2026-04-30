"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  ExternalLink,
  Mail,
  Ban,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  suspendUserAction,
  unsuspendUserAction,
} from "@/lib/actions/admin";
import { NotifyPaymentDialog } from "@/components/admin/notify-payment-dialog";

interface UserActionsMenuProps {
  userId: string;
  userName: string;
  hasAccess: boolean;
  /** Hide the "Detalii" link when already on the detail page. */
  hideDetailLink?: boolean;
}

export function UserActionsMenu({
  userId,
  userName,
  hasAccess,
  hideDetailLink = false,
}: UserActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notifyOpen, setNotifyOpen] = useState(false);

  const handleSuspend = () => {
    startTransition(async () => {
      const result = await suspendUserAction({ userId });
      if (result.ok) {
        toast.success(`${userName.split(" ")[0]} — acces suspendat.`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUnsuspend = () => {
    startTransition(async () => {
      const result = await unsuspendUserAction({ userId });
      if (result.ok) {
        toast.success(`${userName.split(" ")[0]} — acces restaurat.`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Acțiuni pentru ${userName}`}
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "size-7"
          )}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-56">
          {hideDetailLink ? null : (
            <>
              <DropdownMenuItem render={<Link href={`/admin/${userId}`} />}>
                <ExternalLink className="size-4" />
                Detalii
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            render={
              <button type="button" onClick={() => setNotifyOpen(true)} />
            }
          >
            <Mail className="size-4" />
            Trimite reminder de plată
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {hasAccess ? (
            <DropdownMenuItem
              variant="destructive"
              render={<button type="button" onClick={handleSuspend} />}
            >
              <Ban className="size-4" />
              Suspendă acces
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              render={<button type="button" onClick={handleUnsuspend} />}
            >
              <CheckCircle2 className="size-4" />
              Restaurează acces
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <NotifyPaymentDialog
        userId={userId}
        userName={userName}
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
      />
    </>
  );
}
