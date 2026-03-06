// "use client";

// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";

// /* ================================
//    Firebase 初期化
// ================================ */
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.appspot.com",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// // const app = initializeApp(firebaseConfig);

// /* ================================
//    型定義（any禁止・安全設計）
// ================================ */
// type GroupContent = {
//   id: number;
//   user_id: number;
//   school_id: number;
//   group_id: number;
//   group_contents_name: string;
//   content: string;
//   pdf_url: string;
//   created_at: string;
//   updated_at: string;
// };

// type ApiResponse = {
//   message: string;
//   data: GroupContent;
//   current_user?: { id: number }; // ← ここを追加
// };

// /* ================================
//    Markdown風パーサ
// ================================ */
// const parseContent = (text: string) => {
//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   const regex = /!\[(.*?)\]\((.*?)\)|\[(.*?)\.pdf\]\((.*?)\)/gi;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     if (match.index > lastIndex) {
//       parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
//     }

//     if (match[2]?.toLowerCase().endsWith(".pdf")) {
//       const name = match[1]?.endsWith(".pdf") ? match[1] : match[1] + ".pdf";
//       parts.push({ type: "pdf", content: match[2], name });
//     } else if (match[4]) {
//       const name = match[3] + ".pdf";
//       parts.push({ type: "pdf", content: match[4], name });
//     } else if (match[2]) {
//       parts.push({ type: "image", content: match[2] });
//     }

//     lastIndex = regex.lastIndex;
//   }

//   if (lastIndex < text.length) {
//     parts.push({ type: "text", content: text.substring(lastIndex) });
//   }

//   return parts;
// };

// /* ================================
//    メインコンポーネント
// ================================ */
// export default function SchoolsPage() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null); // ← 追加
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   const auth = getAuth();

//   /* ----------------------------
//      Firebase currentUser を監視
//   ---------------------------- */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   /* ----------------------------
//      URLからID取得
//   ---------------------------- */
//   useEffect(() => {
//     if (!currentUser) return; // ←currentUser が null のときは何もしない

//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);

//     if (!isNaN(parsedId)) {
//       setContentId(parsedId);
//       fetchData(parsedId);
//     } else {
//       console.error("URL から有効な数字を取得できませんでした");
//     }
//   }, [currentUser]);

//   /* ----------------------------
//      データ取得
//   ---------------------------- */
//   const fetchData = async (id: number) => {
//     if (!currentUser) {
//       console.error("ユーザーがログインしていません");
//       return;
//     }

//     setResponseData(null); // ローディング状態にする場合

//     try {
//       const idToken = await currentUser.getIdToken(); // Firebase IDトークン取得

//       const payload = {
//         content: id,
//         idToken: idToken,
//       };

//       const res = await fetch("http://localhost:8080/see_groupcontent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Fetch エラー");

//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//       console.log("取得データ:", data);
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentText: string = responseData.data?.content || "";
//   const contentParts = parseContent(contentText);

//   console.log("current_user.id:", responseData.current_user?.id);
//   console.log("content.user_id:", responseData.data.user_id);
//   console.log("型チェック:", typeof responseData.current_user?.id, typeof responseData.data.user_id);

//   return (
//     <div style={{ padding: "16px" }}>

      
      
//       <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//         スクールトピックを見ましょ

//         {responseData.current_user?.id === responseData.data.user_id && (
//           <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
//             <button
//               style={{
//                 backgroundColor: "#f0ad4e",
//                 color: "white",
//                 border: "none",
//                 padding: "4px 8px",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               編集
//             </button>
//             <button
//               style={{
//                 backgroundColor: "#d9534f",
//                 color: "white",
//                 border: "none",
//                 padding: "4px 8px",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               削除
//             </button>
//           </span>
//         )}
//       </h2>

//       {contentId && <p>送信したコンテンツID: {contentId}</p>}

//       <div style={{ marginTop: "16px" }}>
//         <h3>コンテンツ詳細:</h3>

//         <p><strong>ID:</strong> {responseData.data.id}</p>
//         <p><strong>グループID:</strong> {responseData.data.group_id}</p>
//         <p><strong>スクールID:</strong> {responseData.data.school_id}</p>
//         <p><strong>名前:</strong> {responseData.data.group_contents_name}</p>

//         <p><strong>本文:</strong></p>

//         <div>
//           {contentParts.map((part, idx) => {
//             if (part.type === "image") {
//               return (
//                 <img
//                   key={idx}
//                   src={part.content}
//                   alt={`画像 ${idx}`}
//                   style={{ maxWidth: "100%", height: "auto", margin: "8px 0" }}
//                 />
//               );
//             } else if (part.type === "pdf") {
//               return (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     border: "1px solid #ccc",
//                     padding: "8px",
//                     margin: "8px 0",
//                     backgroundColor: "#f9f9f9",
//                     borderRadius: "4px",
//                   }}
//                 >
//                   <span style={{ fontSize: "24px" }}>📄</span>
//                   <span style={{ flex: 1 }}>{part.name || `PDF ${idx + 1}`}</span>
//                   <a
//                     href={part.content}
//                     download={part.name || `download_${idx}.pdf`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       backgroundColor: "#0070f3",
//                       color: "white",
//                       padding: "4px 8px",
//                       borderRadius: "4px",
//                       textDecoration: "none",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ダウンロード
//                   </a>
//                 </div>
//               );
//             } else {
//               return <p key={idx}>{part.content}</p>;
//             }
//           })}
//         </div>

//         {/* =============================
//            DB保存された pdf_url 表示
//         ============================== */}
//         {responseData.data.pdf_url && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               border: "1px solid #ccc",
//               padding: "8px",
//               margin: "16px 0",
//               backgroundColor: "#f0f8ff",
//               borderRadius: "4px",
//             }}
//           >
//             <span style={{ fontSize: "24px" }}>📄</span>
//             <span style={{ flex: 1 }}>添付PDF</span>
//             <a
//               href={responseData.data.pdf_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 backgroundColor: "#0070f3",
//                 color: "white",
//                 padding: "4px 8px",
//                 borderRadius: "4px",
//                 textDecoration: "none",
//                 fontSize: "14px",
//               }}
//             >
//               開く
//             </a>
//           </div>
//         )}

//         <p><strong>作成日時:</strong> {new Date(responseData.data.created_at).toLocaleString()}</p>
//         <p><strong>更新日時:</strong> {new Date(responseData.data.updated_at).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }








// "use client";

// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";

// /* ================================
//    Firebase 初期化
// ================================ */
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.appspot.com",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// /* ================================
//    型定義
// ================================ */
// type GroupContent = {
//   id: number;
//   user_id: number;
//   school_id: number;
//   group_id: number;
//   group_contents_name: string;
//   content: string;
//   pdf_url: string;
//   created_at: string;
//   updated_at: string;
// };

// type ApiResponse = {
//   message: string;
//   data: GroupContent;
//   current_user?: { id: number };
// };

// /* ================================
//    Markdown風パーサ
// ================================ */
// const parseContent = (text: string) => {
//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   const regex = /!\[(.*?)\]\((.*?)\)|\[(.*?)\.pdf\]\((.*?)\)/gi;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     if (match.index > lastIndex) {
//       parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
//     }

//     if (match[2]?.toLowerCase().endsWith(".pdf")) {
//       const name = match[1]?.endsWith(".pdf") ? match[1] : match[1] + ".pdf";
//       parts.push({ type: "pdf", content: match[2], name });
//     } else if (match[4]) {
//       const name = match[3] + ".pdf";
//       parts.push({ type: "pdf", content: match[4], name });
//     } else if (match[2]) {
//       parts.push({ type: "image", content: match[2] });
//     }

//     lastIndex = regex.lastIndex;
//   }

//   if (lastIndex < text.length) {
//     parts.push({ type: "text", content: text.substring(lastIndex) });
//   }

//   return parts;
// };

// /* ================================
//    メインコンポーネント（編集対応）
// ================================ */
// export default function SchoolsPage() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集用フォーム状態
//   const [contentName, setContentName] = useState<string>("");
//   const [markdown, setMarkdown] = useState<string>("");

//   const auth = getAuth();

//   // Firebase currentUser 監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return () => unsubscribe();
//   }, [auth]);

//   // URLからコンテンツID取得
//   useEffect(() => {
//     if (!currentUser) return;

//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) {
//       setContentId(parsedId);
//       fetchData(parsedId);
//     }
//   }, [currentUser]);

//   // データ取得
//   const fetchData = async (id: number) => {
//     if (!currentUser) return;

//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch("http://localhost:8080/see_groupcontent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });

//       if (!res.ok) throw new Error("Fetch エラー");
//       const data: ApiResponse = await res.json();
//       setResponseData(data);

//       // 編集用にフォーム初期値をセット
//       setContentName(data.data.group_contents_name);
//       setMarkdown(data.data.content);
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentParts = parseContent(markdown);

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>コンテンツ編集</h2>

//       {/* 名前入力 */}
//       <input
//         type="text"
//         value={contentName}
//         onChange={(e) => setContentName(e.target.value)}
//         style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
//       />

//       {/* Markdown編集用 */}
//       <textarea
//         value={markdown}
//         onChange={(e) => setMarkdown(e.target.value)}
//         placeholder="ここにマークダウンで本文を書きます"
//         style={{ width: "100%", height: "200px", padding: "10px", marginBottom: "10px" }}
//       />

//       <button
//         onClick={() => alert("ここに更新送信処理を追加")}
//         style={{ padding: "8px 16px", marginBottom: "16px" }}
//       >
//         更新
//       </button>

//       <h3>プレビュー</h3>
//       <div style={{ border: "1px solid #ccc", padding: "10px" }}>
//         {contentParts.map((part, idx) => {
//           if (part.type === "image") {
//             return <img key={idx} src={part.content} alt="" style={{ maxWidth: "100%", marginBottom: "10px" }} />;
//           }
//           if (part.type === "pdf") {
//             return (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   border: "1px solid #ccc",
//                   padding: "8px",
//                   marginBottom: "10px",
//                   borderRadius: "4px",
//                   backgroundColor: "#f0f0f0",
//                 }}
//               >
//                 <span>📄</span>
//                 <span style={{ flex: 1 }}>{part.name}</span>
//                 <a href={part.content} target="_blank" rel="noopener noreferrer">
//                   ダウンロード
//                 </a>
//               </div>
//             );
//           }
//           return <p key={idx}>{part.content}</p>;
//         })}
//       </div>
//     </div>
//   );
// }














"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";

/* ================================
   Firebase 初期化
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.appspot.com",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

/* ================================
   型定義
================================ */
type GroupContent = {
  id: number;
  user_id: number;
  school_id: number;
  group_id: number;
  group_contents_name: string;
  content: string;
  pdf_url: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  message: string;
  data: GroupContent;
  current_user?: { id: number };
};

/* ================================
   Markdown風パーサ
================================ */
const parseContent = (text: string) => {
  const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
  const regex = /!\[(.*?)\]\((.*?)\)|\[(.*?)\.pdf\]\((.*?)\)/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
    }

    if (match[2]?.toLowerCase().endsWith(".pdf")) {
      const name = match[1]?.endsWith(".pdf") ? match[1] : match[1] + ".pdf";
      parts.push({ type: "pdf", content: match[2], name });
    } else if (match[4]) {
      const name = match[3] + ".pdf";
      parts.push({ type: "pdf", content: match[4], name });
    } else if (match[2]) {
      parts.push({ type: "image", content: match[2] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.substring(lastIndex) });
  }

  return parts;
};

/* ================================
   メインコンポーネント
================================ */
export default function SchoolsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  // 編集モード管理
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contentName, setContentName] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");

  const auth = getAuth();

  /* ----------------------------
     Firebase currentUser を監視
  ---------------------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, [auth]);

  /* ----------------------------
     URLからID取得
  ---------------------------- */
  useEffect(() => {
    if (!currentUser) return;

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);

    if (!isNaN(parsedId)) {
      setContentId(parsedId);
      fetchData(parsedId);
    }
  }, [currentUser]);

  /* ----------------------------
     データ取得
  ---------------------------- */
  const fetchData = async (id: number) => {
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch("http://localhost:8080/see_groupcontent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: id, idToken }),
      });

      if (!res.ok) throw new Error("Fetch エラー");

      const data: ApiResponse = await res.json();
      setResponseData(data);
    } catch (err: any) {
      console.error("Fetch エラー:", err.message);
    }
  };

  if (!responseData) return <p>データを取得中…</p>;

  const contentParts = parseContent(isEditing ? markdown : responseData.data.content);

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        スクールトピック

        {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
          <span style={{ marginLeft: "auto" }}>
            <button
              onClick={() => {
                setContentName(responseData.data.group_contents_name);
                setMarkdown(responseData.data.content);
                setIsEditing(true);
              }}
              style={{
                backgroundColor: "#f0ad4e",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              編集
            </button>
          </span>
        )}
      </h2>

      {isEditing ? (
        <>
          {/* 編集フォーム */}
          <input
            type="text"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{ width: "100%", height: "200px", padding: "10px", marginBottom: "10px" }}
          />
          <button
            onClick={() => alert("ここに更新API送信処理を追加")}
            style={{ marginRight: "10px", padding: "6px 12px" }}
          >
            更新
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{ padding: "6px 12px" }}
          >
            キャンセル
          </button>
        </>
      ) : (
        <>
          {/* 通常表示 */}
          <p><strong>ID:</strong> {responseData.data.id}</p>
          <p><strong>グループID:</strong> {responseData.data.group_id}</p>
          <p><strong>スクールID:</strong> {responseData.data.school_id}</p>
          <p><strong>名前:</strong> {responseData.data.group_contents_name}</p>
          <p><strong>本文:</strong></p>
          <div>
            {contentParts.map((part, idx) => {
              if (part.type === "image") {
                return <img key={idx} src={part.content} style={{ maxWidth: "100%", margin: "8px 0" }} />;
              }
              if (part.type === "pdf") {
                return (
                  <div key={idx} style={{ display: "flex", gap: "8px", border: "1px solid #ccc", padding: "8px", margin: "8px 0", borderRadius: "4px", backgroundColor: "#f0f0f0" }}>
                    <span>📄</span>
                    <span style={{ flex: 1 }}>{part.name}</span>
                    <a href={part.content} target="_blank" rel="noopener noreferrer">ダウンロード</a>
                  </div>
                );
              }
              return <p key={idx}>{part.content}</p>;
            })}
          </div>
        </>
      )}
    </div>
  );
}