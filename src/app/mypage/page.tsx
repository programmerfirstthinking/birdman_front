// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Firebase 設定
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

// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [name, setName] = useState("");
//   const [introduce, setIntroduce] = useState("");

//   // 現在のユーザー情報取得
//   useEffect(() => {
//     const fetchUser = async () => {
//       const auth = getAuth();
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       const idToken = await currentUser.getIdToken();

//       const res = await fetch("http://localhost:8080/current_user", {
//         headers: { Authorization: `Bearer ${idToken}` }
//       });

//       if (!res.ok) return;
//       const data: User = await res.json();
//       setUser(data);
//       setName(data.name);
//       setIntroduce(data.introduce || "");
//     };

//     fetchUser();
//   }, []);

//   // 名前・自己紹介更新
//   const handleUpdate = async () => {
//     if (!user) return;

//     const res = await fetch("http://localhost:8080/update_user", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: user.id, name, introduce })
//     });

//     if (res.ok) {
//       const updatedUser: User = await res.json();
//       setUser(updatedUser);
//       alert("更新成功！");
//     } else {
//       alert("更新失敗");
//     }
//   };

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4">プロフィール編集</h2>

//       <label className="block text-blue-700 mb-1">名前</label>
//       <input
//         className="w-full p-2 border border-blue-300 rounded mb-3"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <label className="block text-blue-700 mb-1">自己紹介</label>
//       <textarea
//         className="w-full p-2 border border-blue-300 rounded mb-3"
//         value={introduce}
//         onChange={(e) => setIntroduce(e.target.value)}
//       />

//       <button
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         onClick={handleUpdate}
//       >
//         更新
//       </button>
//     </div>
//   );
// }








// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// // ---------------------
// // Firebase 設定
// // ---------------------
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

// const app = initializeApp(firebaseConfig);

// // ---------------------
// // 型定義
// // ---------------------
// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// // ---------------------
// // メインコンポーネント
// // ---------------------
// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [name, setName] = useState("");
//   const [introduce, setIntroduce] = useState("");
//   const [loading, setLoading] = useState(true);

//   // ---------------------
//   // Firebase ログイン状態監視 + ユーザー情報取得
//   // ---------------------
//   useEffect(() => {
//     const auth = getAuth();

//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
//       if (!firebaseUser) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const idToken = await firebaseUser.getIdToken();

//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) {
//           console.error("ユーザー情報取得に失敗:", res.status);
//           setLoading(false);
//           return;
//         }

//         const data: User = await res.json();
//         setUser(data);
//         setName(data.name);
//         setIntroduce(data.introduce || "");
//         setLoading(false);
//       } catch (err) {
//         console.error("fetchUser エラー:", err);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // ---------------------
//   // 名前・自己紹介更新
//   // ---------------------
//   const handleUpdate = async () => {
//     if (!user) return;

//     try {
//       const auth = getAuth();
//       const firebaseUser = auth.currentUser;
//       if (!firebaseUser) return;

//       const idToken = await firebaseUser.getIdToken();

//       const res = await fetch("http://localhost:8080/update_user", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({
//           id: user.id,
//           name,
//           introduce,
//         }),
//       });

//       if (!res.ok) {
//         alert("更新失敗");
//         return;
//       }

//       const updatedUser: User = await res.json();
//       setUser(updatedUser);
//       setName(updatedUser.name);
//       setIntroduce(updatedUser.introduce || "");
//       alert("更新成功！");
//     } catch (err) {
//       console.error("handleUpdate エラー:", err);
//       alert("更新失敗");
//     }
//   };

//   if (loading) return <p className="text-blue-700 text-center mt-6">読み込み中...</p>;
//   if (!user) return <p className="text-red-600 text-center mt-6">ログインが必要です</p>;

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300 mt-6">
//       <h2 className="text-blue-800 font-bold mb-4 text-center text-xl">プロフィール編集</h2>

//       <label className="block text-blue-700 mb-1 font-medium">名前</label>
//       <input
//         className="w-full p-2 border border-blue-300 rounded mb-3"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <label className="block text-blue-700 mb-1 font-medium">自己紹介</label>
//       <textarea
//         className="w-full p-2 border border-blue-300 rounded mb-3"
//         value={introduce}
//         onChange={(e) => setIntroduce(e.target.value)}
//       />

//       <button
//         className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//         onClick={handleUpdate}
//       >
//         更新
//       </button>
//     </div>
//   );
// }







// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

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

// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();

//     const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
//       try {
//         const idToken = await firebaseUser.getIdToken(true); // force refresh
//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) throw new Error("ユーザー情報取得失敗");

//         const data: User = await res.json();
//         setUser(data);
//         console.log("取得したユーザー情報:", data);
//       } catch (err) {
//         console.error("ユーザー取得エラー:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // 初回ロード時 currentUser チェック
//     const firebaseUser = auth.currentUser;
//     if (firebaseUser) fetchCurrentUser(firebaseUser);

//     // ユーザー状態変更監視
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) fetchCurrentUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;

//   if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4 text-lg">取得したユーザー情報</h2>
//       <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
//         {JSON.stringify(user, null, 2)}
//       </pre>
//       <div>{user.name}</div>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

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

// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();

//     const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
//       try {
//         const idToken = await firebaseUser.getIdToken(true);
//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) throw new Error("ユーザー情報取得失敗");

//         const data: User = await res.json();
//         setUser(data);
//         console.log("取得したユーザー情報:", data);
//       } catch (err) {
//         console.error("ユーザー取得エラー:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const firebaseUser = auth.currentUser;
//     if (firebaseUser) fetchCurrentUser(firebaseUser);

//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) fetchCurrentUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;
//   if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4 text-lg">取得したユーザー情報</h2>
//       <p className="mb-2">
//         <strong>名前:</strong> {user.name}
//       </p>
//       <p>
//         <strong>自己紹介:</strong> {user.introduce ?? "未設定"}
//       </p>
//     </div>
//   );
// }













// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// // --- Firebase 設定 ---
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

// // --- フロント用の User 型（小文字で統一） ---
// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth();

//     const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
//       try {
//         const idToken = await firebaseUser.getIdToken(true);

//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) throw new Error("ユーザー情報取得失敗");

//         // --- バックエンドの大文字キーをフロント用に変換 ---
//         const dataFromBackend = await res.json();
//         const data: User = {
//           id: dataFromBackend.ID,
//           name: dataFromBackend.Name,
//           school_id: dataFromBackend.SchoolID,
//           introduce: dataFromBackend.Introduce,
//           uuid: dataFromBackend.Uuid,
//           created_at: dataFromBackend.CreatedAt,
//           updated_at: dataFromBackend.UpdatedAt,
//         };

//         setUser(data);
//         console.log("取得したユーザー情報:", data);

//       } catch (err) {
//         console.error("ユーザー取得エラー:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // 初回ロード時 currentUser チェック
//     const firebaseUser = auth.currentUser;
//     if (firebaseUser) fetchCurrentUser(firebaseUser);

//     // ユーザー状態変更監視
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) fetchCurrentUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;
//   if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4 text-lg">取得したユーザー情報</h2>
//       <p className="mb-2">
//         <strong>名前:</strong> {user.name}
//       </p>
//       <p>
//         <strong>自己紹介:</strong> {user.introduce ?? "未設定"}
//       </p>
//     </div>
//   );
// }








// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// // --- Firebase 設定 ---
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

// // --- フロント用の User 型 ---
// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [nameInput, setNameInput] = useState("");
//   const [introduceInput, setIntroduceInput] = useState("");

//   useEffect(() => {
//     const auth = getAuth();

//     const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
//       try {
//         const idToken = await firebaseUser.getIdToken(true);

//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) throw new Error("ユーザー情報取得失敗");

//         const dataFromBackend = await res.json();
//         const data: User = {
//           id: dataFromBackend.ID,
//           name: dataFromBackend.Name,
//           school_id: dataFromBackend.SchoolID,
//           introduce: dataFromBackend.Introduce,
//           uuid: dataFromBackend.Uuid,
//           created_at: dataFromBackend.CreatedAt,
//           updated_at: dataFromBackend.UpdatedAt,
//         };

//         setUser(data);
//         console.log("取得したユーザー情報:", data);

//       } catch (err) {
//         console.error("ユーザー取得エラー:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const firebaseUser = auth.currentUser;
//     if (firebaseUser) fetchCurrentUser(firebaseUser);

//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) fetchCurrentUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;
//   if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

//   const handleEditClick = () => {
//     setNameInput(user.name);
//     setIntroduceInput(user.introduce ?? "");
//     setEditing(true);
//   };

//   const handleCancelClick = () => {
//     setEditing(false);
//   };

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4 text-lg">ユーザー情報</h2>

//       {editing ? (
//         <>
//           <label className="block text-blue-700 mb-1 font-medium">名前</label>
//           <input
//             className="w-full p-2 border border-blue-300 rounded mb-3"
//             value={nameInput}
//             onChange={(e) => setNameInput(e.target.value)}
//           />

//           <label className="block text-blue-700 mb-1 font-medium">自己紹介</label>
//           <textarea
//             className="w-full p-2 border border-blue-300 rounded mb-3"
//             value={introduceInput}
//             onChange={(e) => setIntroduceInput(e.target.value)}
//           />

//           <div className="flex gap-2">
//             <button
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               onClick={() => {
//                 // 保存処理（API 呼び出し）はここに追加可能
//                 setUser({
//                   ...user,
//                   name: nameInput,
//                   introduce: introduceInput,
//                 });
//                 setEditing(false);
//               }}
//             >
//               保存
//             </button>
//             <button
//               className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               onClick={handleCancelClick}
//             >
//               キャンセル
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <p className="mb-2">
//             <strong>名前:</strong> {user.name}
//           </p>
//           <p className="mb-4">
//             <strong>自己紹介:</strong> {user.introduce ?? "未設定"}
//           </p>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={handleEditClick}
//           >
//             編集
//           </button>
//         </>
//       )}
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

// // --- Firebase 設定 ---
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

// // --- フロント用の User 型 ---
// type User = {
//   id: number;
//   name: string;
//   school_id: number;
//   introduce?: string;
//   uuid: string;
//   created_at: string;
//   updated_at: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [nameInput, setNameInput] = useState("");
//   const [introduceInput, setIntroduceInput] = useState("");

//   // --- ユーザー情報取得 ---
//   useEffect(() => {
//     const auth = getAuth();

//     const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
//       try {
//         const idToken = await firebaseUser.getIdToken(true);

//         const res = await fetch("http://localhost:8080/current_user", {
//           headers: { Authorization: `Bearer ${idToken}` },
//         });

//         if (!res.ok) throw new Error("ユーザー情報取得失敗");

//         const dataFromBackend = await res.json();
//         const data: User = {
//           id: dataFromBackend.ID,
//           name: dataFromBackend.Name,
//           school_id: dataFromBackend.SchoolID,
//           introduce: dataFromBackend.Introduce,
//           uuid: dataFromBackend.Uuid,
//           created_at: dataFromBackend.CreatedAt,
//           updated_at: dataFromBackend.UpdatedAt,
//         };

//         setUser(data);
//         console.log("取得したユーザー情報:", data);

//       } catch (err) {
//         console.error("ユーザー取得エラー:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const firebaseUser = auth.currentUser;
//     if (firebaseUser) fetchCurrentUser(firebaseUser);

//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) fetchCurrentUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;
//   if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

//   // --- 編集開始 ---
//   const handleEditClick = () => {
//     setNameInput(user.name);
//     setIntroduceInput(user.introduce ?? "");
//     setEditing(true);
//   };

//   const handleCancelClick = () => {
//     setEditing(false);
//   };

//   // --- 保存処理（バックエンドに PUT リクエスト送信） ---
//   const handleSaveClick = async () => {
//     if (!user) return;

//     try {
//       const res = await fetch("http://localhost:8080/update_user", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: user.id,
//           name: nameInput,
//           introduce: introduceInput,
//         }),
//       });

//       if (!res.ok) throw new Error("更新失敗");

//       const updatedUser = await res.json();
//       // 更新後のデータで画面を更新
//       setUser({
//         id: updatedUser.id,
//         name: updatedUser.name,
//         school_id: updatedUser.school_id,
//         introduce: updatedUser.introduce,
//         uuid: updatedUser.uuid,
//         created_at: updatedUser.created_at,
//         updated_at: updatedUser.updated_at,
//       });

//       setEditing(false);
//       alert("プロフィールを更新しました！");
//     } catch (err) {
//       console.error("更新エラー:", err);
//       alert("プロフィール更新に失敗しました");
//     }
//   };

//   return (
//     <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
//       <h2 className="text-blue-800 font-bold mb-4 text-lg">ユーザー情報</h2>

//       {editing ? (
//         <>
//           <label className="block text-blue-700 mb-1 font-medium">名前</label>
//           <input
//             className="w-full p-2 border border-blue-300 rounded mb-3"
//             value={nameInput}
//             onChange={(e) => setNameInput(e.target.value)}
//           />

//           <label className="block text-blue-700 mb-1 font-medium">自己紹介</label>
//           <textarea
//             className="w-full p-2 border border-blue-300 rounded mb-3"
//             value={introduceInput}
//             onChange={(e) => setIntroduceInput(e.target.value)}
//           />

//           <div className="flex gap-2">
//             <button
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               onClick={handleSaveClick}
//             >
//               保存
//             </button>
//             <button
//               className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               onClick={handleCancelClick}
//             >
//               キャンセル
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <p className="mb-2">
//             <strong>名前:</strong> {user.name}
//           </p>
//           <p className="mb-4">
//             <strong>自己紹介:</strong> {user.introduce ?? "未設定"}
//           </p>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={handleEditClick}
//           >
//             編集
//           </button>
//         </>
//       )}
//     </div>
//   );
// }










"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { firebaseConfig } from "../firebaseconfig/firebase";
import { API_BASE_URL } from "../api/api";

// --- Firebase 設定 ---
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF"
// };

initializeApp(firebaseConfig);

// --- フロント用の User 型 ---
type User = {
  id: number;
  name: string;
  school_id: number;
  introduce?: string;
  uuid: string;
  created_at: string;
  updated_at: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [introduceInput, setIntroduceInput] = useState("");

  // --- ユーザー情報取得 ---
  useEffect(() => {
    const auth = getAuth();

    const fetchCurrentUser = async (firebaseUser: FirebaseUser) => {
      try {
        const idToken = await firebaseUser.getIdToken(true);

        // const res = await fetch("http://localhost:8080/current_user", {
        const res = await fetch(`${API_BASE_URL}/current_user`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) throw new Error("ユーザー情報取得失敗");

        const dataFromBackend = await res.json();
        const data: User = {
          id: dataFromBackend.ID,
          name: dataFromBackend.Name,
          school_id: dataFromBackend.SchoolID,
          introduce: dataFromBackend.Introduce,
          uuid: dataFromBackend.Uuid,
          created_at: dataFromBackend.CreatedAt,
          updated_at: dataFromBackend.UpdatedAt,
        };

        setUser(data);
        console.log("取得したユーザー情報:", data);

      } catch (err) {
        console.error("ユーザー取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    const firebaseUser = auth.currentUser;
    if (firebaseUser) fetchCurrentUser(firebaseUser);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) fetchCurrentUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-4 text-blue-700">読み込み中…</p>;
  if (!user) return <p className="p-4 text-red-700">ユーザーが存在しません</p>;

  // --- 編集開始 ---
  const handleEditClick = () => {
    setNameInput(user.name);
    setIntroduceInput(user.introduce ?? "");
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  // --- 保存処理（バックエンドに PUT リクエスト送信） ---
  const handleSaveClick = async () => {
    if (!user) return;

    try {
      // const res = await fetch("http://localhost:8080/update_user", {
      const res = await fetch(`${API_BASE_URL}/update_user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: nameInput,
          introduce: introduceInput,
        }),
      });

      if (!res.ok) throw new Error("更新失敗");

      const updatedUser = await res.json();
      setUser({
        id: updatedUser.id,
        name: updatedUser.name,
        school_id: updatedUser.school_id,
        introduce: updatedUser.introduce,
        uuid: updatedUser.uuid,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      });

      setEditing(false);
      alert("プロフィールを更新しました！");
      window.location.reload();
    } catch (err) {
      console.error("更新エラー:", err);
      alert("プロフィール更新に失敗しました");
    }
  };

  return (
    <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto border border-blue-300">
      <h2 className="text-blue-800 font-bold mb-4 text-lg">ユーザー情報</h2>

      {editing ? (
        <>
          <label className="block text-blue-700 mb-1 font-medium">名前</label>
          <input
            className="w-full p-2 border border-blue-300 rounded mb-3"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <label className="block text-blue-700 mb-1 font-medium">自己紹介</label>
          <textarea
            className="w-full p-2 border border-blue-300 rounded mb-3"
            value={introduceInput}
            onChange={(e) => setIntroduceInput(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleSaveClick}
            >
              保存
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={handleCancelClick}
            >
              キャンセル
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2">
            <strong>名前:</strong> {user.name}
          </p>
          <p className="mb-4">
            <strong>自己紹介:</strong> {user.introduce ?? "未設定"}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleEditClick}
          >
            編集
          </button>
        </>
      )}

      {/* --- 取得したユーザーデータを全て表示 --- */}
      <div className="mt-6 p-4 bg-white border border-gray-300 rounded overflow-x-auto">
        <h3 className="font-bold text-gray-700 mb-2">デバッグ用: 全ユーザーデータ</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}