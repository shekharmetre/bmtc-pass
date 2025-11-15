'use client'
import StatusTabs from "@/components/statusTab";
import Tabs from "@/components/tabs";
import { getPassDates } from "@/lib/helper";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Pass = () => {
    const router = useRouter()
    return (
        <section className="relative bg-background overflow-hidden min-h-screen">
            <div className="relative w-full h-full mt-6 mx-auto max-w-[428px] bg-background  min-h-screen">
                <div className="flex gap-5 items-center px-2">
                    <ArrowLeft className="text-xl font-semibold" />
                    <h2 className="text-xl font-normal">Bookings</h2>
                </div>
                <Tabs />
                <StatusTabs onChange={(tab) => console.log("Selected:", tab)} />
                <div onClick={() => router.push("/monthly")} className="bg-linear-to-r from-[#0B4D55] to-[#0A7982] h-full full m-1 rounded-md mt-8 p-3 px-4">
                    <div className="flex items-center justify-between">
                        <ul className="flex items-center gap-2">
                            <li className="bg-[#3D626B] text-white text-xs w-fit p-1 px-3  rounded-md">Ordinary</li>
                            <li className="bg-[#3D626B] text-white text-xs w-fit p-1 px-3  rounded-md">Monthly</li>
                        </ul>
                        <h3 className="text-white text-xl font-semibold">₹ 1200.0</h3>
                    </div>

                    <h2 className="text-2xl mt-2 text-white">Ordinary Service Monthly Pass</h2>
                    <div className="mt-5 text-white text-sm flex justify-between items-center">
                        <div>
                            <p>Pass valid till</p>
                            {getPassDates().issuedOn}, 11:59 PM
                        </div>
                        <ChevronRight size={6} className="bg-[#34849b] rounded-full w-8 p-1 h-8 text-white" />
                    </div>
                </div>
                <Image src="/new.png" alt="new-pass" width={500} height={500} className="mt-6" />
                {/* <Image src="/pass-add.png" alt="new-pass" width={500} height={500} className="fixed -bottom-5 z-50" /> */}
            </div>
            {/*  */}
        </section >
    )
}

export default Pass;