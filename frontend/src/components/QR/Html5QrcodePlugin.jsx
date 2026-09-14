"use client";

import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useEffectEvent, useId, useState } from "react";

// A new scanner must wait for asynchronous cleanup from the previous one.
let scannerLifecycle = Promise.resolve();

/**
 * @param {{
 *   qrCodeSuccessCallback: import("html5-qrcode").QrcodeSuccessCallback,
 *   qrCodeErrorCallback?: import("html5-qrcode").QrcodeErrorCallback,
 *   fps?: number,
 *   qrbox?: number,
 *   aspectRatio?: number,
 *   disableFlip?: boolean,
 *   verbose?: boolean,
 * }} props
 */
export default function Html5QrcodePlugin({
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
  fps = 10,
  qrbox = 250,
  aspectRatio,
  disableFlip = false,
  verbose = false,
}) {
  const regionId = useId();
  const [error, setError] = useState("");

  // Use the latest callbacks without restarting the camera on parent renders.
  const onSuccess = useEffectEvent((text, result) => {
    qrCodeSuccessCallback(text, result);
  });
  const onScanError = useEffectEvent((message, result) => {
    qrCodeErrorCallback?.(message, result);
  });

  useEffect(() => {
    let disposed = false;
    let accepted = false;
    /** @type {Html5QrcodeScanner | undefined} */
    let scanner;

    scannerLifecycle = scannerLifecycle.then(() => {
      if (disposed) return;

      setError("");
      scanner = new Html5QrcodeScanner(
        regionId,
        {
          fps,
          qrbox,
          aspectRatio,
          disableFlip,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          rememberLastUsedCamera: false,
        },
        verbose,
      );
      scanner.render(
        (text, result) => {
          if (disposed || accepted) return;
          accepted = true;
          onSuccess(text, result);
        },
        (message, result) => {
          if (!disposed && !accepted) onScanError(message, result);
        },
      );
    }).catch((cause) => {
      console.error("Unable to initialize QR scanner.", cause);
      if (!disposed) setError("The scanner could not start. Close it and try again.");
    });

    return () => {
      disposed = true;
      scannerLifecycle = scannerLifecycle
        .then(() => scanner?.clear())
        .catch((cause) => {
          console.error("Unable to close QR scanner.", cause);
        });
    };
  }, [regionId, fps, qrbox, aspectRatio, disableFlip, verbose]);

  return (
    <div>
      <div id={regionId} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
