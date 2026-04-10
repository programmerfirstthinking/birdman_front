// "use client";

// import React from "react";

// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// /* ================================
//    Firebase 初期化
// ================================ */
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
// //   authDomain: "share-info-project.firebaseapp.com",
// //   projectId: "share-info-project",
// //   storageBucket: "share-info-project.appspot.com",
// //   messagingSenderId: "10017220780",
// //   appId: "1:10017220780:web:4820d384929f2d84735709",
// //   measurementId: "G-42VYEZ51GF"
// // };
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const storage = getStorage(app);

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



// const parseContent = (text?: string) => {
//   if (!text) return [];

//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   // 改良: URL は空白以外のすべてをキャプチャ
//   const regex = /!\[(.*?)\]\((\S+?)\)|\[(.*?)\.pdf\]\((\S+?)\)/gi;
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
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集モード管理
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [contentName, setContentName] = useState<string>("");
//   const [markdown, setMarkdown] = useState<string>("");

//   const auth = getAuth();

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//   e.preventDefault();
//   e.stopPropagation();

//   if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//   const file = e.dataTransfer.files[0];

//   const MAX_SIZE = 1024 * 1024; // 1MB
//   if (file.size > MAX_SIZE) {
//     alert("画像は1MB以下にしてください");
//     return;
//   }

//   try {
//     const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);

//     await uploadBytes(storageRef, file);

//     const url = await getDownloadURL(storageRef);

//     setMarkdown((prev) => prev + `\n![${file.name}](${url})\n`);
//   } catch (err) {
//     console.error(err);
//     alert("画像アップロードに失敗しました");
//   }
// };

// const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
// };

//   /* ----------------------------
//      Firebase currentUser を監視
//   ---------------------------- */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return () => unsubscribe();
//   }, [auth]);

//   /* ----------------------------
//      URLからID取得
//   ---------------------------- */
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

//   /* ----------------------------
//      データ取得
//   ---------------------------- */
//   const fetchData = async (id: number) => {
//     if (!currentUser) return;

//     try {
//       const idToken = await currentUser.getIdToken();
//       // const res = await fetch("http://localhost:8080/see_groupcontent", {
//       const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });

//       if (!res.ok) throw new Error("Fetch エラー");

//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   // const contentParts = parseContent(isEditing ? markdown : responseData.data.content);

//   const contentParts = parseContent(isEditing ? markdown : responseData.data.content ?? "");
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">

//         <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
//           スクールトピックですよ
//           {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
//             <button
//               onClick={() => {
//                 setContentName(responseData.data.group_contents_name);
//                 setMarkdown(responseData.data.content ?? "");
//                 setIsEditing(true);
//               }}
//               className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition"
//             >
//               編集
//             </button>
//           )}
//         </h2>

//         {isEditing ? (
//           <>
//             {/* 編集フォーム */}
//             <input
//               type="text"
//               value={contentName}
//               onChange={(e) => setContentName(e.target.value)}
//               className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="コンテンツ名"
//             />
//             <textarea
//               value={markdown}
//               onChange={(e) => setMarkdown(e.target.value)}
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               className="w-full h-48 mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//               placeholder="Markdown本文を入力…（画像をドラッグ＆ドロップ可能）"
//             />

//             {/* Markdown プレビュー */}
//             <div className="border border-blue-200 p-4 mb-4 rounded-lg bg-blue-50">
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
//             </div>

//             {/* 更新・キャンセルボタン */}
//             <div className="flex gap-4">
//               <button
//                 onClick={async () => {
//                   if (!contentId || !currentUser) return;
//                   try {
//                     const idToken = await currentUser.getIdToken();
//                     // const res = await fetch("http://localhost:8080/editSchoolContent", {
//                     const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({
//                         id: contentId,
//                         group_contents_name: contentName,
//                         content: markdown,
//                         idToken,
//                       }),
//                     });
//                     if (!res.ok) throw new Error("更新に失敗しました");

//                     const data: ApiResponse = await res.json();
//                     setResponseData(data);
//                     setIsEditing(false);
//                   } catch (err) {
//                     console.error(err);
//                     alert("更新に失敗しました");
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//               >
//                 更新
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
//               >
//                 キャンセル
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* 表示モード */}
//             <div className="mb-4">
//               <p><strong>ID:</strong> {responseData.data.id}</p>
//               <p><strong>グループID:</strong> {responseData.data.group_id}</p>
//               <p><strong>スクールID:</strong> {responseData.data.school_id}</p>
//               <p><strong>ユーザーID:</strong> {responseData.data.user_id}</p>
//               <p><strong>名前:</strong> {responseData.data.group_contents_name}</p>
//               <p><strong>本文:</strong></p>

//             </div>

//             {/* PDF表示 */}
//             {responseData.data.pdf_url && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <a
//                   href={responseData.data.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             )}

//             {/* Markdown表示 */}
//             <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   img: ({ node, ...props }) => (
//                     <img {...props} style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }} alt="" />
//                   ),
//                   a: ({ node, ...props }) => {
//                     if (props.href?.endsWith(".pdf")) {
//                       const name = React.Children.toArray(props.children)[0]?.toString() || "PDFファイル";
//                       return (
//                         <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
//                           <span className="text-2xl">📄</span>
//                           <span className="flex-1 text-blue-700">{name}</span>
//                           <a
//                             href={props.href}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                           >
//                             ダウンロード
//                           </a>
//                         </div>
//                       );
//                     }
//                     return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
//                   },
//                 }}
//               >
//                 {responseData.data.content ?? ""}
//               </ReactMarkdown>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }





// "use client";

// import React from "react";

// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// /* ================================
//    Firebase 初期化
// ================================ */
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const storage = getStorage(app);

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

// const parseContent = (text?: string) => {
//   if (!text) return [];

//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   const regex = /!\[(.*?)\]\((\S+?)\)|\[(.*?)\.pdf\]\((\S+?)\)/gi;
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
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集モード管理
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [contentName, setContentName] = useState<string>("");
//   const [markdown, setMarkdown] = useState<string>("");
//   const [pdfUrl, setPdfUrl] = useState<string>("");

//   const auth = getAuth();

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];

//     const MAX_SIZE = 1024 * 1024; // 1MB
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください");
//       return;
//     }

//     try {
//       const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setMarkdown((prev) => prev + `![${file.name}](${url})\n`);
//     } catch (err) {
//       console.error(err);
//       alert("画像アップロードに失敗しました");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   // const handlePdfDelete = async () => {
//   //   if (!pdfUrl) return;
//   //   try {
//   //     const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
//   //     const storageRef = ref(storage, path);
//   //     await deleteObject(storageRef);
//   //     setPdfUrl("");
//   //     alert("PDFを削除しました");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("PDF削除に失敗しました");
//   //   }
//   // };

//     const handlePdfDelete = async () => {
//     if (!pdfUrl) return;
//     try {
//       const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);

//       // stateも更新
//       setPdfUrl("");
//       setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);

//       alert("PDFを削除しました");
//     } catch (err) {
//       console.error(err);
//       alert("PDF削除に失敗しました");
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return () => unsubscribe();
//   }, [auth]);

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

//   const fetchData = async (id: number) => {
//     if (!currentUser) return;

//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });

//       if (!res.ok) throw new Error("Fetch エラー");

//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//       setPdfUrl(data.data.pdf_url ?? "");
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentParts = parseContent(isEditing ? markdown : responseData.data.content ?? "");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
//           スクールトピック
//           {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
//             <button
//               onClick={() => {
//                 setContentName(responseData.data.group_contents_name);
//                 setMarkdown(responseData.data.content ?? "");
//                 setPdfUrl(responseData.data.pdf_url ?? "");
//                 setIsEditing(true);
//               }}
//               className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition"
//             >
//               編集
//             </button>
//           )}
//         </h2>

//         {isEditing && (
//           <>
//             <input
//               type="text"
//               value={contentName}
//               onChange={(e) => setContentName(e.target.value)}
//               className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="コンテンツ名"
//             />
//             <textarea
//               value={markdown}
//               onChange={(e) => setMarkdown(e.target.value)}
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               className="w-full h-48 mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//               placeholder="Markdown本文を入力…（画像をドラッグ＆ドロップ可能）"
//             />

//             {/* {pdfUrl && (
//               <div className="flex items-center gap-2 mb-4 p-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">アップロード済みPDF</span>
//                 <button
//                   onClick={handlePdfDelete}
//                   className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                 >
//                   削除
//                 </button>
//               </div>
//             )} */}

//             {/* {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <a
//                   href={pdfUrl || responseData.data.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             )} */}

//             {/* {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <div className="flex gap-2">
//                   <a
//                     href={pdfUrl || responseData.data.pdf_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                   >
//                     ダウンロード
//                   </a>
//                   <button
//                     onClick={async () => {
//                       if (!(pdfUrl || responseData.data.pdf_url)) return;
//                       try {
//                         const targetUrl = pdfUrl || responseData.data.pdf_url;
//                         const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
//                         const storageRef = ref(storage, path);
//                         await deleteObject(storageRef);

//                         // state と responseData の両方を更新
//                         setPdfUrl("");
//                         setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);

//                         alert("PDFを削除しました");
//                       } catch (err) {
//                         console.error(err);
//                         alert("PDF削除に失敗しました");
//                       }
//                     }}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     削除
//                   </button>
//                 </div>
//               </div>
//             )} */}

//             {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <div className="flex gap-2">
//                   <a
//                     href={pdfUrl || responseData.data.pdf_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                   >
//                     ダウンロード
//                   </a>
//                   <button
//                     onClick={handlePdfDelete}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     削除
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* 更新・キャンセルボタン */}
//             <div className="flex gap-4">
//               <button
//                 onClick={async () => {
//                   if (!contentId || !currentUser) return;
//                   try {
//                     const idToken = await currentUser.getIdToken();
//                     const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({
//                         id: contentId,
//                         group_contents_name: contentName,
//                         content: markdown,
//                         pdf_url: pdfUrl,
//                         idToken,
//                       }),
//                     });
//                     if (!res.ok) throw new Error("更新に失敗しました");

//                     const data: ApiResponse = await res.json();
//                     setResponseData(data);
//                     setIsEditing(false);
//                   } catch (err) {
//                     console.error(err);
//                     alert("更新に失敗しました");
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//               >
//                 更新
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
//               >
//                 キャンセル
//               </button>
//             </div>
//           </>
//         )}

//         {!isEditing && (
//           <>
//             {/* PDF表示 */}
//             {responseData.data.pdf_url && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <a
//                   href={responseData.data.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             )}

//             {/* Markdown表示 */}
//             <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   img: ({ node, ...props }) => (
//                     <img
//                       {...props}
//                       style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }}
//                       alt=""
//                     />
//                   ),
//                   a: ({ node, ...props }) => {
//                     if (props.href?.endsWith(".pdf")) {
//                       const name = React.Children.toArray(props.children)[0]?.toString() || "PDFファイル";
//                       return (
//                         <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
//                           <span className="text-2xl">📄</span>
//                           <span className="flex-1 text-blue-700">{name}</span>
//                           <a
//                             href={props.href}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                           >
//                             ダウンロード
//                           </a>
//                         </div>
//                       );
//                     }
//                     return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
//                   },
//                 }}
//               >
//                 {responseData.data.content ?? ""}
//               </ReactMarkdown>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }















// "use client";

// import React from "react";
// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// /* ================================
//    Firebase 初期化
// ================================ */
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const storage = getStorage(app);

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

// const parseContent = (text?: string) => {
//   if (!text) return [];

//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   const regex = /!\[(.*?)\]\((\S+?)\)|\[(.*?)\.pdf\]\((\S+?)\)/gi;
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
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集モード管理
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [contentName, setContentName] = useState<string>("");
//   const [markdown, setMarkdown] = useState<string>("");
//   const [pdfUrl, setPdfUrl] = useState<string>("");

//   const auth = getAuth();

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     const MAX_SIZE = 1024 * 1024; // 1MB
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください");
//       return;
//     }

//     try {
//       const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setMarkdown((prev) => prev + `![${file.name}](${url})\n`);
//     } catch (err) {
//       console.error(err);
//       alert("画像アップロードに失敗しました");
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   // const handlePdfDelete = async () => {
//   //   const targetUrl = pdfUrl || responseData?.data.pdf_url;
//   //   if (!targetUrl) return;

//   //   try {
//   //     const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
//   //     const storageRef = ref(storage, path);
//   //     await deleteObject(storageRef);

//   //     // state統一
//   //     setPdfUrl("");
//   //     setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);
//   //     setMarkdown(prev => prev.replace(new RegExp(`\\[.*?\\.pdf\\]\\(${targetUrl}\\)`, 'g'), ''));

//   //     alert("PDFを削除しました");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("PDF削除に失敗しました");
//   //   }
//   // };

//   const handlePdfDelete = async () => {
//     const targetUrl = pdfUrl || responseData?.data.pdf_url;
//     if (!targetUrl) return;

//     try {
//       const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);

//       // Firebase Storage 削除後に DB 更新用API呼び出し
//       if (contentId && currentUser) {
//         const idToken = await currentUser.getIdToken();
//         await fetch(`${API_BASE_URL}/delete_pdf`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id: contentId, idToken }),
//         });
//       }

//       // state更新
//       setPdfUrl("");
//       setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);
//       setMarkdown(prev => prev.replace(new RegExp(`\\[.*?\\.pdf\\]\\(${targetUrl}\\)`, 'g'), ''));

//       alert("PDFを削除しました");
//     } catch (err) {
//       console.error(err);
//       alert("PDF削除に失敗しました");
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return () => unsubscribe();
//   }, [auth]);

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

//   const fetchData = async (id: number) => {
//     if (!currentUser) return;
//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });
//       if (!res.ok) throw new Error("Fetch エラー");

//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//       setPdfUrl(data.data.pdf_url ?? "");
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentParts = parseContent(isEditing ? markdown : responseData.data.content ?? "");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
//           スクールトピック
//           {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
//             <button
//               onClick={() => {
//                 setContentName(responseData.data.group_contents_name);
//                 setMarkdown(responseData.data.content ?? "");
//                 setPdfUrl(responseData.data.pdf_url ?? "");
//                 setIsEditing(true);
//               }}
//               className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition"
//             >
//               編集
//             </button>
//           )}
//         </h2>

//         {isEditing && (
//           <>
//             <input
//               type="text"
//               value={contentName}
//               onChange={(e) => setContentName(e.target.value)}
//               className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="コンテンツ名"
//             />
//             <textarea
//               value={markdown}
//               onChange={(e) => setMarkdown(e.target.value)}
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               className="w-full h-48 mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
//               placeholder="Markdown本文を入力…（画像をドラッグ＆ドロップ可能）"
//             />

//             {/* {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <div className="flex gap-2">
//                   <a
//                     href={pdfUrl || responseData.data.pdf_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                   >
//                     ダウンロード
//                   </a>
//                   <button
//                     onClick={handlePdfDelete}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     削除
//                   </button>
//                 </div>
//               </div>
//             )} */}

//             {pdfUrl && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <div className="flex gap-2">
//                   <a
//                     href={pdfUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                   >
//                     ダウンロード
//                   </a>
//                   <button
//                     onClick={handlePdfDelete}
//                     className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     削除
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-4">
//               <button
//                 onClick={async () => {
//                   if (!contentId || !currentUser) return;
//                   try {
//                     const idToken = await currentUser.getIdToken();
//                     const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({
//                         id: contentId,
//                         group_contents_name: contentName,
//                         content: markdown,
//                         pdf_url: pdfUrl,
//                         idToken,
//                       }),
//                     });
//                     if (!res.ok) throw new Error("更新に失敗しました");

//                     const data: ApiResponse = await res.json();
//                     setResponseData(data);
//                     setIsEditing(false);
//                   } catch (err) {
//                     console.error(err);
//                     alert("更新に失敗しました");
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
//               >
//                 更新
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
//               >
//                 キャンセル
//               </button>
//             </div>
//           </>
//         )}

//         {!isEditing && (
//           <>
//             {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//                 <span className="text-2xl">📄</span>
//                 <span className="flex-1 text-blue-700">PDFファイル</span>
//                 <a
//                   href={pdfUrl || responseData.data.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             )}

//             <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   img: ({ node, ...props }) => (
//                     <img
//                       {...props}
//                       style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }}
//                       alt=""
//                     />
//                   ),
//                   a: ({ node, ...props }) => {
//                     if (props.href?.endsWith(".pdf")) {
//                       const name = React.Children.toArray(props.children)[0]?.toString() || "PDFファイル";
//                       return (
//                         <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
//                           <span className="text-2xl">📄</span>
//                           <span className="flex-1 text-blue-700">{name}</span>
//                           <a
//                             href={props.href}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
//                           >
//                             ダウンロード
//                           </a>
//                         </div>
//                       );
//                     }
//                     return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />;
//                   },
//                 }}
//               >
//                 {responseData.data.content ?? ""}
//               </ReactMarkdown>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }













// "use client";

// import React from "react";
// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp } from "firebase/app";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// /* ================================
//    Firebase 初期化
// ================================ */
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const storage = getStorage(app);

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

// const parseContent = (text?: string) => {
//   if (!text) return [];

//   const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
//   const regex = /!\[(.*?)\]\((\S+?)\)|\[(.*?)\.pdf\]\((\S+?)\)/gi;
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
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集モード管理
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [contentName, setContentName] = useState<string>("");
//   const [markdown, setMarkdown] = useState<string>("");
//   const [images, setImages] = useState<{ name: string; url: string }[]>([]);
//   const [pdfUrl, setPdfUrl] = useState<string>("");
//   const [uploadingImage, setUploadingImage] = useState<boolean>(false);
//   const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

//   const auth = getAuth();

//   const uploadImageFile = async (file: File) => {
//     const MAX_SIZE = 1024 * 1024; // 1MB
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください");
//       return;
//     }

//     setUploadingImage(true);
//     try {
//       const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setImages((prev) => [...prev, { name: file.name, url }]);
//     } catch (err) {
//       console.error("画像アップロードエラー:", err);
//       alert("画像のアップロードに失敗しました");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

//     const file = e.dataTransfer.files[0];
//     await uploadImageFile(file);
//   };

//   const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     await uploadImageFile(e.target.files[0]);
//   };

//   const handleImageDelete = async (image: { name: string; url: string }) => {
//     if (!confirm("この画像を削除してもよろしいですか？")) return;
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

//   const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   // 削除ボタン用ハンドラー
//   // const handleDelete = async () => {
//   //   if (!contentId || !currentUser) return;

//   //   if (!confirm("本当にこのグループコンテンツを削除しますか？")) return;

//   //   try {
//   //     const idToken = await currentUser.getIdToken();
//   //     const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
//   //       method: "DELETE",
//   //       headers: {
//   //         "Authorization": `Bearer ${idToken}`,
//   //       },
//   //     });

//   //     if (!res.ok) throw new Error("削除に失敗しました");

//   //     alert("グループコンテンツを削除しました");
//   //     // 削除後にリダイレクトや一覧に戻る処理
//   //     window.location.href = "/schools"; // 適宜戻るURLに変更
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("削除に失敗しました");
//   //   }
//   // };

//   const handlePdfDelete = async () => {
//     const targetUrl = pdfUrl || responseData?.data.pdf_url;
//     if (!targetUrl) return;

//     try {
//       const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);

//       // state更新
//       setPdfUrl("");
//       setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);
//       setMarkdown(prev => prev.replace(new RegExp(`\\[.*?\\.pdf\\]\\(${targetUrl}\\)`, 'g'), ''));

//       alert("PDFを削除しました");
//     } catch (err) {
//       console.error(err);
//       alert("PDF削除に失敗しました");
//     }
//   };

//     const handleDelete = async () => {
//     if (!contentId || !currentUser) return;

//     if (!confirm("本当にこのグループコンテンツを削除しますか？")) return;

//     try {
//       const idToken = await currentUser.getIdToken();

//       // ① PDFが存在する場合はStorageから削除
//       if (pdfUrl) {
//         try {
//           const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
//           const storageRef = ref(storage, path);
//           await deleteObject(storageRef);

//           // DB側も pdf_url を空にする
//           await fetch(`${API_BASE_URL}/delete_pdf`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id: contentId, idToken }),
//           });

//           console.log("PDFを削除しました");
//         } catch (err) {
//           console.error("PDF削除に失敗:", err);
//           alert("PDF削除に失敗しましたが、コンテンツ自体は削除します");
//         }
//       }

//       // ② グループコンテンツ自体を削除
//       const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${idToken}`,
//         },
//       });

//       if (!res.ok) throw new Error("グループコンテンツ削除に失敗しました");

//       alert("グループコンテンツを削除しました");
//       window.location.href = "/schools"; // 適宜一覧ページに戻す
//     } catch (err) {
//       console.error(err);
//       alert("削除に失敗しました");
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
//     return () => unsubscribe();
//   }, [auth]);

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

//   const fetchData = async (id: number) => {
//     if (!currentUser) return;
//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });
//       if (!res.ok) throw new Error("Fetch エラー");

//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//       setPdfUrl(data.data.pdf_url ?? "");
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   if (!responseData) return <p>データを取得中…</p>;

//   const contentParts = parseContent(isEditing ? markdown : responseData.data.content ?? "");


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">

//         {/* タイトル + 操作 */}
//         <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
//           スクールトピック

//           {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
//             <div>
//               <button
//                 onClick={() => {
//                   setContentName(responseData.data.group_contents_name);
//                   setMarkdown(responseData.data.content ?? "");
//                   setPdfUrl(responseData.data.pdf_url ?? "");
//                   setIsEditing(true);
//                 }}
//                 className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition"
//               >
//                 編集
//               </button>

//               <button
//                 onClick={handleDelete}
//                 className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
//               >
//                 削除
//               </button>
//             </div>
//           )}
//         </h2>

//         {/* コンテンツ名 */}
//         <div className="mb-4">
//           <h3 className="text-blue-700 font-semibold mb-1">コンテンツ名</h3>

//           {isEditing ? (
//             <input
//               type="text"
//               value={contentName}
//               onChange={(e) => setContentName(e.target.value)}
//               className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           ) : (
//             <div className="text-blue-800 font-medium">
//               {responseData.data.group_contents_name}
//             </div>
//           )}
//         </div>

//         {/* PDF（表示モード） */}
//         {!isEditing && pdfUrl && (
//           <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
//             <span className="text-2xl">📄</span>
//             <span className="flex-1 text-blue-700">PDFファイル</span>
//             <a
//               href={pdfUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               ダウンロード
//             </a>
//           </div>
//         )}

//         {/* 編集エリア + プレビュー */}
//         {isEditing && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

//             {/* 編集 */}
//             <div>
//               <textarea
//                 value={markdown}
//                 onChange={(e) => setMarkdown(e.target.value)}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 className="w-full h-96 p-3 border border-blue-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Markdown本文を入力（画像ドラッグ可）"
//               />
//             </div>

//             {/* プレビュー */}
//             <div className="h-96 overflow-auto border border-blue-200 p-3 rounded-lg bg-blue-50">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   img: ({ ...props }) => (
//                     <img
//                       {...props}
//                       style={{
//                         maxWidth: "100%",
//                         margin: "8px 0",
//                         borderRadius: "6px",
//                         border: "1px solid #cbd5e1",
//                       }}
//                     />
//                   ),
//                   a: ({ ...props }) => {
//                     if (props.href?.endsWith(".pdf")) {
//                       const name =
//                         React.Children.toArray(props.children)[0]?.toString() ||
//                         "PDFファイル";

//                       return (
//                         <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
//                           <span className="text-2xl">📄</span>
//                           <span className="flex-1 text-blue-700">{name}</span>
//                           <a
//                             href={props.href}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-2 py-1 bg-blue-600 text-white rounded-lg text-sm"
//                           >
//                             ダウンロード
//                           </a>
//                         </div>
//                       );
//                     }

//                     return (
//                       <a
//                         {...props}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:underline"
//                       />
//                     );
//                   },
//                 }}
//               >
//                 {markdown}
//               </ReactMarkdown>
//             </div>
//           </div>
//         )}

//         {/* 更新ボタン */}
//         {isEditing && (
//           <div className="flex gap-4 mb-6">
//             <button
//               onClick={async () => {
//                 if (!contentId || !currentUser) return;

//                 const idToken = await currentUser.getIdToken();

//                 const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({
//                     id: contentId,
//                     group_contents_name: contentName,
//                     content: markdown,
//                     pdf_url: pdfUrl,
//                     idToken,
//                   }),
//                 });

//                 if (!res.ok) {
//                   alert("更新失敗");
//                   return;
//                 }

//                 const data: ApiResponse = await res.json();
//                 setResponseData(data);
//                 setIsEditing(false);
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               更新
//             </button>

//             <button
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
//             >
//               キャンセル
//             </button>
//           </div>
//         )}

//         {/* 表示モード本文 */}
//         {!isEditing && (
//           <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]}
//               components={{
//                 img: ({ ...props }) => (
//                   <img
//                     {...props}
//                     style={{
//                       maxWidth: "100%",
//                       margin: "8px 0",
//                       borderRadius: "6px",
//                       border: "1px solid #cbd5e1",
//                     }}
//                   />
//                 ),
//                 a: ({ ...props }) => {
//                   if (props.href?.endsWith(".pdf")) {
//                     const name =
//                       React.Children.toArray(props.children)[0]?.toString() ||
//                       "PDFファイル";

//                     return (
//                       <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
//                         <span className="text-2xl">📄</span>
//                         <span className="flex-1 text-blue-700">{name}</span>
//                         <a
//                           href={props.href}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="px-2 py-1 bg-blue-600 text-white rounded-lg text-sm"
//                         >
//                           ダウンロード
//                         </a>
//                       </div>
//                     );
//                   }

//                   return (
//                     <a
//                       {...props}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     />
//                   );
//                 },
//               }}
//             >
//               {responseData.data.content ?? ""}
//             </ReactMarkdown>
//           </div>
//         )}

//       </div>
//     </div>
//   );

// }













// "use client";
// import React, { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getApps, initializeApp, getApp } from "firebase/app";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { firebaseConfig } from "../../firebaseconfig/firebase";
// import { API_BASE_URL } from "../../api/api";

// // Firebase 初期化 (重複を避ける)
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const storage = getStorage(app);

// // 型定義
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

// type UploadedImage = {
//   name: string;
//   url: string;
// };

// export default function SchoolsPage() {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [contentId, setContentId] = useState<number | null>(null);
//   const [responseData, setResponseData] = useState<ApiResponse | null>(null);

//   // 編集モード管理
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [contentName, setContentName] = useState<string>("");
  
//   // 完全分離したステート（テキスト、画像配列、PDF）
//   const [markdown, setMarkdown] = useState<string>("");
//   const [images, setImages] = useState<UploadedImage[]>([]);
//   const [pdfUrl, setPdfUrl] = useState<string>("");

//   // ローディング状態
//   const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

//   const auth = getAuth(app);

//   // ==========================
//   // 1. Firebase 認証・データ取得
//   // ==========================
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, [auth]);

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

//   const fetchData = async (id: number) => {
//     if (!currentUser) return;
//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: id, idToken }),
//       });
//       if (!res.ok) throw new Error("Fetch エラー");
//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//     } catch (err: any) {
//       console.error("Fetch エラー:", err.message);
//     }
//   };

//   // ==========================
//   // 2. 画像のアップロードと削除
//   // ==========================
//   const handleImageUpload = async (file: File) => {
//     const MAX_SIZE = 1024 * 1024; // 1MB
//     if (file.size > MAX_SIZE) {
//       alert("画像は1MB以下にしてください。");
//       return;
//     }
//     const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
//     try {
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       // Markdownテキストには追記せず、画像リストとして保存
//       setImages((prev) => [...prev, { name: file.name, url }]);
//     } catch (err) {
//       console.error("画像アップロードエラー:", err);
//       alert("アップロードに失敗しました。");
//     }
//   };

//   const handleImageDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
//     await handleImageUpload(e.dataTransfer.files[0]);
//   };

//   const handleImageDelete = async (imageToDelete: UploadedImage) => {
//     if (!confirm("この画像を削除してもよろしいですか?")) return;
//     try {
//       const path = decodeURIComponent(imageToDelete.url.split("/o/")[1].split("?")[0]);
//       const storageRef = ref(storage, path);
//       await deleteObject(storageRef);
//       setImages((prev) => prev.filter((img) => img.url !== imageToDelete.url));
//     } catch (err) {
//       console.error("画像削除エラー:", err);
//       alert("画像の削除に失敗しました");
//     }
//   };

//   // ==========================
//   // 3. PDFのアップロードと削除
//   // ==========================
//   const handlePdfUpload = async (file: File) => {
//     if (file.type !== "application/pdf") {
//       alert("PDFファイルのみアップロード可能です。");
//       return;
//     }
//     if (pdfUrl) {
//       alert("すでにPDFがアップロードされています。削除してから再アップロードしてください。");
//       return;
//     }
//     const MAX_SIZE = 10 * 1024 * 1024; // 10MB
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
//       alert("PDFアップロード成功!");
//     } catch (err) {
//       console.error(err);
//       alert("PDFアップロードに失敗しました");
//     } finally {
//       setUploadingPdf(false);
//     }
//   };

//   const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     await handlePdfUpload(e.target.files[0]);
//   };

//   const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
//     await handlePdfUpload(e.dataTransfer.files[0]);
//   };

//   const handlePdfDelete = async () => {
//     if (!pdfUrl) return;
//     if (!confirm("PDFを削除してもよろしいですか？")) return;
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

//   // ==========================
//   // 4. モード切替・保存・削除 (DB連携)
//   // ==========================
//   const enterEditMode = () => {
//     setContentName(responseData?.data.group_contents_name ?? "");
//     setPdfUrl(responseData?.data.pdf_url ?? "");
    
//     // DBのJSON文字列を解析して「テキスト」と「画像」に分離
//     const rawContent = responseData?.data.content ?? "";
//     try {
//       const parsed = JSON.parse(rawContent);
//       setMarkdown(parsed.text || "");
//       setImages(parsed.images || []);
//     } catch (e) {
//       // 過去のデータ(ただのテキスト)の場合のフォールバック
//       setMarkdown(rawContent);
//       setImages([]);
//     }
//     setIsEditing(true);
//   };

//   const handleSave = async () => {
//     if (!contentId || !currentUser) return;
//     try {
//       const idToken = await currentUser.getIdToken();
//       // テキストと画像を分離したまま一つのJSON文字列として保存
//       const payloadContent = JSON.stringify({
//         text: markdown,
//         images: images,
//       });

//       const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: contentId,
//           group_contents_name: contentName,
//           content: payloadContent, // JSON文字列として送信
//           pdf_url: pdfUrl,
//           idToken,
//         }),
//       });

//       if (!res.ok) throw new Error("更新に失敗しました");
//       const data: ApiResponse = await res.json();
//       setResponseData(data);
//       setIsEditing(false);
//       alert("コンテンツを更新しました");
//     } catch (err) {
//       console.error(err);
//       alert("更新に失敗しました");
//     }
//   };

//   const handleDelete = async () => {
//     if (!contentId || !currentUser) return;
//     if (!confirm("本当にこのグループコンテンツを削除しますか?")) return;
//     try {
//       const idToken = await currentUser.getIdToken();

//       // ① PDFが存在する場合はStorageから削除
//       if (pdfUrl || responseData?.data.pdf_url) {
//         try {
//           const targetUrl = pdfUrl || responseData?.data.pdf_url || "";
//           const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
//           const storageRef = ref(storage, path);
//           await deleteObject(storageRef);
//           await fetch(`${API_BASE_URL}/delete_pdf`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id: contentId, idToken }),
//           });
//         } catch (err) {
//           console.error("PDF削除に失敗:", err);
//         }
//       }

//       // ② グループコンテンツ自体を削除
//       const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
//         method: "DELETE",
//         headers: { "Authorization": `Bearer ${idToken}` },
//       });
//       if (!res.ok) throw new Error("グループコンテンツ削除に失敗しました");
      
//       alert("グループコンテンツを削除しました");
//       window.location.href = "/schools";
//     } catch (err) {
//       console.error(err);
//       alert("削除に失敗しました");
//     }
//   };

//   // ==========================
//   // 5. 表示データの準備 (自動合成)
//   // ==========================
//   let displayMarkdown = "";
//   let displayImages: UploadedImage[] = [];
//   const rawDataContent = responseData?.data.content ?? "";
  
//   if (isEditing) {
//     displayMarkdown = markdown;
//     displayImages = images;
//   } else {
//     try {
//       const parsed = JSON.parse(rawDataContent);
//       displayMarkdown = parsed.text || "";
//       displayImages = parsed.images || [];
//     } catch (e) {
//       displayMarkdown = rawDataContent;
//     }
//   }

//   // プレビュー用に本文の下に画像をマークダウン形式で追加して合成
//   const syntheticMarkdown = displayImages.length > 0 
//     ? `${displayMarkdown}\n\n${displayImages.map(img => `![${img.name}](${img.url})`).join('\n')}`
//     : displayMarkdown;


//   if (!responseData) return <p className="text-center p-6 text-gray-600">データを取得中...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
//       <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        
//         {/* ヘッダーエリア */}
//         <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
//           スクールトピック詳細
//           {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
//             <div>
//               <button
//                 onClick={enterEditMode}
//                 className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
//               >
//                 編集
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
//               >
//                 削除
//               </button>
//             </div>
//           )}
//         </h2>

//         {isEditing ? (
//           // ==============================
//           // 編集モード UI
//           // ==============================
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-blue-700 font-semibold mb-2">コンテンツ名</h3>
//               <input
//                 type="text"
//                 value={contentName}
//                 onChange={(e) => setContentName(e.target.value)}
//                 className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="コンテンツ名"
//               />
//             </div>

//             <div>
//               <h3 className="text-blue-700 font-semibold mb-2">本文 (Markdown)</h3>
//               <textarea
//                 value={markdown}
//                 onChange={(e) => setMarkdown(e.target.value)}
//                 onDrop={handleImageDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 placeholder="ここにテキストを書いてください (画像をドラッグ＆ドロップすると下のギャラリーに追加されます)"
//                 className="w-full h-48 p-3 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* 画像ギャラリー・個別削除エリア */}
//             <div>
//               <h3 className="text-blue-800 font-semibold mb-2">添付画像</h3>
//               {images.length > 0 ? (
//                 <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {images.map((img) => (
//                     <div key={img.url} className="relative group border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
//                       <img src={img.url} alt={img.name} className="w-full h-32 object-cover" />
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => handleImageDelete(img)}
//                           className="px-3 py-1 bg-red-500 text-white rounded text-sm font-semibold"
//                         >
//                           削除
//                         </button>
//                       </div>
//                       <div className="p-2 truncate text-xs text-center text-gray-600 bg-gray-50">{img.name}</div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">添付された画像はありません。</p>
//               )}
//             </div>

//             {/* PDF アップロードエリア (新しいUI) */}
//             <div>
//               <h3 className="text-blue-800 font-semibold mb-2">PDF添付</h3>
//               <div
//                 onDrop={handlePdfDrop}
//                 onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
//                 className="p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
//               >
//                 {!pdfUrl ? (
//                   <>
//                     <p className="text-blue-700 mb-3">PDFファイルをドラッグ＆ドロップ</p>
//                     <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
//                       {uploadingPdf ? "アップロード中..." : "ファイル選択"}
//                       <input
//                         type="file"
//                         accept="application/pdf"
//                         style={{ display: "none" }}
//                         onChange={handlePdfSelect}
//                         disabled={uploadingPdf}
//                       />
//                     </label>
//                   </>
//                 ) : (
//                   <div className="flex flex-col items-center gap-3">
//                     <span className="text-blue-800 font-semibold">✅ 1件のPDFがアップロードされています</span>
//                     <div className="flex gap-4">
//                       <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow">
//                         中身を確認
//                       </a>
//                       <button onClick={handlePdfDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm shadow">
//                         削除して再アップロード
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* アクションボタン */}
//             <div className="flex gap-4 pt-4 border-t border-gray-200">
//               <button onClick={handleSave} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition">
//                 更新を保存
//               </button>
//               <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow transition">
//                 キャンセル
//               </button>
//             </div>

//             {/* プレビューエリア */}
//             <div className="mt-8 border border-blue-200 p-6 rounded-lg bg-blue-50">
//               <h3 className="text-blue-800 font-semibold border-b border-blue-200 pb-2 mb-4">プレビュー</h3>
//               <div className="prose max-w-none">
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={{
//                     img: ({ node, ...props }) => (
//                       <img {...props} style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }} alt="" />
//                     ),
//                   }}
//                 >
//                   {syntheticMarkdown}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // ==============================
//           // 表示モード UI
//           // ==============================
//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3">
//               {responseData.data.group_contents_name}
//             </h3>
            
//             {/* PDF ダウンロードボタン */}
//             {(pdfUrl || responseData.data.pdf_url) && (
//               <div className="flex items-center justify-between gap-4 p-4 border border-blue-300 bg-blue-50 rounded-lg shadow-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl">📄</span>
//                   <span className="font-semibold text-blue-800">添付資料 (PDF)</span>
//                 </div>
//                 <a
//                   href={pdfUrl || responseData.data.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
//                 >
//                   ダウンロード
//                 </a>
//               </div>
//             )}

//             {/* マークダウン・画像表示エリア */}
//             <div className="border border-blue-200 p-6 rounded-lg bg-blue-50 prose max-w-none shadow-sm min-h-[300px]">
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   img: ({ node, ...props }) => (
//                     <img {...props} style={{ maxWidth: "100%", margin: "16px 0", borderRadius: "8px", border: "1px solid #cbd5e1" }} alt="" />
//                   ),
//                   a: ({ node, ...props }) => {
//                     return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold" />;
//                   }
//                 }}
//               >
//                 {syntheticMarkdown}
//               </ReactMarkdown>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

// Firebase 初期化
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

// 型定義
type GroupContent = {
  id: number;
  user_id: number;
  school_id: number;
  group_id: number;
  group_contents_name: string;
  content: string; // 単純なマークダウン文字列として保存
  pdf_url: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  message: string;
  data: GroupContent;
  current_user?: { id: number };
};

export default function SchoolsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  // 編集モード管理
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contentName, setContentName] = useState<string>("");
  
  // テキストとPDFのステート
  const [markdown, setMarkdown] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  // ローディング状態
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);

  const auth = getAuth(app);

  // ==========================
  // 1. Firebase 認証・データ取得
  // ==========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

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

  const fetchData = async (id: number) => {
    if (!currentUser) return;
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/see_groupcontent`, {
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

  // ==========================
  // 2. 画像のアップロード (マークダウンの先頭に追加)
  // ==========================
  const handleImageDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const file = e.dataTransfer.files[0];
    const MAX_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      alert("画像は1MB以下にしてください。");
      return;
    }

    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      // マークダウンの一番上に画像URLを挿入する
      setMarkdown((prev) => `![${file.name}](${url})\n\n${prev}`);
    } catch (err) {
      console.error("画像アップロードエラー:", err);
      alert("アップロードに失敗しました。");
    }
  };

  // ==========================
  // 3. PDFのアップロードと削除
  // ==========================
  const handlePdfUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("PDFファイルのみアップロード可能です。");
      return;
    }
    if (pdfUrl) {
      alert("すでにPDFがアップロードされています。削除してから再アップロードしてください。");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
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
      alert("PDFアップロード成功!");
    } catch (err) {
      console.error(err);
      alert("PDFアップロードに失敗しました");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await handlePdfUpload(e.target.files[0]);
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    await handlePdfUpload(e.dataTransfer.files[0]);
  };

  const handlePdfDelete = async () => {
    if (!pdfUrl) return;
    if (!confirm("PDFを削除してもよろしいですか？")) return;
    
    try {
      // ① Firebase Storageから削除
      if (pdfUrl.includes("/o/")) {
        const path = decodeURIComponent(pdfUrl.split("/o/")[1].split("?")[0]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      }

      // ② DBからも直ちに削除する（キャンセルしてもリンク切れが発生しないように）
      if (contentId && currentUser) {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE_URL}/delete_pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: contentId, idToken }),
        });
      }

      // ③ ローカルのステートを完全にクリアする（表示・編集の両方から消すため）
      setPdfUrl("");
      if (responseData) {
        setResponseData({
          ...responseData,
          data: {
            ...responseData.data,
            pdf_url: "", // 表示モードのステートも空にする
          },
        });
      }

      alert("PDFを削除しました");
    } catch (err) {
      console.error("PDFの削除エラー:", err);
      // ストレージにファイルがないなどのエラー時も強制的に画面からは消す
      setPdfUrl("");
      if (responseData) {
        setResponseData({
          ...responseData,
          data: { ...responseData.data, pdf_url: "" },
        });
      }
    }
  };

  // ==========================
  // 4. モード切替・保存・削除 (DB連携)
  // ==========================
  const enterEditMode = () => {
    setContentName(responseData?.data.group_contents_name ?? "");
    setPdfUrl(responseData?.data.pdf_url ?? "");
    setMarkdown(responseData?.data.content ?? "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!contentId || !currentUser) return;
    try {
      const idToken = await currentUser.getIdToken();

      const res = await fetch(`${API_BASE_URL}/editSchoolContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: contentId,
          group_contents_name: contentName,
          content: markdown, 
          pdf_url: pdfUrl,
          idToken,
        }),
      });

      if (!res.ok) throw new Error("更新に失敗しました");
      const data: ApiResponse = await res.json();
      setResponseData(data);
      setIsEditing(false);
      alert("コンテンツを更新しました");
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!contentId || !currentUser) return;
    if (!confirm("本当にこのグループコンテンツを削除しますか?")) return;
    try {
      const idToken = await currentUser.getIdToken();

      if (responseData?.data.pdf_url) {
        try {
          const targetUrl = responseData.data.pdf_url;
          if (targetUrl.includes("/o/")) {
            const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
          }
          await fetch(`${API_BASE_URL}/delete_pdf`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: contentId, idToken }),
          });
        } catch (err) {
          console.error("PDF削除に失敗:", err);
        }
      }

      const res = await fetch(`${API_BASE_URL}/group_contents/${contentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("グループコンテンツ削除に失敗しました");
      
      alert("グループコンテンツを削除しました");
      window.location.href = "/schools";
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  // 編集キャンセル時にステートを元に戻す処理
  const handleCancelEdit = () => {
    setIsEditing(false);
    setMarkdown(responseData?.data.content ?? "");
    setPdfUrl(responseData?.data.pdf_url ?? "");
    setContentName(responseData?.data.group_contents_name ?? "");
  };

  if (!responseData) return <p className="text-center p-6 text-gray-600">データを取得中...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
      <div className={`w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 ${isEditing ? "max-w-6xl" : "max-w-4xl"}`}>
        
        {/* ヘッダーエリア */}
        <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
          {isEditing ? "コンテンツを編集" : "スクールトピック詳細"}
          {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
            <div>
              <button
                onClick={enterEditMode}
                className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-semibold shadow"
              >
                削除
              </button>
            </div>
          )}
        </h2>

        {isEditing ? (
          // ==============================
          // 編集モード UI (2カラムレイアウト)
          // ==============================
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 左カラム：入力・操作エリア */}
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-blue-700 font-semibold mb-2">コンテンツ名</h3>
                <input
                  type="text"
                  value={contentName}
                  onChange={(e) => setContentName(e.target.value)}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="コンテンツ名"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-blue-700 font-semibold mb-2">本文 (Markdown)</h3>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  onDrop={handleImageDrop}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  placeholder="ここにテキストを書いてください (画像をドラッグ＆ドロップすると一番上にURLが追加されます)"
                  className="w-full flex-1 min-h-[300px] p-3 border border-blue-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* PDF アップロードエリア */}
              <div>
                <h3 className="text-blue-800 font-semibold mb-2">PDF添付</h3>
                <div
                  onDrop={handlePdfDrop}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="p-6 text-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
                >
                  {/* !pdfUrl で判定しているため、削除されると直ちにこのエリアに戻ります */}
                  {!pdfUrl ? (
                    <>
                      <p className="text-blue-700 mb-3">PDFファイルをドラッグ＆ドロップ</p>
                      <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
                        {uploadingPdf ? "アップロード中..." : "ファイル選択"}
                        <input
                          type="file"
                          accept="application/pdf"
                          style={{ display: "none" }}
                          onChange={handlePdfSelect}
                          disabled={uploadingPdf}
                        />
                      </label>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-blue-800 font-semibold">✅ 1件のPDFが添付されています</span>
                      <div className="flex gap-4">
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm shadow transition">
                          中身を確認
                        </a>
                        <button onClick={handlePdfDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow transition">
                          削除して再アップロード
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition">
                  更新を保存
                </button>
                <button onClick={handleCancelEdit} className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg shadow transition">
                  キャンセル
                </button>
              </div>
            </div>

            {/* 右カラム：リアルタイムプレビューエリア */}
            <div className="flex flex-col h-full max-h-[800px]">
              <h3 className="text-blue-800 font-semibold mb-2">プレビュー</h3>
              <div className="flex-1 border border-blue-200 p-6 rounded-lg bg-blue-50 overflow-y-auto prose max-w-none shadow-inner">
                {markdown ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ node, ...props }) => (
                        <img {...props} style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }} alt="" />
                      ),
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                      )
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 text-sm">プレビューがここに表示されます...</p>
                )}
              </div>
            </div>

          </div>
        ) : (
          // ==============================
          // 表示モード UI
          // ==============================
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3">
              {responseData.data.group_contents_name}
            </h3>
            
            {/* PDF ダウンロードボタン (DBデータにURLが存在する時のみ表示) */}
            {responseData.data.pdf_url && (
              <div className="flex items-center justify-between gap-4 p-4 border border-blue-300 bg-blue-50 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <span className="font-semibold text-blue-800">添付資料 (PDF)</span>
                </div>
                <a
                  href={responseData.data.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
                >
                  ダウンロード
                </a>
              </div>
            )}

            {/* マークダウン表示エリア */}
            <div className="border border-blue-200 p-6 rounded-lg bg-blue-50 prose max-w-none shadow-sm min-h-[300px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} style={{ maxWidth: "100%", margin: "16px 0", borderRadius: "8px", border: "1px solid #cbd5e1" }} alt="" />
                  ),
                  a: ({ node, ...props }) => {
                    return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold" />;
                  }
                }}
              >
                {responseData.data.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}