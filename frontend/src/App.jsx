import Header from '../components/Header.jsx'
import CodeEditor from '../components/CodeEditor.jsx'
import CompilerBackground from '../components/CompilerBg.jsx'
import Input from '../components/Input.jsx'
import Output from '../components/output.jsx'
import { useState } from 'react'
import React from 'react'
function App() {
  const [output,setOutput] = useState("//Console \n Result will be shown here... \n \n \n \n\n")
     const setterForOutput =(e)=>{
        setOutput(e);
    }
    const [language,setLanguage]=useState("javascript")
  const children = (<div className='items-center w-screen flex flex-col'>
    <Header setterForOutput={setterForOutput} setLanguage={setLanguage}/>
    <CodeEditor language={language}/>
    <Input/>
    <Output output={output}/>
    </div>)

  return (
    <div className='min-w-screen min-h-screen '>
      <CompilerBackground children={children}/>
      
    </div>
  )
}

export default App
