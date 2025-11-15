"use client";
import React, { useRef, useState, useEffect } from "react";

type PinInputProps = {
  length?: number;
  value?: string; // ✅ incoming value from parent (optional)
  onChange?: (pin: string) => void; // ✅ inform parent on any update
  onComplete?: (pin: string) => void;
  className?: string;
};

export default function PinInput({ length = 4, value, onChange, onComplete, className }: PinInputProps) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // ✅ Sync parent value → internal state
  useEffect(() => {
    if (!value) return;
    const arr = value.slice(0, length).split("").concat(Array(length).fill(""));
    setValues(arr.slice(0, length));
  }, [value, length]);

  const focusInput = (idx: number) => {
    inputsRef.current[idx]?.focus();
  };

  const updateValues = (next: string[]) => {
    setValues(next);
    const pin = next.join("");
    onChange?.(pin); // ✅ send partial pin to parent

    if (pin.length === length && !next.includes("")) {
      onComplete?.(pin); // ✅ final complete callback
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const digit = e.target.value.replace(/\D/g, "").slice(0, 1);

    const next = [...values];
    next[idx] = digit || "";
    updateValues(next);

    if (digit && idx < length - 1) focusInput(idx + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (values[idx]) {
        const next = [...values];
        next[idx] = "";
        updateValues(next);
      } else if (idx > 0) {
        focusInput(idx - 1);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("");
    const next = Array(length).fill("");
    for (let i = 0; i < chars.length; i++) next[i] = chars[i];
    updateValues(next);
    focusInput(Math.min(chars.length, length - 1));
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className="w-14 h-14 text-lg font-medium text-gray-800 rounded-md bg-[#DFE1E0] border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 caret-transparent text-center"
          />
        ))}
      </div>
    </div>
  );
}
