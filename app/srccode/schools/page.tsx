// "use client"; // Next.js 13 appディレクトリの場合

// import { useState } from "react";
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

// const provider = new GoogleAuthProvider();

// let GlobalIdToken = "";



// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// // function reloadPage() {
// //   const router = useRouter();

// //   if (GlobalIdToken!="") {
// //     router.push('/srccode/topic');
// //   }
// // }

// // reloadPage();

// export default function Signup() {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const router = useRouter();



//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.name === "mail") {
//       setEmail(e.target.value);
//     } else if (e.target.name === "password") {
//       setPassword(e.target.value);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // ページリロードを止める

//     const auth = getAuth();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       console.log("サインアップ成功:", user);
//       alert("登録成功しました！");
//       console.log("ユーザーID:", user.uid);
//     } catch (error: any) {
//       console.error(error);
//       alert(`エラー: ${error.message}`);
//     }
//   };

//   function signInWithGoogle() {
//     const auth = getAuth();
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         const user = result.user;
//         console.log("Googleサインイン成功:", user);
//         alert("Googleでのサインインに成功しました");
//       })
//       .catch((error) => {
//         console.error(error);
//         alert(`Googleサインインエラー: ${error.message}`);
//       });
//   }



  

//   return (
//     <div>
//       <h2>学校選択画面</h2>
//       <form onSubmit={handleSubmit} className="signup">
//         <input
//           type="email"
//           name="mail"
//           placeholder="メールアドレス"
//           value={email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="パスワード"
//           value={password}
//           onChange={handleChange}
//         />
//         <button type="submit">送信</button>
//       </form>
//       <button onClick={() => {
//         const auth = getAuth();
//         signInWithPopup(auth, provider)
//           // .then(async (result) => {

//           .then(async (result) => {
//             const user = result.user;

//             alert("Googleでのサインインに成功しました");

//             const idToken = await user.getIdToken();
//             GlobalIdToken = idToken;

//             router.push('/srccode/topic');

//             await fetch("http://localhost:8080/login", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ idToken }),

//             });

//             console.log("グローバル:", GlobalIdToken);
//           })
//           .catch((error) => {
//             console.error(error);
//             alert(`Googleサインインエラー: ${error.message}`);
//           });
//         }
//       }>Googleでサインイン</button>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("http://localhost:8080/getSchools");

        if (!res.ok) {
          throw new Error("サーバーエラー");
        }

        const data = await res.json();
        console.log("受信データ:", data);

        // バックエンドが { schools: [] } 形式で返す想定
        if (Array.isArray(data.schools)) {
          setSchools(data.schools);
        } else {
          console.error("schoolsが配列ではありません:", data);
          setSchools([]);
        }
      } catch (error) {
        console.error("学校取得エラー:", error);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  function handleSchoolClick(schoolId: number) {
    router.push(`/srccode/school_topic/${schoolId}`);
  }

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h2>学校選択画面</h2>

      {schools.length === 0 && <p>学校が登録されていません</p>}

      {schools.map((school) => (
        <button
            key={school.ID}
            onClick={() => handleSchoolClick(school.ID)}
            style={{
            display: "block",
            margin: "8px 0",
            padding: "16px",
            minHeight: "40px",
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            }}
        >
            {school.SchoolName}
        </button>
        ))}


    </div>
  );
}