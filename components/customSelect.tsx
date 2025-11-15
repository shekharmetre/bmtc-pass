"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const items = [
    "KA35F", "KA29D", "KA89B", "KA45X",
    "KA35F", "KA29D", "KA89B", "KA45X",
];

export default function CustomSelect({ value, onChange }: { value?: string, onChange?: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    // ✅ Whenever parent updates prefix, reflect it here
    useEffect(() => {
        if (value) setSelected(value.toUpperCase());
    }, [value]);

    const handleSelect = (item: string) => {
        setSelected(item);
        onChange?.(item); // send back to parent
        setOpen(false);
    };

    return (
        <div className="relative w-full">
            {/* Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center bg-gray-50 border mt-2 mx-auto border-gray-300 h-14 rounded-md w-56 shadow-sm"
            >
                <span className={`flex-1 truncate ${selected ? "text-xl uppercase pl-4" : "text-gray-400 text-[15px] pl-4"}`}>
                    {selected ? selected : "Select bus number prefix"}
                </span>
                <ChevronDown className={`bg-white h-full w-10 p-2 z-50 rounded-md transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-2000"
                        onClick={() => setOpen(false)}
                    />

                    <ul className="fixed left-1/2 -translate-x-1/2 bottom-56 z-3000 bg-white border border-gray-300 rounded-md w-fit p-4 shadow-lg max-h-64 overflow-y-auto">
                        {items.map((item, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-4 uppercase text-xl cursor-pointer hover:bg-gray-100 text-gray-700 text-center"
                                onClick={() => handleSelect(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
