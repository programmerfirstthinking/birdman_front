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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


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

  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

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

  const handlePdfUpload = async (file: File) => {
  if (file.type !== "application/pdf") {
    alert("PDFファイルのみアップロード可能です。");
    return;
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    alert("PDFは10MB以下にしてください。");
    return;
  }

  try {
    setUploadingPdf(true);

    const storageRef = ref(
      storage,
      `pdfs/${Date.now()}_${file.name}`
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setPdfUrl(url);
    alert("PDFアップロード成功！");
    } catch (err) {
      console.error(err);
      alert("PDFアップロードに失敗しました");
    } finally {
      setUploadingPdf(false);
    }

  };


    const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    await handlePdfUpload(file);
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

  const handlePdfSelect = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      await handlePdfUpload(file);
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
      contentName,
      content: markdown,
      pdfUrl: pdfUrl, // ★ これを追加
    };

    const response = await fetch("http://localhost:8080/make_grouptopic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

    alert("送信成功！");
    setMarkdown("");
    setContentName("");
    setPdfUrl(""); // ★ リセット追加
  } catch (err) {
    console.error(err);
    alert("送信中にエラーが発生しました");
  } finally {
    setSending(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          マークダウン入力欄（画像ドロップ対応）
        </h2>

        {/* コンテンツ名フォーム */}
        <input
          type="text"
          placeholder="コンテンツ名"
          value={contentName}
          onChange={(e) => setContentName(e.target.value)}
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Markdown入力 */}
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
          className="w-full h-48 p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        <button
          onClick={handleSend}
          disabled={sending || markdown.trim() === "" || !groupId || !contentName.trim()}
          className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
            sending || !groupId || !contentName.trim() || markdown.trim() === ""
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {sending ? "送信中..." : "送信"}
        </button>

        {/* PDF専用アップロード欄 */}
        <div
          onDrop={handlePdfDrop}
          onDragOver={handlePdfDragOver}
          className="mb-6 p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
        >
          <p className="text-blue-700 text-lg mb-2">📄 ここにPDFをドラッグ＆ドロップしよう</p>
          <p className="text-blue-500 mb-4">または</p>
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
            ファイルを選択
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handlePdfSelect}
            />
          </label>

          {uploadingPdf && <p className="text-blue-500 mt-2">アップロード中...</p>}

          {pdfUrl && (
            <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-between">
              <span className="text-blue-700 font-medium">✅ アップロード済み</span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                PDFを確認する
              </a>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-blue-800 mb-3">プレビュー</h3>
        <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ maxWidth: "200px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  alt={props.alt || ""}
                />
              ),
              a: ({ node, ...props }) => {
                const href = props.href || "";
                if (href.endsWith(".pdf")) {
                  return (
                    <div className="flex items-center gap-2 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-100">
                      <span className="text-2xl">📄</span>
                      <span className="flex-1 text-blue-700">{props.children}</span>
                      <a
                        href={href}
                        download={props.children?.toString() || "PDF"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        ダウンロード
                      </a>
                    </div>
                  );
                }
                return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
              },
            }}
          >
            {markdown}
          </ReactMarkdown>

          {pdfUrl && !markdown.includes(pdfUrl) && (
            <div className="flex items-center gap-2 p-3 mt-4 border border-blue-200 rounded-lg bg-blue-100">
              <span className="text-2xl">📄</span>
              <span className="flex-1 text-blue-700">PDFファイル</span>
              <a
                href={pdfUrl}
                download="PDF"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                ダウンロード
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownImageUploader;