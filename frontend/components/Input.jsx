import React from 'react'

function Input() {
  return (
    <div className='mt-8 min-w-screen flex justify-center items-center'>
      <textarea className='bg-white/5 backdrop-blur-md border-b border-white/10 z-50 transition-all outline-none w-[85%] h-fit min-h-[20vh] p-3 rounded-md' id="input"/>
    </div>
  )
}

export default Input
