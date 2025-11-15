"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import Lottie from "lottie-react";
import animationData from "@/public/yes.json";
import { getPassDates } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function AutoCloseModal() {
    const [open, setOpen] = useState(false);
    const router = useRouter()

    useEffect(() => {
        setOpen(true);

        const timer = setTimeout(() => {
            setOpen(false);
            router.push("/monthly")
        }, 70000); // 10 seconds  (adjust as needed)

        return () => clearTimeout(timer);
    }, []);

    const data = [
        { title: "Pass number", desc: "TPASS964211710" },
        { title: "Pass type", desc: "Monthly" },
        { title: "Pass valid till", desc: getPassDates().validTill + ", 11:59 PM" }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogOverlay className="bg-transparent backdrop-blur-0" />
            <DialogContent className="w-[96%] rounded-xl mx-auto px-3 [&>.absolute]:hidden">
                <Lottie
                    animationData={animationData}
                    loop
                    className="w-20 h-20 mx-auto"
                />

                <h2 className="text-xl font-medium text-center">
                    Self verification done successfully
                </h2>

                <div className="grid grid-cols-1 gap-2 w-full">
                    {data.map((item, index) => (
                        <label key={index} className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm font-medium">
                                {item.title}
                            </span>
                            <span className="text-xs font-medium text-gray-700">
                                {item.desc}
                            </span>
                        </label>
                    ))}
                </div>

                <Separator />

                <label className="flex justify-between items-center -mt-2">
                    <span className="text-base font-medium">Pass fare</span>
                    <span className="text-base font-medium">₹ 1200</span>
                </label>

                <button
                    className="bg-[#10BBC3] p-3 text-white w-full rounded-md"
                    onClick={() => { setOpen(false); router.push("/monthly") }}
                >
                    Okay
                </button>
            </DialogContent>
        </Dialog>
    );
}
