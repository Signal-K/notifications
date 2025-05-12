"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

// This is a placeholder component that you'll replace with your own implementation
export default function UserSelector({
  selectedUsers,
  onSelectionChange,
}: {
  selectedUsers: string[]
  onSelectionChange: (users: string[]) => void
}) {
  const [inputValue, setInputValue] = useState("")

  // This is just a placeholder implementation
  // You'll replace this with your actual user selection logic
  const handleAddUser = () => {
    if (inputValue.trim() && !selectedUsers.includes(inputValue.trim())) {
      onSelectionChange([...selectedUsers, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleRemoveUser = (user: string) => {
    onSelectionChange(selectedUsers.filter((u) => u !== user))
  }

  return (
    <div className="space-y-4">
      <label className="block text-2xl font-bold">USERS</label>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUsers.map((user) => (
          <div key={user} className="flex items-center gap-2 px-3 py-2 bg-blue-200 border-2 border-black">
            <span className="font-medium truncate max-w-[200px]">{user}</span>
            <button type="button" onClick={() => handleRemoveUser(user)} className="p-1 hover:bg-blue-300 rounded-full">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter user ID"
          className="flex-1 p-4 text-lg border-4 border-black focus:outline-none focus:ring-4 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddUser()
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 border-4 border-black hover:bg-blue-600 active:translate-y-1 active:translate-x-1 transition-transform"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>

      <p className="text-sm text-gray-600 italic">
        Note: This is a placeholder user selector. Replace with your own implementation.
      </p>
    </div>
  )
}
