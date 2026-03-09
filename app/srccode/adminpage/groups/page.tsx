// "use client"
// import { useEffect, useState } from "react"

// // Group型
// type Group = {
//   ID: number
//   UserID: number
//   SchoolID: number | null
//   CreatedAt: string
//   UpdatedAt: string
// }

// export default function AdminPage() {
//   const [groups, setGroups] = useState<Group[]>([])

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllGroup", { method: "POST" })
//         const data: Group[] = await res.json()
//         setGroups(data)
//       } catch (err) {
//         console.error("グループ取得失敗", err)
//       }
//     }

//     fetchGroups()
//   }, [])

//   // グループ削除
//   const handleDeleteGroup = async (id: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/deleteGroup/${id}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("削除失敗")
//       setGroups(prev => prev.filter(g => g.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("削除に失敗しました")
//     }
//   }

//   return (
//     <div>
//       <h1>グループ管理ページ</h1>

//       {groups.length === 0 ? (
//         <p>グループがありません</p>
//       ) : (
//         groups.map((group, i) => (
//           <div key={`${group.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
//             <p><strong>ID:</strong> {group.ID}</p>
//             <p><strong>UserID:</strong> {group.UserID}</p>
//             <p><strong>SchoolID:</strong> {group.SchoolID ?? "-"}</p>
//             <p><strong>CreatedAt:</strong> {group.CreatedAt}</p>
//             <p><strong>UpdatedAt:</strong> {group.UpdatedAt}</p>

//             <button
//               onClick={() => handleDeleteGroup(group.ID)}
//               style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}
//             >
//               削除
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   )
// }








"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
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
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const router = useRouter()

  // currentUser を監視して IDToken 取得
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

  // admin チェック
  useEffect(() => {
    if (!idToken) return

    ;(async () => {
      try {
        const res = await fetch("http://localhost:8080/admin/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        })
        const data = await res.json()
        if (!data.isAdmin) {
          alert("管理者権限がありません")
          router.push("/")
        }
      } catch (err) {
        console.error("adminチェックエラー:", err)
        alert("エラーが発生しました")
        router.push("/")
      }
    })()
  }, [idToken])

  // グループ取得
  useEffect(() => {
    if (!idToken) return // admin チェック後に取得するように

    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:8080/getAllGroup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        })
        const data: Group[] = await res.json()
        setGroups(data)
      } catch (err) {
        console.error("グループ取得失敗", err)
      }
    }

    fetchGroups()
  }, [idToken])

  // グループ削除
  const handleDeleteGroup = async (id: number) => {
    if (!idToken) return

    try {
      const res = await fetch(`http://localhost:8080/deleteGroup/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      })
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