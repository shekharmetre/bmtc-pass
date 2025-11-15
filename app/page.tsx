'use client'

import { useState, useEffect, useCallback } from "react"
import AnimatedSearchInput from "@/components/animatedSearchINput"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLocalStorageOnce } from "@/lib/hooks/useLocalStorageOnce"

interface PassengerForm {
  name: string
  idType: "Aadhar"
  idNumber: string
  image?: string // Base64 string
}

const HomePage = () => {
  const router = useRouter()
  const [passengerForm, savePassengerForm] =
    useLocalStorageOnce<PassengerForm | null>("passengerForm", null);
  // ---------------- Popup State ----------------
  const [popupOpen, setPopupOpen] = useState(false)
  const [formData, setFormData] = useState<PassengerForm>({
    name: "",
    idType: "Aadhar",
    idNumber: "",
    image: ""
  })
  const [greenAdd, setgreenAdd] = useState(true)

  // Open popup only if localStorage does NOT have passengerForm
  useEffect(() => {
    const savedData = localStorage.getItem("passengerForm")
    if (!savedData) {
      setPopupOpen(true)
    } else {
      // Prefill form if needed
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleChange = useCallback((field: keyof PassengerForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      handleChange("image", reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [handleChange])

  const handleSave = useCallback(() => {
    savePassengerForm(formData);
    alert("Passenger data saved to localStorage")
    setPopupOpen(false)
  }, [formData])


  // ---------------- Layout ----------------
  return (
    <section
      id="History"
      className="relative bg-background flex items-start justify-center overflow-hidden"
    >
      <div className="relative w-full h-full mb-20 max-w-[428px] bg-background min-h-screen">

        {/* Scroll Area */}
        <div className="overflow-y-scroll">
          <div className="bg-[#0F2D38] w-full h-40">
            <div className="flex justify-between items-center px-2 pt-2">
              <Image src="/icon.png" alt="icon-image" width={500} height={500} className="w-10 h-6" />
              <Image src="/weather.png" alt="icon-image" width={500} height={500} className="w-48 h-14 object-contain mr-2" />
            </div>

            <div className="flex justify-between items-center px-2 mt-4">
              <h2 className="text-white text-[17px] font-semibold">Good Evening {passengerForm?.name}</h2>
              <Image src="/green.png" alt="icon-image" width={500} height={500} className="w-20 h-11" />
            </div>

            <AnimatedSearchInput
              wordGroups={[
                ["search products", "search users", "search orders"],
                ["iphone", "charger", "screen protector"]
              ]}
              inputClassName="w-[93%] mx-auto p-2 py-3 mt-5 rounded-md"
              typingSpeed={70}
              deletingSpeed={35}
              pauseBetweenWords={1000}
              pauseBetweenGroups={1200}
            />
          </div>
          {greenAdd && <Image onClick={() => setgreenAdd(false)} src="/ad1.png" alt="advertisement" width={500} height={500} className="w-[94%] mx-auto mt-12 h-16 object-cover rounded-2xl" />
          }
          <Image src="/passes.png" alt="passes" width={500} height={500} className="w-full mt-3" />
          <Image src="/commute.png" alt="commute" width={500} height={500} className="w-full mt-3" />
          <Image src="/outStation.png" alt="travel" width={500} height={500} className="w-full" />
        </div>

        {/* Sticky Bottom Overlay */}
        <div className="fixed bottom-0 right-4 w-full z-20">
          <Image
            src="/all-in-one.png"
            onClick={() => router.push("/pass")}
            alt="travel"
            width={500}
            height={500}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Passenger Form Popup */}
      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent className="p-6 bg-white max-w-full h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Passenger Form</h2>

          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="font-medium">Passenger Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange("name", e.target.value)}
                className="border p-2 rounded-md"
                placeholder="Enter name"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Identification Type</span>
              <select value={formData.idType} disabled className="border p-2 rounded-md bg-gray-200">
                <option value="Aadhar">Aadhar</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Identification Number (Last 4 digits)</span>
              <input
                type="text"
                value={formData.idNumber}
                onChange={e => {
                  if (e.target.value.length <= 4) handleChange("idNumber", e.target.value)
                }}
                className="border p-2 rounded-md"
                placeholder="e.g. 1234"
              />
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.image && (
                <Image src={formData.image} alt="Uploaded" width={100} height={100} className="mt-2 rounded-md object-cover" />
              )}
            </label>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default HomePage
