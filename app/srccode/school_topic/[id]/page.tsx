




// 動いた。ボタンがちゃんと表示される
"use client"
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
    if (!schoolId || !currentUser) return;

    setFetchingGroups(true);

    try {
      const idToken = await currentUser.getIdToken();

      const res = await fetch("http://localhost:8080/getgroups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupID: schoolId,
          idToken: idToken,
        }),
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
      console.log(groupedData)
    } catch (err: any) {
      console.error("グループ取得エラー:", err);
      alert(`グループ取得エラー: ${err.message}`);
    } finally {
      setFetchingGroups(false);
    }
  };

  useEffect(() => {
    if (!schoolId) return;
    fetchGroups();
  }, [schoolId, currentUser]);

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
    // const handleAddContent = async (groupId: number) => {
    //   // URLの最後の数字を取得
    //   const pathParts = window.location.pathname.split("/").filter(Boolean);
    //   const lastPart = pathParts[pathParts.length - 1]; 
    //   const idFromUrl = parseInt(lastPart, 10);

    //   if (isNaN(idFromUrl)) {
    //     alert("URLからIDを取得できませんでした");
    //     return;
    //   }

    //   // 取得したIDをURLに埋め込む
    //   // router.push(`/srccode/makeSchoolTopic/${groupId}`);
    // };
    router.push(`/srccode/makeSchoolTopic/${groupId}`);
  };

  // const see_school_topic

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      alert("Googleサインイン成功");
    } catch (err: any) {
      console.error(err);
      alert(`Googleサインインエラー: ${err.message}`);
    }
  };



  return (
    <div style={{ padding: "16px" }}>
      <h2>グループ作成します</h2>

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

      <h2>全グループ一覧よ</h2>
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
                    <li key={c.id} style={{ marginBottom: "8px" }}>
                      <strong>トピック:</strong> {c.contentName} <br />
                      {/* <strong>本文:</strong> {c.content} <br /> */}
                     <button
                        onClick={() => router.push(`/srccode/see_school_topic/${c.id}`)}
                        style={{
                          padding: "2px 6px",
                          backgroundColor: "#F44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        詳しくみる
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>コンテンツはありません</p>
              )}
              {/* コンテンツ追加フォーム */}
              <div style={{ marginTop: "8px" }}>
                {/* <input
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
                /> */}
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













// // 動いた。ボタンがなんか表示されない
// "use client"
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
//   contentName: string;
//   content: string;
//   idToken: string;
// };

// type GroupContent = {
//   id: number;
//   content: string;
//   contentName: string;
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
//   const [contentInputs, setContentInputs] = useState<{ [groupId: number]: { name: string; content: string } }>({});

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

//   type GetGroupsRequest = {
//     groupID: number;
//     idToken: string;
//   };

//   // グループ取得
//   const fetchGroups = async () => {
//     if (!schoolId || !currentUser) return;

//     setFetchingGroups(true);

//     try {
//       const idToken = await currentUser.getIdToken();

//       const payload: GetGroupsRequest = {
//         groupID: schoolId,
//         idToken,
//       };

//       const res = await fetch("http://localhost:8080/getgroups", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       console.log("返ってきたuserID:", data.userID); // ← フロント側でも確認可能

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
//               contentName: c.GroupContentsName, // 名前を取得
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
//     if (schoolId && currentUser) {
//       fetchGroups();
//     }
//   }, [schoolId, currentUser]);

//   const handleSubmitGroup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentUser || !groupName || !schoolId) return;

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
//     if (!currentUser) { alert("ログインしてください"); return; }
//     const input = contentInputs[groupId];
//     if (!input || !input.content.trim() || !input.name.trim()) {
//       alert("コンテンツ名と本文を入力してください");
//       return;
//     }

//     setLoading(true);
//     try {
//       const idToken = await currentUser.getIdToken();
//       const payload: AddContentRequest = {
//         groupId,
//         contentName: input.name,
//         content: input.content,
//         idToken
//       };
//       const res = await fetch("http://localhost:8080/make_grouptopic", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       if (!res.ok) throw new Error("コンテンツ追加に失敗");
//       await res.json();
//       alert("コンテンツ追加成功！");
//       setContentInputs(prev => ({ ...prev, [groupId]: { name: "", content: "" } }));
//       fetchGroups();
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

//   return (
//     <div style={{ padding: "16px" }}>
//       <h2>グループ作成します</h2>

//       {!currentUser && (
//         <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
//           Googleでログイン
//         </button>
//       )}

//     {currentUser && schoolId !== null && (
//       <form onSubmit={handleSubmitGroup} style={{ marginBottom: "32px" }}>
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

//       <h2>全グループ一覧です</h2>
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
//               <p>テストです</p>

//               {g.contents.length > 0 ? (
//               <ul>
//                 {g.contents.map((c) => (
//                   <li key={c.id}>
//                     <strong>名前:</strong> {c.contentName} <br />
//                     <strong>本文:</strong> {c.content}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>コンテンツはありません</p>
//             )}

//             {/* schoolId が一致する場合のみ表示 */}
//             {schoolId === g.schoolId && (
//               <div style={{ marginTop: "8px" }}>
//                 <input
//                   type="text"
//                   placeholder="コンテンツ名"
//                   value={contentInputs[g.id]?.name || ""}
//                   onChange={(e) =>
//                     setContentInputs(prev => ({
//                       ...prev,
//                       [g.id]: { ...prev[g.id], name: e.target.value }
//                     }))
//                   }
//                   style={{ padding: "4px", marginRight: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="本文"
//                   value={contentInputs[g.id]?.content || ""}
//                   onChange={(e) =>
//                     setContentInputs(prev => ({
//                       ...prev,
//                       [g.id]: { ...prev[g.id], content: e.target.value }
//                     }))
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
//             )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }








