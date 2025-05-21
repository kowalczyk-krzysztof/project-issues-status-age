import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EuiProvider } from '@elastic/eui'
import App from './App.tsx'
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon'
import { icon as EuiIconCheck } from '@elastic/eui/es/components/icon/assets/check'

appendIconComponentCache({
  check: EuiIconCheck,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EuiProvider>
      <App />
    </EuiProvider>
  </StrictMode>
)
