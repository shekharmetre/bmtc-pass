"use client";
import { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import { MdFlashAuto } from "react-icons/md";
import CustomSelect from "@/components/customSelect";
import PinInput from "@/components/pinInput";
import AutoCloseModal from "@/components/autoclose";
import { formatDate, parseBusData } from "@/lib/helper";

export default function ScanningInterface({ onClose, onScanSuccess }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);
    const [scannedText, setScannedText] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [open, setOpen] = useState(false);
    console.log(videoRef.current)
    const [vaidated, setValidated] = useState({
        prefix: "",
        number: "",
        time: formatDate(new Date()),
    })


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
                        setOpen(true);
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
    }, [onClose, onScanSuccess]);

    function hnaldeCOmplete() {
        setValidated({
            prefix: 
            '',
            number: "",
            time: "",
        })
    }

    return (
        <section className="min-h-screen flex flex-col bg-black relative">

            {/* Camera */}
            <div className="flex-1 relative h-[60vh] ">
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

            {/* White Bottom Panel */}
            <div className="h-[40vh] bg-white p-4 overflow-hidden rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.2)]">
                <h2 className="font-medium py-3 text-xl">Enter bus number</h2>
                <CustomSelect value={vaidated.prefix} onChange={(val) => setValidated({ ...vaidated, prefix: val })} />
                <PinInput value={vaidated.number} onChange={(val) => setValidated({ ...vaidated, number: val })} className="mt-6 grid place-content-center"  />
            </div>
            {open && <AutoCloseModal />}

        </section>
    );
}
