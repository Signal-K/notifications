"use client"

import type React from "react"

import { useState } from "react"
import { sendNotification } from "@/app/actions"
import UserSelector from "./user-selector"

export default function NotificationForm() {
  const [message, setMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message: string
  }>({ type: "idle", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      setStatus({
        type: "error",
        message: "Message cannot be empty!",
      })
      return
    }

    if (selectedUsers.length === 0) {
      setStatus({
        type: "error",
        message: "Select at least one user!",
      })
      return
    }

    setStatus({ type: "loading", message: "Sending notification..." })

    try {
      const result = await sendNotification(selectedUsers, message)

      if (result.error) {
        throw new Error(result.error)
      }

      setStatus({
        type: "success",
        message: `Notification sent to ${result.successCount} users!`,
      })
      setMessage("")
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send notification",
      })
    }
  }

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-2xl font-bold mb-2">
            MESSAGE
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-4 text-lg border-4 border-black focus:outline-none focus:ring-4 focus:ring-pink-500"
            placeholder="Type your notification message here..."
          />
        </div>

        <UserSelector selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} />

        <div className="pt-4">
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="w-full md:w-auto px-8 py-4 text-xl font-bold text-white bg-pink-500 border-4 border-black hover:bg-pink-600 active:translate-y-1 active:translate-x-1 transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            {status.type === "loading" ? "SENDING..." : "SEND NOTIFICATION"}
          </button>
        </div>

        {status.message && (
          <div
            className={`p-4 border-4 border-black mt-4 font-bold ${
              status.type === "error" ? "bg-red-200" : status.type === "success" ? "bg-green-200" : "bg-blue-200"
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  )
}
