"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {

  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {

    const password = prompt("管理者パスワードを入力してください")

    fetch("http://localhost:8080/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setMessage("管理者ログイン成功")
        } else {
          alert("パスワードが違います")
          router.push("/") // ホームへ追い出す
        }
      })

  }, [])

  const buttonStyle = {
    padding: "10px 16px",
    margin: "8px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0070f3",
    color: "white",
    cursor: "pointer"
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Page</h1>
      <p>{message}</p>

      <div style={{ marginTop: "20px" }}>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topics")}>
          トピック
        </button>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topic-comments")}>
          トピックコメント
        </button>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/groups")}>
          グループ
        </button>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/group-topics")}>
          グループトピック
        </button>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/schools")}>
          スクール
        </button>

        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/users")}>
          ユーザー
        </button>

      </div>
    </div>
  )
}