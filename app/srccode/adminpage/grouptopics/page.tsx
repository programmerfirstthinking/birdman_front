"use client"
import { useEffect, useState } from "react"

// GroupsContent型
type GroupsContent = {
  ID: number
  UserID: number
  SchoolID: number | null
  GroupID: number
  GroupContentsName: string
  Content: string
  PdfUrl: string | null
  CreatedAt: string
  UpdatedAt: string
}

export default function GroupContentsPage() {
  const [contents, setContents] = useState<GroupsContent[]>([])

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("http://localhost:8080/getAllGroupContents", { method: "POST" })
        const data: GroupsContent[] = await res.json()
        setContents(data)
      } catch (err) {
        console.error("グループコンテンツ取得失敗", err)
      }
    }

    fetchContents()
  }, [])

  // グループコンテンツ削除
  const handleDeleteContent = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteGroupContent/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("削除失敗")
      setContents(prev => prev.filter(c => c.ID !== id))
    } catch (err) {
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div>
      <h1>グループコンテンツ管理ページ</h1>

      {contents.length === 0 ? (
        <p>コンテンツがありません</p>
      ) : (
        contents.map((content, i) => (
          <div key={`${content.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {content.ID}</p>
            <p><strong>UserID:</strong> {content.UserID}</p>
            <p><strong>SchoolID:</strong> {content.SchoolID ?? "-"}</p>
            <p><strong>GroupID:</strong> {content.GroupID}</p>
            <p><strong>名前:</strong> {content.GroupContentsName}</p>
            <p><strong>内容:</strong> {content.Content}</p>
            <p><strong>PDF:</strong> {content.PdfUrl ? <a href={content.PdfUrl} target="_blank">開く</a> : "-"}</p>
            <p><strong>CreatedAt:</strong> {content.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {content.UpdatedAt}</p>

            <button
              onClick={() => handleDeleteContent(content.ID)}
              style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}
            >
              削除
            </button>
          </div>
        ))
      )}
    </div>
  )
}