






"use client"
import { useEffect, useState } from "react"

type Topic = {
  ID: number
  Year: number | null
  UserID: number
  TopicName: string
  Content: string
  Activate: boolean
  Alert: boolean
  CreatedAt: string
  UpdatedAt: string
}

export default function AdminPage() {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:8080/getAllTopic", { method: "POST" })
        const data: Topic[] = await res.json()
        console.log("Fetched topics:", data)
        setTopics(data)
      } catch (err) {
        console.error("failed to fetch topics", err)
      }
    }

    fetchTopics()
  }, [])

  // DBにも反映させる削除
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteTopic/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("failed to delete topic")

      // 成功したらフロント配列からも削除
      setTopics(prev => prev.filter(topic => topic.ID !== id))
    } catch (err) {
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div>
      <h1>トピックページ</h1>

      {topics.map((topic, index) => (
        <div
          key={`${topic.ID}-${index}`}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <p><strong>ID:</strong> {topic.ID}</p>
          <p><strong>Year:</strong> {topic.Year ?? "-"}</p>
          <p><strong>UserID:</strong> {topic.UserID}</p>
          <p><strong>TopicName:</strong> {topic.TopicName}</p>
          <p><strong>Content:</strong> {topic.Content}</p>
          <p><strong>Activate:</strong> {topic.Activate ? "true" : "false"}</p>
          <p><strong>Alert:</strong> {topic.Alert ? "true" : "false"}</p>
          <p><strong>CreatedAt:</strong> {topic.CreatedAt}</p>
          <p><strong>UpdatedAt:</strong> {topic.UpdatedAt}</p>

          <button
            onClick={() => handleDelete(topic.ID)}
            style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer", marginTop: "5px" }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  )
}