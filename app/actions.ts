"use server"

export async function sendNotification(userIds: string[], message: string) {
  try {
    const response = await fetch("https://localhost:3001/api/send-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds,
        message,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to send notification")
    }

    // Count successful notifications
    const successCount = data.results?.filter((r: any) => r.success).length || 0

    return {
      success: true,
      successCount,
      results: data.results,
    }
  } catch (error) {
    console.error("Error sending notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}