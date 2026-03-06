


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
//       <h2>グループ作成します</h2>

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