"use client";
import { useState } from "react";

export default function Tabs() {
  const [active, setActive] = useState<"passes" | "trips">("passes");

  return (
    <div className="w-full mt-6">
      <ul className="relative flex justify-between items-center text-base font-medium select-none">
        <li
          onClick={() => setActive("passes")}
          className={`w-1/2 text-center cursor-pointer py-2 transition-colors ${
            active === "passes" ? "text-[#10BBC3]" : "text-gray-500"
          }`}
        >
          Passes
        </li>

        <li
          onClick={() => setActive("trips")}
          className={`w-1/2 text-center cursor-pointer transition-colors ${
            active === "trips" ? "text-[#10BBC3]" : "text-gray-500"
          }`}
        >
          Trips/Tickets
        </li>

        {/* Underline */}
        <span
          className="absolute -bottom-2 h-[3px] w-1/2 bg-[#10BBC3] rounded-md transition-transform duration-300"
          style={{
            transform: active === "passes" ? "translateX(0%)" : "translateX(100%)",
          }}
        />
      </ul>
    </div>
  );
}
