



// "use client";
// import React, { useState, useEffect } from "react";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";



// // 🔥 Firebase 設定
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
// //   authDomain: "share-info-project.firebaseapp.com",
// //   projectId: "share-info-project",
// //   storageBucket: "share-info-project.firebasestorage.app",
// //   messagingSenderId: "10017220780",
// //   appId: "1:10017220780:web:4820d384929f2d84735709",
// //   measurementId: "G-42VYEZ51GF",
// // };

// // 🔥 Firebase 初期化（重複を避ける）
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const storage = getStorage(app);

// const MarkdownImageUploader: React.FC = () => {

//   type UploadedImage = {
//     name: string;
//     url: string;
//   };

//   const [images, setImages] = useState<UploadedImage[]>([]);
//   const [markdown, setMarkdown] = useState<string>("");
//   const [sending, setSending] = useState<boolean>(false);
//   const [groupId, setGroupId] = useState<number | null>(null);
//   const [contentName, setContentName] = useState<string>(""); // 新しいフォーム用

//   const [pdfUrl, setPdfUrl] = useState<string>("");
//   const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

//   // const markdown = images.map((img) => `![${img.name}](${img.url})`).join("\n");

//   // URLから groupId を取得
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setGroupId(parsedId);
//   }, []);

//   // 画像ドロップ処理
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

//   const handlePdfDelete = async () => {
//     if (!pdfUrl) return;

//     try {
//       const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);
//       setPdfUrl("");
//       alert("PDFを削除しました");
//     } catch (err) {
//       console.error("PDF削除エラー:", err);
//       alert("PDFの削除に失敗しました");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   // const handlePdfUpload = async (file: File) => {
//   // if (file.type !== "application/pdf") {
//   //   alert("PDFファイルのみアップロード可能です。");
//   //   return;
//   // }

//   // const MAX_SIZE = 10 * 1024 * 1024; // 10MB
//   // if (file.size > MAX_SIZE) {
//   //   alert("PDFは10MB以下にしてください。");
//   //   return;
//   // }

//   // try {
//   //   setUploadingPdf(true);

//   //   const storageRef = ref(
//   //     storage,
//   //     `pdfs/${Date.now()}_${file.name}`
//   //   );

//   //   await uploadBytes(storageRef, file);
//   //   const url = await getDownloadURL(storageRef);

//   //   setPdfUrl(url);
//   //   alert("PDFアップロード成功！");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("PDFアップロードに失敗しました");
//   //   } finally {
//   //     setUploadingPdf(false);
//   //   }

//   // };

//   const handlePdfUpload = async (file: File) => {
//       if (file.type !== "application/pdf") {
//         alert("PDFファイルのみアップロード可能です。");
//         return;
//       }

//       // ★ 既にPDFがアップロードされている場合はブロック
//       if (pdfUrl) {
//         alert("すでにPDFがアップロードされています。削除してから再アップロードしてください。");
//         return;
//       }

//       const MAX_SIZE = 10 * 1024 * 1024; // 10MB
//       if (file.size > MAX_SIZE) {
//         alert("PDFは10MB以下にしてください。");
//         return;
//       }

//       try {
//         setUploadingPdf(true);

//         const storageRef = ref(
//           storage,
//           `pdfs/${Date.now()}_${file.name}`
//         );

//         await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(storageRef);

//         setPdfUrl(url);
//         alert("PDFアップロード成功！");
//       } catch (err) {
//         console.error(err);
//         alert("PDFアップロードに失敗しました");
//       } finally {
//         setUploadingPdf(false);
//       }
//     };


//     const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     await handlePdfUpload(file);
//   };

//   const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       e.stopPropagation();
//     };

//   const handlePdfSelect = async (
//       e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//       if (!e.target.files || e.target.files.length === 0) return;

//       const file = e.target.files[0];
//       await handlePdfUpload(file);
//     };

//   // 送信処理
// const handleSend = async () => {
//   const user = auth.currentUser;
//   if (!user) {
//     alert("ログインが必要です");
//     return;
//   }
//   if (!groupId) {
//     alert("groupId が取得できませんでした");
//     return;
//   }
//   if (!contentName.trim()) {
//     alert("コンテンツ名を入力してください");
//     return;
//   }

//   setSending(true);

//   try {
//     const payload = {
//       uid: user.uid,
//       groupId,
//       contentName,
//       content: markdown,
//       pdfUrl: pdfUrl, // ★ これを追加
//     };

//     // const response = await fetch("http://localhost:8080/make_grouptopic", {
//     const response = await fetch(`${API_BASE_URL}/make_grouptopic`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

//     alert("送信成功！");
//     setMarkdown("");
//     setContentName("");
//     setPdfUrl(""); // ★ リセット追加
//   } catch (err) {
//     console.error(err);
//     alert("送信中にエラーが発生しました");
//   } finally {
//     setSending(false);
//   }
// };

// const handleImageUpload = async (file: File) => {
//   const MAX_SIZE = 1024 * 1024;
//   if (file.size > MAX_SIZE) {
//     alert("画像は1MB以下にしてください。");
//     return;
//   }

//   const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

//   try {
//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);

//     // 画像配列に追加
//     setImages((prev) => [...prev, { name: file.name, url }]);
//   } catch (err) {
//     console.error("画像アップロードエラー:", err);
//     alert("アップロードに失敗しました。");
//   }
// };

// const handleImageDelete = async (image: UploadedImage) => {
//   try {
//     const path = decodeURIComponent(image.url.split("/o/")[1].split("?")[0]);
//     const storageRef = ref(storage, path);

//     await deleteObject(storageRef);

//     // 配列から削除
//     setImages((prev) => prev.filter((img) => img.url !== image.url));
//   } catch (err) {
//     console.error("画像削除エラー:", err);
//     alert("画像の削除に失敗しました");
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">

//         <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
//           マークダウン入力欄（画像ドロップ対応）
//         </h2>

//         {/* コンテンツ名フォーム */}
//         <input
//           type="text"
//           placeholder="コンテンツ名"
//           value={contentName}
//           onChange={(e) => setContentName(e.target.value)}
//           className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* Markdown入力 */}
//         <textarea
//           value={markdown}
//           onChange={(e) => setMarkdown(e.target.value)}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//           className="w-full h-48 p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//         />

//         <button
//           onClick={handleSend}
//           disabled={sending || markdown.trim() === "" || !groupId || !contentName.trim()}
//           className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
//             sending || !groupId || !contentName.trim() || markdown.trim() === ""
//               ? "bg-blue-300 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {sending ? "送信中..." : "送信"}
//         </button>

//         {/* PDF専用アップロード欄 */}
//         <div
//           onDrop={handlePdfDrop}
//           onDragOver={handlePdfDragOver}
//           className="mb-6 p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
//         >
//           <p className="text-blue-700 text-lg mb-2">📄 ここにPDFをドラッグ＆ドロップしよう</p>
//           <p className="text-blue-500 mb-4">もしくは</p>
//           <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//             ファイルを選択
//             <input
//               type="file"
//               accept="application/pdf"
//               style={{ display: "none" }}
//               onChange={handlePdfSelect}
//             />
//           </label>

//           {uploadingPdf && <p className="text-blue-500 mt-2">アップロード中...</p>}

//           {/* {pdfUrl && (
//             <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-between">
//               <span className="text-blue-700 font-medium">✅ アップロード済み</span>
//               <a
//                 href={pdfUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//               >
//                 PDFを確認する
//               </a>
//             </div>
//           )} */}

//           {pdfUrl && (
//             <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-between gap-2">
//               <span className="text-blue-700 font-medium">✅ アップロード済み</span>
//               <div className="flex gap-2">
//                 <a
//                   href={pdfUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                 >
//                   PDFを確認
//                 </a>
//                 <button
//                   onClick={handlePdfDelete}
//                   className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                 >
//                   削除
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <h3 className="text-xl font-semibold text-blue-800 mb-3">プレビュー</h3>
//         <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//           <ReactMarkdown
//             remarkPlugins={[remarkGfm]}
//             components={{
//               img: ({ node, ...props }) => (
//                 <img
//                   {...props}
//                   style={{ maxWidth: "200px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
//                   alt={props.alt || ""}
//                 />
//               ),
//               a: ({ node, ...props }) => {
//                 const href = props.href || "";
//                 if (href.endsWith(".pdf")) {
//                   return (
//                     <div className="flex items-center gap-2 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-100">
//                       <span className="text-2xl">📄</span>
//                       <span className="flex-1 text-blue-700">{props.children}</span>
//                       <a
//                         href={href}
//                         download={props.children?.toString() || "PDF"}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                       >
//                         ダウンロード
//                       </a>
//                     </div>
//                   );
//                 }
//                 return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
//               },
//             }}
//           >
//             {markdown}
//           </ReactMarkdown>

//           {pdfUrl && !markdown.includes(pdfUrl) && (
//             <div className="flex items-center gap-2 p-3 mt-4 border border-blue-200 rounded-lg bg-blue-100">
//               <span className="text-2xl">📄</span>
//               <span className="flex-1 text-blue-700">PDFファイル</span>
//               <a
//                 href={pdfUrl}
//                 download="PDF"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//               >
//                 ダウンロード
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarkdownImageUploader;
















// "use client";
// import React, { useState, useEffect } from "react";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// // 🔥 Firebase 初期化（重複を避ける）
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const storage = getStorage(app);

// const MarkdownImageUploader: React.FC = () => {
//   type UploadedImage = {
//     name: string;
//     url: string;
//   };

//   const [images, setImages] = useState<UploadedImage[]>([]);
//   const [markdown, setMarkdown] = useState<string>("");
//   const [sending, setSending] = useState<boolean>(false);
//   const [groupId, setGroupId] = useState<number | null>(null);
//   const [contentName, setContentName] = useState<string>("");
//   const [pdfUrl, setPdfUrl] = useState<string>("");
//   const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

//   // URLから groupId を取得
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setGroupId(parsedId);
//   }, []);

//   // const handleImageUpload = async (file: File) => {
//   //   const MAX_SIZE = 1024 * 1024;
//   //   if (file.size > MAX_SIZE) {
//   //     alert("画像は1MB以下にしてください。");
//   //     return;
//   //   }

//   //   const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

//   //   try {
//   //     await uploadBytes(storageRef, file);
//   //     const url = await getDownloadURL(storageRef);
//   //     setImages((prev) => [...prev, { name: file.name, url }]);
//   //   } catch (err) {
//   //     console.error("画像アップロードエラー:", err);
//   //     alert("アップロードに失敗しました。");
//   //   }
//   // };

//   // const handleImageUpload = async (file: File) => {
//   //     const MAX_SIZE = 1024 * 1024;
//   //     if (file.size > MAX_SIZE) {
//   //       alert("画像は1MB以下にしてください。");
//   //       return;
//   //     }

//   //     const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

//   //     try {
//   //       await uploadBytes(storageRef, file);
//   //       const url = await getDownloadURL(storageRef);

//   //       // 画像配列に追加
//   //       setImages((prev) => [...prev, { name: file.name, url }]);

//   //       // ★ ここで markdown の末尾に追加
//   //       setMarkdown((prev) => prev + `\n![${file.name}](${url})`);
//   //     } catch (err) {
//   //       console.error("画像アップロードエラー:", err);
//   //       alert("アップロードに失敗しました。");
//   //     }
//   //   };

//     // 画像アップロード
//   const handleImageUpload = async (file: File) => {
//     const MAX_SIZE = 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください。");
//       return;
//     }

//     const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);

//       // 画像配列に追加
//       setImages((prev) => [...prev, { name: file.name, url }]);

//       // ★ Markdown は変更しない
//     } catch (err) {
//       console.error("画像アップロードエラー:", err);
//       alert("アップロードに失敗しました。");
//     }
//   };

//   const handleImageDelete = async (image: UploadedImage) => {
//     try {
//       const path = decodeURIComponent(image.url.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);
//       setImages((prev) => prev.filter((img) => img.url !== image.url));
//     } catch (err) {
//       console.error("画像削除エラー:", err);
//       alert("画像の削除に失敗しました");
//     }
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     await handleImageUpload(file);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handlePdfUpload = async (file: File) => {
//     if (file.type !== "application/pdf") {
//       alert("PDFファイルのみアップロード可能です。");
//       return;
//     }
//     if (pdfUrl) {
//       alert("すでにPDFがアップロードされています。削除してから再アップロードしてください。");
//       return;
//     }
//     const MAX_SIZE = 10 * 1024 * 1024;
//     if (file.size > MAX_SIZE) {
//       alert("PDFは10MB以下にしてください。");
//       return;
//     }

//     try {
//       setUploadingPdf(true);
//       const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setPdfUrl(url);
//       alert("PDFアップロード成功！");
//     } catch (err) {
//       console.error(err);
//       alert("PDFアップロードに失敗しました");
//     } finally {
//       setUploadingPdf(false);
//     }
//   };

//   const handlePdfDelete = async () => {
//     if (!pdfUrl) return;
//     try {
//       const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);
//       setPdfUrl("");
//       alert("PDFを削除しました");
//     } catch (err) {
//       console.error(err);
//       alert("PDFの削除に失敗しました");
//     }
//   };

//   const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
//     const file = e.dataTransfer.files[0];
//     await handlePdfUpload(file);
//   };

//   const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     const file = e.target.files[0];
//     await handlePdfUpload(file);
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
//     if (!contentName.trim()) {
//       alert("コンテンツ名を入力してください");
//       return;
//     }

//     setSending(true);

//     try {
//       const markdownContent = [
//         images.map((img) => `![${img.name}](${img.url})`).join("\n"),
//         markdown,
//       ].join("\n");

//       const payload = {
//         uid: user.uid,
//         groupId,
//         contentName,
//         content: markdownContent,
//         pdfUrl,
//       };

//       const response = await fetch(`${API_BASE_URL}/make_grouptopic`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

//       alert("送信成功！");
//       setImages([]);
//       setMarkdown("");
//       setContentName("");
//       setPdfUrl("");
//     } catch (err) {
//       console.error(err);
//       alert("送信中にエラーが発生しました");
//     } finally {
//       setSending(false);
//     }
//   };

//   // return (
//   //   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
//   //     <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">

//   //       <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
//   //         マークダウン入力欄（画像ドロップ対応）
//   //       </h2>

//   //       <input
//   //         type="text"
//   //         placeholder="コンテンツ名"
//   //         value={contentName}
//   //         onChange={(e) => setContentName(e.target.value)}
//   //         className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//   //       />

//   //       <textarea
//   //         value={markdown}
//   //         onChange={(e) => setMarkdown(e.target.value)}
//   //         onDrop={handleDrop}
//   //         onDragOver={handleDragOver}
//   //         placeholder="ここにテキストを書いてください。画像をドロップすると自動でマークダウンに挿入されます。"
//   //         className="w-full h-48 p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//   //       />

//   //       <button
//   //         onClick={handleSend}
//   //         disabled={sending || (!groupId || !contentName.trim())}
//   //         className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
//   //           sending || !groupId || !contentName.trim()
//   //             ? "bg-blue-300 cursor-not-allowed"
//   //             : "bg-blue-600 hover:bg-blue-700"
//   //         }`}
//   //       >
//   //         {sending ? "送信中..." : "送信"}
//   //       </button>

//   //       {/* 画像プレビュー */}
//   //       {images.length > 0 && (
//   //         <div className="mb-6">
//   //           <h3 className="text-xl font-semibold text-blue-800 mb-3">アップロード画像</h3>
//   //           {images.map((img) => (
//   //             <div key={img.url} className="flex items-center gap-2 mb-2 border p-2 rounded bg-blue-50">
//   //               <img src={img.url} alt={img.name} className="w-20 h-20 object-cover rounded" />
//   //               <span className="flex-1">{img.name}</span>
//   //               <button
//   //                 onClick={() => handleImageDelete(img)}
//   //                 className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//   //               >
//   //                 削除
//   //               </button>
//   //             </div>
//   //           ))}
//   //         </div>
//   //       )}

//   //       {/* PDF専用アップロード欄 */}
//   //       <div
//   //         onDrop={handlePdfDrop}
//   //         onDragOver={handlePdfDragOver}
//   //         className="mb-6 p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
//   //       >
//   //         <p className="text-blue-700 text-lg mb-2">📄 ここにPDFをドラッグ＆ドロップしよう</p>
//   //         <p className="text-blue-500 mb-4">もしくは</p>
//   //         <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//   //           ファイルを選択
//   //           <input
//   //             type="file"
//   //             accept="application/pdf"
//   //             style={{ display: "none" }}
//   //             onChange={handlePdfSelect}
//   //           />
//   //         </label>

//   //         {uploadingPdf && <p className="text-blue-500 mt-2">アップロード中...</p>}

//   //         {pdfUrl && (
//   //           <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-between gap-2">
//   //             <span className="text-blue-700 font-medium">✅ アップロード済み</span>
//   //             <div className="flex gap-2">
//   //               <a
//   //                 href={pdfUrl}
//   //                 target="_blank"
//   //                 rel="noopener noreferrer"
//   //                 className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//   //               >
//   //                 PDFを確認
//   //               </a>
//   //               <button
//   //                 onClick={handlePdfDelete}
//   //                 className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//   //               >
//   //                 削除
//   //               </button>
//   //             </div>
//   //           </div>
//   //         )}
//   //       </div>

//   //       <h3 className="text-xl font-semibold text-blue-800 mb-3">プレビュー</h3>
//   //       <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//   //         <ReactMarkdown
//   //           remarkPlugins={[remarkGfm]}
//   //           components={{
//   //             img: ({ node, ...props }) => (
//   //               <img
//   //                 {...props}
//   //                 style={{ maxWidth: "200px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
//   //                 alt={props.alt || ""}
//   //               />
//   //             ),
//   //             a: ({ node, ...props }) => {
//   //               const href = props.href || "";
//   //               if (href.endsWith(".pdf")) {
//   //                 return (
//   //                   <div className="flex items-center gap-2 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-100">
//   //                     <span className="text-2xl">📄</span>
//   //                     <span className="flex-1 text-blue-700">{props.children}</span>
//   //                     <a
//   //                       href={href}
//   //                       download={props.children?.toString() || "PDF"}
//   //                       target="_blank"
//   //                       rel="noopener noreferrer"
//   //                       className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//   //                     >
//   //                       ダウンロード
//   //                     </a>
//   //                   </div>
//   //                 );
//   //               }
//   //               return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
//   //             },
//   //           }}
//   //         >
//   //           {[
//   //             images.map((img) => `![${img.name}](${img.url})`).join("\n"),
//   //             markdown,
//   //           ].join("\n")}
//   //         </ReactMarkdown>

//   //         {pdfUrl && !markdown.includes(pdfUrl) && (
//   //           <div className="flex items-center gap-2 p-3 mt-4 border border-blue-200 rounded-lg bg-blue-100">
//   //             <span className="text-2xl">📄</span>
//   //             <span className="flex-1 text-blue-700">PDFファイル</span>
//   //             <a
//   //               href={pdfUrl}
//   //               download="PDF"
//   //               target="_blank"
//   //               rel="noopener noreferrer"
//   //               className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//   //             >
//   //               ダウンロード
//   //             </a>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
//     <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">

//       <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
//         マークダウン入力欄（画像ドロップ対応）
//       </h2>

//       {/* コンテンツ名入力 */}
//       <input
//         type="text"
//         placeholder="コンテンツ名"
//         value={contentName}
//         onChange={(e) => setContentName(e.target.value)}
//         className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Markdown テキスト入力 */}
//       <textarea
//         value={markdown}
//         onChange={(e) => setMarkdown(e.target.value)}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         placeholder="ここにテキストを書いてください。画像をドロップしても Markdown 内には URL は追加されません。"
//         className="w-full h-48 p-3 mb-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//       />

//       {/* 送信ボタン */}
//       <button
//         onClick={handleSend}
//         disabled={sending || (!groupId || !contentName.trim())}
//         className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
//           sending || !groupId || !contentName.trim()
//             ? "bg-blue-300 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {sending ? "送信中..." : "送信"}
//       </button>

//       {/* 画像プレビュー */}
//       {images.length > 0 && (
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-blue-800 mb-3">アップロード画像</h3>
//           <div className="flex flex-wrap gap-4">
//             {images.map((img) => (
//               <div key={img.url} className="flex flex-col items-center border p-2 rounded bg-blue-50">
//                 <img src={img.url} alt={img.name} className="w-28 h-28 object-cover rounded mb-1" />
//                 <span className="text-sm text-blue-700 mb-1">{img.name}</span>
//                 <button
//                   onClick={() => handleImageDelete(img)}
//                   className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
//                 >
//                   削除
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* PDFアップロード欄 */}
//       <div
//         onDrop={handlePdfDrop}
//         onDragOver={handlePdfDragOver}
//         className="mb-6 p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
//       >
//         <p className="text-blue-700 text-lg mb-2">📄 ここにPDFをドラッグ＆ドロップしよう</p>
//         <p className="text-blue-500 mb-4">もしくは</p>
//         <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
//           ファイルを選択
//           <input
//             type="file"
//             accept="application/pdf"
//             style={{ display: "none" }}
//             onChange={handlePdfSelect}
//           />
//         </label>

//         {uploadingPdf && <p className="text-blue-500 mt-2">アップロード中...</p>}

//         {pdfUrl && (
//           <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-between gap-2">
//             <span className="text-blue-700 font-medium">✅ アップロード済み</span>
//             <div className="flex gap-2">
//               <a
//                 href={pdfUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//               >
//                 PDFを確認
//               </a>
//               <button
//                 onClick={handlePdfDelete}
//                 className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//               >
//                 削除
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Markdown プレビュー */}
//       <h3 className="text-xl font-semibold text-blue-800 mb-3">プレビュー</h3>
//       <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//         {/* Markdown 文字部分 */}
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             a: ({ node, ...props }) => (
//               <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
//             ),
//           }}
//         >
//           {markdown}
//         </ReactMarkdown>

//         {/* 画像プレビュー部分 */}
//         {images.length > 0 && (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {images.map((img) => (
//               <div key={img.url} className="flex flex-col items-center border p-2 rounded bg-blue-50">
//                 <img
//                   src={img.url}
//                   alt={img.name}
//                   className="w-32 h-32 object-cover rounded mb-1"
//                 />
//                 <span className="text-sm text-blue-700">{img.name}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* PDFプレビュー */}
//         {pdfUrl && (
//           <div className="flex items-center gap-2 p-3 mt-4 border border-blue-200 rounded-lg bg-blue-100">
//             <span className="text-2xl">📄</span>
//             <span className="flex-1 text-blue-700">PDFファイル</span>
//             <a
//               href={pdfUrl}
//               download="PDF"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//             >
//               ダウンロード
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
// };

// export default MarkdownImageUploader;


















"use client";
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";
import { useRouter, useSearchParams } from "next/navigation";

// 🔥 Firebase 初期化（重複を避ける）
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const MarkdownImageUploader: React.FC = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  type UploadedImage = {
    name: string;
    url: string;
  };

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [markdown, setMarkdown] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [contentName, setContentName] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

  // URLから groupId を取得
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setGroupId(parsedId);
  }, []);

  const handleImageUpload = async (file: File) => {
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("画像は1MB以下にしてください。");
      return;
    }

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImages((prev) => [...prev, { name: file.name, url }]);
    } catch (err) {
      console.error("画像アップロードエラー:", err);
      alert("アップロードに失敗しました。");
    }
  };

  const handleImageDelete = async (image: UploadedImage) => {
    try {
      const path = decodeURIComponent(image.url.split("/o/")[1].split("?")[0]);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      setImages((prev) => prev.filter((img) => img.url !== image.url));
    } catch (err) {
      console.error("画像削除エラー:", err);
      alert("画像の削除に失敗しました");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    await handleImageUpload(file);
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
    if (pdfUrl) {
      alert("すでにPDFがアップロードされています。削除してから再アップロードしてください。");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("PDFは10MB以下にしてください。");
      return;
    }

    try {
      setUploadingPdf(true);
      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
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

  const handlePdfDelete = async () => {
    if (!pdfUrl) return;
    try {
      const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      setPdfUrl("");
      alert("PDFを削除しました");
    } catch (err) {
      console.error(err);
      alert("PDFの削除に失敗しました");
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

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await handlePdfUpload(file);
  };

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
      const markdownContent = [
        images.map((img) => `![${img.name}](${img.url})`).join("\n"),
        markdown,
      ].join("\n");

      const idToken = await user.getIdToken();
      const payload = {
        groupId,
        contentName,
        content: markdownContent,
        pdfUrl,
      };

      const response = await fetch(`${API_BASE_URL}/make_grouptopic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`送信に失敗: ${response.status}`);

      alert("送信成功！");
      setImages([]);
      setMarkdown("");
      setContentName("");
      setPdfUrl("");
      const schoolIdParam = searchParams.get("schoolId");
      const schoolId = schoolIdParam ? Number(schoolIdParam) : NaN;
      if (!Number.isNaN(schoolId)) {
        router.push(`/school_topic/${schoolId}`);
      } else {
        router.push("/schools");
      }
    } catch (err) {
      console.error(err);
      alert("送信中にエラーが発生しました");
    } finally {
      setSending(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">

      <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
        マークダウン入力（左）＋ プレビュー（右）
      </h2>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* =========================
            左：編集エリア
        ========================= */}
        <div className="flex flex-col">

          <input
            type="text"
            placeholder="コンテンツ名"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
            className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            placeholder="ここにMarkdownを書いてください"
            className="w-full h-64 p-3 mb-4 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* 送信ボタン */}
          <button
            onClick={handleSend}
            disabled={sending || !groupId || !contentName.trim()}
            className={`mb-6 px-6 py-3 rounded-lg text-white font-semibold transition ${
              sending || !groupId || !contentName.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {sending ? "送信中..." : "送信"}
          </button>

          {/* 画像プレビュー */}
          {images.length > 0 && (
            <div className="mb-4">
              <h3 className="text-blue-800 font-semibold mb-2">画像</h3>
              {images.map((img) => (
                <div
                  key={img.url}
                  className="flex items-center gap-2 mb-2 border p-2 rounded bg-blue-50"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="flex-1 text-sm">{img.name}</span>
                  <button
                    onClick={() => handleImageDelete(img)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PDFアップロード */}
          <div
            onDrop={handlePdfDrop}
            onDragOver={handlePdfDragOver}
            className="p-4 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
          >
            <p className="text-blue-700 mb-2">📄 PDFアップロード</p>

            <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
              ファイル選択
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handlePdfSelect}
              />
            </label>

            {pdfUrl && (
              <div className="mt-3 flex justify-between items-center bg-blue-100 p-2 rounded">
                <span className="text-sm text-blue-700">アップロード済み</span>
                <button
                  onClick={handlePdfDelete}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            右：プレビュー
        ========================= */}
        <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 h-[600px] overflow-auto">

          <h3 className="text-blue-800 font-semibold mb-3">
            プレビュー
          </h3>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{
                    maxWidth: "100%",
                    margin: "8px 0",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                  }}
                />
              ),
              a: ({ node, ...props }) => {
                const href = props.href || "";

                if (href.endsWith(".pdf")) {
                  return (
                    <div className="flex items-center gap-2 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-100">
                      <span className="text-2xl">📄</span>
                      <span className="flex-1 text-blue-700">
                        {props.children}
                      </span>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        PDF
                      </a>
                    </div>
                  );
                }

                return (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  />
                );
              },
            }}
          >
            {[
              images.map((img) => `![${img.name}](${img.url})`).join("\n"),
              markdown,
            ].join("\n")}
          </ReactMarkdown>

          {pdfUrl && (
            <div className="mt-4 flex items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-100">
              <span className="text-2xl">📄</span>
              <span className="flex-1 text-blue-700">PDFファイル</span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
              >
                ダウンロード
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default MarkdownImageUploader;