"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage(){

  const [message,setMessage] = useState("")
  const router = useRouter()

  useEffect(()=>{

    const password = prompt("管理者パスワードを入力してください")

    fetch("http://localhost:8080/admin/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password:password
      })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.ok){
        setMessage("管理者ログイン成功")
      }else{
        alert("パスワードが違います")
        router.push("/")   // ホームへ追い出す
      }
    })

  },[])

  return(
    <div>
      <h1>Admin Page</h1>
      <p>{message}</p>
    </div>
  )
}