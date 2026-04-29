









"use client"

import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { firebaseConfig } from "../../firebaseconfig/firebase"
import { API_BASE_URL } from "../../api/api"

// Firebase 初期化
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // 🔹 Firebase ユーザー監視 + IDトークン取得
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
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  // 🔹 管理者チェック + グループコンテンツ取得
  useEffect(() => {
    if (!idToken) return

    ;(async () => {
      try {
        // 管理者チェック
        const checkRes = await fetch(`${API_BASE_URL}/admin/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        })
        const checkData = await checkRes.json()
        if (!checkData.isAdmin) {
          alert("管理者権限がありません")
          setIsAdmin(false)
          return
        }
        setIsAdmin(true)

        // 管理者ならグループコンテンツ取得
        const res = await fetch(`${API_BASE_URL}/getAllGroupContents`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data: GroupsContent[] = await res.json()
        setContents(data)
      } catch (err) {
        console.error("管理者チェック/コンテンツ取得失敗:", err)
        alert("管理者チェックまたはコンテンツ取得に失敗しました")
      }
    })()
  }, [idToken])

  // 🔹 グループコンテンツ削除
  const handleDeleteContent = async (id: number) => {
    if (!idToken || !isAdmin) return
    if (!confirm("本当に削除しますか？")) return

    try {
      const res = await fetch(`${API_BASE_URL}/deleteGroupContent/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      })
      if (!res.ok) throw new Error(`削除失敗: ${res.status}`)
      setContents(prev => prev.filter(c => c.ID !== id))
    } catch (err) {
      console.error("削除失敗", err)
      alert("削除に失敗しました")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>グループコンテンツ管理ページ</h1>

      {!isAdmin && <p>管理者権限チェック中...</p>}

      {contents.length === 0 ? (
        <p>コンテンツがありません</p>
      ) : (
        contents.map((content, i) => (
          <div
            key={`${content.ID}-${i}`}
            style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
          >
            <p><strong>ID:</strong> {content.ID}</p>
            <p><strong>UserID:</strong> {content.UserID}</p>
            <p><strong>SchoolID:</strong> {content.SchoolID ?? "-"}</p>
            <p><strong>GroupID:</strong> {content.GroupID}</p>
            <p><strong>名前:</strong> {content.GroupContentsName}</p>
            <p><strong>内容:</strong> {content.Content}</p>
            <p>
              <strong>PDF:</strong>{" "}
              {content.PdfUrl ? <a href={content.PdfUrl} target="_blank">開く</a> : "-"}
            </p>
            <p><strong>CreatedAt:</strong> {content.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {content.UpdatedAt}</p>

            <button
              onClick={() => handleDeleteContent(content.ID)}
              style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}
              disabled={!isAdmin} // 管理者でなければ押せない
            >
              削除
            </button>
          </div>
        ))
      )}
    </div>
  )
}