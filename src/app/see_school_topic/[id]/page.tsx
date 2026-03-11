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













"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

/* ================================
   Firebase 初期化
================================ */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

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

const parseContent = (text?: string) => {
  if (!text) return [];

  const parts: { type: "text" | "image" | "pdf"; content: string; name?: string }[] = [];
  const regex = /!\[(.*?)\]\((\S+?)\)|\[(.*?)\.pdf\]\((\S+?)\)/gi;
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
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const auth = getAuth();

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    const MAX_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      alert("画像は1MB以下にしてください");
      return;
    }

    try {
      const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setMarkdown((prev) => prev + `![${file.name}](${url})\n`);
    } catch (err) {
      console.error(err);
      alert("画像アップロードに失敗しました");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePdfDelete = async () => {
    const targetUrl = pdfUrl || responseData?.data.pdf_url;
    if (!targetUrl || !contentId || !currentUser) return;

    try {
      const path = decodeURIComponent(targetUrl.split("/o/")[1].split("?")[0]);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);

      // Firebase Storage 削除後に DB 更新用API呼び出し
      const idToken = await currentUser.getIdToken();
      await fetch(`${API_BASE_URL}/delete_pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contentId, idToken }),
      });

      // state更新
      setPdfUrl("");
      setResponseData(prev => prev ? { ...prev, data: { ...prev.data, pdf_url: "" } } : null);
      setMarkdown(prev => prev.replace(new RegExp(`\\[.*?\\.pdf\\]\\(${targetUrl}\\)`, 'g'), ''));

      alert("PDFを削除しました");
    } catch (err) {
      console.error(err);
      alert("PDF削除に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
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
      setPdfUrl(data.data.pdf_url ?? "");
    } catch (err: any) {
      console.error("Fetch エラー:", err.message);
    }
  };

  if (!responseData) return <p>データを取得中…</p>;

  const contentParts = parseContent(isEditing ? markdown : responseData.data.content ?? "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex justify-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="flex items-center justify-between text-2xl font-bold text-blue-800 mb-6">
          スクールトピックですよ
          {responseData.current_user?.id === responseData.data.user_id && !isEditing && (
            <button
              onClick={() => {
                setContentName(responseData.data.group_contents_name);
                setMarkdown(responseData.data.content ?? "");
                setPdfUrl(responseData.data.pdf_url ?? "");
                setIsEditing(true);
              }}
              className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition"
            >
              編集
            </button>
          )}
        </h2>

        {isEditing && (
          <>
            <input
              type="text"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="コンテンツ名"
            />
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full h-48 mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Markdown本文を入力…（画像をドラッグ＆ドロップ可能）"
            />

            {pdfUrl && (
              <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
                <span className="text-2xl">📄</span>
                <span className="flex-1 text-blue-700">PDFファイル</span>
                <div className="flex gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    ダウンロード
                  </a>
                  <button
                    onClick={handlePdfDelete}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={async () => {
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
                  } catch (err) {
                    console.error(err);
                    alert("更新に失敗しました");
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                更新
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
              >
                キャンセル
              </button>
            </div>
          </>
        )}

        {!isEditing && pdfUrl && (
          <div className="flex items-center justify-between gap-2 p-4 mb-4 border border-blue-300 bg-blue-50 rounded-lg">
            <span className="text-2xl">📄</span>
            <span className="flex-1 text-blue-700">PDFファイル</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              ダウンロード
            </a>
          </div>
        )}

        <div className="border border-blue-200 p-4 rounded-lg bg-blue-50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ maxWidth: "100%", margin: "8px 0", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  alt=""
                />
              ),
              a: ({ node, ...props }) => {
                if (props.href?.endsWith(".pdf")) {
                  const name = React.Children.toArray(props.children)[0]?.toString() || "PDFファイル";
                  return (
                    <div className="flex items-center gap-2 p-3 mb-3 border border-blue-300 bg-blue-100 rounded-lg">
                      <span className="text-2xl">📄</span>
                      <span className="flex-1 text-blue-700">{name}</span>
                      <a
                        href={props.href}
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
            {responseData.data.content ?? ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}