import Header from '../components/Header.jsx'
import CodeEditor from '../components/CodeEditor.jsx'
import CompilerBackground from '../components/CompilerBg.jsx'
import Input from '../components/Input.jsx'
import Output from '../components/output.jsx'
import { useState } from 'react'
import React from 'react'
import CppBackground from '../components/CPMode.jsx'

function App() {
  const [output,setOutput] = useState("//Console \n Result will be shown here... \n \n \n \n\n")
  const [code,setCode]=useState();
  const[isCpMode,setCpMode]= useState(false);
  const toggleCpMode=()=>{
    setCpMode(!isCpMode)
  }
     const setterForOutput =(e)=>{
        setOutput(e);
    }
    const [language,setLanguage]=useState("javascript")
  const children = (isCpMode===true?<CppBackground isCpMode={isCpMode} toggleCpMode={toggleCpMode} language={language}/>:<div className='items-center w-screen flex flex-col relative'>
    <Header setterForOutput={setterForOutput} setLanguage={setLanguage} code={code} isCpMode={isCpMode} toggleCpMode={toggleCpMode}/>
    <CodeEditor language={language} setCode={setCode}/>
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
