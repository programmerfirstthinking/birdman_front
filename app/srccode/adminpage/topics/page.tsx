






// "use client"
// import { useEffect, useState } from "react"

// type Topic = {
//   ID: number
//   Year: number | null
//   UserID: number
//   TopicName: string
//   Content: string
//   Activate: boolean
//   Alert: boolean
//   CreatedAt: string
//   UpdatedAt: string
// }

// export default function AdminPage() {
//   const [topics, setTopics] = useState<Topic[]>([])

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllTopic", { method: "POST" })
//         const data: Topic[] = await res.json()
//         console.log("Fetched topics:", data)
//         setTopics(data)
//       } catch (err) {
//         console.error("failed to fetch topics", err)
//       }
//     }

//     fetchTopics()
//   }, [])

//   // DBにも反映させる削除
//   const handleDelete = async (id: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/deleteTopic/${id}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("failed to delete topic")

//       // 成功したらフロント配列からも削除
//       setTopics(prev => prev.filter(topic => topic.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("削除に失敗しました")
//     }
//   }

//   return (
//     <div>
//       <h1>トピックページ</h1>

//       {topics.map((topic, index) => (
//         <div
//           key={`${topic.ID}-${index}`}
//           style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
//         >
//           <p><strong>ID:</strong> {topic.ID}</p>
//           <p><strong>Year:</strong> {topic.Year ?? "-"}</p>
//           <p><strong>UserID:</strong> {topic.UserID}</p>
//           <p><strong>TopicName:</strong> {topic.TopicName}</p>
//           <p><strong>Content:</strong> {topic.Content}</p>
//           <p><strong>Activate:</strong> {topic.Activate ? "true" : "false"}</p>
//           <p><strong>Alert:</strong> {topic.Alert ? "true" : "false"}</p>
//           <p><strong>CreatedAt:</strong> {topic.CreatedAt}</p>
//           <p><strong>UpdatedAt:</strong> {topic.UpdatedAt}</p>

//           <button
//             onClick={() => handleDelete(topic.ID)}
//             style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer", marginTop: "5px" }}
//           >
//             削除
//           </button>
//         </div>
//       ))}
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
type Topic = {
  ID: number;
  Year: number | null;
  UserID: number;
  TopicName: string;
  Content: string;
  Activate: boolean;
  Alert: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

// -----------------------------
// コンポーネント
// -----------------------------
export default function AdminTopicPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // -----------------------------
  // 管理者チェック + データ取得
  // -----------------------------
  const loadTopics = async (user: any) => {
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
        router.push("/"); // 非管理者はトップページにリダイレクト
        return;
      }

      // 管理者ならトピック取得
      const res = await fetch("http://localhost:8080/getAllTopic", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + idToken,
        },
      });
      const data: Topic[] = await res.json();
      setTopics(data);
    } catch (err) {
      console.error("データ取得エラー:", err);
      alert("データ取得に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCurrentUser(user);
      loadTopics(user);
    });
    return () => unsubscribe();
  }, []);

  // -----------------------------
  // トピック削除
  // -----------------------------
  const handleDelete = async (id: number) => {
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken();

    try {
      const res = await fetch(`http://localhost:8080/deleteTopic/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error("トピック削除失敗");
      setTopics((prev) => prev.filter((topic) => topic.ID !== id));
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  return (
    <div>
      <h1>トピック管理ページ</h1>

      {topics.length === 0 ? (
        <p>トピックがありません</p>
      ) : (
        topics.map((topic, index) => (
          <div
            key={`${topic.ID}-${index}`}
            style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
          >
            <p><strong>ID:</strong> {topic.ID}</p>
            <p><strong>Year:</strong> {topic.Year ?? "-"}</p>
            <p><strong>UserID:</strong> {topic.UserID}</p>
            <p><strong>TopicName:</strong> {topic.TopicName}</p>
            <p><strong>Content:</strong> {topic.Content}</p>
            <p><strong>Activate:</strong> {topic.Activate ? "true" : "false"}</p>
            <p><strong>Alert:</strong> {topic.Alert ? "true" : "false"}</p>
            <p><strong>CreatedAt:</strong> {topic.CreatedAt}</p>
            <p><strong>UpdatedAt:</strong> {topic.UpdatedAt}</p>

            <button
              onClick={() => handleDelete(topic.ID)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer",
                marginTop: "5px",
              }}
            >
              削除
            </button>
          </div>
        ))
      )}
    </div>
  );
}