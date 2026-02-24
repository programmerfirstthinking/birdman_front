"use client"; // Next.js 13 appディレクトリの場合
import { useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { sign } from "crypto";
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

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

export default function Main() {

  // const [fetchData, setFetchData] = useState({});
  let topicdata ;

  const [data, setData] = useState<Record<string, any> | null>(null);

  async function fetchtopicdata() {
    await fetch("http://localhost:8080/topics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
    //   console.log("トピックデータの取得に成功"), 
    //   console.log(response)
    
    // });
    .then((data) => {
      console.log("トピックデータの取得に成功");
      console.log(data);
      // topicdata = data;
      // console.log(topicdata);
      // setFetchData(data);
      setData(data);
    });
  }

  useEffect(() => {
  fetchtopicdata();
}, []);



  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");

  async function sendinfo() {

      // 現在のユーザーのトークンを取得している
      //　ログインしているかをチェック
      const auth = getAuth();
      const user = auth.currentUser;

      const idToken = await user?.getIdToken();

      // GlobalIdToken = idToken;

      await fetch("http://localhost:8080/topiccontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: topicName, content: topicContent,token:idToken }),
    });
  }

 

  return (
    <div>
      <h2>トピックの作成はこちら</h2>
        {/* <form  className="signup" method="POST"> */}
        <div></div>
        <form
            className="signup"
            onSubmit={async (e) => {
              e.preventDefault();
              await sendinfo();
            }}
          >
          <input
            type="text"
            name="topicname"
            placeholder="トピック名"
            value={topicName}
            onChange={(e)=>setTopicName(e.target.value)}
          />
          <input
            type="text"
            name="topiccontent"
            placeholder="内容"
            value={topicContent}
            onChange={(e)=>setTopicContent(e.target.value)}
          />
        <button type="submit">トピックの作成</button>
      </form>

      <div>
      {/* <button onClick={fetchData}>取得</button> */}

      {data && (
        <div>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}