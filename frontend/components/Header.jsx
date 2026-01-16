import React from 'react';

function Header({setterForOutput,setLanguage}) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-center w-full px-4 py-3 bg-white/5 backdrop-blur-md border-b border-white/10 z-50 transition-all'>
      
      {/* Run Button Area */}
      <div className='w-full sm:w-auto mb-3 sm:mb-0 flex justify-center sm:justify-start'>
        <button className='w-full sm:w-auto text-white bg-green-600 hover:bg-green-500 border border-green-500/50 hover:border-green-400 p-2 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)] font-semibold tracking-wide' onClick={()=>setterForOutput("karan")}>
          <i className="fa-solid fa-play mr-2"></i>Run
        </button>
      </div>

      {/* Language Selection Area */}
      <div className='flex flex-col sm:flex-row gap-3 text-white items-center justify-center w-full sm:w-auto'>
        <label htmlFor="language-select" className="text-slate-300 font-medium text-sm">Select Language:</label>
        <select 
          id="language-select" 
          defaultValue="select language" 
          className='bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 text-sm p-2 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors min-w-[150px]'
          onChange={()=>setLanguage(document.getElementById("language-select").value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

    </div>
  )
}

export default Header;