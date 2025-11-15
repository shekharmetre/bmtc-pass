'use client'
import React, { useEffect, useState, useRef } from "react";
import {Search} from "lucide-react"


export type AnimatedSearchInputProps = {
    /** Array of groups. Each group is an array of placeholder words/phrases. Component will cycle groups. */
    wordGroups?: string[][];
    typingSpeed?: number; // ms per character when typing
    deletingSpeed?: number; // ms per character when deleting
    pauseBetweenWords?: number; // ms to wait after a full word is typed
    pauseBetweenGroups?: number; // ms to wait after finishing a group before switching groups
    className?: string;
    inputClassName?: string;
    placeholderPrefix?: string; // optional text before the animated part
};

export default function AnimatedSearchInput({
    wordGroups = [["search products", "search users", "search orders"], ["apple", "banana", "mango"]],
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseBetweenWords = 1000,
    pauseBetweenGroups = 1500,
    className = "w-full max-w-lg",
    inputClassName = "w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none",
    placeholderPrefix = "",
}: AnimatedSearchInputProps) {
    const [groupIndex, setGroupIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        // Safety: ensure there is at least one group and one word
        if (!wordGroups || wordGroups.length === 0 || wordGroups[0].length === 0) return;

        let timer: ReturnType<typeof setTimeout> | null = null;

        const currentGroup = wordGroups[groupIndex % wordGroups.length];
        const currentWord = currentGroup[wordIndex % currentGroup.length];

        if (!isDeleting) {
            // Type next character
            if (displayText.length < currentWord.length) {
                timer = setTimeout(() => {
                    if (!mountedRef.current) return;
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                }, typingSpeed);
            } else {
                // Word fully typed, wait then start deleting
                timer = setTimeout(() => {
                    if (!mountedRef.current) return;
                    setIsDeleting(true);
                }, pauseBetweenWords);
            }
        } else {
            // Deleting flow
            if (displayText.length > 0) {
                timer = setTimeout(() => {
                    if (!mountedRef.current) return;
                    setDisplayText(currentWord.slice(0, displayText.length - 1));
                }, deletingSpeed);
            } else {
                // Finished deleting — move to next word
                timer = setTimeout(() => {
                    if (!mountedRef.current) return;
                    setIsDeleting(false);
                    setWordIndex((w) => w + 1);
                    // if we've cycled through the whole group, advance to next group
                    if ((wordIndex + 1) % currentGroup.length === 0) {
                        // switch groups after a small pause
                        setTimeout(() => {
                            if (!mountedRef.current) return;
                            setGroupIndex((g) => g + 1);
                            setWordIndex(0);
                        }, pauseBetweenGroups);
                    }
                }, 150);
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };

    }, [displayText, isDeleting, groupIndex, wordIndex, wordGroups, typingSpeed, deletingSpeed, pauseBetweenWords, pauseBetweenGroups]);

    // The placeholder should always be safe string
    const placeholder = `${placeholderPrefix}${displayText}`;

    return (
        <div className={`flex items-center ${className} relative`}>
            <label htmlFor="search-input" className="sr-only">Search</label>
            <input
                id="search-input"
                aria-label="Search"
                placeholder={placeholder}
                className={`pl-12 bg-white border border-gray-200 ${inputClassName}`}
                onFocus={() => {
                    // optional: stop animation while user types or focuses
                }}
            />
            <Search className="absolute left-6 top-8 text-gray-500" />
        </div>
    );
}

/**
 * Example usage:
 *
 * import AnimatedSearchInput from './AnimatedSearchInput'
 *
 * function Demo() {
 *   return (
 *     <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
 *       <AnimatedSearchInput
 *         wordGroups={[
 *           ["search products", "search users", "search orders"],
 *           ["iphone", "charger", "screen protector"]
 *         ]}
 *         typingSpeed={70}
 *         deletingSpeed={35}
 *         pauseBetweenWords={1000}
 *         pauseBetweenGroups={1200}
 *         placeholderPrefix="Try: "
 *       />
 *     </div>
 *   )
 * }
 */
