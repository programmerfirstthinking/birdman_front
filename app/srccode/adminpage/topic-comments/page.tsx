



// "use client"
// import { useEffect, useState } from "react"

// // トピック型
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

// // コメント型
// type TopicComment = {
//   ID: number
//   UserID: number
//   TopicID: number
//   Content: string
//   Activate: boolean
//   CreatedAt: string
//   UpdatedAt: string
// }

// export default function AdminPage() {
//   const [topics, setTopics] = useState<Topic[]>([])
//   const [comments, setComments] = useState<TopicComment[]>([])

//   useEffect(() => {
//     // -------------------------
//     // トピック取得
//     // -------------------------
//     const fetchTopics = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllTopic", { method: "POST" })
//         // JSON配列として受け取る
//         const data: Topic[] = await res.json()
//         setTopics(data)
//       } catch (err) {
//         console.error("トピック取得失敗", err)
//       }
//     }

//     // -------------------------
//     // コメント取得
//     // -------------------------
//     const fetchComments = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getAllTopicComments", { method: "POST" })
//         // JSON配列として受け取る
//         const data: TopicComment[] = await res.json()
//         setComments(data)
//       } catch (err) {
//         console.error("コメント取得失敗", err)
//       }
//     }

//     fetchTopics()
//     fetchComments()
//   }, [])

//   // -------------------------
//   // トピック削除
//   // -------------------------
//   const handleDeleteTopic = async (id: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/deleteTopic/${id}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("トピック削除失敗")
//       setTopics(prev => prev.filter(t => t.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("トピック削除に失敗しました")
//     }
//   }

//   // -------------------------
//   // コメント削除
//   // -------------------------
//   const handleDeleteComment = async (id: number, userID: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/deleteTopicComment/${id}/${userID}`, { method: "DELETE" })
//       if (!res.ok) throw new Error("コメント削除失敗")
//       setComments(prev => prev.filter(c => c.ID !== id))
//     } catch (err) {
//       console.error(err)
//       alert("コメント削除に失敗しました")
//     }
//   }

//   // -------------------------
//   // コメント編集
//   // -------------------------
//   const handleEditComment = async (id: number, userID: number, content: string) => {
//     try {
//       const res = await fetch(`http://localhost:8080/editTopicComment/${id}/${userID}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content }),
//       })
//       if (!res.ok) throw new Error("コメント編集失敗")
//       setComments(prev =>
//         prev.map(c => (c.ID === id ? { ...c, Content: content } : c))
//       )
//     } catch (err) {
//       console.error(err)
//       alert("コメント編集に失敗しました")
//     }
//   }

//   return (
//     <div>
//       <h1>トピックコメント管理ページ</h1>

//       {topics.length === 0 ? (
//         <p>トピックがありません</p>
//       ) : (
//         topics.map((topic, i) => (
//           <div key={`${topic.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
//             <p><strong>ID:</strong> {topic.ID}</p>
//             <p><strong>TopicName:</strong> {topic.TopicName}</p>
//             <p><strong>Content:</strong> {topic.Content}</p>
//             <button onClick={() => handleDeleteTopic(topic.ID)} style={{ backgroundColor: "red", color: "white", marginBottom: "5px" }}>削除</button>

//             <h4>コメント一覧</h4>
//             {comments.filter(c => c.TopicID === topic.ID).length === 0 ? (
//               <p style={{ marginLeft: "20px" }}>コメントはありません</p>
//             ) : (
//               comments
//                 .filter(c => c.TopicID === topic.ID)
//                 .map((c, j) => (
//                   <div key={`${c.ID}-${j}`} style={{ marginLeft: "20px", border: "1px dashed #888", padding: "5px" }}>
//                     <p>{c.Content}</p>
//                     <button onClick={() => handleDeleteComment(c.ID, c.UserID)} style={{ marginRight: "5px" }}>削除</button>
//                     <button onClick={() => {
//                       const newContent = prompt("新しいコメント内容を入力", c.Content)
//                       if (newContent !== null) handleEditComment(c.ID, c.UserID, newContent)
//                     }}>編集</button>
//                   </div>
//                 ))
//             )}
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

type TopicComment = {
  ID: number;
  UserID: number;
  TopicID: number;
  Content: string;
  Activate: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

// -----------------------------
// コンポーネント
// -----------------------------
export default function AdminTopicCommentPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [comments, setComments] = useState<TopicComment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // -----------------------------
  // 管理者チェック + データ取得
  // -----------------------------
  const loadData = async (user: any) => {
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
      const topicRes = await fetch("http://localhost:8080/getAllTopic", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + idToken,
        },
      });
      const topicData: Topic[] = await topicRes.json();
      setTopics(topicData);

      // コメント取得
      const commentRes = await fetch("http://localhost:8080/getAllTopicComments", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + idToken,
        },
      });
      const commentData: TopicComment[] = await commentRes.json();
      setComments(commentData);
    } catch (err) {
      console.error("データ取得エラー:", err);
      alert("データ取得に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCurrentUser(user);
      loadData(user);
    });
    return () => unsubscribe();
  }, []);

  // -----------------------------
  // トピック削除
  // -----------------------------
  const handleDeleteTopic = async (id: number) => {
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken();
    try {
      const res = await fetch(`http://localhost:8080/deleteTopic/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error("トピック削除失敗");
      setTopics((prev) => prev.filter((t) => t.ID !== id));
    } catch (err) {
      console.error(err);
      alert("トピック削除に失敗しました");
    }
  };

  // -----------------------------
  // コメント削除
  // -----------------------------
  const handleDeleteComment = async (id: number, userID: number) => {
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken();
    try {
      const res = await fetch(`http://localhost:8080/deleteTopicComment/${id}/${userID}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error("コメント削除失敗");
      setComments((prev) => prev.filter((c) => c.ID !== id));
    } catch (err) {
      console.error(err);
      alert("コメント削除に失敗しました");
    }
  };

  // -----------------------------
  // コメント編集
  // -----------------------------
  const handleEditComment = async (id: number, userID: number, content: string) => {
    if (!currentUser) return;
    const idToken = await currentUser.getIdToken();
    try {
      const res = await fetch(`http://localhost:8080/editTopicComment/${id}/${userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("コメント編集失敗");
      setComments((prev) => prev.map((c) => (c.ID === id ? { ...c, Content: content } : c)));
    } catch (err) {
      console.error(err);
      alert("コメント編集に失敗しました");
    }
  };

  return (
    <div>
      <h1>トピックコメント管理ページ</h1>

      {topics.length === 0 ? (
        <p>トピックがありません</p>
      ) : (
        topics.map((topic, i) => (
          <div key={`${topic.ID}-${i}`} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {topic.ID}</p>
            <p><strong>TopicName:</strong> {topic.TopicName}</p>
            <p><strong>Content:</strong> {topic.Content}</p>
            <button onClick={() => handleDeleteTopic(topic.ID)} style={{ backgroundColor: "red", color: "white", marginBottom: "5px" }}>削除</button>

            <h4>コメント一覧</h4>
            {comments.filter(c => c.TopicID === topic.ID).length === 0 ? (
              <p style={{ marginLeft: "20px" }}>コメントはありません</p>
            ) : (
              comments
                .filter(c => c.TopicID === topic.ID)
                .map((c, j) => (
                  <div key={`${c.ID}-${j}`} style={{ marginLeft: "20px", border: "1px dashed #888", padding: "5px" }}>
                    <p>{c.Content}</p>
                    <button onClick={() => handleDeleteComment(c.ID, c.UserID)} style={{ marginRight: "5px" }}>削除</button>
                    <button onClick={() => {
                      const newContent = prompt("新しいコメント内容を入力", c.Content);
                      if (newContent !== null) handleEditComment(c.ID, c.UserID, newContent);
                    }}>編集</button>
                  </div>
                ))
            )}
          </div>
        ))
      )}
    </div>
  );
}