"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

interface LiveQRProps {
  size?: number;
  color?: string;
  interval?: number;
}

export default function LiveQR({
  size = 100,
  color = "#4B0082",
  interval = 1000,
}: LiveQRProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  // Create QRCodeStyling only on client
  useEffect(() => {
    if (!ref.current) return;

    const qr = new QRCodeStyling({
      width: 200,
      height: 190,
      margin: 20,
      type: "svg",
      cornersSquareOptions: {
        type: "square",
        color,
      },
      qrOptions: {
        mode: "Alphanumeric",
      },
      dotsOptions: {
        type: "square",
        color: "#000",
      },
    });

    qr.append(ref.current);

    setQrCode(qr);
  }, [color]);

  // Continuous update
  useEffect(() => {
    if (!qrCode) return;

    const id = setInterval(() => {
      qrCode.update({
        data: `LIVE-${Date.now()}`,
      });
    }, interval);

    return () => clearInterval(id);
  }, [qrCode, interval]);

  return <div className="w-full mt-5 flex justify-center" ref={ref}></div>;
}
