// "use client";

// import { useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useRouter } from "next/navigation";

// // -----------------------------
// // Firebase 初期化
// // -----------------------------
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
// const auth = getAuth(app);

// // -----------------------------
// // コンポーネント
// // -----------------------------
// export default function AdminPage() {
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         alert("ログインしてください");
//         router.push("/");
//         return;
//       }

//       setCurrentUser(user);

//       try {
//         const idToken = await user.getIdToken();

//         // 管理者権限チェック
//         const res = await fetch("http://localhost:8080/admin/check", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + idToken,
//           },
//         });
//         const data = await res.json();

//         if (!data.isAdmin) {
//           alert("管理者権限がありません");
//           router.push("/"); // トップページへリダイレクト
//           return;
//         }

//         setLoading(false); // 管理者OKなら表示
//       } catch (err) {
//         console.error("管理者チェックエラー:", err);
//         alert("管理者チェックに失敗しました");
//         router.push("/");
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (loading) return <p>読み込み中…</p>;

//   return <div>スクールページです（管理者アクセス）</div>;
// }











// "use client";

// import { useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useRouter } from "next/navigation";

// // Firebase 初期化
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
// const auth = getAuth(app);

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function AdminSchoolPage() {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         alert("ログインしてください");
//         router.push("/");
//         return;
//       }

//       try {
//         const idToken = await user.getIdToken();

//         const res = await fetch("http://localhost:8080/admin/schools", {
//           method: "GET",
//           headers: {
//             "Authorization": "Bearer " + idToken,
//           },
//         });

//         if (!res.ok) {
//           if (res.status === 403) alert("管理者権限がありません");
//           else alert("学校一覧取得に失敗しました");
//           router.push("/");
//           return;
//         }

//         const data: School[] = await res.json();
//         setSchools(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("学校一覧取得エラー:", err);
//         alert("学校一覧取得に失敗しました");
//         router.push("/");
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (loading) return <p>読み込み中…</p>;

//   return (
//     <div>
//       <h1>学校一覧（管理者アクセス）</h1>
//       {schools.length === 0 ? (
//         <p>学校が登録されていません</p>
//       ) : (
//         schools.map((s) => (
//           <div key={s.ID} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
//             <p><strong>ID:</strong> {s.ID}</p>
//             <p><strong>名前:</strong> {s.SchoolName}</p>
//             <p><strong>作成日:</strong> {s.CreatedAt}</p>
//             <p><strong>更新日:</strong> {s.UpdatedAt}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// Firebase 初期化
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function AdminSchoolPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSchoolName, setNewSchoolName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("ログインしてください");
        router.push("/");
        return;
      }

      try {
        const idToken = await user.getIdToken();

        const res = await fetch("http://localhost:8080/admin/schools", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + idToken,
          },
        });

        if (!res.ok) {
          if (res.status === 403) alert("管理者権限がありません");
          else alert("学校一覧取得に失敗しました");
          router.push("/");
          return;
        }

        const data: School[] = await res.json();
        setSchools(data);
        setLoading(false);
      } catch (err) {
        console.error("学校一覧取得エラー:", err);
        alert("学校一覧取得に失敗しました");
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // -----------------------------
  // 学校追加
  // -----------------------------
  const handleCreateSchool = async () => {
    if (!newSchoolName) return alert("学校名を入力してください");
    const user = auth.currentUser;
    if (!user) return;

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:8080/admin/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken,
        },
        body: JSON.stringify({ school_name: newSchoolName }),
      });

      if (!res.ok) throw new Error("学校作成失敗");

      const created: School = await res.json();
      setSchools((prev) => [...prev, created]);
      setNewSchoolName("");
    } catch (err) {
      console.error(err);
      alert("学校作成に失敗しました");
    }
  };

  // -----------------------------
  // 学校削除
  // -----------------------------
  const handleDeleteSchool = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;
    const user = auth.currentUser;
    if (!user) return;

    try {
      const idToken = await user.getIdToken();

      const res = await fetch(`http://localhost:8080/admin/schools/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + idToken,
        },
      });

      if (!res.ok) throw new Error("削除失敗");

      setSchools((prev) => prev.filter((s) => s.ID !== id));
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました");
    }
  };

  if (loading) return <p>読み込み中…</p>;

  return (
    <div>
      <h1>学校一覧（管理者アクセス）</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="新しい学校名"
          value={newSchoolName}
          onChange={(e) => setNewSchoolName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleCreateSchool}>追加</button>
      </div>

      {schools.length === 0 ? (
        <p>学校が登録されていません</p>
      ) : (
        schools.map((s) => (
          <div
            key={s.ID}
            style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
          >
            <p><strong>ID:</strong> {s.ID}</p>
            <p><strong>名前:</strong> {s.SchoolName}</p>
            <p><strong>作成日:</strong> {s.CreatedAt}</p>
            <p><strong>更新日:</strong> {s.UpdatedAt}</p>
            <button
              onClick={() => handleDeleteSchool(s.ID)}
              style={{ backgroundColor: "red", color: "white", marginTop: "5px" }}
            >
              削除
            </button>
          </div>
        ))
      )}
    </div>
  );
}