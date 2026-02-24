// import Link from "next/link"

// export default function Main() {
//   return (
//     <Link href="http://localhost:8080/test">
//       <button>Aboutへ</button>
//     </Link>
//   )
// }

"use client"; // Next.js 13 appディレクトリの場合

import { useState } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { sign } from "crypto";
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "mail") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ページリロードを止める

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("サインアップ成功:", user);
      alert("登録成功しました！");
      console.log("ユーザーID:", user.uid);
    } catch (error: any) {
      console.error(error);
      alert(`エラー: ${error.message}`);
    }
  };

  function signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Googleサインイン成功:", user);
        alert("Googleでのサインインに成功しました！");
      })
      .catch((error) => {
        console.error(error);
        alert(`Googleサインインエラー: ${error.message}`);
      });
  }



  

  return (
    <div>
      <h2>サインアップ</h2>
      <form onSubmit={handleSubmit} className="signup">
        <input
          type="email"
          name="mail"
          placeholder="メールアドレス"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="パスワード"
          value={password}
          onChange={handleChange}
        />
        <button type="submit">送信</button>
      </form>
      <button onClick={() => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
          // .then(async (result) => {
          //   const user = result.user;
          //   console.log("Googleサインイン成功:", user);
          //   alert("Googleでのサインインに成功しました");
          //   // fetch("")
          //   const idToken = await user.getIdToken();

          //   const fetchData = async () => {
          //     try {
          //       const res = await fetch('http://127.0.0.1:8080/login', {
          //         method: 'POST',
          //         headers: {
          //           'Content-Type': 'application/json',
          //         },
          //         // body: JSON.stringify({ userId: user.uid }),

          //         body: JSON.stringify({ idToken }), // IDトークンを送信
          //       });

          //       if (!res.ok) {
          //         throw new Error(`サーバーエラー: ${res.status}`);
          //       }



          //       // const data = await res.json();
          //       // console.log("サーバー応答:", data);

          //     } catch (error) {
          //       console.error("Fetchエラー:", error);
          //     }
          //   };

          //   fetchData();

          //   router.push('/srccode/topic');

          // })
          .then(async (result) => {
            const user = result.user;

            alert("Googleでのサインインに成功しました");

            const idToken = await user.getIdToken();

            router.push('/srccode/topic');

            await fetch("http://localhost:8080/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken }),
              
            });
          })
          .catch((error) => {
            console.error(error);
            alert(`Googleサインインエラー: ${error.message}`);
          });
        }
      }>Googleでサインイン</button>
    </div>
  );
}
