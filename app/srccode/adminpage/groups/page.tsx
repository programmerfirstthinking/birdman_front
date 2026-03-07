"use client"
import { useEffect, useState } from "react"

// Group型
type Group = {
  ID: number
  UserID: number
  SchoolID: number | null
  CreatedAt: string
  UpdatedAt: string
}

export default function AdminPage() {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:8080/getAllGroup", { method: "POST" })
        const data: Group[] = await res.json()
        setGroups(data)
      } catch (err) {
        console.error("グループ取得失敗", err)
      }
    }

    fetchGroups()
  }, [])

  // グループ削除
  const handleDeleteGroup = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteGroup/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("削除失敗")
      setGroups(prev => prev.filter(g => g.ID !== id))
    } catch (err) {
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div>
      <h1>グループ管理ページ</h1>

      {groups.length === 0 ? (
        <p>グループがありません</p>
      ) : (
        groups.map((group, i) => (
          <div key={`${group.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {group.ID}</p>
            <p><strong>UserID:</strong> {group.UserID}</p>
            <p><strong>SchoolID:</strong> {group.SchoolID ?? "-"}</p>
            <p><strong>CreatedAt:</strong> {group.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {group.UpdatedAt}</p>

            <button
              onClick={() => handleDeleteGroup(group.ID)}
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