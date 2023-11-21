
import Button from "./components/Button"
import AtEditor from "./components/AtEditor"
import React, { useState } from 'react'


import Emojis  from "./components/Emojis"

const users = [
  {
    id: 'walter',
    display: 'Walter White',
  },
  {
    id: 'pipilu',
    display: '皮皮鲁',
  },
  {
    id: 'luxixi',
    display: '鲁西西',
  },
  {
    id: 'satoshi1',
    display: '中本聪',
  },
  {
    id: 'satoshi2',
    display: 'サトシ・ナカモト',
  },
  {
    id: 'nobi',
    display: '野比のび太',
  },
  {
    id: 'sung',
    display: '성덕선',
  },
  {
    id: 'jesse',
    display: 'Jesse Pinkman',
  },
  {
    id: 'gus',
    display: 'Gustavo "Gus" Fring',
  },
  {
    id: 'saul',
    display: 'Saul Goodman',
  },
  {
    id: 'hank',
    display: 'Hank Schrader',
  },
  {
    id: 'skyler',
    display: 'Skyler White',
  },
  {
    id: 'mike',
    display: 'Mike Ehrmantraut',
  },
  {
    id: 'lydia',
    display: 'Lydìã Rôdarté-Qüayle',
  },
]

import Editor from "./components/Editor"
export default function App() {
  const [curIpt,setCurIpt] = useState("1")
  return <div>
    <Emojis data={users} value={curIpt} onChange={(v)=>{
      setCurIpt(v.target.value)
      console.log("v",v);
    }}
    
    onAdd={(v)=>{
      console.log("onAdd",v)
    }}
    />

    {/* <AtEditor></AtEditor> */}
    <Editor></Editor>
  </div>
}