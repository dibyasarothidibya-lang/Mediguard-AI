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
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const confirmed = useRef(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsProcessingFile(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      // Use an off-DOM container ID or temporary element
      const tempId = `temp_scanner_${Date.now()}`;
      let tempDiv = document.getElementById(tempId);
      if (!tempDiv) {
        tempDiv = document.createElement("div");
        tempDiv.id = tempId;
        tempDiv.style.display = "none";
        document.body.appendChild(tempDiv);
      }

      const html5QrCode = new Html5Qrcode(tempId);
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        setResult(decodedText);
      } finally {
        try {
          await html5QrCode.clear();
        } catch {}
        tempDiv.remove();
      }
    } catch (err: unknown) {
      setFileError("No QR code or barcode found in this image. Please try a clearer picture.");
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (result === null) {
    return (
      <div className="space-y-4">
        <QrScanner qrCodeSuccessCallback={(text: string) => setResult(text)} />

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-muted w-full" />
          <span className="bg-background px-2 text-xs text-muted-foreground uppercase">Or upload image</span>
          <div className="border-t border-muted w-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="qr-file-upload-input"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            disabled={isProcessingFile}
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessingFile ? "Scanning image..." : "Upload medicine package photo"}
          </Button>

          {fileError && (
            <p className="text-xs text-rose-500 font-medium text-center" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2" aria-live="polite">
        <p className="font-medium">Scanned QR / Barcode content</p>
        <p className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted p-3">
          {result}
        </p>
        <p className="text-sm text-muted-foreground">
          Review the result before adding it to your message.
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setResult(null);
            setFileError(null);
          }}
        >
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
