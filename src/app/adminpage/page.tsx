

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../firebaseconfig/firebase"
import { API_BASE_URL } from "../api/api";

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

export default function AdminPage() {
  const [message, setMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null) // currentUser を state で管理
  const router = useRouter()

  // currentUser を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("currentUser:", user) // <- まずこれを確認
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  // currentUser が取得できたらバックエンドに admin チェック
  useEffect(() => {
    if (!currentUser) return

    ;(async () => {
      try {
        const idToken = await currentUser.getIdToken()

        // Go バックエンドに送信して admin チェック
        // const res = await fetch("http://localhost:8080/admin/check", {
        const res = await fetch(`${API_BASE_URL}/admin/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + idToken
          }
        })

        const data = await res.json()

        if (data.isAdmin) {
          setMessage("管理者ログイン成功")
        } else {
          alert("管理者権限がありません")
          router.push("/")
        }
      } catch (err) {
        console.error(err)
        alert("エラーが発生しました")
        router.push("/")
      }
    })()
  }, [currentUser]) // currentUser がセットされたら発火

  const buttonStyle = { padding: "10px 16px", margin: "8px", fontSize: "16px", borderRadius: "6px", border: "none", backgroundColor: "#0070f3", color: "white", cursor: "pointer" }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Page</h1>
      <p>{message}</p>

      <div style={{ marginTop: "20px" }}>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/topics")}>トピック</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/topic-comments")}>トピックコメント</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/groups")}>グループ</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/grouptopics")}>グループトピック</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/schools")}>スクール</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/users")}>ユーザー</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/password")}>パスワード</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/school_group")}>スクールのグループ</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/school_topic")}>スクールトピック</button>
        <button style={buttonStyle} onClick={() => router.push("/adminpage/adminuser")}>アドミンユーザー追加</button>
      </div>
    </div>
  )
}

