// "use client"
// import { useEffect, useState } from "react"

// // User型
// type User = {
//   ID: number
//   Name: string
//   SchoolID: number | null
//   Nandai: string | null
//   Image: string | null
//   Introduce: string | null
//   Twitter: string | null
//   Uuid: string
//   CreatedAt: string
//   UpdatedAt: string
// }

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([])

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllUsers", { method: "POST" })
//         const data: User[] = await res.json()
//         setUsers(data)
//       } catch (err) {
//         console.error("ユーザー取得失敗", err)
//       }
//     }

//     fetchUsers()
//   }, [])

//   // ユーザー削除
//   const handleDeleteUser = async (id: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/deleteUser/${id}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("削除失敗")
//       setUsers(prev => prev.filter(u => u.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("削除に失敗しました")
//     }
//   }

//   return (
//     <div>
//       <h1>ユーザー管理ページ</h1>

//       {users.length === 0 ? (
//         <p>ユーザーがいません</p>
//       ) : (
//         users.map((user, i) => (
//           <div key={`${user.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
//             <p><strong>ID:</strong> {user.ID}</p>
//             <p><strong>Name:</strong> {user.Name}</p>
//             <p><strong>SchoolID:</strong> {user.SchoolID ?? "-"}</p>
//             <p><strong>年代:</strong> {user.Nandai ?? "-"}</p>
//             <p><strong>Image:</strong> {user.Image ? <a href={user.Image} target="_blank">表示</a> : "-"}</p>
//             <p><strong>自己紹介:</strong> {user.Introduce ?? "-"}</p>
//             <p><strong>Twitter:</strong> {user.Twitter ? <a href={`https://twitter.com/${user.Twitter}`} target="_blank">{user.Twitter}</a> : "-"}</p>
//             <p><strong>UUID:</strong> {user.Uuid}</p>
//             <p><strong>CreatedAt:</strong> {user.CreatedAt}</p>
//             <p><strong>UpdatedAt:</strong> {user.UpdatedAt}</p>

//             <button
//               onClick={() => handleDeleteUser(user.ID)}
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





// "use client"
// import { useEffect, useState } from "react"

// type User = {
//   ID: number
//   Name: string
//   SchoolID: number | null
//   Nandai: string | null
//   Image: string | null
//   Introduce: string | null
//   Twitter: string | null
//   Uuid: string
//   CreatedAt: string
//   UpdatedAt: string
// }

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [editingId, setEditingId] = useState<number | null>(null)
//   const [newSchoolID, setNewSchoolID] = useState<number | null>(null)

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllUsers", { method: "POST" })
//         const data: User[] = await res.json()
//         setUsers(data)
//       } catch (err) {
//         console.error("ユーザー取得失敗", err)
//       }
//     }

//     fetchUsers()
//   }, [])

//   // SchoolID更新
//   const handleUpdateSchoolID = async (id: number) => {
//     try {
//       const res = await fetch("http://localhost:8080/updateUserSchoolID", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           id: id,
//           school_id: newSchoolID
//         })
//       })

//       if (!res.ok) throw new Error("更新失敗")

//       const updatedUser: User = await res.json()

//       setUsers(prev =>
//         prev.map(u => (u.ID === updatedUser.ID ? updatedUser : u))
//       )

//       setEditingId(null)
//       setNewSchoolID(null)

//     } catch (err) {
//       console.error(err)
//       alert("更新に失敗しました")
//     }
//   }

//   // ユーザー削除
//   const handleDeleteUser = async (id: number) => {
//     if (!confirm("本当に削除しますか？")) return

//     try {
//       const res = await fetch(`http://localhost:8080/deleteUser/${id}`, {
//         method: "DELETE"
//       })

//       if (!res.ok) throw new Error("削除失敗")

//       setUsers(prev => prev.filter(u => u.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("削除に失敗しました")
//     }
//   }

//   return (
//     <div>
//       <h1>ユーザー管理ページ</h1>

//       {users.length === 0 ? (
//         <p>ユーザーがいません</p>
//       ) : (
//         users.map((user, i) => (
//           <div
//             key={`${user.ID}-${i}`}
//             style={{
//               border: "1px solid #ccc",
//               margin: "10px",
//               padding: "10px"
//             }}
//           >
//             <p><strong>ID:</strong> {user.ID}</p>
//             <p><strong>Name:</strong> {user.Name}</p>

//             <p>
//               <strong>SchoolID:</strong>

//               {editingId === user.ID ? (
//                 <>
//                   <input
//                     type="number"
//                     value={newSchoolID ?? ""}
//                     onChange={(e) => setNewSchoolID(Number(e.target.value))}
//                     style={{ marginLeft: "10px", width: "80px" }}
//                   />

//                   <button
//                     onClick={() => handleUpdateSchoolID(user.ID)}
//                     style={{ marginLeft: "5px" }}
//                   >
//                     保存
//                   </button>

//                   <button
//                     onClick={() => setEditingId(null)}
//                     style={{ marginLeft: "5px" }}
//                   >
//                     キャンセル
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   {user.SchoolID ?? "-"}
//                   <button
//                     onClick={() => {
//                       setEditingId(user.ID)
//                       setNewSchoolID(user.SchoolID)
//                     }}
//                     style={{ marginLeft: "10px" }}
//                   >
//                     編集
//                   </button>
//                 </>
//               )}
//             </p>

//             <p><strong>年代:</strong> {user.Nandai ?? "-"}</p>

//             <p>
//               <strong>Image:</strong>{" "}
//               {user.Image ? (
//                 <a href={user.Image} target="_blank">表示</a>
//               ) : "-"}
//             </p>

//             <p><strong>自己紹介:</strong> {user.Introduce ?? "-"}</p>

//             <p>
//               <strong>Twitter:</strong>{" "}
//               {user.Twitter ? (
//                 <a
//                   href={`https://twitter.com/${user.Twitter}`}
//                   target="_blank"
//                 >
//                   {user.Twitter}
//                 </a>
//               ) : "-"}
//             </p>

//             <p><strong>UUID:</strong> {user.Uuid}</p>
//             <p><strong>CreatedAt:</strong> {user.CreatedAt}</p>
//             <p><strong>UpdatedAt:</strong> {user.UpdatedAt}</p>

//             <button
//               onClick={() => handleDeleteUser(user.ID)}
//               style={{
//                 backgroundColor: "red",
//                 color: "white",
//                 marginTop: "10px"
//               }}
//             >
//               削除
//             </button>
//           </div>
//         ))
//       )}
//     </div>
//   )
// }











"use client";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// -----------------------------
// Firebase 初期化
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// -----------------------------
// 型定義
// -----------------------------
type User = {
  ID: number;
  Name: string;
  SchoolID: number | null;
  Nandai: string | null;
  Image: string | null;
  Introduce: string | null;
  Twitter: string | null;
  Uuid: string;
  CreatedAt: string;
  UpdatedAt: string;
};

// -----------------------------
// コンポーネント
// -----------------------------
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSchoolID, setNewSchoolID] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // -----------------------------
  // 管理者チェック + ユーザー取得
  // -----------------------------
  const loadUsers = async (user: any) => {
    try {
      const idToken = await user.getIdToken();

      // 管理者チェック
      const checkRes = await fetch("http://localhost:8080/admin/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken,
        },
      });
      const checkData = await checkRes.json();
      if (!checkData.isAdmin) {
        alert("管理者権限がありません");
        router.push("/"); // 非管理者はトップページへリダイレクト
        return;
      }

      // 管理者ならユーザー一覧取得
      const res = await fetch("http://localhost:8080/getAllUsers", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + idToken,
        },
      });
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("データ取得エラー:", err);
      alert("ユーザー一覧取得に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCurrentUser(user);
      loadUsers(user);
    });
    return () => unsubscribe();
  }, []);

  // -----------------------------
  // SchoolID更新
  // -----------------------------
  const handleUpdateSchoolID = async (id: number) => {
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken();

    try {
      const res = await fetch("http://localhost:8080/updateUserSchoolID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
        body: JSON.stringify({
          id: id,
          school_id: newSchoolID,
        }),
      });

      if (!res.ok) throw new Error("更新失敗");

      const updatedUser: User = await res.json();
      setUsers((prev) => prev.map((u) => (u.ID === updatedUser.ID ? updatedUser : u)));
      setEditingId(null);
      setNewSchoolID(null);
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  // -----------------------------
  // ユーザー削除
  // -----------------------------
  const handleDeleteUser = async (id: number) => {
    if (!currentUser) return;
    if (!confirm("本当に削除しますか？")) return;

    const idToken = await currentUser.getIdToken();
    try {
      const res = await fetch(`http://localhost:8080/deleteUser/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error("削除失敗");

      setUsers((prev) => prev.filter((u) => u.ID !== id));
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div>
      <h1>ユーザー管理ページ</h1>

      {users.length === 0 ? (
        <p>ユーザーがいません</p>
      ) : (
        users.map((user, i) => (
          <div
            key={`${user.ID}-${i}`}
            style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
          >
            <p><strong>ID:</strong> {user.ID}</p>
            <p><strong>Name:</strong> {user.Name}</p>

            <p>
              <strong>SchoolID:</strong>
              {editingId === user.ID ? (
                <>
                  <input
                    type="number"
                    value={newSchoolID ?? ""}
                    onChange={(e) => setNewSchoolID(Number(e.target.value))}
                    style={{ marginLeft: "10px", width: "80px" }}
                  />
                  <button onClick={() => handleUpdateSchoolID(user.ID)} style={{ marginLeft: "5px" }}>
                    保存
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: "5px" }}>
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  {user.SchoolID ?? "-"}
                  <button
                    onClick={() => {
                      setEditingId(user.ID);
                      setNewSchoolID(user.SchoolID);
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    編集
                  </button>
                </>
              )}
            </p>

            <p><strong>年代:</strong> {user.Nandai ?? "-"}</p>

            <p>
              <strong>Image:</strong>{" "}
              {user.Image ? <a href={user.Image} target="_blank">表示</a> : "-"}
            </p>

            <p><strong>自己紹介:</strong> {user.Introduce ?? "-"}</p>

            <p>
              <strong>Twitter:</strong>{" "}
              {user.Twitter ? <a href={`https://twitter.com/${user.Twitter}`} target="_blank">{user.Twitter}</a> : "-"}
            </p>

            <p><strong>UUID:</strong> {user.Uuid}</p>
            <p><strong>CreatedAt:</strong> {user.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {user.UpdatedAt}</p>

            <button
              onClick={() => handleDeleteUser(user.ID)}
              style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}
            >
              削除
            </button>
          </div>
        ))
      )}
    </div>
  );
}