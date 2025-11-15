'use client'
import { formatDate, getPassDates, getPassengerData, getValueFromArray, parseBusData } from "@/lib/helper"
import { ArrowLeft, ChevronDown, CircleAlert, MailOpen, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import ScanningPopup from "@/components/scanningPopup"
import { title } from "process"
import { useLocalStorageOnce } from "@/lib/hooks/useLocalStorageOnce"
import PhonePeQRScanner from "@/components/reatScaner"
import LiveQR from "@/components/reatScaner"
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog"

interface ValidatedData {
    title: string;
    desc: string;
    bus: string;
    example: string;
    valide: string;
    answer: string;
}

const Monthly = () => {
    // const data = [{ title: "Passenger name", desc: "Shekhar Metre" }, { title: "Identification type", desc: "Aadhar Card" }, { title: "Identification number (Last 4 digits)", desc: "0866" }, { title: "Pass purchase date", desc: getPassDates().issuedOn + ", 11:38 AM" }, { title: "Pass valid from", desc: getPassDates().issuedOn + ", 12:00 AM" }, { title: "Pass valid till", desc: getPassDates().validTill + ", 11:59 PM" }]
    const router = useRouter()
    const [scannerOpen, setScannerOpen] = useState(false);
    const [scanedData, setScannedData] = useState<any>()
    const [open, onOpenChange] = useState(false)


    // Example inside your component
    const defaultPassengerData = [
        { title: "Passenger name", desc: "Shekhar Metre" },
        { title: "Identification type", desc: "Aadhar Card" },
        { title: "Identification number (Last 4 digits)", desc: "0866" },
        { title: "Pass purchase date", desc: getPassDates().issuedOn + ", 11:38 AM" },
        { title: "Pass valid from", desc: getPassDates().issuedOn + ", 12:00 AM" },
        { title: "Pass valid till", desc: getPassDates().validTill + ", 11:59 PM" },
        { title: "image", desc: "" }

    ]

    const [data, setPassengerData] = useState(defaultPassengerData)

    useEffect(() => {
        if (typeof window === "undefined") return // SSR safety

        const savedData = localStorage.getItem("passengerForm")
        if (savedData) {
            const parsed = JSON.parse(savedData)
            // Update only relevant fields
            setPassengerData([
                { title: "Passenger name", desc: parsed.name || "Shekhar Metre" },
                { title: "Identification type", desc: parsed.idType + " Card" || "Aadhar Card" },
                { title: "Identification number (Last 4 digits)", desc: parsed.idNumber || "0866" },
                { title: "Pass purchase date", desc: getPassDates().issuedOn + ", 11:38 AM" },
                { title: "Pass valid from", desc: getPassDates().issuedOn + ", 12:00 AM" },
                { title: "Pass valid till", desc: getPassDates().validTill + ", 11:59 PM" },
                { title: "image", desc: parsed.image || "" }
            ])
        }
    }, [])

    const defaultValidatedData: ValidatedData = {
        title: "Last Validated",
        desc: formatDate(new Date()),
        bus: "Bus Number",
        example: "BMTC BUS KA57F6025",
        valide: "Validated By",
        answer: "Self",
    };

    const [vaidated, saveValidatedData] =
        useLocalStorageOnce<ValidatedData>("ScannedData", defaultValidatedData);

    // console.log(getValueFromArray(data, "image", 'desc'))

    const TermsCondition = ["Pass is valid for travel for the service it has been purchased and until the expiry date printed on the pass", "In case the conductor asks for you ID proof, you can either show a physical/digital copy of the ID used as the time of booking", "Only one pass is allowed for the one ID card", "Pass holders must show their pass to conductor or any authorised person on demand", "Improper/misuse of past results in withdrawl of pass attract penalty and pass holder will be liable to legal implications", "BMTC is not responsible if passenger/pass holder's mobile application is not working or switched off", "BMTC is not responsible if passenger/pass holder has entered wrong ID number in mobile pass purchased and the same cannot be accepted",
        "Pass holders should abide by and accept the conditions on which the pass is issued", "It is not required to carry BMTC ID card for pass holders who have a purchased a digital pass"]
    return (
    
        <section className="relative bg-background overflow-hidden min-h-screen">
            <div className="relative w-full h-full mx-auto max-w-[428px] min-h-screen bg-[#e4eaf5] pb-14">
                <div className="bg-[#0E192D] w-full flex justify-between p-4">
                    <h2 className="text-white text-[18px] flex items-center gap-4"><ArrowLeft /> <span>Your Bus Pass</span> </h2>
                    <Link href="#" className="text-blue-400 text-md">Support</Link>
                </div>
                <div className="shadow-sm shadow-black/20 m-2 bg-white  h-full rounded-md p-3">
                    <div className="flex gap-4 items-center">
                        <div>
                            <Image src="/bmtc-logo.png" alt="bmtc logo" width={500} height={500} className="w-14 h-14" />
                            <p className="text-slate-400 text-md mt-5">Pass ID:</p>
                        </div>
                        <div>
                            <h2 className="text-[#323F50] text-[17px]">Ordinary Montly Pass</h2>
                            <p className="flex items-center gap-2 mt-1 text-md"><span className="bg-[#c9eee9] text-[#1fb880] py-1 px-3 rounded-md ">Monthly</span> <span className="bg-[#c9eee9] text-[#323F50] py-1 px-4 rounded-md ">Ordinary</span> </p>
                            <p className="mt-5">TPASS964211710</p>
                        </div>
                    </div>
                    <button onClick={() => setScannerOpen(true)} className="bg-[#00A4C0] text-white w-full py-3 rounded-md mt-5">Validate Pass</button>
                    <Link href="#" className="text-[#00A4C0] flex gap-2 items-center text-[15px] justify-center mt-2  w-full"><CircleAlert size={17} className="rotate-180" /> How to Validate Your Pass?</Link>
                </div>
                <div className="shadow-md m-1 mt-24 bg-white  h-full rounded-md p-3 pb-8">
                    <h1 className="font-medium text-[#323F50] text-[20px] ">Booking Details</h1>
                    <div className="h-px mt-4 mb-1 w-full bg-[repeating-linear-gradient(to_right,#9CA3AF_0,#9CA3AF_4px,transparent_4px,transparent_8px)]"></div>
                    <div className="relative">
                        <div>
                            {data.map((item, index) => <label className="flex flex-col mt-2" key={index}>
                                <span className=" text-[#323F50]/70 text-[14px] ">{item.title}</span>
                                <span className="text-[16px] -mt-1 text-gray-650 font-normal">{item.desc}</span>
                            </label>)}
                            {/* #c8e6c9 */}
                        </div>
                        {getValueFromArray(data, "image", "desc") ? (
                            <Image
                                onClick={() => onOpenChange(true)} // u have to open model with that image
                                src={getValueFromArray(data, "image", "desc")!} // non-null since we checked
                                alt="user-profile"
                                width={144} // w-36
                                height={144}
                                className="w-22 h-22 object-cover rounded-full absolute right-4 top-0"
                                unoptimized // needed for base64 images
                            />
                        ) : (
                            <Image
                                src="/user2.png"
                                alt="user-profile"
                                width={144} // same width as above
                                height={144}
                                className="w-36 h-36 rounded-full absolute right-2 -top-4"
                            />
                        )}

                        <label className="absolute bottom-0 right-0 flex flex-col mt-2">
                            <span className=" text-[#323F50]/70 text-[16px] underline underline-offset-4 font-medium">Pass fare</span>
                            <span className="text-[19px] font-medium text-gray-700">₹ 1200.0</span>
                        </label>
                    </div>
                    <div className="h-px mt-4 mb-3 w-full bg-[repeating-linear-gradient(to_right,#9CA3AF_0,#9CA3AF_4px,transparent_4px,transparent_8px)]"></div>
                    <div className="flex justify-center">
                        <button className="border border-[#00A4C0] text-[#00A4C0] p-2 rounded-md px-3 flex justify-center items-center gap-1"><MailOpen size={17} /> Generate mail receipt</button>
                    </div>
                    <div className="h-px mt-4 mb-3 w-full bg-[repeating-linear-gradient(to_right,#9CA3AF_0,#9CA3AF_4px,transparent_4px,transparent_8px)]"></div>
                    <div className="bg-[#ccebcd] m-1  p-2 rounded-md flex flex-col gap-1 mt-4">
                        <label className=" flex flex-col">
                            <span className=" text-[#323F50]/60 text-[13px] font-medium">Last Validated</span>
                            <span className="text-[14px] font-medium text-gray-700">{vaidated?.desc}</span>
                        </label>
                        <label className=" flex flex-col">
                            <span className=" text-[#323F50]/60 text-[13px] font-medium">Bus Number</span>
                            <span className="text-[14px] font-medium text-gray-700">BMTC BUS {vaidated?.example}</span>
                        </label>
                        <label className=" flex flex-col">
                            <span className=" text-[#323F50]/60 text-[13px]  font-medium">Validated By</span>
                            <span className="text-[14px] font-medium text-gray-700">{vaidated?.answer}</span>
                        </label>
                    </div>
                    <LiveQR size={100} color="black" interval={800} />
                    {/* <Image src="/bmtc-qr.png" alt="bmtc-qr.png" width={500} height={500} className="mt-8 w-[60%] mx-auto" /> */}
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <div
                            id="terms-condition"
                            className="flex justify-between items-center bg-white m-2 p-3 rounded-md mt-4 py-4 shadow cursor-pointer"
                        >
                            <p className="text-[16px] ">Terms and Conditions</p>
                            <ChevronDown />
                        </div>
                    </SheetTrigger>

                    <SheetContent
                        side="bottom"
                        className="h-[90%] overflow-y-auto rounded-t-2xl [&>button]:hidden"
                    >
                        <SheetHeader>
                            <SheetTitle className="text-left text-[18px] font-semibold">
                                Terms and Conditions
                            </SheetTitle>
                        </SheetHeader>

                        <ul className="list-disc pl-10 -mt-3 pr-4 marker:text-2xl space-y-1 text-[15px] text-gray-700">
                            {TermsCondition.map((item, idx) => (
                                <li className="text-sm pl-2" key={idx}>
                                    {item}
                                </li>
                            ))}
                        </ul>

                    </SheetContent>
                </Sheet>

                <ScanningPopup
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onScanSuccess={(data: any) => {
                        const paresedData = parseBusData(data)
                        saveValidatedData({
                            title: "Last Validated",
                            desc: formatDate(new Date()),
                            bus: "Bus Number",
                            example: paresedData?.prefix + "" + paresedData?.busNumber,
                            valide: "Validated By",
                            answer: "Self"
                        })
                        // update last validation info here if you want
                    }}
                />




            </div>

        </section>
    )
}

export default Monthly