"use client";
import { useState } from "react";

interface StatusTabsProps {
  onChange?: (value: "active" | "expired") => void;
}

export default function StatusTabs({ onChange }: StatusTabsProps) {
  const [selected, setSelected] = useState<"active" | "expired">("active");

  const handleSelect = (value: "active" | "expired") => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <ul className="flex gap-3 mt-5 items-center select-none px-3">
      <li
        onClick={() => handleSelect("active")}
        className={`py-2 px-5 rounded-md font-medium text-sm cursor-pointer transition-all ${
          selected === "active"
            ? "bg-[#E6F9FF] text-[#1BB6BE]"
            : "bg-[#F5F5F5] text-black/70"
        }`}
      >
        Active
      </li>

      <li
        onClick={() => handleSelect("expired")}
        className={`py-2 px-5 rounded-md text-sm font-medium cursor-pointer transition-all ${
          selected === "expired"
            ? "bg-[#E6F9FF] text-[#1BB6BE]"
            : "bg-[#F5F5F5] text-black/70"
        }`}
      >
        Expired
      </li>
    </ul>
  );
}
