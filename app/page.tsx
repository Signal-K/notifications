"use client"

import { useSupabaseClient } from "@supabase/auth-helpers-react"
import type React from "react"
import { useState, useEffect } from "react"

export default function ClientPage() {
  const supabase = useSupabaseClient()

  const [message, setMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [userIds, setUserIds] = useState<string[]>([])

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message: string
  }>({
    type: "idle",
    message: "",
  })

  // Fetch user IDs from the 'profiles' table on component mount
  useEffect(() => {
    async function fetchUserIds() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
      
      if (error) {
        console.error("Error fetching user IDs:", error)
      } else {
        setUserIds(data?.map((profile) => profile.id) || [])
      }
    }

    fetchUserIds()
  }, [supabase])

  const handleAddUser = () => {
    if (inputValue.trim() && !selectedUsers.includes(inputValue.trim())) {
      setSelectedUsers([...selectedUsers, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user))
  }

  // Select all users
  const handleSelectAllUsers = () => {
    setSelectedUsers((prevSelectedUsers) => {
      // Only add users that are not already selected
      const allUsers = userIds.filter((user) => !prevSelectedUsers.includes(user))
      return [...prevSelectedUsers, ...allUsers]
    })
  }

  async function sendNotification(userIds: string[], message: string) {
    try {
      const response = await fetch("https://starsailors.space/api/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds,
          message,
        }),
        mode: 'no-cors', // Add this line to prevent CORS issues (this will block response data)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }
  
      console.log("Notification sent successfully");
      return { success: true };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error: error }; // Return error object
    }
  }  

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

      if (!result.success) {
        throw new Error(result.error as string)
      }

      setStatus({
        type: "success",
        message: "Notification sent successfully!",
      })
      setMessage("")
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send notification",
      })
    }
  }

  // Inline styles for neobrutalist design
  const styles = {
    main: {
      minHeight: "100vh",
      padding: "24px",
      backgroundColor: "#FFFAEE",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "48px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "900",
      marginBottom: "16px",
      color: "#000",
    },
    divider: {
      height: "16px",
      backgroundColor: "#FF3366",
      width: "128px",
      marginBottom: "24px",
    },
    subtitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
    },
    formContainer: {
      backgroundColor: "#FFF",
      border: "4px solid #000",
      boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
      padding: "32px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    textarea: {
      width: "100%",
      height: "128px",
      padding: "16px",
      fontSize: "18px",
      border: "4px solid #000",
      outline: "none",
      fontFamily: "inherit",
    },
    userSelectorContainer: {
      marginBottom: "24px",
    },
    selectedUsersContainer: {
      display: "flex",
      flexWrap: "wrap" as React.CSSProperties["flexWrap"],
      gap: "8px",
      marginBottom: "16px",
    },
    userTag: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "#E6F0FF",
      border: "2px solid #000",
    },
    userTagText: {
      fontWeight: "500",
      maxWidth: "200px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    removeButton: {
      padding: "4px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      borderRadius: "50%",
    },
    inputContainer: {
      display: "flex",
      gap: "8px",
    },
    input: {
      flex: "1",
      padding: "16px",
      fontSize: "18px",
      border: "4px solid #000",
      outline: "none",
    },
    addButton: {
      padding: "0 16px",
      backgroundColor: "#3366FF",
      border: "4px solid #000",
      color: "#FFF",
      cursor: "pointer",
      fontSize: "24px",
      fontWeight: "bold",
    },
    submitButton: {
      padding: "16px 32px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#FFF",
      backgroundColor: "#FF3366",
      border: "4px solid #000",
      cursor: "pointer",
      transition: "transform 0.1s",
    },
    statusMessage: {
      padding: "16px",
      border: "4px solid #000",
      marginTop: "16px",
      fontWeight: "bold",
    },
    errorMessage: {
      backgroundColor: "#FFCCCC",
    },
    successMessage: {
      backgroundColor: "#CCFFCC",
    },
    loadingMessage: {
      backgroundColor: "#CCE5FF",
    },
    note: {
      fontSize: "14px",
      fontStyle: "italic",
      color: "#666",
      marginTop: "8px",
    },
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>PUSH NOTIFIER</h1>
          <div style={styles.divider}></div>
          <p style={styles.subtitle}>Send notifications to your users with brutal simplicity.</p>
        </header>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="message" style={styles.label}>
                MESSAGE
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.textarea}
                placeholder="Type your notification message here..."
              />
            </div>

            <div style={styles.userSelectorContainer}>
              <label style={styles.label}>USERS</label>

              <div style={styles.selectedUsersContainer}>
                {selectedUsers.map((user) => (
                  <div key={user} style={styles.userTag}>
                    <span style={styles.userTagText}>{user}</span>
                    <button type="button" onClick={() => handleRemoveUser(user)} style={styles.removeButton}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.inputContainer}>
                <select
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={styles.input}
                >
                  <option value="" disabled>
                    Select user ID
                  </option>
                  {userIds.map((userId) => (
                    <option key={userId} value={userId}>
                      {userId}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddUser} style={styles.addButton}>
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleSelectAllUsers}
                style={styles.addButton}
              >
                Select All Users
              </button>

              <p style={styles.note}>
                Note: Select a user ID from the list or add your own user ID.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={status.type === "loading"}
                style={{
                  ...styles.submitButton,
                  opacity: status.type === "loading" ? 0.5 : 1,
                  cursor: status.type === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {status.type === "loading" ? "SENDING..." : "SEND NOTIFICATION"}
              </button>
            </div>

            {status.message && (
              <div
                style={{
                  ...styles.statusMessage,
                  ...(status.type === "error"
                    ? styles.errorMessage
                    : status.type === "success"
                      ? styles.successMessage
                      : styles.loadingMessage),
                }}
              >
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  )
};