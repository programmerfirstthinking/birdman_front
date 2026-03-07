"use client"
import { useEffect, useState } from "react"

// User型
type User = {
  ID: number
  Name: string
  SchoolID: number | null
  Nandai: string | null
  Image: string | null
  Introduce: string | null
  Twitter: string | null
  Uuid: string
  CreatedAt: string
  UpdatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/getAllUsers", { method: "POST" })
        const data: User[] = await res.json()
        setUsers(data)
      } catch (err) {
        console.error("ユーザー取得失敗", err)
      }
    }

    fetchUsers()
  }, [])

  // ユーザー削除
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/deleteUser/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("削除失敗")
      setUsers(prev => prev.filter(u => u.ID !== id))
    } catch (err) {
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div>
      <h1>ユーザー管理ページ</h1>

      {users.length === 0 ? (
        <p>ユーザーがいません</p>
      ) : (
        users.map((user, i) => (
          <div key={`${user.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {user.ID}</p>
            <p><strong>Name:</strong> {user.Name}</p>
            <p><strong>SchoolID:</strong> {user.SchoolID ?? "-"}</p>
            <p><strong>年代:</strong> {user.Nandai ?? "-"}</p>
            <p><strong>Image:</strong> {user.Image ? <a href={user.Image} target="_blank">表示</a> : "-"}</p>
            <p><strong>自己紹介:</strong> {user.Introduce ?? "-"}</p>
            <p><strong>Twitter:</strong> {user.Twitter ? <a href={`https://twitter.com/${user.Twitter}`} target="_blank">{user.Twitter}</a> : "-"}</p>
            <p><strong>UUID:</strong> {user.Uuid}</p>
            <p><strong>CreatedAt:</strong> {user.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {user.UpdatedAt}</p>

            <button
              onClick={() => handleDeleteUser(user.ID)}
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