
// "use client";

// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation"; // ← ここを追加

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

// type MakeGroupRequest = {
//   groupName: string;
//   idToken: string;
//   schoolId: number;
// };

// export default function CreateGroup() {
//   const [groupName, setGroupName] = useState("");
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [groups, setGroups] = useState<any[]>([]);
//   const [fetchingGroups, setFetchingGroups] = useState(true);

//   const auth = getAuth();

//   // Firebase currentUser を監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // ページ初回レンダリングで全グループ取得
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setFetchingGroups(true);
//         const res = await fetch("http://localhost:8080/getgroups");
//         if (!res.ok) throw new Error("グループ取得に失敗しました");
//         const data = await res.json();
//         setGroups(data.all_groups || []);
//       } catch (err: any) {
//         console.error(err);
//         alert(`グループ取得エラー: ${err.message}`);
//       } finally {
//         setFetchingGroups(false);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!currentUser) {
//       alert("ログインしてください");
//       return;
//     }

//     if (!groupName) {
//       alert("グループ名を入力してください");
//       return;
//     }

//     setLoading(true);

//     try {
//       const idToken = await currentUser.getIdToken();

//       const payload: MakeGroupRequest = {
//         groupName,
//         idToken,
//         schoolId: 1, // ここは固定値や URL パラメータに応じて変更可能
//       };

//       const res = await fetch("http://localhost:8080/makegroup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("グループ作成に失敗");

//       const data = await res.json();
//       alert("グループ作成成功！");

//       // 作成したグループIDは data.created_group_id
//       // 作成後、最新の全グループを再取得
//       const groupsRes = await fetch("http://localhost:8080/getgroups");
//       const groupsData = await groupsRes.json();
//       setGroups(groupsData.all_groups || []);

//       console.log(groupsData)

//       // フォームクリア
//       setGroupName("");
//     } catch (err: any) {
//       console.error(err);
//       alert(`エラー: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Googleサインイン
//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setCurrentUser(result.user);
//       alert("Googleサインイン成功！");
//     } catch (err: any) {
//       console.error(err);
//       alert(`Googleサインインエラー: ${err.message}`);
//     }
//   };

//   function Create_GroupTopics(id){
//     router.push('/srccode/topic');
//   }

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>グループ作成</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//       {currentUser && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
//           <input
//             type="text"
//             placeholder="グループ名を入力"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             required
//             style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//           >
//             {loading ? "作成中..." : "グループを作成"}
//           </button>
//         </form>
//       )}

//       <h2>全グループ一覧</h2>
//       {fetchingGroups ? (
//         <p>読み込み中...</p>
//       ) : groups.length === 0 ? (
//         <p>まだグループはありません</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
//           {groups.map((g) => (
//             <li
//               key={g.ID}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "16px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#f9f9f9",
//                 width: "100%",      // 横長にする
//                 maxWidth: "600px",  // 任意で最大幅指定
//               }}
//             >
//               <div>
//                 <p style={{ margin: "4px 0" }}>グループID: {g.ID}</p>
//                 <p style={{ margin: "4px 0" }}>ユーザーID: {g.UserID}</p>
//                 <p style={{ margin: "4px 0" }}>学校ID: {g.SchoolID}</p>
//                 <p style={{ margin: "4px 0" }}>作成日時: {new Date(g.CreatedAt).toLocaleString()}</p>
//               </div>
//               <button
//                 style={{
//                   padding: "8px 12px",
//                   backgroundColor: "#2196F3",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => alert(`グループ ${g.ID} のトピック作成ページへ`)}
//               >
//                 トピックを作る
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation"; // ← ここを追加

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

// type MakeGroupRequest = {
//   groupName: string;
//   idToken: string;
//   schoolId: number;
// };

// export default function CreateGroup() {
//   const [groupName, setGroupName] = useState("");
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [groups, setGroups] = useState<any[]>([]);
//   const [fetchingGroups, setFetchingGroups] = useState(true);

//   const auth = getAuth();
//   const router = useRouter(); // ← useRouter を使う

//   // Firebase currentUser を監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // ページ初回レンダリングで全グループ取得
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setFetchingGroups(true);
//         const res = await fetch("http://localhost:8080/getgroups");
//         if (!res.ok) throw new Error("グループ取得に失敗しました");
//         const data = await res.json();
//         setGroups(data.all_groups || []);
//       } catch (err: any) {
//         console.error(err);
//         alert(`グループ取得エラー: ${err.message}`);
//       } finally {
//         setFetchingGroups(false);
//       }
//     };
//     fetchGroups();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!currentUser) {
//       alert("ログインしてください");
//       return;
//     }

//     if (!groupName) {
//       alert("グループ名を入力してください");
//       return;
//     }

//     setLoading(true);

//     try {
//       const idToken = await currentUser.getIdToken();

//       const payload: MakeGroupRequest = {
//         groupName,
//         idToken,
//         schoolId: 1,
//       };

//       const res = await fetch("http://localhost:8080/makegroup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("グループ作成に失敗");

//       const data = await res.json();
//       alert("グループ作成成功！");

//       const groupsRes = await fetch("http://localhost:8080/getgroups");
//       const groupsData = await groupsRes.json();
//       setGroups(groupsData.all_groups || []);
//       console.log(groupsData)

//       setGroupName("");
//     } catch (err: any) {
//       console.error(err);
//       alert(`エラー: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Googleサインイン
//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setCurrentUser(result.user);
//       alert("Googleサインイン成功！");
//     } catch (err: any) {
//       console.error(err);
//       alert(`Googleサインインエラー: ${err.message}`);
//     }
//   };

//   // グループIDのページに遷移する関数
//   const goToGroupTopic = (groupId: number) => {
//     router.push(`/srccode/makeSchoolTopic/${groupId}`);
//   };

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>グループ作成</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//       {currentUser && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
//           <input
//             type="text"
//             placeholder="グループ名を入力"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             required
//             style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//           >
//             {loading ? "作成中..." : "グループを作成"}
//           </button>
//         </form>
//       )}

//       <h2>全グループ一覧</h2>
//       {fetchingGroups ? (
//         <p>読み込み中...</p>
//       ) : groups.length === 0 ? (
//         <p>まだグループはありません</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
//           {groups.map((g) => (
//             <li
//               key={g.ID}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "16px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#f9f9f9",
//                 width: "100%",
//                 maxWidth: "600px",
//               }}
//             >
//               <div>
//                 <p style={{ margin: "4px 0" }}>グループID: {g.ID}</p>
//                 <p style={{ margin: "4px 0" }}>ユーザーID: {g.UserID}</p>
//                 <p style={{ margin: "4px 0" }}>学校ID: {g.SchoolID}</p>
//                 <p style={{ margin: "4px 0" }}>作成日時: {new Date(g.CreatedAt).toLocaleString()}</p>
//               </div>
//               <button
//                 style={{
//                   padding: "8px 12px",
//                   backgroundColor: "#2196F3",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => goToGroupTopic(g.ID)}
//               >
//                 トピックを作る
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }









// "use client";

// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";

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

// type MakeGroupRequest = {
//   groupName: string;
//   idToken: string;
//   schoolId: number;
// };

// export default function CreateGroup() {
//   const [groupName, setGroupName] = useState("");
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [groups, setGroups] = useState<any[]>([]);
//   const [fetchingGroups, setFetchingGroups] = useState(true);
//   const [schoolId, setSchoolId] = useState<number | null>(null);

//   const auth = getAuth();
//   const router = useRouter();

//   // Firebase currentUser を監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // URL の最後の数字から schoolId を取得
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setSchoolId(parsedId);
//   }, []);

//   // ページ初回レンダリングで全グループ取得
// // ページ初回レンダリングで全グループ取得
//   // useEffect(() => {
//   //   const fetchGroups = async () => {
//   //     if (!schoolId) return; // schoolId がまだない場合は何もしない
//   //     try {
//   //       setFetchingGroups(true);

//   //       const res = await fetch("http://localhost:8080/getgroups", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ groupID: schoolId }), // ここで schoolId を JSON として送信
//   //       });

//   //       if (!res.ok) throw new Error("グループ取得に失敗しました");

//   //       const data = await res.json();
//   //       setGroups(data.all_groups || []);
//   //     } catch (err: any) {
//   //       console.error(err);
//   //       alert(`グループ取得エラー: ${err.message}`);
//   //     } finally {
//   //       setFetchingGroups(false);
//   //     }
//   //   };

//   //   fetchGroups();
//   // }, [schoolId]); // schoolId が取得できたら実行

//   useEffect(() => {
//     const fetchGroups = async () => {
//       if (!schoolId) {
//         console.log("schoolId がまだ取得できていません");
//         return; // schoolId がまだない場合は何もしない
//       }

//       console.log("fetchGroups 実行開始, schoolId:", schoolId);

//       try {
//         setFetchingGroups(true);

//         const res = await fetch("http://localhost:8080/getgroups", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ groupID: schoolId }), // schoolId を JSON として送信
//         });

//         if (!res.ok) {
//           console.error("HTTP エラー:", res.status, res.statusText);
//           throw new Error("グループ取得に失敗しました");
//         }

//         const data = await res.json();
//         console.log("サーバーから返ってきたデータ:", data);

//         if (!data.all_groups) {
//           console.warn("all_groups プロパティが存在しません:", data);
//         } else {
//           console.log("取得した all_groups:", data.all_groups);
//         }

//         setGroups(data.all_groups || []);
//       } catch (err: any) {
//         console.error("fetchGroups 内でエラー発生:", err);
//         alert(`グループ取得エラー: ${err.message}`);
//       } finally {
//         setFetchingGroups(false);
//       }
//     };

//     fetchGroups();
//   }, [schoolId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!currentUser) {
//       alert("ログインしてください");
//       return;
//     }

//     if (!groupName) {
//       alert("グループ名を入力してください");
//       return;
//     }

//     if (!schoolId) {
//       alert("schoolId が取得できませんでした");
//       return;
//     }

//     setLoading(true);

//     try {
//       const idToken = await currentUser.getIdToken();

//       const payload: MakeGroupRequest = {
//         groupName,
//         idToken,
//         schoolId, // URL から取得した schoolId
//       };

//       const res = await fetch("http://localhost:8080/makegroup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("グループ作成に失敗");

//       const data = await res.json();
//       alert("グループ作成成功！");

//       // グループ作成後にグループ一覧を再取得
//       const groupsRes = await fetch("http://localhost:8080/getgroups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ groupID: schoolId }), // schoolId を JSON で送信
//       });
//       const groupsData = await groupsRes.json();
//       console.log("バックエンドから返ってきたデータ:", groupsData.all_groups); // ← ここで確認
//       setGroups(groupsData.all_groups || []);

//       setGroupName("");
//     } catch (err: any) {
//       console.error(err);
//       alert(`エラー: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Googleサインイン
//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setCurrentUser(result.user);
//       alert("Googleサインイン成功！");
//     } catch (err: any) {
//       console.error(err);
//       alert(`Googleサインインエラー: ${err.message}`);
//     }
//   };

//   const goToGroupTopic = (groupId: number) => {
//     router.push(`/srccode/makeSchoolTopic/${groupId}`);
//   };

//   return (
//     <div style={{ padding: "16px" }}>
//       {/* <h2>グループ作成</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//       {currentUser && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
//           <input
//             type="text"
//             placeholder="グループ名を入力"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             required
//             style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//           >
//             {loading ? "作成中..." : "グループを作成"}
//           </button>
//         </form>
//       )}

//       <h2>全グループ一覧</h2>
//       {fetchingGroups ? (
//         <p>読み込み中...</p>
//       ) : groups.length === 0 ? (
//         <p>まだグループはありません</p>
//       ) : (
//         <ul>
//           {groups.map((g) => (
//             <li key={g.group.ID}>
//               <p>グループID: {g.group.ID}</p>
//               <p>ユーザーID: {g.group.UserID}</p>
//               <p>学校ID: {g.group.SchoolID}</p>
//               <p>作成日時: {new Date(g.group.CreatedAt).toLocaleString()}</p>

//               {g.contents.length > 0 ? (
//                 <ul>
//                   {g.contents.map((c) => (
//                     <li key={c.ID}>
//                       <strong>コンテンツ:</strong> {c.Content}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>コンテンツはありません</p>
//               )}
//             </li>
//           ))}
//         </ul>
//       )} */}
//     </div>
//   );
// }









// "use client";

// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";

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

// type MakeGroupRequest = {
//   groupName: string;
//   idToken: string;
//   schoolId: number;
// };

// type GroupContent = {
//   id: number;
//   content: string;
//   userId: number;
// };

// type GroupItem = {
//   id: number;
//   userId: number;
//   schoolId: number;
//   createdAt: string;
//   updatedAt: string;
//   contents: GroupContent[];
// };

// export default function CreateGroup() {
//   const [groupName, setGroupName] = useState("");
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [groups, setGroups] = useState<GroupItem[]>([]);
//   const [fetchingGroups, setFetchingGroups] = useState(true);
//   const [schoolId, setSchoolId] = useState<number | null>(null);

//   const auth = getAuth();
//   const router = useRouter();

//   // Firebase currentUser を監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // URL の最後の数字から schoolId を取得
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setSchoolId(parsedId);
//   }, []);

//   // ページ初回レンダリングで全グループ取得
//   useEffect(() => {
//     const fetchGroups = async () => {
//       if (!schoolId) {
//         console.log("schoolId がまだ取得できていません");
//         return;
//       }

//       console.log("fetchGroups 実行開始, schoolId:", schoolId);

//       try {
//         setFetchingGroups(true);

//         const res = await fetch("http://localhost:8080/getgroups", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ groupID: schoolId }),
//         });

//         if (!res.ok) {
//           console.error("HTTP エラー:", res.status, res.statusText);
//           throw new Error("グループ取得に失敗しました");
//         }

//         const data = await res.json();
//         console.log("サーバーから返ってきたデータ:", data);

//         if (!data.all_groups) {
//           console.warn("all_groups プロパティが存在しません:", data);
//           setGroups([]);
//           return;
//         }

//         // グループごとに箱を作り、contents を整理
//         const groupedData: GroupItem[] = data.all_groups.map((g: any) => ({
//           id: g.group.ID,
//           userId: g.group.UserID,
//           schoolId: g.group.SchoolID,
//           createdAt: g.group.CreatedAt,
//           updatedAt: g.group.UpdatedAt,
//           contents: g.contents
//             ? g.contents.map((c: any) => ({
//                 id: c.ID,
//                 content: c.Content,
//                 userId: c.UserID
//               }))
//             : []
//         }));

//         console.log("整形後のグループデータ:", groupedData);
//         setGroups(groupedData);
//       } catch (err: any) {
//         console.error("fetchGroups 内でエラー発生:", err);
//         alert(`グループ取得エラー: ${err.message}`);
//       } finally {
//         setFetchingGroups(false);
//       }
//     };

//     fetchGroups();
//   }, [schoolId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!currentUser) {
//       alert("ログインしてください");
//       return;
//     }

//     if (!groupName) {
//       alert("グループ名を入力してください");
//       return;
//     }

//     if (!schoolId) {
//       alert("schoolId が取得できませんでした");
//       return;
//     }

//     setLoading(true);

//     try {
//       const idToken = await currentUser.getIdToken();

//       const payload: MakeGroupRequest = {
//         groupName,
//         idToken,
//         schoolId,
//       };

//       const res = await fetch("http://localhost:8080/makegroup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("グループ作成に失敗");

//       const data = await res.json();
//       alert("グループ作成成功！");

//       // グループ作成後に一覧を再取得
//       const groupsRes = await fetch("http://localhost:8080/getgroups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ groupID: schoolId }),
//       });
//       const groupsData = await groupsRes.json();

//       if (groupsData.all_groups) {
//         const groupedData: GroupItem[] = groupsData.all_groups.map((g: any) => ({
//           id: g.group.ID,
//           userId: g.group.UserID,
//           schoolId: g.group.SchoolID,
//           createdAt: g.group.CreatedAt,
//           updatedAt: g.group.UpdatedAt,
//           contents: g.contents
//             ? g.contents.map((c: any) => ({
//                 id: c.ID,
//                 content: c.Content,
//                 userId: c.UserID
//               }))
//             : []
//         }));
//         setGroups(groupedData);
//         console.log("作成後の整形グループデータ:", groupedData);
//       }

//       setGroupName("");
//     } catch (err: any) {
//       console.error(err);
//       alert(`エラー: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setCurrentUser(result.user);
//       alert("Googleサインイン成功！");
//     } catch (err: any) {
//       console.error(err);
//       alert(`Googleサインインエラー: ${err.message}`);
//     }
//   };

//   const goToGroupTopic = (groupId: number) => {
//     router.push(`/srccode/makeSchoolTopic/${groupId}`);
//   };

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>グループ作成</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//       {currentUser && (
//         <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
//           <input
//             type="text"
//             placeholder="グループ名を入力"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             required
//             style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//           >
//             {loading ? "作成中..." : "グループを作成"}
//           </button>
//         </form>
//       )}

//       <h2>全グループ一覧</h2>
//       {fetchingGroups ? (
//         <p>読み込み中...</p>
//       ) : groups.length === 0 ? (
//         <p>まだグループはありません</p>
//       ) : (
//         <ul>
//           {groups.map((g) => (
//             <li key={g.id} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}>
//               <p>グループID: {g.id}</p>
//               <p>ユーザーID: {g.userId}</p>
//               <p>学校ID: {g.schoolId}</p>
//               <p>作成日時: {new Date(g.createdAt).toLocaleString()}</p>

//               {g.contents.length > 0 ? (
//                 <ul>
//                   {g.contents.map((c) => (
//                     <li key={c.id}>
//                       <strong>コンテンツ:</strong> {c.content}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>コンテンツはありません</p>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }













// "use client";

// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";

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

// type MakeGroupRequest = {
//   groupName: string;
//   idToken: string;
//   schoolId: number;
// };

// type AddContentRequest = {
//   groupId: number;
//   content: string;
//   idToken: string;
// };

// type GroupContent = {
//   id: number;
//   content: string;
//   userId: number;
// };

// type GroupItem = {
//   id: number;
//   userId: number;
//   schoolId: number;
//   createdAt: string;
//   updatedAt: string;
//   contents: GroupContent[];
// };

// export default function CreateGroup() {
//   const [groupName, setGroupName] = useState("");
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [groups, setGroups] = useState<GroupItem[]>([]);
//   const [fetchingGroups, setFetchingGroups] = useState(true);
//   const [schoolId, setSchoolId] = useState<number | null>(null);
//   const [contentInputs, setContentInputs] = useState<{ [groupId: number]: string }>({}); // グループごとのコンテンツ入力

//   const auth = getAuth();
//   const router = useRouter();

//   // Firebase currentUser を監視
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // URL の最後の数字から schoolId を取得
//   useEffect(() => {
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const lastPart = pathParts[pathParts.length - 1];
//     const parsedId = parseInt(lastPart, 10);
//     if (!isNaN(parsedId)) setSchoolId(parsedId);
//   }, []);

//   // グループ取得
//   const fetchGroups = async () => {
//     if (!schoolId) return;
//     setFetchingGroups(true);
//     try {
//       const res = await fetch("http://localhost:8080/getgroups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ groupID: schoolId }),
//       });
//       const data = await res.json();
//       if (!data.all_groups) {
//         setGroups([]);
//         return;
//       }
//       const groupedData: GroupItem[] = data.all_groups.map((g: any) => ({
//         id: g.group.ID,
//         userId: g.group.UserID,
//         schoolId: g.group.SchoolID,
//         createdAt: g.group.CreatedAt,
//         updatedAt: g.group.UpdatedAt,
//         contents: g.contents
//           ? g.contents.map((c: any) => ({
//               id: c.ID,
//               content: c.Content,
//               userId: c.UserID
//             }))
//           : []
//       }));
//       setGroups(groupedData);
//     } catch (err: any) {
//       console.error("グループ取得エラー:", err);
//       alert(`グループ取得エラー: ${err.message}`);
//     } finally {
//       setFetchingGroups(false);
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, [schoolId]);

//   const handleSubmitGroup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentUser) { alert("ログインしてください"); return; }
//     if (!groupName) { alert("グループ名を入力してください"); return; }
//     if (!schoolId) { alert("schoolId が取得できませんでした"); return; }

//     setLoading(true);
//     try {
//       const idToken = await currentUser.getIdToken();
//       const payload: MakeGroupRequest = { groupName, idToken, schoolId };
//       const res = await fetch("http://localhost:8080/makegroup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       if (!res.ok) throw new Error("グループ作成に失敗");
//       await res.json();
//       alert("グループ作成成功！");
//       setGroupName("");
//       fetchGroups();
//     } catch (err: any) {
//       console.error(err);
//       alert(`エラー: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddContent = async (groupId: number) => {
//     // if (!currentUser) { alert("ログインしてください"); return; }
//     // const content = contentInputs[groupId];
//     // if (!content) { alert("コンテンツを入力してください"); return; }

//     // setLoading(true);
//     // try {
//     //   const idToken = await currentUser.getIdToken();
//     //   const payload: AddContentRequest = { groupId, content, idToken };
//     //   const res = await fetch("http://localhost:8080/addcontent", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify(payload)
//     //   });
//     //   if (!res.ok) throw new Error("コンテンツ追加に失敗");
//     //   await res.json();
//     //   alert("コンテンツ追加成功！");
//     //   setContentInputs(prev => ({ ...prev, [groupId]: "" }));
//     //   fetchGroups();
//     // } catch (err: any) {
//     //   console.error(err);
//     //   alert(`エラー: ${err.message}`);
//     // } finally {
//     //   setLoading(false);
//     // }

//     router.push(`/srccode/makeSchoolTopic/${groupId}`);
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       setCurrentUser(result.user);
//       alert("Googleサインイン成功！");
//     } catch (err: any) {
//       console.error(err);
//       alert(`Googleサインインエラー: ${err.message}`);
//     }
//   };

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>グループ作成</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//       {currentUser && (
//         <form onSubmit={handleSubmitGroup} style={{ marginBottom: "32px" }}>
//           <input
//             type="text"
//             placeholder="グループ名を入力"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             required
//             style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//           >
//             {loading ? "作成中..." : "グループを作成"}
//           </button>
//         </form>
//       )}

//       <h2>全グループ一覧</h2>
//       {fetchingGroups ? (
//         <p>読み込み中...</p>
//       ) : groups.length === 0 ? (
//         <p>まだグループはありません</p>
//       ) : (
//         <ul>
//           {groups.map((g) => (
//             <li key={g.id} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}>
//               <p>グループID: {g.id}</p>
//               <p>ユーザーID: {g.userId}</p>
//               <p>学校ID: {g.schoolId}</p>
//               <p>作成日時: {new Date(g.createdAt).toLocaleString()}</p>

//               {g.contents.length > 0 ? (
//                 <ul>
//                   {g.contents.map((c) => (
//                     <li key={c.id}>
//                       <strong>コンテンツ:</strong> {c.content}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>コンテンツはありません</p>
//               )}

//               {/* コンテンツ追加フォーム */}
//               <div style={{ marginTop: "8px" }}>
//                 <input
//                   type="text"
//                   placeholder="コンテンツを入力"
//                   value={contentInputs[g.id] || ""}
//                   onChange={(e) =>
//                     setContentInputs(prev => ({ ...prev, [g.id]: e.target.value }))
//                   }
//                   style={{ padding: "4px", marginRight: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
//                 />
//                 <button
//                   onClick={() => handleAddContent(g.id)}
//                   disabled={loading}
//                   style={{
//                     padding: "4px 8px",
//                     backgroundColor: "#2196F3",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     cursor: loading ? "not-allowed" : "pointer"
//                   }}
//                 >
//                   追加
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }






// "use client"
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

type MakeGroupRequest = {
  groupName: string;
  idToken: string;
  schoolId: number;
};

type AddContentRequest = {
  groupId: number;
  contentName: string;
  content: string;
  idToken: string;
};

type GroupContent = {
  id: number;
  content: string;
  contentName: string;
  userId: number;
};

type GroupItem = {
  id: number;
  userId: number;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  contents: GroupContent[];
};

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState(true);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [contentInputs, setContentInputs] = useState<{ [groupId: number]: { name: string; content: string } }>({});

  const auth = getAuth();
  const router = useRouter();

  // Firebase currentUser を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // URL の最後の数字から schoolId を取得
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setSchoolId(parsedId);
  }, []);

  // グループ取得
  const fetchGroups = async () => {
    if (!schoolId) return;
    setFetchingGroups(true);
    try {
      const res = await fetch("http://localhost:8080/getgroups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupID: schoolId }),
      });
      const data = await res.json();
      if (!data.all_groups) {
        setGroups([]);
        return;
      }
      const groupedData: GroupItem[] = data.all_groups.map((g: any) => ({
        id: g.group.ID,
        userId: g.group.UserID,
        schoolId: g.group.SchoolID,
        createdAt: g.group.CreatedAt,
        updatedAt: g.group.UpdatedAt,
        contents: g.contents
          ? g.contents.map((c: any) => ({
              id: c.ID,
              content: c.Content,
              contentName: c.GroupContentsName, // 名前を取得
              userId: c.UserID
            }))
          : []
      }));
      setGroups(groupedData);
    } catch (err: any) {
      console.error("グループ取得エラー:", err);
      alert(`グループ取得エラー: ${err.message}`);
    } finally {
      setFetchingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [schoolId]);

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !groupName || !schoolId) return;

    setLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const payload: MakeGroupRequest = { groupName, idToken, schoolId };
      const res = await fetch("http://localhost:8080/makegroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("グループ作成に失敗");
      await res.json();
      alert("グループ作成成功！");
      setGroupName("");
      fetchGroups();
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (groupId: number) => {
    if (!currentUser) { alert("ログインしてください"); return; }
    const input = contentInputs[groupId];
    if (!input || !input.content.trim() || !input.name.trim()) {
      alert("コンテンツ名と本文を入力してください");
      return;
    }

    setLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const payload: AddContentRequest = {
        groupId,
        contentName: input.name,
        content: input.content,
        idToken
      };
      const res = await fetch("http://localhost:8080/make_grouptopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("コンテンツ追加に失敗");
      await res.json();
      alert("コンテンツ追加成功！");
      setContentInputs(prev => ({ ...prev, [groupId]: { name: "", content: "" } }));
      fetchGroups();
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      alert("Googleサインイン成功！");
    } catch (err: any) {
      console.error(err);
      alert(`Googleサインインエラー: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>グループ作成</h2>

      {!currentUser && (
        <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
          Googleでログイン
        </button>
      )}

      {currentUser && (
        <form onSubmit={handleSubmitGroup} style={{ marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="グループ名を入力"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "作成中..." : "グループを作成"}
          </button>
        </form>
      )}

      <h2>全グループ一覧です</h2>
      {fetchingGroups ? (
        <p>読み込み中...</p>
      ) : groups.length === 0 ? (
        <p>まだグループはありません</p>
      ) : (
        <ul>
          {groups.map((g) => (
            <li key={g.id} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}>
              <p>グループID: {g.id}</p>
              <p>ユーザーID: {g.userId}</p>
              <p>学校ID: {g.schoolId}</p>
              <p>作成日時: {new Date(g.createdAt).toLocaleString()}</p>
              <p>テストです</p>

              {g.contents.length > 0 ? (
                <ul>
                  {g.contents.map((c) => (
                    <li key={c.id}>
                      <strong>名前:</strong> {c.contentName} <br />
                      <strong>本文:</strong> {c.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>コンテンツはありません</p>
              )}

              {/* コンテンツ追加フォーム */}
              <div style={{ marginTop: "8px" }}>
                <input
                  type="text"
                  placeholder="コンテンツ名"
                  value={contentInputs[g.id]?.name || ""}
                  onChange={(e) =>
                    setContentInputs(prev => ({
                      ...prev,
                      [g.id]: { ...prev[g.id], name: e.target.value }
                    }))
                  }
                  style={{ padding: "4px", marginRight: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <input
                  type="text"
                  placeholder="本文"
                  value={contentInputs[g.id]?.content || ""}
                  onChange={(e) =>
                    setContentInputs(prev => ({
                      ...prev,
                      [g.id]: { ...prev[g.id], content: e.target.value }
                    }))
                  }
                  style={{ padding: "4px", marginRight: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <button
                  onClick={() => handleAddContent(g.id)}
                  disabled={loading}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  追加
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}