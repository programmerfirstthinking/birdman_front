"use client"

import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { firebaseConfig } from "../../firebaseconfig/firebase"
import { API_BASE_URL } from "../../api/api";

// Firebase 初期化
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function AdminUserPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [userId, setUserId] = useState<number | "">("") // 数字のみ

  // 🔹 管理者チェックと一覧取得
  const loadAdmins = async (user: any) => {
    try {
      const idToken = await user.getIdToken()
      // バックエンドに admin チェック
      const checkRes = await fetch(`${API_BASE_URL}/admin/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        }
      })
      const checkData = await checkRes.json()
      if (!checkData.isAdmin) {
        alert("管理者権限がありません")
        return
      }

      // 管理者ユーザー一覧取得
      // const res = await fetch("http://localhost:8080/adminusers", {
      const res = await fetch(`${API_BASE_URL}/adminusers`, {
        headers: { Authorization: "Bearer " + idToken },
      })
      const data = await res.json()
      setAdmins(data)
    } catch (err) {
      console.error("管理者データ取得失敗:", err)
      alert("管理者データ取得に失敗しました")
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return
      loadAdmins(user)
    })
    return () => unsubscribe()
  }, [])

  // 🔹 管理者追加
  const addAdmin = async () => {
    const user = auth.currentUser
    if (!user) return
    if (!userId) return alert("ユーザーIDを入力してください")

    try {
      const token = await user.getIdToken()
      // await fetch("http://localhost:8080/adminusers/add", {
      await fetch(`${API_BASE_URL}/adminusers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ user_id: userId }),
      })
      setUserId("")
      loadAdmins(user)
    } catch (err) {
      console.error("管理者追加失敗:", err)
      alert("管理者追加に失敗しました")
    }
  }

  // 🔹 管理者削除
  const deleteAdmin = async (id: number) => {
    const user = auth.currentUser
    if (!user) return
    try {
      const token = await user.getIdToken()
      await fetch(`${API_BASE_URL}/adminusers/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      })
      loadAdmins(user)
    } catch (err) {
      console.error("管理者削除失敗:", err)
      alert("管理者削除に失敗しました")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Users</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="ユーザーID (数字)"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <button onClick={addAdmin}>追加</button>
      </div>

      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a: any) => (
            <tr key={String(a.ID)}>
              <td>{a.ID}</td>
              <td>{a.UserID}</td>
              <td>
                <button onClick={() => deleteAdmin(a.ID)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}