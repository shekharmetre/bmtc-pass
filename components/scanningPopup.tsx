"use client";

import { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import CustomSelect from "@/components/customSelect";
import PinInput from "@/components/pinInput";
import AutoCloseModal from "@/components/autoclose";
import { formatDate, parseBusData } from "@/lib/helper";
import { MdFlashAuto } from "react-icons/md";
import Link from "next/link";

export default function ScanningPopup({ open, onClose, onScanSuccess }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [validated, setValidated] = useState({
        prefix: "",
        number: "",
        time: formatDate(new Date()),
    });

    useEffect(() => {
        const setupScanner = async () => {
            try {
                // ✅ Ask for camera access explicitly
                await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

                if (!videoRef.current) return;

                qrScannerRef.current = new QrScanner(
                    videoRef.current,
                    (result) => {
                        console.log("✅ QR Scan Result:", result.data);
                        const data = parseBusData(result?.data)
                        setValidated({
                            prefix: data?.prefix || "KA43M",
                            number: data?.busNumber || "4102",   // correct key
                            time: data?.time || formatDate(new Date()),
                        });
                        onScanSuccess?.(result.data);
                        onClose?.();
                        setModalOpen(true);
                        qrScannerRef.current?.stop();
                    },
                    {
                        highlightScanRegion: false,
                        highlightCodeOutline: false,
                    }
                );

                await qrScannerRef.current.start();
                setIsReady(true);

            } catch (error) {
                console.error("❌ Camera Error:", error);
                alert("Camera access blocked. Please allow camera and reload.");
            }
        };

        setupScanner();

        return () => {
            qrScannerRef.current?.stop();
            qrScannerRef.current?.destroy();
        };
    }, [open, onClose, onScanSuccess]);


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/75 backdrop-blur-sm min-w-full" />

            <DialogContent className="
    p-0 
    m-0 
    w-full 
    border-none
    max-w-full 
    rounded-none 
    bg-black 
    overflow-hidden
    [&>button]:hidden  /* hides default close button */
  ">

                {/* Camera Section */}
                <div className="flex-1 relative h-[60vh]">
                    {!isReady && (
                        <p className="text-white text-center pt-40">Initializing camera...</p>
                    )}

                    <video ref={videoRef} className="w-full h-full object-cover" />

                    <Link className="absolute top-6 left-4 text-white text-xl" href="/monthly">
                        <ArrowLeft />
                    </Link>
                    <div className="absolute bottom-4 left-8 flex items-center gap-7">
                        <div className=" flex items-center gap-3 bg-[#212121] px-3 py-2.5 pr-6 pl-4 rounded-full">
                            <Search className="text-white p-1" />
                            <input type="range" min={0} max={100} defaultValue={0} className="accent-white" />
                        </div>
                        <MdFlashAuto className="text-white bg-[#212121] w-12 h-12 p-3 rounded-full" />
                    </div>

                    <div className="absolute top-16 left-4 bg-white rounded-md flex items-center gap-2 px-3 py-2 w-[95%]">
                        <Image src="/scan-looo.png" width={40} height={40} alt="scan" className="rounded-md" />
                        <p className="text-blue-700 font-semibold text-sm">Enter bus number or Scan QR to validate</p>
                    </div>
                </div>

                {/* Bottom White Panel */}
                <div className="bg-white p-4 -mt-5 h-[40vh]">
                    <h2 className="font-medium py-3 text-xl">Enter bus number</h2>

                    <CustomSelect
                        value={validated.prefix}
                        onChange={(val) => setValidated({ ...validated, prefix: val })}
                    />

                    <PinInput
                        value={validated.number}
                        onChange={(val) => {
                            setValidated({ ...validated, number: val });

                            // ✅ Check if entered number has expected length (e.g. 4 digits)
                            if (val.length === 4) {
                                setModalOpen(true);
                            }
                        }}
                        className="mt-6 grid place-content-center"
                    />
                </div>
            </DialogContent>

            {modalOpen && <AutoCloseModal />}
        </Dialog>
    );
}
