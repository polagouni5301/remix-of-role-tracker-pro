import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({ open, onOpenChange, title, desc, confirmLabel = "Confirm", onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {desc && <AlertDialogDescription>{desc}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirm() {
  const [state, setState] = useState({ open: false });
  return {
    confirm: (opts) => new Promise((resolve) => setState({ open: true, ...opts, resolve })),
    node: (
      <ConfirmDialog
        {...state}
        onOpenChange={(open) => setState((s) => ({ ...s, open }))}
        onConfirm={() => { state.resolve?.(true); setState({ open: false }); }}
      />
    ),
  };
}
