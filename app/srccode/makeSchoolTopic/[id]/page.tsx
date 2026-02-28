// "use client";

// import { useState } from "react";
// import ReactMarkdown from "react-markdown";

// export default function SchoolsPage() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // ここでサーバーに送信するなどの処理を追加可能
//     alert(`題名: ${title}\n本文:\n${content}`);
//   };

//   return (
//     <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
//       <h2>トピック作成画面</h2>

//       <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
//         <div style={{ marginBottom: "16px" }}>
//           <label htmlFor="title" style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
//             題名
//           </label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="題名を入力"
//             required
//             style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label htmlFor="content" style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
//             本文 (Markdown形式)
//           </label>
//           <textarea
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="本文をMarkdown形式で入力"
//             rows={10}
//             style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "monospace" }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: "8px 16px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           作成
//         </button>
//       </form>

//       <h3>プレビュー</h3>
//       <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", backgroundColor: "#f9f9f9" }}>
//         <h4>{title}</h4>
//         <ReactMarkdown>{content}</ReactMarkdown>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.appspot.com",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// export default function TopicEditor() {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [uploading, setUploading] = useState(false);

//   // ファイルをドラッグ＆ドロップしたとき
//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (!file) return;

//     setUploading(true);
//     try {
//       const storageRef = ref(storage, `topics/${Date.now()}_${file.name}`);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);

//       // Markdown形式で本文に追加
//       setContent((prev) => prev + `\n![${file.name}](${url})\n`);
//     } catch (err) {
//       console.error(err);
//       alert("画像アップロードに失敗しました");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//   };

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>トピック作成</h2>

//       <input
//         type="text"
//         placeholder="題名を入力"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
//       />

//       <textarea
//         placeholder="本文（Markdown形式）を入力。画像はドラッグ＆ドロップ可能"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         rows={10}
//         style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
//       />

//       {uploading && <p>画像アップロード中…</p>}

//       <h3>プレビュー</h3>
//       <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
//         <ReactMarkdown>{`# ${title}\n\n${content}`}</ReactMarkdown>
//       </div>
//     </div>
//   );
// }





// "use client";
// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // Firebase 設定
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

// // Firebase 初期化
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// const MarkdownImageUploader: React.FC = () => {
//   const [markdown, setMarkdown] = useState<string>("");

//   // ファイルがドロップされた時
//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     console.log("ドロップされたファイル:", file.name);

//     const storageRef = ref(storage, "images/" + file.name);

//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       console.log("アップロード成功！URL:", url);

//       const markdownImage = `![${file.name}](${url})\n`;
//       setMarkdown((prev) => prev + markdownImage);
//     } catch (err) {
//       console.error("アップロードエラー:", err);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMarkdown(e.target.value);
//   };

//   return (
//     <div className="markdownUploader">
//       <h2>マークダウン入力欄（画像ドロップ対応）</h2>
//       <textarea
//         value={markdown}
//         onChange={handleChange}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//         style={{ width: "100%", height: "200px", padding: "10px" }}
//       />

//       <h3>プレビュー</h3>
//       <div
//         className="markdownPreview"
//         style={{ border: "1px solid #ccc", padding: "10px" }}
//       >
//         {markdown.split("\n").map((line, idx) => {
//           const imgMatch = line.match(/!\[.*\]\((.*)\)/);
//           if (imgMatch) {
//             return (
//               <img
//                 key={idx}
//                 src={imgMatch[1]}
//                 alt=""
//                 style={{ maxWidth: "200px", marginBottom: "10px" }}
//               />
//             );
//           }
//           return <p key={idx}>{line}</p>;
//         })}
//       </div>
//     </div>
//   );
// };

// export default MarkdownImageUploader;











// マークダウンの中に画像を埋め込めた
// "use client";
// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // Firebase 設定
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

// // Firebase 初期化
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// const MarkdownImageUploader: React.FC = () => {
//   const [markdown, setMarkdown] = useState<string>("");

//   // ファイルがドロップされた時
//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     console.log("ドロップされたファイル:", file.name);

//     // 🔹 1MB以下チェック
//     const MAX_SIZE = 1024 * 1024; // 1MB = 1048576バイト
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください。");
//       return;
//     }

//     const storageRef = ref(storage, "images/" + file.name);

//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       console.log("アップロード成功！URL:", url);

//       const markdownImage = `![${file.name}](${url})\n`;
//       setMarkdown((prev) => prev + markdownImage);
//     } catch (err) {
//       console.error("アップロードエラー:", err);
//       alert("アップロードに失敗しました。");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMarkdown(e.target.value);
//   };

//   return (
//     <div className="markdownUploader">
//       <h2>マークダウン入力欄（画像ドロップ対応）</h2>
//       <textarea
//         value={markdown}
//         onChange={handleChange}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//         style={{ width: "100%", height: "200px", padding: "10px" }}
//       />

//       <h3>プレビュー</h3>
//       <div
//         className="markdownPreview"
//         style={{ border: "1px solid #ccc", padding: "10px" }}
//       >
//         {markdown.split("\n").map((line, idx) => {
//           const imgMatch = line.match(/!\[.*\]\((.*)\)/);
//           if (imgMatch) {
//             return (
//               <img
//                 key={idx}
//                 src={imgMatch[1]}
//                 alt=""
//                 style={{ maxWidth: "200px", marginBottom: "10px" }}
//               />
//             );
//           }
//           return <p key={idx}>{line}</p>;
//         })}
//       </div>
//     </div>
//   );
// };

// export default MarkdownImageUploader;







// "use client";
// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // Firebase 設定
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

// // Firebase 初期化
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// const auth = getAuth(app);

// interface MarkdownImageUploaderProps {
//   schoolId: number; // スクールID
//   groupId: number;  // グループID
// }

// const MarkdownImageUploader: React.FC<MarkdownImageUploaderProps> = ({ schoolId, groupId }) => {
//   const [markdown, setMarkdown] = useState<string>("");
//   const [sending, setSending] = useState<boolean>(false);

//   // ファイルがドロップされた時
//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];

//     const MAX_SIZE = 1024 * 1024; // 1MB
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください。");
//       return;
//     }

//     const storageRef = ref(storage, "images/" + file.name);

//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);

//       const markdownImage = `![${file.name}](${url})\n`;
//       setMarkdown((prev) => prev + markdownImage);
//     } catch (err) {
//       console.error("アップロードエラー:", err);
//       alert("アップロードに失敗しました。");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMarkdown(e.target.value);
//   };

//   // 送信処理
//   const handleSend = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("ログインが必要です");
//       return;
//     }

//     setSending(true);

//     try {
//       const payload = {
//         uid: user.uid,
//         schoolId,
//         groupId,
//         content: markdown,
//       };

//       const response = await fetch("http://localhost:8080/make_grouptopic", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`送信に失敗しました: ${response.status}`);
//       }

//       alert("送信成功！");
//       setMarkdown(""); // 送信後クリア
//     } catch (err) {
//       console.error(err);
//       alert("送信中にエラーが発生しました");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="markdownUploader">
//       <h2>マークダウン入力欄（画像ドロップ対応）</h2>
//       <textarea
//         value={markdown}
//         onChange={handleChange}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//         style={{ width: "100%", height: "200px", padding: "10px" }}
//       />

//       <button
//         onClick={handleSend}
//         disabled={sending || markdown.trim() === ""}
//         style={{ marginTop: "10px", padding: "8px 16px" }}
//       >
//         {sending ? "送信中..." : "送信"}
//       </button>

//       <h3>プレビュー</h3>
//       <div
//         className="markdownPreview"
//         style={{ border: "1px solid #ccc", padding: "10px" }}
//       >
//         {markdown.split("\n").map((line, idx) => {
//           const imgMatch = line.match(/!\[.*\]\((.*)\)/);
//           if (imgMatch) {
//             return (
//               <img
//                 key={idx}
//                 src={imgMatch[1]}
//                 alt=""
//                 style={{ maxWidth: "200px", marginBottom: "10px" }}
//               />
//             );
//           }
//           return <p key={idx}>{line}</p>;
//         })}
//       </div>
//     </div>
//   );
// };

// export default MarkdownImageUploader;


// "use client";
// import React, { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// // Firebase 設定
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

// // Firebase 初期化
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);
// const auth = getAuth(app);

// const MarkdownImageUploader: React.FC = () => {
//   const [markdown, setMarkdown] = useState<string>("");
//   const [sending, setSending] = useState<boolean>(false);
//   const [groupId, setGroupId] = useState<number | null>(null);

//   // URLの最後の数字を groupId にセット
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setGroupId(parsedId);
//   }, []);

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     const MAX_SIZE = 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください。");
//       return;
//     }

//     const storageRef = ref(storage, "images/" + file.name);

//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setMarkdown((prev) => prev + `![${file.name}](${url})\n`);
//     } catch (err) {
//       console.error("アップロードエラー:", err);
//       alert("アップロードに失敗しました。");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMarkdown(e.target.value);
//   };

//   const handleSend = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("ログインが必要です");
//       return;
//     }
//     if (!groupId) {
//       alert("groupId が取得できませんでした");
//       return;
//     }

//     setSending(true);

//     try {
//       const payload = {
//         uid: user.uid,
//         groupId,   // URLから取得
//         content: markdown,
//       };

//       const response = await fetch("http://localhost:8080/make_grouptopic", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

//       alert("送信成功！");
//       setMarkdown("");
//     } catch (err) {
//       console.error(err);
//       alert("送信中にエラーが発生しました");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="markdownUploader">
//       <h2>マークダウン入力欄（画像ドロップ対応）</h2>
//       <textarea
//         value={markdown}
//         onChange={handleChange}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//         style={{ width: "100%", height: "200px", padding: "10px" }}
//       />

//       <button
//         onClick={handleSend}
//         disabled={sending || markdown.trim() === "" || !groupId}
//         style={{ marginTop: "10px", padding: "8px 16px" }}
//       >
//         {sending ? "送信中..." : "送信"}
//       </button>

//       <h3>プレビュー</h3>
//       <div style={{ border: "1px solid #ccc", padding: "10px" }}>
//         {markdown.split("\n").map((line, idx) => {
//           const imgMatch = line.match(/!\[.*\]\((.*)\)/);
//           if (imgMatch)
//             return (
//               <img
//                 key={idx}
//                 src={imgMatch[1]}
//                 alt=""
//                 style={{ maxWidth: "200px", marginBottom: "10px" }}
//               />
//             );
//           return <p key={idx}>{line}</p>;
//         })}
//       </div>
//     </div>
//   );
// };



// export default MarkdownImageUploader;






"use client";
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔥 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF",
};

// 🔥 Firebase 初期化（重複を避ける）
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const MarkdownImageUploader: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [contentName, setContentName] = useState<string>(""); // 新しいフォーム用

  // URLから groupId を取得
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setGroupId(parsedId);
  }, []);

  // 画像ドロップ処理
  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("画像は1MB以下にしてください。");
      return;
    }

    const storageRef = ref(storage, "images/" + file.name);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setMarkdown((prev) => prev + `![${file.name}](${url})\n`);
    } catch (err) {
      console.error("アップロードエラー:", err);
      alert("アップロードに失敗しました。");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 送信処理
  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      return;
    }
    if (!groupId) {
      alert("groupId が取得できませんでした");
      return;
    }
    if (!contentName.trim()) {
      alert("コンテンツ名を入力してください");
      return;
    }

    setSending(true);

    try {
      const payload = {
        uid: user.uid,
        groupId,
        contentName, // 新規追加
        content: markdown,
      };

      const response = await fetch("http://localhost:8080/make_grouptopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

      alert("送信成功！");
      setMarkdown("");
      setContentName(""); // フォームもリセット
    } catch (err) {
      console.error(err);
      alert("送信中にエラーが発生しました");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="markdownUploader">
      <h2>マークダウン入力欄（画像ドロップ対応）</h2>

      {/* コンテンツ名フォーム */}
      <input
        type="text"
        placeholder="コンテンツ名"
        value={contentName}
        onChange={(e) => setContentName(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {/* Markdown入力 */}
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
        style={{ width: "100%", height: "200px", padding: "10px" }}
      />

      <button
        onClick={handleSend}
        disabled={sending || markdown.trim() === "" || !groupId || !contentName.trim()}
        style={{ marginTop: "10px", padding: "8px 16px" }}
      >
        {sending ? "送信中..." : "送信"}
      </button>

      <h3>プレビューです</h3>
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        {markdown.split("\n").map((line, idx) => {
          const imgMatch = line.match(/!\[.*\]\((.*)\)/);
          if (imgMatch)
            return (
              <img
                key={idx}
                src={imgMatch[1]}
                alt=""
                style={{ maxWidth: "200px", marginBottom: "10px" }}
              />
            );
          return <p key={idx}>{line}</p>;
        })}
      </div>
    </div>
  );
};

export default MarkdownImageUploader;