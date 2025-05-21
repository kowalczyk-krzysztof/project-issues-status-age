import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EuiProvider } from '@elastic/eui'
import App from './App.tsx'
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon'

import { icon as EuiIconArrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down'
import { icon as EuiIconArrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left'

// One or more icons are passed in as an object of iconKey (string): IconComponent
appendIconComponentCache({
  arrowDown: EuiIconArrowDown,
  arrowLeft: EuiIconArrowLeft,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EuiProvider>
      <App />
    </EuiProvider>
  </StrictMode>
)
