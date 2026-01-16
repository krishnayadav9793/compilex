import React from 'react'
import { useState } from 'react'
function Output({output}) {
    
  return (
    <div className='bg-white/5 backdrop-blur-md border-b border-white/10 z-50 transition-all min-h-[10vh] mt-8 mb-8 min-w-[85vw] p-4 rounded-md max-h-fit'>
      <pre> {output}</pre>
    </div>
  )
}

export default Output
