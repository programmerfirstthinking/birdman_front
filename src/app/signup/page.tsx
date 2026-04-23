// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import { 
//   getAuth, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   onAuthStateChanged, 
//   User 
// } from "firebase/auth";
// import { firebaseConfig } from "../firebaseconfig/firebase";
// import { API_BASE_URL } from "../api/api";


// // const firebaseConfig = {
// //   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
// //   authDomain: "share-info-project.firebaseapp.com",
// //   projectId: "share-info-project",
// //   storageBucket: "share-info-project.firebasestorage.app",
// //   messagingSenderId: "10017220780",
// //   appId: "1:10017220780:web:4820d384929f2d84735709",
// //   measurementId: "G-42VYEZ51GF"
// // };

// const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [password, setPassword] = useState(""); // ← 新しく追加

//   const router = useRouter();
//   const auth = getAuth();

//   // ----------------------
//   // バックエンドに送信して自動遷移
//   // ----------------------
//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();
//     try {
//       // const res = await fetch("http://localhost:8080/login", {
//       const res = await fetch(`${API_BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId,
//           password, // ← 新しく追加
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) {
//           router.push("/topic");
//         }
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//     }
//   };

//   // ----------------------
//   // ページロード時に自動ログインチェック
//   // ----------------------
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
//       if (!user) return;

//       const idToken = await user.getIdToken();

//       try {
//         // const res = await fetch("http://localhost:8080/is_user_exist", {
//         const res = await fetch(`${API_BASE_URL}/is_user_exist`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken }),
//         });

//         if (res.status === 200) {
//           router.push("/topic");
//         }
//       } catch (err) {
//         console.error("ユーザー存在確認エラー:", err);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   // ----------------------
//   // Googleログイン
//   // ----------------------
//   const handleGoogleLogin = async () => {
//     if (!name || !bio || !schoolId || !password) {
//       alert("名前・自己紹介・学校ID・パスワードは必須です");
//       return;
//     }

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       await sendToBackend(user);
//     } catch (err) {
//       console.error("Googleサインインエラー:", err);
//       alert("Googleサインインに失敗しました");
//     }
//   };

//   return (
//     <div>
//       <h2>Googleログイン</h2>
//       <input
//         type="text"
//         placeholder="名前"
//         value={name}
//         onChange={e => setName(e.target.value)}
//         maxLength={10}
//       />
//       <textarea
//         placeholder="自己紹介"
//         value={bio}
//         onChange={e => setBio(e.target.value)}
//         maxLength={30}
//       />
//       <input
//         type="text"
//         placeholder="学校ID（半角数字）"
//         value={schoolId}
//         onChange={e => setSchoolId(e.target.value.replace(/[^\d]/g, ""))}
//       />
//       <input
//         type="password"  // ← 新しく追加
//         placeholder="パスワード"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         maxLength={20}
//       />
//       <button onClick={handleGoogleLogin}>Googleでログイン</button>
//     </div>
//   );
// }













// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import { 
//   getAuth, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   onAuthStateChanged, 
//   User 
// } from "firebase/auth";

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
// const provider = new GoogleAuthProvider();

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();
//   const auth = getAuth(app);

//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();
//     try {
//       const res = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId,
//           password,
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) router.push("/srccode/topic");
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
//       if (!user) return;
//       const idToken = await user.getIdToken();

//       try {
//         const res = await fetch("http://localhost:8080/is_user_exist", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken }),
//         });

//         if (res.status === 200) router.push("/srccode/topic");
//       } catch (err) {
//         console.error("ユーザー存在確認エラー:", err);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   const handleGoogleLogin = async () => {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;
//     await sendToBackend(user);
//   };

//   // 🔹 全項目入力済みかどうか
//   const isFormValid = name && bio && schoolId && password;

//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "100vh",
//       backgroundColor: "#f0f4f8",
//       fontFamily: "Arial, sans-serif"
//     }}>
//       <h1 style={{
//         fontSize: "2rem",
//         marginBottom: "20px",
//         color: "#1f2937",
//         textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
//       }}>
//         Birdman Webへようこそ
//       </h1>

//       <div style={{
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         width: "100%",
//         maxWidth: "400px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px"
//       }}>
//         <input
//           type="text"
//           placeholder="名前"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           maxLength={10}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <textarea
//           placeholder="自己紹介"
//           value={bio}
//           onChange={e => setBio(e.target.value)}
//           maxLength={30}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem", resize: "none" }}
//         />
//         <input
//           type="text"
//           placeholder="学校ID（半角数字）"
//           value={schoolId}
//           onChange={e => setSchoolId(e.target.value.replace(/[^\d]/g, ""))}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <input
//           type="password"
//           placeholder="パスワード"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           maxLength={20}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <button
//           onClick={handleGoogleLogin}
//           disabled={!isFormValid}
//           style={{
//             padding: "12px",
//             borderRadius: "5px",
//             border: "none",
//             backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
//             color: "white",
//             fontWeight: "bold",
//             fontSize: "1rem",
//             cursor: isFormValid ? "pointer" : "not-allowed",
//             transition: "background-color 0.2s"
//           }}
//           onMouseOver={e => isFormValid && (e.currentTarget.style.backgroundColor = "#2563eb")}
//           onMouseOut={e => isFormValid && (e.currentTarget.style.backgroundColor = "#3b82f6")}
//         >
//           Googleでログイン
//         </button>
//       </div>
//     </div>
//   );
// }








// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import { 
//   getAuth, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   onAuthStateChanged, 
//   User 
// } from "firebase/auth";

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
// const provider = new GoogleAuthProvider();

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [password, setPassword] = useState("");
//   const [schools, setSchools] = useState<School[]>([]);
//   const router = useRouter();
//   const auth = getAuth(app);

//   // 🔹 学校一覧を取得
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/admin/schools");
//         const data: School[] = await res.json();
//         setSchools(data);
//       } catch (err) {
//         console.error("学校一覧取得エラー:", err);
//       }
//     };
//     fetchSchools();
//   }, []);

//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();
//     try {
//       const res = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId,
//           password,
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) router.push("/srccode/topic");
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//     }
//   };

//   // useEffect(() => {
//   //   const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
//   //     if (!user) return;
//   //     const idToken = await user.getIdToken();
//   //     try {
//   //       const res = await fetch("http://localhost:8080/is_user_exist", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ idToken }),
//   //       });
//   //       if (res.status === 200) router.push("/srccode/topic");
//   //     } catch (err) {
//   //       console.error("ユーザー存在確認エラー:", err);
//   //     }
//   //   });
//   //   return () => unsubscribe();
//   // }, [auth]);

//   const handleGoogleLogin = async () => {
//     if (!name || !bio || !schoolId || !password) {
//       alert("名前・自己紹介・学校は必須です");
//       return;
//     }

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       await sendToBackend(user);
//     } catch (err) {
//       console.error("Googleサインインエラー:", err);
//       alert("Googleサインインに失敗しました");
//     }
//   };

//   const isFormValid = name && bio && schoolId && password;

//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "100vh",
//       backgroundColor: "#f0f4f8",
//       fontFamily: "Arial, sans-serif"
//     }}>
//       <h1 style={{
//         fontSize: "2rem",
//         marginBottom: "20px",
//         color: "#1f2937",
//         textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
//       }}>
//         Birdman Webへようこそ
//       </h1>

//       <div style={{
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         width: "100%",
//         maxWidth: "400px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px"
//       }}>
//         <input
//           type="text"
//           placeholder="名前"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           maxLength={10}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <textarea
//           placeholder="自己紹介"
//           value={bio}
//           onChange={e => setBio(e.target.value)}
//           maxLength={30}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem", resize: "none" }}
//         />
//         <select
//           value={schoolId}
//           onChange={e => setSchoolId(e.target.value)}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         >
//           <option value="">学校を選択してください</option>
//           {schools.map(s => (
//             <option key={s.ID} value={s.ID}>{s.SchoolName}</option>
//           ))}
//         </select>
//         <input
//           type="password"
//           placeholder="パスワード"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           maxLength={20}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <button
//           onClick={handleGoogleLogin}
//           disabled={!isFormValid}
//           style={{
//             padding: "12px",
//             borderRadius: "5px",
//             border: "none",
//             backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
//             color: "white",
//             fontWeight: "bold",
//             fontSize: "1rem",
//             cursor: isFormValid ? "pointer" : "not-allowed",
//             transition: "background-color 0.2s"
//           }}
//           onMouseOver={e => isFormValid && (e.currentTarget.style.backgroundColor = "#2563eb")}
//           onMouseOut={e => isFormValid && (e.currentTarget.style.backgroundColor = "#3b82f6")}
//         >
//           Googleでログイン
//         </button>
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function SchoolSelect() {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [selectedSchool, setSelectedSchool] = useState<number | "">("");

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/schools_list");
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data: School[] = await res.json();
//         setSchools(data);
//       } catch (err) {
//         console.error(err);
//         alert("学校の取得に失敗しました");
//       }
//     };

//     fetchSchools();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>学校を選択</h2>
//       <select
//         value={selectedSchool}
//         onChange={(e) => setSelectedSchool(Number(e.target.value))}
//         style={{ padding: "10px", borderRadius: "5px", fontSize: "1rem" }}
//       >
//         <option value="">学校を選択してください</option>
//         {schools.map((s) => (
//           <option key={s.ID} value={s.ID}>
//             {s.SchoolName}
//           </option>
//         ))}
//       </select>

//       {selectedSchool && (
//         <p style={{ marginTop: "10px" }}>
//           選択中の学校ID: {selectedSchool}
//         </p>
//       )}
//     </div>
//   );
// }









// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

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

// const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState<number | "">("");
//   const [password, setPassword] = useState("");
//   const [schools, setSchools] = useState<School[]>([]);

//   const router = useRouter();
//   const auth = getAuth(app);

//   // 🔹 学校一覧取得
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/schools_list");
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data: School[] = await res.json();
//         setSchools(data);
//       } catch (err) {
//         console.error(err);
//         alert("学校の取得に失敗しました");
//       }
//     };
//     fetchSchools();
//   }, []);

//   // 🔹 バックエンド送信
//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();
//     try {
//       const res = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId, // ← ここは選択した学校のID
//           password,
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) router.push("/srccode/topic");
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//       alert("ログインに失敗しました");
//     }
//   };

//   // 🔹 Googleログイン
//   const handleGoogleLogin = async () => {
//     if (!name || !bio || !schoolId || !password) {
//       alert("すべての項目を入力してください");
//       return;
//     }

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       await sendToBackend(user);
//     } catch (err) {
//       console.error("Googleサインインエラー:", err);
//       alert("Googleサインインに失敗しました");
//     }
//   };

//   const isFormValid = name && bio && schoolId && password;

//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "100vh",
//       backgroundColor: "#f0f4f8",
//       fontFamily: "Arial, sans-serif"
//     }}>
//       <h1 style={{
//         fontSize: "2rem",
//         marginBottom: "20px",
//         color: "#1f2937",
//         textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
//       }}>
//         Birdman Webへようこそ
//       </h1>

//       <div style={{
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         width: "100%",
//         maxWidth: "400px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px"
//       }}>
//         <input
//           type="text"
//           placeholder="名前"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           maxLength={10}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <textarea
//           placeholder="自己紹介"
//           value={bio}
//           onChange={e => setBio(e.target.value)}
//           maxLength={30}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem", resize: "none" }}
//         />
//         <select
//           value={schoolId}
//           onChange={e => setSchoolId(Number(e.target.value))}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         >
//           <option value="">学校を選択してください</option>
//           {schools.map(s => (
//             <option key={s.ID} value={s.ID}>
//               {s.SchoolName}
//             </option>
//           ))}
//         </select>
//         <input
//           type="password"
//           placeholder="パスワード"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           maxLength={20}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" }}
//         />
//         <button
//           onClick={handleGoogleLogin}
//           disabled={!isFormValid}
//           style={{
//             padding: "12px",
//             borderRadius: "5px",
//             border: "none",
//             backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
//             color: "white",
//             fontWeight: "bold",
//             fontSize: "1rem",
//             cursor: isFormValid ? "pointer" : "not-allowed",
//             transition: "background-color 0.2s"
//           }}
//           onMouseOver={e => isFormValid && (e.currentTarget.style.backgroundColor = "#2563eb")}
//           onMouseOut={e => isFormValid && (e.currentTarget.style.backgroundColor = "#3b82f6")}
//         >
//           Googleでログイン
//         </button>
//       </div>
//     </div>
//   );
// }







// // リロードしたらしっかり動く
"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, // ← ★追加
  User
} from "firebase/auth";
import { firebaseConfig } from "../firebaseconfig/firebase";
import { API_BASE_URL } from "../api/api";

// ----------------------
// Firebase 設定
// ----------------------
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

// ----------------------
// 型定義
// ----------------------
type School = {
  ID: number;
  SchoolName: string;
};

// ----------------------
// コンポーネント
// ----------------------
export default function LoginPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [schoolId, setSchoolId] = useState(""); // ← 文字列で保持
  const [password, setPassword] = useState("");
  const [schools, setSchools] = useState<School[]>([]);

  const router = useRouter();
  const auth = getAuth(app);

  // ----------------------
// 自動ログインチェック
// ----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const idToken = await user.getIdToken();

        const res = await fetch(`${API_BASE_URL}/is_user_exist`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.status === 200) {
          const data = await res.json();

          // ユーザー存在
          if (data.exist === true || data.uid) {
            router.push("/topic");
          }
        }
      } catch (err) {
        console.error("ユーザー存在確認エラー:", err);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // ----------------------
  // 学校一覧を取得
  // ----------------------
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // const res = await fetch("http://localhost:8080/schools_list");
        const res = await fetch(`${API_BASE_URL}/schools_list`);
        if (!res.ok) throw new Error("学校取得失敗");
        const data: School[] = await res.json();
        setSchools(data);
      } catch (err) {
        console.error(err);
        alert("学校の取得に失敗しました");
      }
    };
    fetchSchools();
  }, []);

  // ----------------------
  // バックエンド送信
  // ----------------------
  const sendToBackend = async (user: User) => {
    if (!user) return;

    const idToken = await user.getIdToken();

    try {
      // const res = await fetch("http://localhost:8080/login", {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          introduce: bio,
          schoolId, // 文字列で送信
          password,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.uid) {
          router.push("/topic");
        }
      } else {
        const errData = await res.json();
        console.error("バックエンドエラー:", errData);
        alert(errData.error || "ログインに失敗しました");
      }
    } catch (err) {
      console.error("バックエンド通信エラー:", err);
      alert("ログインに失敗しました");
    }
  };

  // ----------------------
  // Googleログイン
  // ----------------------
  const handleGoogleLogin = async () => {
    if (!name || !bio || !schoolId || !password) {
      alert("すべての項目を入力してください");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await sendToBackend(user);
    } catch (err) {
      console.error("Googleサインインエラー:", err);
      alert("Googleサインインに失敗しました");
    }
  };

  const isFormValid = name && bio && schoolId && password;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Birdman Webへようこそ</h1>

      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={10}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <textarea
          placeholder="自己紹介"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={30}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "none" }}
        />

        <select
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)} // ← 文字列のまま保持
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">学校を選択してください</option>
          {schools.map(s => (
            <option key={s.ID} value={s.ID.toString()}>
              {s.SchoolName}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={20}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button
          onClick={handleGoogleLogin}
          disabled={!isFormValid}
          style={{
            padding: "12px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
            color: "white",
            fontWeight: "bold",
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
}









// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import {
//   getAuth,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   User
// } from "firebase/auth";
// import { firebaseConfig } from "../firebaseconfig/firebase";
// import { API_BASE_URL } from "../api/api";

// const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();

// type School = {
//   ID: number;
//   SchoolName: string;
// };

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [password, setPassword] = useState("");
//   const [schools, setSchools] = useState<School[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(true);

//   const router = useRouter();
//   const auth = getAuth(app);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) return;

//       try {
//         const idToken = await user.getIdToken();
//         const res = await fetch(`${API_BASE_URL}/is_user_exist`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken }),
//         });

//         if (res.status === 200) {
//           const data = await res.json();
//           if (data.exist === true || data.uid) {
//             router.push("/topic");
//           }
//         }
//       } catch (err) {
//         console.error("ユーザー存在確認エラー:", err);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, router]);

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/schools_list`);
//         if (!res.ok) throw new Error("学校取得失敗");
//         const data: School[] = await res.json();
//         setSchools(data);
//       } catch (err) {
//         console.error(err);
//         alert("学校の取得に失敗しました");
//       } finally {
//         setLoadingSchools(false);
//       }
//     };
//     fetchSchools();
//   }, []);

//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();

//     try {
//       const res = await fetch(`${API_BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId,
//           password,
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) {
//           router.push("/topic");
//         }
//       } else {
//         const errData = await res.json();
//         console.error("バックエンドエラー:", errData);
//         alert(errData.error || "ログインに失敗しました");
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//       alert("ログインに失敗しました");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     if (!name || !bio || !schoolId || !password) {
//       alert("すべての項目を入力してください");
//       return;
//     }

//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       await sendToBackend(user);
//     } catch (err) {
//       console.error("Googleサインインエラー:", err);
//       alert("Googleサインインに失敗しました");
//     }
//   };

//   const isFormValid = name && bio && schoolId && password;

//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "100vh",
//       backgroundColor: "#f0f4f8",
//       fontFamily: "Arial, sans-serif",
//       padding: "20px",
//     }}>
//       <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Birdman Webへようこそ</h1>

//       <div style={{
//         backgroundColor: "white",
//         padding: "30px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         width: "100%",
//         maxWidth: "400px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px"
//       }}>
//         <input
//           type="text"
//           placeholder="名前"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           maxLength={10}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />

//         <textarea
//           placeholder="自己紹介"
//           value={bio}
//           onChange={e => setBio(e.target.value)}
//           maxLength={30}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "none" }}
//         />

//         <select
//           value={schoolId}
//           onChange={e => setSchoolId(e.target.value)}
//           disabled={loadingSchools || schools.length === 0}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//         >
//           {loadingSchools ? (
//             <option>読み込み中…</option>
//           ) : (
//             <>
//               <option value="">学校を選択してください</option>
//               {schools.map(s => (
//                 <option key={s.ID} value={s.ID.toString()}>
//                   {s.SchoolName}
//                 </option>
//               ))}
//             </>
//           )}
//         </select>

//         <input
//           type="password"
//           placeholder="パスワード"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           maxLength={20}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />

//         <button
//           onClick={handleGoogleLogin}
//           disabled={!isFormValid}
//           style={{
//             padding: "12px",
//             borderRadius: "5px",
//             border: "none",
//             backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
//             color: "white",
//             fontWeight: "bold",
//             cursor: isFormValid ? "pointer" : "not-allowed",
//           }}
//         >
//           Googleでログイン
//         </button>
//       </div>
//     </div>
//   );
// }











// "use client";

// import { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import {
//   getAuth,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   User
// } from "firebase/auth";
// import { firebaseConfig } from "../firebaseconfig/firebase";
// import { API_BASE_URL } from "../api/api";

// const app = initializeApp(firebaseConfig);
// const provider = new GoogleAuthProvider();

// export default function LoginPage() {
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(true); // ← 自動ログイン判定中用

//   const router = useRouter();
//   const auth = getAuth(app);

//   // ----------------------
//   // 自動ログインチェック
//   // ----------------------
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
//       if (!user) {
//         setLoading(false); // ユーザーいなければロード完了
//         return;
//       }

//       try {
//         const idToken = await user.getIdToken();

//         const res = await fetch(`${API_BASE_URL}/is_user_exist`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ idToken }),
//         });

//         if (res.status === 200) {
//           const data = await res.json();

//           if (data.exist || data.uid) {
//             // すでにユーザー存在 → 自動リダイレクト
//             router.push("/topic");
//           } else {
//             // Firebaseログイン済みだけどバックエンドに存在しない場合は入力待ち
//             setLoading(false);
//           }
//         } else {
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("ユーザー存在確認エラー:", err);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, router]);

//   // ----------------------
//   // バックエンド送信
//   // ----------------------
//   const sendToBackend = async (user: User) => {
//     if (!user) return;

//     const idToken = await user.getIdToken();

//     try {
//       const res = await fetch(`${API_BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idToken,
//           name,
//           introduce: bio,
//           schoolId,
//           password,
//         }),
//       });

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.uid) {
//           router.push("/topic");
//         }
//       } else {
//         const errData = await res.json();
//         console.error("バックエンドエラー:", errData);
//         alert(errData.error || "ログインに失敗しました");
//       }
//     } catch (err) {
//       console.error("バックエンド通信エラー:", err);
//       alert("ログインに失敗しました");
//     }
//   };

//   // ----------------------
//   // Googleログイン
//   // ----------------------
//   const handleGoogleLogin = async () => {
//     if (!name || !bio || !schoolId || !password) {
//       alert("すべての項目を入力してください");
//       return;
//     }

//     try {
//       const result = await signInWithPopup(auth, provider);
//       await sendToBackend(result.user);
//     } catch (err) {
//       console.error("Googleサインインエラー:", err);
//       alert("Googleサインインに失敗しました");
//     }
//   };

//   // ----------------------
//   // フォーム入力チェック
//   // ----------------------
//   const isFormValid = name && bio && schoolId && password;

//   // ----------------------
//   // JSX
//   // ----------------------
//   if (loading) {
//     // 自動ログイン判定中は何も表示しない or ローディング
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f0f4f8", padding: "20px" }}>
//       <h1>Birdman Webへようこそ</h1>

//       <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
//         <input type="text" placeholder="名前" value={name} onChange={e => setName(e.target.value)} />
//         <textarea placeholder="自己紹介" value={bio} onChange={e => setBio(e.target.value)} />
//         <input type="text" placeholder="学校ID" value={schoolId} onChange={e => setSchoolId(e.target.value.replace(/[^\d]/g, ""))} />
//         <input type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} />
//         <button onClick={handleGoogleLogin} disabled={!isFormValid}>Googleでログイン</button>
//       </div>
//     </div>
//   );
// }