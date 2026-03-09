// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function AdminPage() {

//   const [message, setMessage] = useState("")
//   const router = useRouter()

//   // useEffect(() => {

//   //   const password = prompt("管理者パスワードを入力してください")

//   //   fetch("http://localhost:8080/admin/login", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify({
//   //       password: password
//   //     })
//   //   })
//   //     .then(res => res.json())
//   //     .then(data => {
//   //       if (data.ok) {
//   //         setMessage("管理者ログイン成功")
//   //       } else {
//   //         alert("パスワードが違います")
//   //         router.push("/") // ホームへ追い出す
//   //       }
//   //     })

//   // }, [])

//   const buttonStyle = {
//     padding: "10px 16px",
//     margin: "8px",
//     fontSize: "16px",
//     borderRadius: "6px",
//     border: "none",
//     backgroundColor: "#0070f3",
//     color: "white",
//     cursor: "pointer"
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Admin Page</h1>
//       <p>{message}</p>

//       <div style={{ marginTop: "20px" }}>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topics")}>
//           トピック
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topic-comments")}>
//           トピックコメント
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/groups")}>
//           グループ
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/grouptopics")}>
//           グループトピック
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/schools")}>
//           スクール
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/users")}>
//           ユーザー
//         </button>

//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/password")}>
//           パスワード
//         </button>

//       </div>
//     </div>
//   )
// }






// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { getAuth } from "firebase/auth"
// import { initializeApp } from "firebase/app"

// // Firebase 初期化
// const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
// }
// const app = initializeApp(firebaseConfig)
// const auth = getAuth(app)

// export default function AdminPage() {
//   const [message, setMessage] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     (async () => {
//       try {
//         // ログイン済みユーザーの IDToken を取得

        
//         const user = auth.currentUser
//         if (!user) {
//           alert("ログインしてください")
//           // router.push("/")
//           return
//         }

//         const idToken = await user.getIdToken()

//         // Go バックエンドに送信して admin チェック
//         const res = await fetch("http://localhost:8080/admin/check", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + idToken
//           }
//         })

//         const data = await res.json()

//         if (data.isAdmin) {
//           setMessage("管理者ログイン成功")
//         } else {
//           alert("管理者権限がありません")
//           // router.push("/")
//         }
//       }
//        catch (err) {
//         console.error(err)
//         alert("エラーが発生しました")
//         // router.push("/")
//       }
//     })()
//   }, [])

//   const buttonStyle = { padding: "10px 16px", margin: "8px", fontSize: "16px", borderRadius: "6px", border: "none", backgroundColor: "#0070f3", color: "white", cursor: "pointer" }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Admin Page</h1>
//       <p>{message}</p>

//       <div style={{ marginTop: "20px" }}>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topics")}>トピック</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topic-comments")}>トピックコメント</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/groups")}>グループ</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/grouptopics")}>グループトピック</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/schools")}>スクール</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/users")}>ユーザー</button>
//         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/password")}>パスワード</button>
//       </div>
//     </div>
//   )
// }









"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { initializeApp } from "firebase/app"

// Firebase 初期化
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

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
        const res = await fetch("http://localhost:8080/admin/check", {
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
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topics")}>トピック</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/topic-comments")}>トピックコメント</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/groups")}>グループ</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/grouptopics")}>グループトピック</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/schools")}>スクール</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/users")}>ユーザー</button>
        <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/password")}>パスワード</button>
         <button style={buttonStyle} onClick={() => router.push("/srccode/adminpage/adminuser")}>アドミンユーザー追加</button>
      </div>
    </div>
  )
}


// "use client"

// import { useEffect } from "react"
// import { getAuth, onAuthStateChanged } from "firebase/auth"
// import { initializeApp } from "firebase/app"

// // Firebase 初期化
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };

// initializeApp(firebaseConfig)

// const app = initializeApp(firebaseConfig)

// export const auth = getAuth(app)

// export default function AdminPage() {

//   useEffect(() => {
//     // const auth = getAuth()

//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         console.log("ログインしていません")
//         return
//       }

//       try {
//         const idToken = await user.getIdToken()
//         console.log("現在のIDToken:", idToken)
//       } catch (err) {
//         console.error("IDToken取得エラー:", err)
//       }
//     })

//     return () => unsubscribe()
//   }, [])

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Admin Page</h1>
//       <p>IDToken を console に出力します</p>
//     </div>
//   )
// }