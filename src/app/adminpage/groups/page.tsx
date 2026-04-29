









"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../firebaseconfig/firebase"
import { API_BASE_URL } from "../../api/api"

// Firebase 初期化
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Group 型
type Group = {
  ID: number
  UserID: number
  SchoolID: number | null
  CreatedAt: string
  UpdatedAt: string
}

export default function AdminPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const router = useRouter()

  // 🔹 currentUser を監視して IDToken 取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const token = await user.getIdToken()
          setIdToken(token)
        } catch (err) {
          console.error("IDトークン取得エラー:", err)
        }
      } else {
        setIdToken(null)
      }
    })
    return () => unsubscribe()
  }, [])

  // 🔹 管理者チェック
  useEffect(() => {
    if (!idToken) return

    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        })
        const data = await res.json()
        if (!data.isAdmin) {
          alert("管理者権限がありません")
          router.push("/") // 権限なしならトップへ
        } else {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error("adminチェックエラー:", err)
        alert("管理者チェックに失敗しました")
        router.push("/")
      }
    })()
  }, [idToken, router])

  // 🔹 グループ一覧取得
  useEffect(() => {
    if (!idToken || !isAdmin) return

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getAllGroup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data: Group[] = await res.json()
        setGroups(data)
      } catch (err) {
        console.error("グループ取得失敗", err)
        alert("グループ取得に失敗しました")
      }
    }

    fetchGroups()
  }, [idToken, isAdmin])

  // 🔹 グループ削除
  const handleDeleteGroup = async (id: number) => {
    if (!idToken) return
    if (!confirm("本当に削除しますか？")) return

    try {
      const res = await fetch(`${API_BASE_URL}/deleteGroup/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      })
      if (!res.ok) throw new Error(`削除失敗: ${res.status}`)
      // DOMから即時削除
      setGroups(prev => prev.filter(g => g.ID !== id))
    } catch (err) {
      console.error(err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>グループ管理ページ</h1>

      {!isAdmin && <p>管理者権限チェック中...</p>}

      {groups.length === 0 ? (
        <p>グループがありません</p>
      ) : (
        groups.map((group, i) => (
          <div
            key={`${group.ID}-${i}`}
            style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
          >
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