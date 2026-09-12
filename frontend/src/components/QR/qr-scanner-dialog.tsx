"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const QrScanner = dynamic(() => import("./Html5QrcodePlugin"), {
  ssr: false,
  loading: () => <p role="status">Loading scanner...</p>,
});

type QrScannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (decodedText: string) => void;
};

function ScanSession({ onConfirm }: Pick<QrScannerDialogProps, "onConfirm">) {
  const [result, setResult] = useState<string | null>(null);
  const confirmed = useRef(false);

  if (result === null) {
    return <QrScanner qrCodeSuccessCallback={(text: string) => setResult(text)} />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2" aria-live="polite">
        <p className="font-medium">Scanned QR content</p>
        <p className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted p-3">
          {result}
        </p>
        <p className="text-sm text-muted-foreground">
          Review the result before adding it to your message.
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setResult(null)}>
          Scan again
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (confirmed.current) return;
            confirmed.current = true;
            onConfirm(result);
          }}
        >
          Use in chat
        </Button>
      </div>
    </div>
  );
}

export default function QrScannerDialog({
  open,
  onOpenChange,
  onConfirm,
}: QrScannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan a medicine QR code</DialogTitle>
          <DialogDescription>
            Use your camera or select an image containing a QR code.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <ScanSession
            onConfirm={(text) => {
              onConfirm(text);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
