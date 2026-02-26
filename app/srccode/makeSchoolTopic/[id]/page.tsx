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





"use client";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF",
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const MarkdownImageUploader: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");

  // ファイルがドロップされた時
  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    console.log("ドロップされたファイル:", file.name);

    const storageRef = ref(storage, "images/" + file.name);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("アップロード成功！URL:", url);

      const markdownImage = `![${file.name}](${url})\n`;
      setMarkdown((prev) => prev + markdownImage);
    } catch (err) {
      console.error("アップロードエラー:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="markdownUploader">
      <h2>マークダウン入力欄（画像ドロップ対応）</h2>
      <textarea
        value={markdown}
        onChange={handleChange}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
        style={{ width: "100%", height: "200px", padding: "10px" }}
      />

      <h3>プレビュー</h3>
      <div
        className="markdownPreview"
        style={{ border: "1px solid #ccc", padding: "10px" }}
      >
        {markdown.split("\n").map((line, idx) => {
          const imgMatch = line.match(/!\[.*\]\((.*)\)/);
          if (imgMatch) {
            return (
              <img
                key={idx}
                src={imgMatch[1]}
                alt=""
                style={{ maxWidth: "200px", marginBottom: "10px" }}
              />
            );
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    </div>
  );
};

export default MarkdownImageUploader;