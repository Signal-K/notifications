import NotificationForm from "@/components/notification-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Push Notification Sender",
  description: "Send push notifications to your users",
}

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12 bg-yellow-50">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-black">PUSH NOTIFIER</h1>
          <div className="h-4 bg-pink-500 w-32 mb-6"></div>
          <p className="text-xl font-bold text-gray-800">Send notifications to your users with brutal simplicity.</p>
        </header>

        <NotificationForm />
      </div>
    </main>
  )
}
