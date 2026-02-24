"use client"

import Link from "next/link"
import { useState } from "react"
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

export default function Main() {
  
  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");

  async function sendinfo() {

      // 現在のユーザーのトークンを取得している
      //　ログインしているかをチェック
      const auth = getAuth();
      const user = auth.currentUser;

      const idToken = await user?.getIdToken();

      // GlobalIdToken = idToken;

      await fetch("http://localhost:8080/topiccoment", {
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
        <form  className="signup" method="POST">
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
        <button onClick={sendinfo}>トピックの作成</button>
      </form>
    </div>
  )
}