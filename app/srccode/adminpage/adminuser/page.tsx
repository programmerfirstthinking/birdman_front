// // "use client"

// // import { useEffect, useState } from "react"
// // import { getAuth } from "firebase/auth"

// // export default function AdminUserPage() {

// //   const [admins,setAdmins] = useState<any[]>([])
// //   const [userId,setUserId] = useState("")

// //   const auth = getAuth()

// //   const loadAdmins = async () => {

// //     const user = auth.currentUser
// //     if(!user) return

// //     const token = await user.getIdToken()

// //     const res = await fetch("http://localhost:8080/adminusers",{
// //       headers:{
// //         Authorization:"Bearer "+token
// //       }
// //     })

// //     const data = await res.json()
// //     setAdmins(data)
// //   }

// //   useEffect(()=>{
// //     loadAdmins()
// //   },[])

// //   const addAdmin = async ()=>{

// //     const user = auth.currentUser
// //     if(!user) return

// //     const token = await user.getIdToken()

// //     await fetch("http://localhost:8080/adminusers",{
// //       method:"POST",
// //       headers:{
// //         "Content-Type":"application/json",
// //         Authorization:"Bearer "+token
// //       },
// //       body:JSON.stringify({
// //         user_id:userId
// //       })
// //     })

// //     setUserId("")
// //     loadAdmins()
// //   }

// //   const deleteAdmin = async(id:number)=>{

// //     const user = auth.currentUser
// //     if(!user) return

// //     const token = await user.getIdToken()

// //     await fetch(`http://localhost:8080/adminusers/${id}`,{
// //       method:"DELETE",
// //       headers:{
// //         Authorization:"Bearer "+token
// //       }
// //     })

// //     loadAdmins()
// //   }

// //   return(

// //     <div style={{padding:"20px"}}>

// //       <h1>Admin Users</h1>

// //       <div style={{marginBottom:"20px"}}>

// //         <input
// //           placeholder="Firebase UID"
// //           value={userId}
// //           onChange={(e)=>setUserId(e.target.value)}
// //         />

// //         <button onClick={addAdmin}>
// //           追加
// //         </button>

// //       </div>

// //       <table border={1}>

// //         <thead>
// //           <tr>
// //             <th>ID</th>
// //             <th>UserID</th>
// //             <th>Delete</th>
// //           </tr>
// //         </thead>

// //         <tbody>

// //           {admins.map((a)=>(
// //             <tr key={a.id}>
// //               <td>{a.id}</td>
// //               <td>{a.user_id}</td>

// //               <td>
// //                 <button onClick={()=>deleteAdmin(a.id)}>
// //                   削除
// //                 </button>
// //               </td>

// //             </tr>
// //           ))}

// //         </tbody>

// //       </table>

// //     </div>

// //   )
// // }






// "use client"

// import { useEffect, useState } from "react"
// import { getAuth, onAuthStateChanged } from "firebase/auth"

// export default function AdminUserPage() {

//   const [admins,setAdmins] = useState<any[]>([])
//   const [userId,setUserId] = useState("")

//   const auth = getAuth()

//   const loadAdmins = async (user:any) => {

//     const token = await user.getIdToken()

//     const res = await fetch("http://localhost:8080/adminusers",{
//       headers:{
//         Authorization:"Bearer "+token
//       }
//     })

//     const data = await res.json()
//     setAdmins(data)
//     console.log(data)
//   }

//   useEffect(()=>{

//     const unsubscribe = onAuthStateChanged(auth,(user)=>{

//       if(!user){
//         console.log("not login")
//         return
//       }

//       loadAdmins(user)

//     })

//     return ()=>unsubscribe()

//   },[])

//   const addAdmin = async ()=>{

//     const user = auth.currentUser
//     if(!user) return

//     const token = await user.getIdToken()

//     await fetch("http://localhost:8080/adminusers",{
//       method:"POST",
//       headers:{
//         "Content-Type":"application/json",
//         Authorization:"Bearer "+token
//       },
//       body:JSON.stringify({
//         user_id:userId
//       })
//     })

//     setUserId("")
//     loadAdmins(user)
//   }

//   const deleteAdmin = async(id:number)=>{

//     const user = auth.currentUser
//     if(!user) return

//     const token = await user.getIdToken()

//     await fetch(`http://localhost:8080/adminusers/${id}`,{
//       method:"DELETE",
//       headers:{
//         Authorization:"Bearer "+token
//       }
//     })

//     loadAdmins(user)
//   }

//   return(

//     <div style={{padding:"20px"}}>

//       <h1>Admin Users</h1>

//       <div style={{marginBottom:"20px"}}>

//         <input
//           placeholder="Firebase UID"
//           value={userId}
//           onChange={(e)=>setUserId(e.target.value)}
//         />

//         <button onClick={addAdmin}>
//           追加
//         </button>

//       </div>

//       <table border={1}>

//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>UserID</th>
//             <th>Delete</th>
//           </tr>
//         </thead>

//         <tbody>
//             {admins.map((a:any)=>(
//                 <tr key={String(a.ID)}>
//                 <td>{a.ID}</td>
//                 <td>{a.UserID}</td>
//                 <td>
//                     <button onClick={()=>deleteAdmin(a.ID)}>
//                     削除
//                     </button>
//                 </td>
//                 </tr>
//             ))}
//             </tbody>

//       </table>

//     </div>

//   )
// }






"use client"

import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function AdminUserPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [userId, setUserId] = useState<number | "">("") // 数字のみ

  const auth = getAuth()

  const loadAdmins = async (user: any) => {
    const token = await user.getIdToken()
    const res = await fetch("http://localhost:8080/adminusers", {
      headers: { Authorization: "Bearer " + token },
    })
    const data = await res.json()
    setAdmins(data)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return
      loadAdmins(user)
    })
    return () => unsubscribe()
  }, [])

  const addAdmin = async () => {
    const user = auth.currentUser
    if (!user) return
    if (!userId) return alert("ユーザーIDを入力してください")

    const token = await user.getIdToken()

    await fetch("http://localhost:8080/adminusers/add", { // 新しいエンドポイント
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ user_id: userId }), // 数字を送信
    })

    setUserId("")
    loadAdmins(user)
  }

  const deleteAdmin = async (id: number) => {
    const user = auth.currentUser
    if (!user) return
    const token = await user.getIdToken()

    await fetch(`http://localhost:8080/adminusers/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })

    loadAdmins(user)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Users</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="ユーザーID (数字)"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
        <button onClick={addAdmin}>追加</button>
      </div>

      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a: any) => (
            <tr key={String(a.ID)}>
              <td>{a.ID}</td>
              <td>{a.UserID}</td>
              <td>
                <button onClick={() => deleteAdmin(a.ID)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}