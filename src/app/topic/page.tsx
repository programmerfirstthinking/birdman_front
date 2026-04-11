// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "../firebaseconfig/firebase"
// import { API_BASE_URL } from "../api/api";
// import useSWR from "swr";

// // const firebaseConfig = {
// //   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
// //   authDomain: "share-info-project.firebaseapp.com",
// //   projectId: "share-info-project",
// //   storageBucket: "share-info-project.firebasestorage.app",
// //   messagingSenderId: "10017220780",
// //   appId: "1:10017220780:web:4820d384929f2d84735709",
// //   measurementId: "G-42VYEZ51GF"
// // };
// initializeApp(firebaseConfig);

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// type Topic = {
//   ID: number;
//   Year: number;
//   UserID: number;
//   TopicName: string;
//   Content: string;
//   Activate: boolean;
//   Alert: boolean;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// const fetcher = (url: string) =>
//   fetch(url).then(res => res.json());

// export default function Main() {
//   const auth = getAuth();
//   const router = useRouter();

//   // const { data: schoolData, isLoading: loadingSchools } =
//   //   useSWR(`${API_BASE_URL}/getSchools`, fetcher);

//   // const schools = schoolData?.schools ?? [];

//   const [schools, setSchools] = useState<School[]>([]);
//   const [results, setResults] = useState<Topic[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);
//   const [loadingTopics, setLoadingTopics] = useState(true);

//   const [topicName, setTopicName] = useState("");
//   const [topicContent, setTopicContent] = useState("");
//   const [showCreateForm, setShowCreateForm] = useState(false);

//   // --- ページネーション用 ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;
//   const totalPages = Math.ceil(results.length / itemsPerPage);

//   const displayedTopics = results.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // --- 学校一覧取得 ---
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         // const res = await fetch("http://localhost:8080/getSchools");
//         const res = await fetch(`${API_BASE_URL}/getSchools`);
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data = await res.json();
//         setSchools(Array.isArray(data.schools) ? data.schools : []);
//       } catch (err) {
//         console.error("学校取得エラー:", err);
//         setSchools([]);
//       } finally {
//         setLoadingSchools(false);
//       }
//     };
//     fetchSchools();
//   }, []);

//   // --- トピック一覧取得 ---
//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         // const res = await fetch("http://localhost:8080/topics");
//         const res = await fetch(`${API_BASE_URL}/topics`);
//         if (!res.ok) throw new Error("トピック取得失敗");
//         const data = await res.json();
//         setResults(data.topics || []);
//       } catch (err) {
//         console.error("トピック取得エラー:", err);
//         setResults([]);
//       } finally {
//         setLoadingTopics(false);
//       }
//     };
//     fetchTopics();
//   }, []);

//   const road_to_topic = (id: string) => router.push('/topiccontents/' + id);
//   const road_to_school = (id: number) => router.push('/school_topic/' + id);

//   const sendinfo = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("ユーザー未ログイン");
//       const idToken = await user.getIdToken();

//       // const res = await fetch("http://localhost:8080/topiccontent", {
//       const res = await fetch(`${API_BASE_URL}/topiccontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: topicName, content: topicContent, token: idToken }),
//       });

//       if (!res.ok) throw new Error("トピック投稿失敗");
//       await res.json();
//       window.location.reload();
//     } catch (err) {
//       console.error("送信エラー:", err);
//     }
//   };

//   const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
//   const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">

// {/* <h1 className="w-screen text-3xl font-bold text-white text-center py-4 bg-blue-700 shadow-md">
//   Birdman_Web
// </h1> */}
//       <div className="max-w-7xl mx-auto flex gap-6">

//         {/* --- サイドバー: 学校一覧 --- */}
//         {/* <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6"> */}
//         {/* <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-[90vh] overflow-y-auto"> */}
//         <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-[90vh] overflow-y-auto hide-scrollbar">
//           <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
//           {loadingSchools ? (
//             <p className="text-center text-blue-600">読み込み中...</p>
//           ) : schools.length === 0 ? (
//             <p className="text-center text-blue-600">学校が登録されていません</p>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {schools.map(school => (
//                 <button
//                   key={school.ID}
//                   onClick={() => road_to_school(school.ID)}
//                   className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
//                 >
//                   <div className="text-xl font-semibold">{school.SchoolName}</div>
//                   <div className="text-sm text-blue-400 mt-1">
//                     作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </aside>

//         {/* --- メイン: トピック一覧 + 作成フォーム --- */}
//         <main className="flex-1 flex gap-6">

//           {/* --- 左側: トピック一覧 --- */}
//           <div className="flex-1 flex flex-col gap-10">

//             {/* --- トピック作成フォーム（表示/非表示） --- */}
//             {showCreateForm && (
//               <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto w-full">
//                 <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
//                 <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//                   <input
//                     type="text"
//                     placeholder="トピック名"
//                     value={topicName}
//                     onChange={e => setTopicName(e.target.value)}
//                     className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   />
//                   <textarea
//                     placeholder="内容"
//                     value={topicContent}
//                     onChange={e => setTopicContent(e.target.value)}
//                     className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//                   >
//                     投稿する
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* トピック一覧 */}
//             <div>
//               <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
//               {loadingTopics ? (
//                 <p className="text-center text-gray-500">読み込み中...</p>
//               ) : results.length === 0 ? (
//                 <p className="text-center text-gray-500">まだ投稿がありません</p>
//               ) : (
//                 <div className="flex flex-col gap-5">
//                   {displayedTopics.map(topic => (
//                     <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
//                       <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                         <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                         <p className="text-gray-700 mt-2 whitespace-pre-line">{topic.Content}</p>
//                         <div className="text-sm text-gray-400 mt-4">
//                           <div>作成者ID: {topic.UserID}</div>
//                           <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                         </div>
//                       </button>
//                     </div>
//                   ))}

//                   {/* ページネーションボタン */}
//                   {results.length > itemsPerPage && (
//                     <div className="flex justify-center gap-4 mt-4">
//                       <button
//                         onClick={handlePrevPage}
//                         disabled={currentPage === 1}
//                         className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                       >
//                         前へ
//                       </button>
//                       <span className="px-2 py-2">
//                         {currentPage} / {totalPages}
//                       </span>
//                       <button
//                         onClick={handleNextPage}
//                         disabled={currentPage === totalPages}
//                         className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                       >
//                         次へ
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* --- 右側: 固定ボタン群 --- */}
//           <div className="w-1/6 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6 flex flex-col gap-4">
//             <button
//               className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//               onClick={() => setShowCreateForm(prev => !prev)}
//             >
//               トピックを作成
//             </button>

//             <button
//               className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
//               onClick={() => router.push("/schools")}
//             >
//               学校一覧
//             </button>
//             <button
//               className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
//               onClick={() => router.push("/how_to_use")}
//             >
//               使い方
//             </button>
//             <button
//               className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
//               onClick={() => router.push("/mypage")}
//             >
//               マイページへ
//             </button>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }







// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "../firebaseconfig/firebase";
// import { API_BASE_URL } from "../api/api";
// import useSWR from "swr";

// initializeApp(firebaseConfig);

// // ----------------------
// // 型定義
// // ----------------------
// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// type Topic = {
//   ID: number;
//   Year: number;
//   UserID: number;
//   TopicName: string;
//   Content: string;
//   Activate: boolean;
//   Alert: boolean;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// // ----------------------
// // SWR fetcher
// // ----------------------
// const fetcher = (url: string) =>
//   fetch(url).then(res => res.json());

// // ----------------------
// // Main Component
// // ----------------------
// export default function Main() {
//   const auth = getAuth();
//   const router = useRouter();

//   // ✅ 学校一覧（キャッシュされる）
//   const {
//     data: schoolData,
//     isLoading: loadingSchools,
//   } = useSWR(`${API_BASE_URL}/getSchools`, fetcher);

//   const schools: School[] = schoolData?.schools ?? [];

//   // ✅ トピック一覧（キャッシュされる）
//   const {
//     data: topicData,
//     isLoading: loadingTopics,
//     mutate,
//   } = useSWR(`${API_BASE_URL}/topics`, fetcher);

//   const results: Topic[] = topicData?.topics ?? [];

//   // ----------------------
//   // UI State
//   // ----------------------
//   const [topicName, setTopicName] = useState("");
//   const [topicContent, setTopicContent] = useState("");
//   const [showCreateForm, setShowCreateForm] = useState(false);

//   // ----------------------
//   // ページネーション
//   // ----------------------
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;
//   const totalPages = Math.ceil(results.length / itemsPerPage);

//   const displayedTopics = results.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // ----------------------
//   // routing
//   // ----------------------
//   const road_to_topic = (id: string) =>
//     router.push("/topiccontents/" + id);

//   const road_to_school = (id: number) =>
//     router.push("/school_topic/" + id);

//   // ----------------------
//   // 投稿処理（SWR更新）
//   // ----------------------
//   const sendinfo = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("ユーザー未ログイン");

//       const idToken = await user.getIdToken();

//       const res = await fetch(`${API_BASE_URL}/topiccontent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: topicName,
//           content: topicContent,
//           token: idToken,
//         }),
//       });

//       if (!res.ok) throw new Error("トピック投稿失敗");

//       // ✅ 再取得（reload不要）
//       await mutate();

//       setTopicName("");
//       setTopicContent("");
//       setShowCreateForm(false);

//     } catch (err) {
//       console.error("送信エラー:", err);
//     }
//   };

//   const handlePrevPage = () =>
//     setCurrentPage(prev => Math.max(prev - 1, 1));

//   const handleNextPage = () =>
//     setCurrentPage(prev => Math.min(prev + 1, totalPages));

//   // ----------------------
//   // JSX
//   // ----------------------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//       <div className="max-w-7xl mx-auto flex gap-6">

//         {/* ---------------- サイドバー ---------------- */}
//         <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-[90vh] overflow-y-auto hide-scrollbar">
//           <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
//             学校一覧
//           </h2>

//           {loadingSchools ? (
//             <p className="text-center text-blue-600">読み込み中...</p>
//           ) : schools.length === 0 ? (
//             <p className="text-center text-blue-600">
//               学校が登録されていません
//             </p>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {schools.map(school => (
//                 <button
//                   key={school.ID}
//                   onClick={() => road_to_school(school.ID)}
//                   className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
//                 >
//                   <div className="text-xl font-semibold">
//                     {school.SchoolName}
//                   </div>
//                   <div className="text-sm text-blue-400 mt-1">
//                     作成日:
//                     {new Date(
//                       school.CreatedAt
//                     ).toLocaleDateString()}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </aside>

//         {/* ---------------- メイン ---------------- */}
//         <main className="flex-1 flex gap-6">
//           <div className="flex-1 flex flex-col gap-10">

//             {/* 作成フォーム */}
//             {showCreateForm && (
//               <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto w-full">
//                 <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//                   新しいトピックを作成
//                 </h2>

//                 <form
//                   className="flex flex-col gap-4"
//                   onSubmit={e => {
//                     e.preventDefault();
//                     sendinfo();
//                   }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="トピック名"
//                     value={topicName}
//                     onChange={e => setTopicName(e.target.value)}
//                     className="border rounded-lg p-3"
//                   />

//                   <textarea
//                     placeholder="内容"
//                     value={topicContent}
//                     onChange={e => setTopicContent(e.target.value)}
//                     className="border rounded-lg p-3 h-28"
//                   />

//                   <button
//                     type="submit"
//                     className="bg-indigo-500 text-white py-3 rounded-lg"
//                   >
//                     投稿する
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* トピック一覧 */}
//             <div>
//               <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//                 トピック一覧
//               </h2>

//               {loadingTopics ? (
//                 <p className="text-center text-gray-500">
//                   読み込み中...
//                 </p>
//               ) : results.length === 0 ? (
//                 <p className="text-center text-gray-500">
//                   まだ投稿がありません
//                 </p>
//               ) : (
//                 <div className="flex flex-col gap-5">
//                   {displayedTopics.map(topic => (
//                     <div
//                       key={topic.ID}
//                       className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl"
//                     >
//                       <button
//                         className="text-left w-full"
//                         onClick={() =>
//                           road_to_topic(String(topic.ID))
//                         }
//                       >
//                         <h3 className="text-xl font-bold text-indigo-600">
//                           {topic.TopicName}
//                         </h3>

//                         <p className="text-gray-700 mt-2 whitespace-pre-line">
//                           {topic.Content}
//                         </p>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* 右サイド */}
//           <div className="w-1/6 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6 flex flex-col gap-4">
//             <button
//               className="bg-indigo-500 text-white py-3 rounded-lg"
//               onClick={() =>
//                 setShowCreateForm(prev => !prev)
//               }
//             >
//               トピックを作成
//             </button>

//             <button
//               className="bg-green-500 text-white py-3 rounded-lg"
//               onClick={() => router.push("/schools")}
//             >
//               学校一覧
//             </button>

//             <button
//               className="bg-green-500 text-white py-3 rounded-lg"
//               onClick={() => router.push("/how_to_use")}
//             >
//               使い方
//             </button>

//             <button
//               className="bg-green-500 text-white py-3 rounded-lg"
//               onClick={() => router.push("/mypage")}
//             >
//               マイページへ
//             </button>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }










"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, User } from "firebase/auth";
import { initializeApp,getApp,getApps } from "firebase/app";
import { firebaseConfig } from "../firebaseconfig/firebase";
import { API_BASE_URL } from "../api/api";
import useSWR from "swr";

// ----------------------
// Firebase 初期化
// ----------------------
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ----------------------
// 型定義
// ----------------------
type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string | null;
  UpdatedAt: string | null;
};

type Topic = {
  ID: number;
  Year: number;
  UserID: number;
  TopicName: string;
  Content: string;
  Activate: boolean;
  Alert: boolean;
  CreatedAt: string | null;
  UpdatedAt: string | null;
};

// ----------------------
// SWR fetcher
// ----------------------
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

// ----------------------
// Main Component
// ----------------------
export default function Main() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = Number(params.get("page") ?? "1");
    return Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (currentPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(currentPage));
    }

    const query = params.toString();
    const nextUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [currentPage]);

  // ✅ 学校一覧（キャッシュされる）
  const { data: schoolData, isLoading: loadingSchools } = useSWR(
    `${API_BASE_URL}/getSchools`,
    fetcher
  );
  const schools: School[] = schoolData?.schools ?? [];

  // ✅ トピック一覧（キャッシュされる）
  const { data: topicData, isLoading: loadingTopics, mutate } = useSWR(
    `${API_BASE_URL}/topics?page=${currentPage}`,
    fetcher
  );
  const results: Topic[] = topicData?.topics ?? [];
  const totalPages = Math.max(topicData?.totalPages ?? 1, 1);

  // ----------------------
  // UI State
  // ----------------------
  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_TOPIC_NAME_LENGTH = 100;
  const MAX_TOPIC_CONTENT_LENGTH = 2000;

  // ----------------------
  // ページネーション
  // ----------------------
  

  const displayedTopics = results;

  // ----------------------
  // routing
  // ----------------------
  const road_to_topic = (id: string) => router.push("/topiccontents/" + id);
  const road_to_school = (id: number) => router.push("/school_topic/" + id);


    const sendinfo = async () => {
    if (isSubmitting) return; // ← 連打防止

    setIsSubmitting(true);

    try {
      const user: User | null = auth.currentUser;
      if (!user) {
        alert("ログインしてください");
        return;
      }

      const trimmedTopicName = topicName.trim();
      const trimmedTopicContent = topicContent.trim();

      if (!trimmedTopicName || !trimmedTopicContent) {
        alert("トピック名と内容を入力してください");
        return;
      }

      if (trimmedTopicName.length > MAX_TOPIC_NAME_LENGTH) {
        alert(`トピック名は ${MAX_TOPIC_NAME_LENGTH} 文字以内で入力してください`);
        return;
      }

      if (trimmedTopicContent.length > MAX_TOPIC_CONTENT_LENGTH) {
        alert(`内容は ${MAX_TOPIC_CONTENT_LENGTH} 文字以内で入力してください`);
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/topiccontent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: trimmedTopicName,
          content: trimmedTopicContent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || errData.message || "トピック投稿失敗"
        );
      }

      await mutate(undefined, { revalidate: true });

      setTopicName("");
      setTopicContent("");
      setShowCreateForm(false);

    } catch (err) {
      console.error("送信エラー:", err);
      alert("トピック投稿に失敗しました");
    } finally {
      setIsSubmitting(false); // ← 必ず戻す
    }
  };

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));


    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* ---------------- サイドバー ---------------- */}
        <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-[90vh] overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            学校一覧
          </h2>

          {loadingSchools ? (
            <p className="text-center text-blue-600">読み込み中...</p>
          ) : schools.length === 0 ? (
            <p className="text-center text-blue-600">
              学校が登録されていません
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {schools.map(school => (
                <button
                  key={school.ID}
                  onClick={() => road_to_school(school.ID)}
                  className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-xl font-semibold">
                    {school.SchoolName}
                  </div>
                  {/* <div className="text-sm text-blue-400 mt-1">
                    作成日:
                    {school.CreatedAt
                      ? new Date(school.CreatedAt).toLocaleDateString()
                      : "-"}
                  </div> */}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* ---------------- メイン ---------------- */}
        <main className="flex-1 flex gap-6">
          <div className="flex-1 flex flex-col gap-10">

            {/* 作成フォーム */}
            {showCreateForm && (
              <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto w-full">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                  新しいトピックを作成
                </h2>

                <form
                  className="flex flex-col gap-4"
                  onSubmit={e => {
                    e.preventDefault();
                    sendinfo();
                  }}
                >
                  <input
                    type="text"
                    placeholder="トピック名"
                    value={topicName}
                    onChange={e => setTopicName(e.target.value)}
                    className="border rounded-lg p-3"
                  />

                  <textarea
                    placeholder="内容"
                    value={topicContent}
                    onChange={e => setTopicContent(e.target.value)}
                    className="border rounded-lg p-3 h-28"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-3 rounded-lg text-white ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {isSubmitting ? "送信中..." : "投稿する"}
                  </button>
                </form>
              </div>
            )}

            {/* ---------------- トピック一覧 ---------------- */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                トピック一覧
              </h2>

              {loadingTopics ? (
                <p className="text-center text-gray-500">読み込み中...</p>
              ) : results.length === 0 ? (
                <p className="text-center text-gray-500">
                  まだ投稿がありません
                </p>
              ) : (
                <>
                  {/* 一覧 */}
                  <div className="flex flex-col gap-5">
                    {displayedTopics.map(topic => (
                      <div
                        key={topic.ID}
                        className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl"
                      >
                        <button
                          className="text-left w-full"
                          onClick={() =>
                            road_to_topic(String(topic.ID))
                          }
                        >
                          <h3 className="text-xl font-bold text-indigo-600">
                            {topic.TopicName}
                          </h3>
                          <p className="text-gray-700 mt-2 whitespace-pre-line">
                            {topic.Content}
                          </p>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ⭐ ページネーション */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">

                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        ← 前へ
                      </button>

                      <span className="font-semibold text-gray-700">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        次へ →
                      </button>

                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ---------------- 右サイド ---------------- */}
          <div className="w-1/6 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6 flex flex-col gap-4">
            <button
              className="bg-indigo-500 text-white py-3 rounded-lg"
              onClick={() => setShowCreateForm(prev => !prev)}
            >
              トピックを作成
            </button>

            <button
              className="bg-green-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/schools")}
            >
              学校一覧
            </button>

            <button
              className="bg-green-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/how_to_use")}
            >
              使い方
            </button>

            <button
              className="bg-green-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/mypage")}
            >
              マイページへ
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}