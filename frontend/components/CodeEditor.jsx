import React from 'react'
import { Editor } from '@monaco-editor/react'
function CodeEditor() {
  const getCode =(e)=>{
    console.log(e)
  }
  return (
    <div className='w-[85%] p-8 mt-4 rounded-lg bg-white/5 backdrop-blur-md border-b border-white/10 z-50 transition-all'>
      <Editor defaultLanguage='javascript' height={"80vh"} theme='vs-dark' onChange={getCode}/>
    </div>
  )
}

export default CodeEditor
