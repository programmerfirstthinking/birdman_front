// "use client"; // Next.js 13 appディレクトリの場合
// import { useState, useEffect } from "react";
// // import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// // import { GoogleAuthProvider } from "firebase/auth";
// import { getAuth,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { sign } from "crypto";
// // import { useRouter } from 'next/router';
// import { useRouter } from 'next/navigation';

// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };

// const app = initializeApp(firebaseConfig);

// export default function Main() {

//   const auth = getAuth();
//   const user = auth.currentUser;

//   // const [fetchData, setFetchData] = useState({});
//   // let topicdata ;

//   const router = useRouter();

//   // const [data, setData] = useState<Record<string, any> | null>(null);
//   // const [results, setResults] = useState<Record<string, any> | null>(null);

//   type Topic = {
//     ID: number;
//     Year: number;
//     UserID: number;
//     TopicName: string;
//     Content: string;
//     Activate: boolean;
//     Alert: boolean;
//     CreatedAt: string;  // time.Time → stringで来る
//     UpdatedAt: string;
//   };

// const [results, setResults] = useState<Topic[]>([]);

//   async function fetchtopicdata() {
//     try {
//       const response = await fetch("http://localhost:8080/topics", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       // HTTPステータスチェック
//       if (!response.ok) {
//         console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
//         return;
//       }

//       console.log("トピックデータの取得に成功");
//       console.log(response);

//       // const result = await response.json();
//       // console.log("取得したトピックデータをjsonに変換");
//       // console.log(result);

//       const result = await response.json();
//       setResults(result.topics); // ←ここ重要

//       // setData(result);
//       // setResults(result);

//       // console.log("データの一部を取り出し");
//       // console.log(result.topics[0]);

//     } catch (error) {
//       console.error("トピックデータの取得中にエラーが発生しました:", error);
//     }
//   }

//   useEffect(() => {
//       fetchtopicdata();
//   }, []);



//   const [topicName, setTopicName] = useState("");
//   const [topicContent, setTopicContent] = useState("");

//   async function sendinfo() {
//     try {
//       // 現在のユーザーのトークンを取得

//       const auth = getAuth();
//       const user = auth.currentUser;


//       if (!user) {
//         console.error("ユーザーがログインしていません");
//         return;
//       }

//       const idToken = await user.getIdToken();
//       console.log("現在のユーザーのIDトークン:", idToken);

//       // POST リクエスト送信
//       const response = await fetch("http://localhost:8080/topiccontent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: topicName, content: topicContent, token: idToken }),
//       });

//       // HTTP ステータスチェック
//       if (!response.ok) {
//         console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
//         return;
//       }

//       // レスポンスを JSON として取得
//       const data = await response.json();
//       console.log("トピックの送信に成功");
//       console.log(data);

//       // 必要であればページリロード
//       window.location.reload();

//     } catch (error) {
//       // トークン取得や fetch エラーをキャッチ
//       console.error("送信中にエラーが発生しました:", error);
//     }
//   }

//   function road_to_topic(id : String) {

//     router.push('/srccode/topiccontents/' + id);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">

//       <div className="w-full max-w-3xl">

//         <h1 className="text-4xl font-bold mb-10 text-center text-indigo-700">
//           トピック掲示板です
//         </h1>

//         {/* 投稿フォーム */}
//         <div className="bg-white shadow-xl rounded-2xl p-8 mb-10">

//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//             新しいトピックを作成しよう
//           </h2>

//           <form
//             className="flex flex-col gap-4"
//             onSubmit={async (e) => {
//               e.preventDefault();
//               await sendinfo();
//             }}
//           >

//             <input
//               type="text"
//               name="topicname"
//               placeholder="トピック名"
//               value={topicName}
//               onChange={(e)=>setTopicName(e.target.value)}
//               className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />

//             <textarea
//               name="topiccontent"
//               placeholder="内容"
//               value={topicContent}
//               onChange={(e)=>setTopicContent(e.target.value)}
//               className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />

//             <button
//               type="submit"
//               className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//             >
//               投稿する
//             </button>

//           </form>

//         </div>


//         {/* トピック一覧 */}
//         <div>

//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//             トピック一覧
//           </h2>

//           {(!results || results.length === 0) ? (
//             <p className="text-gray-500 text-center">
//               まだ投稿がありません
//             </p>
//           ) : (

//             <div className="flex flex-col gap-5">

//               {results.map((topic) => (

//                 <div
//                   key={topic.ID}
//                   className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
//                 >

//                   <button
//                     className="text-left w-full"
//                     onClick={() => road_to_topic(String(topic.ID))}
//                   >

//                     <h3 className="text-xl font-bold text-indigo-600">
//                       {topic.TopicName}
//                     </h3>

//                     <p className="text-gray-700 mt-2">
//                       {topic.Content}
//                     </p>

//                     <div className="text-sm text-gray-400 mt-4">
//                       <div>作成者ID: {topic.UserID}</div>
//                       <div>
//                         作成日: {new Date(topic.CreatedAt).toLocaleString()}
//                       </div>
//                     </div>

//                   </button>

//                 </div>

//               ))}

//             </div>

//           )}

//         </div>

//       </div>

//     </div>
//   );
// }






"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};
initializeApp(firebaseConfig);

type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type Topic = {
  ID: number;
  Year: number;
  UserID: number;
  TopicName: string;
  Content: string;
  Activate: boolean;
  Alert: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function Main() {
  const auth = getAuth();
  const router = useRouter();

  const [schools, setSchools] = useState<School[]>([]);
  const [results, setResults] = useState<Topic[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");

  // --- 学校一覧取得 ---
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("http://localhost:8080/getSchools");
        if (!res.ok) throw new Error("学校取得失敗");
        const data = await res.json();
        if (Array.isArray(data.schools)) {
          setSchools(data.schools);
        } else {
          setSchools([]);
        }
      } catch (err) {
        console.error("学校取得エラー:", err);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  // --- トピック一覧取得 ---
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://localhost:8080/topics");
        if (!res.ok) throw new Error("トピック取得失敗");
        const data = await res.json();
        setResults(data.topics || []);
      } catch (err) {
        console.error("トピック取得エラー:", err);
        setResults([]);
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, []);

  const road_to_topic = (id: string) => router.push('/srccode/topiccontents/' + id);
  const road_to_school = (id: number) => router.push('/srccode/school_topic/' + id);

  const sendinfo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("ユーザー未ログイン");
      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:8080/topiccontent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: topicName, content: topicContent, token: idToken }),
      });

      if (!res.ok) throw new Error("トピック投稿失敗");
      await res.json();
      window.location.reload();
    } catch (err) {
      console.error("送信エラー:", err);
    }
  };

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
  //     <div className="max-w-4xl mx-auto flex flex-col gap-10">

  //       {/* --- 学校一覧 --- */}
  //       <div>
  //         <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
  //         {loadingSchools ? (
  //           <p className="text-center text-blue-600">読み込み中...</p>
  //         ) : schools.length === 0 ? (
  //           <p className="text-center text-blue-600">学校が登録されていません</p>
  //         ) : (
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             {schools.map(school => (
  //               <button
  //                 key={school.ID}
  //                 onClick={() => road_to_school(school.ID)}
  //                 className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
  //               >
  //                 <div className="text-xl font-semibold">{school.SchoolName}</div>
  //                 <div className="text-sm text-blue-400 mt-1">
  //                   作成日: {new Date(school.CreatedAt).toLocaleDateString()}
  //                 </div>
  //               </button>
  //             ))}
  //           </div>
  //         )}
  //       </div>

  //       {/* --- トピック投稿フォーム --- */}
  //       <div className="bg-white shadow-xl rounded-2xl p-8">
  //         <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
  //         <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
  //           <input
  //             type="text"
  //             placeholder="トピック名"
  //             value={topicName}
  //             onChange={e => setTopicName(e.target.value)}
  //             className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  //           />
  //           <textarea
  //             placeholder="内容"
  //             value={topicContent}
  //             onChange={e => setTopicContent(e.target.value)}
  //             className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  //           />
  //           <button
  //             type="submit"
  //             className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
  //           >
  //             投稿する
  //           </button>
  //         </form>
  //       </div>

  //       {/* --- トピック一覧 --- */}
  //       <div>
  //         <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
  //         {loadingTopics ? (
  //           <p className="text-center text-gray-500">読み込み中...</p>
  //         ) : results.length === 0 ? (
  //           <p className="text-center text-gray-500">まだ投稿がありません</p>
  //         ) : (
  //           <div className="flex flex-col gap-5">
  //             {results.map(topic => (
  //               <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
  //                 <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
  //                   <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
  //                   <p className="text-gray-700 mt-2">{topic.Content}</p>
  //                   <div className="text-sm text-gray-400 mt-4">
  //                     <div>作成者ID: {topic.UserID}</div>
  //                     <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
  //                   </div>
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>

  //     </div>
  //   </div>
  // );
//   return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//     <div className="max-w-7xl mx-auto flex gap-10">
      
//       {/* --- サイドバー: 学校一覧 --- */}
//       <aside className="w-1/4 bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6">
//         <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
//         {loadingSchools ? (
//           <p className="text-center text-blue-600">読み込み中...</p>
//         ) : schools.length === 0 ? (
//           <p className="text-center text-blue-600">学校が登録されていません</p>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {schools.map(school => (
//               <button
//                 key={school.ID}
//                 onClick={() => road_to_school(school.ID)}
//                 className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
//               >
//                 <div className="text-xl font-semibold">{school.SchoolName}</div>
//                 <div className="text-sm text-blue-400 mt-1">
//                   作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </aside>

//       {/* --- メインコンテンツ: トピック関連 --- */}
//       <main className="flex-1 flex flex-col gap-10">

//         {/* トピック投稿フォーム */}
//         <div className="bg-white shadow-xl rounded-2xl p-8">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
//           <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//             <input
//               type="text"
//               placeholder="トピック名"
//               value={topicName}
//               onChange={e => setTopicName(e.target.value)}
//               className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             <textarea
//               placeholder="内容"
//               value={topicContent}
//               onChange={e => setTopicContent(e.target.value)}
//               className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             <button
//               type="submit"
//               className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//             >
//               投稿する
//             </button>
//           </form>
//         </div>

//         {/* トピック一覧 */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
//           {loadingTopics ? (
//             <p className="text-center text-gray-500">読み込み中...</p>
//           ) : results.length === 0 ? (
//             <p className="text-center text-gray-500">まだ投稿がありません</p>
//           ) : (
//             <div className="flex flex-col gap-5">
//               {results.map(topic => (
//                 <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
//                   <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                     <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                     <p className="text-gray-700 mt-2">{topic.Content}</p>
//                     <div className="text-sm text-gray-400 mt-4">
//                       <div>作成者ID: {topic.UserID}</div>
//                       <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                     </div>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </main>
//     </div>
//   </div>
// );
// return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//     <div className="max-w-7xl mx-auto flex gap-10">

//       {/* --- サイドバー: 学校一覧 --- */}
//       <aside className="w-1/4 bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6">
//         <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
//         {loadingSchools ? (
//           <p className="text-center text-blue-600">読み込み中...</p>
//         ) : schools.length === 0 ? (
//           <p className="text-center text-blue-600">学校が登録されていません</p>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {schools.map(school => (
//               <button
//                 key={school.ID}
//                 onClick={() => road_to_school(school.ID)}
//                 className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
//               >
//                 <div className="text-xl font-semibold">{school.SchoolName}</div>
//                 <div className="text-sm text-blue-400 mt-1">
//                   作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </aside>

//       {/* --- メイン + 右側ボタン --- */}
//       <main className="flex-1 flex gap-6">

//         {/* --- 左側: トピック関連 --- */}
//         <div className="flex-1 flex flex-col gap-10">

//           {/* トピック投稿フォーム */}
//           <div className="bg-white shadow-xl rounded-2xl p-8">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
//             <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//               <input
//                 type="text"
//                 placeholder="トピック名"
//                 value={topicName}
//                 onChange={e => setTopicName(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <textarea
//                 placeholder="内容"
//                 value={topicContent}
//                 onChange={e => setTopicContent(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//               >
//                 投稿する
//               </button>
//             </form>
//           </div>

//           {/* トピック一覧 */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
//             {loadingTopics ? (
//               <p className="text-center text-gray-500">読み込み中...</p>
//             ) : results.length === 0 ? (
//               <p className="text-center text-gray-500">まだ投稿がありません</p>
//             ) : (
//               <div className="flex flex-col gap-5">
//                 {results.map(topic => (
//                   <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
//                     <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                       <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                       <p className="text-gray-700 mt-2">{topic.Content}</p>
//                       <div className="text-sm text-gray-400 mt-4">
//                         <div>作成者ID: {topic.UserID}</div>
//                         <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- 右側: ボタン2つ --- */}
//         <div className="w-1/3 bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-center items-center gap-6">
//           <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
//             ボタン1
//           </button>
//           <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
//             ボタン2
//           </button>
//         </div>

//       </main>

//     </div>
//   </div>
// );
// return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//     <div className="max-w-7xl mx-auto flex gap-10">

//       {/* --- サイドバー: 学校一覧 --- */}
//       <aside className="w-1/4 bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6">
//         <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
//         {loadingSchools ? (
//           <p className="text-center text-blue-600">読み込み中...</p>
//         ) : schools.length === 0 ? (
//           <p className="text-center text-blue-600">学校が登録されていません</p>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {schools.map(school => (
//               <button
//                 key={school.ID}
//                 onClick={() => road_to_school(school.ID)}
//                 className="bg-white shadow-md hover:shadow-lg rounded-xl p-4 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
//               >
//                 <div className="text-xl font-semibold">{school.SchoolName}</div>
//                 <div className="text-sm text-blue-400 mt-1">
//                   作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </aside>

//       {/* --- メイン + 右側ボタン --- */}
//       <main className="flex-1 flex gap-6">

//         {/* --- 左側: トピック関連 --- */}
//         <div className="flex-1 flex flex-col gap-10">

//           {/* トピック投稿フォーム */}
//           <div className="bg-white shadow-xl rounded-2xl p-7">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
//             <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//               <input
//                 type="text"
//                 placeholder="トピック名"
//                 value={topicName}
//                 onChange={e => setTopicName(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <textarea
//                 placeholder="内容"
//                 value={topicContent}
//                 onChange={e => setTopicContent(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
//               >
//                 投稿する
//               </button>
//             </form>
//           </div>

//           {/* トピック一覧 */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
//             {loadingTopics ? (
//               <p className="text-center text-gray-500">読み込み中...</p>
//             ) : results.length === 0 ? (
//               <p className="text-center text-gray-500">まだ投稿がありません</p>
//             ) : (
//               <div className="flex flex-col gap-5">
//                 {results.map(topic => (
//                   <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
//                     <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                       <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                       <p className="text-gray-700 mt-2">{topic.Content}</p>
//                       <div className="text-sm text-gray-400 mt-4">
//                         <div>作成者ID: {topic.UserID}</div>
//                         <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- 右側: 固定ボタン2つ --- */}
//         <div className="w-1/3 bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6 flex flex-col gap-4">
//           <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
//             ボタン1
//           </button>
//           <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
//             ボタン2
//           </button>
//         </div>

//       </main>

//     </div>
//   </div>
// );

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
    <div className="max-w-7xl mx-auto flex gap-6">

      {/* --- サイドバー: 学校一覧 --- */}
      <aside className="w-1/5 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">学校一覧</h2>
        {loadingSchools ? (
          <p className="text-center text-blue-600">読み込み中...</p>
        ) : schools.length === 0 ? (
          <p className="text-center text-blue-600">学校が登録されていません</p>
        ) : (
          <div className="flex flex-col gap-3">
            {schools.map(school => (
              <button
                key={school.ID}
                onClick={() => road_to_school(school.ID)}
                className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
              >
                <div className="text-xl font-semibold">{school.SchoolName}</div>
                <div className="text-sm text-blue-400 mt-1">
                  作成日: {new Date(school.CreatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* --- メイン + 右側ボタン --- */}
      <main className="flex-1 flex gap-6">

        {/* --- 左側: トピック関連 --- */}
        <div className="flex-1 flex flex-col gap-10">

          {/* トピック投稿フォーム */}
          <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">新しいトピックを作成</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
              <input
                type="text"
                placeholder="トピック名"
                value={topicName}
                onChange={e => setTopicName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="内容"
                value={topicContent}
                onChange={e => setTopicContent(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
              >
                投稿する
              </button>
            </form>
          </div>

          {/* トピック一覧 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">トピック一覧</h2>
            {loadingTopics ? (
              <p className="text-center text-gray-500">読み込み中...</p>
            ) : results.length === 0 ? (
              <p className="text-center text-gray-500">まだ投稿がありません</p>
            ) : (
              <div className="flex flex-col gap-5">
                {results.map(topic => (
                  <div key={topic.ID} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
                      <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
                      <p className="text-gray-700 mt-2">{topic.Content}</p>
                      <div className="text-sm text-gray-400 mt-4">
                        <div>作成者ID: {topic.UserID}</div>
                        <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- 右側: 固定ボタン2つ --- */}
        <div className="w-1/6 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6 flex flex-col gap-4">
          <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
            ボタン1
          </button>
          <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
            ボタン2
          </button>
        </div>

      </main>

    </div>
  </div>
);
}






// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };
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

// export default function Main() {
//   const auth = getAuth();
//   const router = useRouter();

//   const [schools, setSchools] = useState<School[]>([]);
//   const [results, setResults] = useState<Topic[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);
//   const [loadingTopics, setLoadingTopics] = useState(true);

//   const [topicName, setTopicName] = useState("");
//   const [topicContent, setTopicContent] = useState("");

//   // 学校一覧取得
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getSchools");
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data = await res.json();
//         setSchools(Array.isArray(data.schools) ? data.schools : []);
//       } catch (err) {
//         console.error(err);
//         setSchools([]);
//       } finally {
//         setLoadingSchools(false);
//       }
//     };
//     fetchSchools();
//   }, []);

//   // トピック一覧取得
//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/topics");
//         if (!res.ok) throw new Error("トピック取得失敗");
//         const data = await res.json();
//         setResults(data.topics || []);
//       } catch (err) {
//         console.error(err);
//         setResults([]);
//       } finally {
//         setLoadingTopics(false);
//       }
//     };
//     fetchTopics();
//   }, []);

//   const road_to_topic = (id: string) => router.push('/srccode/topiccontents/' + id);
//   const road_to_school = (id: number) => router.push('/srccode/school_topic/' + id);

//   const sendinfo = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("ユーザー未ログイン");
//       const idToken = await user.getIdToken();

//       const res = await fetch("http://localhost:8080/topiccontent", {
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//       <div className="max-w-7xl mx-auto flex gap-8">

//         {/* 左側: 学校一覧 */}
//         <div className="w-1/4">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4">学校一覧</h2>
//           {loadingSchools ? (
//             <p className="text-blue-600">読み込み中...</p>
//           ) : schools.length === 0 ? (
//             <p className="text-blue-600">学校が登録されていません</p>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {schools.map(school => (
//                 <button
//                   key={school.ID}
//                   onClick={() => road_to_school(school.ID)}
//                   className="bg-white shadow-md rounded-lg p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50 hover:shadow-lg transition"
//                 >
//                   <div className="font-semibold">{school.SchoolName}</div>
//                   <div className="text-sm text-blue-400">
//                     作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* 中央: トピック投稿フォーム + トピック一覧 */}
//         <div className="w-3/4 flex flex-col gap-8">

//           {/* トピック投稿フォーム */}
//           <div className="bg-white shadow-xl rounded-2xl p-6">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-700">新しいトピックを作成</h2>
//             <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//               <input
//                 type="text"
//                 placeholder="トピック名"
//                 value={topicName}
//                 onChange={e => setTopicName(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <textarea
//                 placeholder="内容"
//                 value={topicContent}
//                 onChange={e => setTopicContent(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
//               >
//                 投稿する
//               </button>
//             </form>
//           </div>

//           {/* トピック一覧 */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-4 text-gray-700">トピック一覧</h2>
//             {loadingTopics ? (
//               <p className="text-gray-500">読み込み中...</p>
//             ) : results.length === 0 ? (
//               <p className="text-gray-500">まだ投稿がありません</p>
//             ) : (
//               <div className="flex flex-col gap-4">
//                 {results.map(topic => (
//                   <div key={topic.ID} className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
//                     <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                       <h3 className="text-xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                       <p className="text-gray-700 mt-1">{topic.Content}</p>
//                       <div className="text-sm text-gray-400 mt-2">
//                         <div>作成者ID: {topic.UserID}</div>
//                         <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }





// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };
// initializeApp(firebaseConfig);

// type School = { ID: number; SchoolName: string; CreatedAt: string; UpdatedAt: string };
// type Topic = { ID: number; Year: number; UserID: number; TopicName: string; Content: string; Activate: boolean; Alert: boolean; CreatedAt: string; UpdatedAt: string };

// export default function Main() {
//   const auth = getAuth();
//   const router = useRouter();

//   const [schools, setSchools] = useState<School[]>([]);
//   const [results, setResults] = useState<Topic[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);
//   const [loadingTopics, setLoadingTopics] = useState(true);

//   const [topicName, setTopicName] = useState("");
//   const [topicContent, setTopicContent] = useState("");

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getSchools");
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data = await res.json();
//         setSchools(Array.isArray(data.schools) ? data.schools : []);
//       } catch (err) {
//         console.error(err);
//         setSchools([]);
//       } finally {
//         setLoadingSchools(false);
//       }
//     };
//     fetchSchools();
//   }, []);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/topics");
//         if (!res.ok) throw new Error("トピック取得失敗");
//         const data = await res.json();
//         setResults(data.topics || []);
//       } catch (err) {
//         console.error(err);
//         setResults([]);
//       } finally {
//         setLoadingTopics(false);
//       }
//     };
//     fetchTopics();
//   }, []);

//   const road_to_topic = (id: string) => router.push('/srccode/topiccontents/' + id);
//   const road_to_school = (id: number) => router.push('/srccode/school_topic/' + id);

//   const sendinfo = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error("ユーザー未ログイン");
//       const idToken = await user.getIdToken();

//       const res = await fetch("http://localhost:8080/topiccontent", {
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center items-center p-6">
//       <div className="flex w-full max-w-7xl gap-8">

//         {/* 左側: 学校一覧（小さめ） */}
//         <div className="w-1/6">
//           <h2 className="text-lg font-bold text-blue-800 mb-3">学校一覧</h2>
//           {loadingSchools ? (
//             <p className="text-blue-600 text-sm">読み込み中...</p>
//           ) : schools.length === 0 ? (
//             <p className="text-blue-600 text-sm">学校がありません</p>
//           ) : (
//             <div className="flex flex-col gap-2">
//               {schools.map(school => (
//                 <button
//                   key={school.ID}
//                   onClick={() => road_to_school(school.ID)}
//                   className="bg-white shadow-sm rounded-md p-2 text-left text-blue-800 text-sm border border-blue-200 hover:bg-blue-50 hover:shadow-md transition"
//                 >
//                   {school.SchoolName}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* 中央: トピック作成 + トピック一覧 */}
//         <div className="w-5/6 flex flex-col items-center gap-10">

//           {/* トピック投稿フォーム */}
//           <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
//             <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">新しいトピックを作成</h2>
//             <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); sendinfo(); }}>
//               <input
//                 type="text"
//                 placeholder="トピック名"
//                 value={topicName}
//                 onChange={e => setTopicName(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <textarea
//                 placeholder="内容"
//                 value={topicContent}
//                 onChange={e => setTopicContent(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 h-32 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-600 transition"
//               >
//                 投稿する
//               </button>
//             </form>
//           </div>

//           {/* トピック一覧 */}
//           <div className="w-full max-w-2xl">
//             <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">トピック一覧</h2>
//             {loadingTopics ? (
//               <p className="text-gray-500 text-center text-lg">読み込み中...</p>
//             ) : results.length === 0 ? (
//               <p className="text-gray-500 text-center text-lg">まだ投稿がありません</p>
//             ) : (
//               <div className="flex flex-col gap-6">
//                 {results.map(topic => (
//                   <div key={topic.ID} className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
//                     <button className="text-left w-full" onClick={() => road_to_topic(String(topic.ID))}>
//                       <h3 className="text-2xl font-bold text-indigo-600">{topic.TopicName}</h3>
//                       <p className="text-gray-700 mt-2 text-lg">{topic.Content}</p>
//                       <div className="text-sm text-gray-400 mt-3">
//                         <div>作成者ID: {topic.UserID}</div>
//                         <div>作成日: {new Date(topic.CreatedAt).toLocaleString()}</div>
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }