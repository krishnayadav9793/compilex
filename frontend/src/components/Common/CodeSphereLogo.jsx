import React from 'react';
import CompileXLogo from './CompileXLogo';

/**
 * Re-export CompileXLogo as default to maintain seamless backward compatibility
 */
export default function CodeSphereLogo(props) {
  return <CompileXLogo {...props} />;
}

export { CompileXLogo };
