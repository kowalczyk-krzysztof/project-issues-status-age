import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EuiProvider } from '@elastic/eui'
import App from './App.tsx'
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon'
import { icon as EuiIconCheck } from '@elastic/eui/es/components/icon/assets/check'
import { icon as EuiIconFullScreen } from '@elastic/eui/es/components/icon/assets/full_screen'
import { icon as EuiIconControls } from '@elastic/eui/es/components/icon/assets/controls'
import { icon as EuiIconKeyboard } from '@elastic/eui/es/components/icon/assets/keyboard'
import { icon as EuiIconBoxesVertical } from '@elastic/eui/es/components/icon/assets/boxes_vertical'
import { icon as EuiIconExpand } from '@elastic/eui/es/components/icon/assets/expand'
import { icon as EuiIconTableDensityNormal } from '@elastic/eui/es/components/icon/assets/table_density_normal'
import { icon as EuiIconFullScreenExit } from '@elastic/eui/es/components/icon/assets/fullScreenExit'
import { icon as EuiIconGrab } from '@elastic/eui/es/components/icon/assets/grab'
import { icon as EuiIconEyeClosed } from '@elastic/eui/es/components/icon/assets/eye_closed'
import { icon as EuiIconSortLeft } from '@elastic/eui/es/components/icon/assets/sortLeft'
import { icon as EuiIconSortRight } from '@elastic/eui/es/components/icon/assets/sortRight'
import { icon as EuiIconSortDown } from '@elastic/eui/es/components/icon/assets/sort_down'
import { icon as EuiIconSortUp } from '@elastic/eui/es/components/icon/assets/sort_up'
import { icon as EuiIconSortable } from '@elastic/eui/es/components/icon/assets/sortable'
import { icon as EuiIconArrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down'
import { icon as EuiIconArrowUp } from '@elastic/eui/es/components/icon/assets/arrow_up'
import { icon as EuiIconCross } from '@elastic/eui/es/components/icon/assets/cross'
import { icon as EuiIconTokenString } from '@elastic/eui/es/components/icon/assets/tokenString'
import { icon as EuiIconLock } from '@elastic/eui/es/components/icon/assets/lock'
import { icon as EuiIconSearch } from '@elastic/eui/es/components/icon/assets/search'
import { icon as EuiIconWarning } from '@elastic/eui/es/components/icon/assets/warning'

appendIconComponentCache({
  check: EuiIconCheck,
  fullScreen: EuiIconFullScreen,
  controls: EuiIconControls,
  keyboard: EuiIconKeyboard,
  boxesVertical: EuiIconBoxesVertical,
  expand: EuiIconExpand,
  tableDensityNormal: EuiIconTableDensityNormal,
  fullScreenExit: EuiIconFullScreenExit,
  grab: EuiIconGrab,
  eyeClosed: EuiIconEyeClosed,
  sortLeft: EuiIconSortLeft,
  sortRight: EuiIconSortRight,
  sortDown: EuiIconSortDown,
  sortUp: EuiIconSortUp,
  sortable: EuiIconSortable,
  arrowDown: EuiIconArrowDown,
  arrowUp: EuiIconArrowUp,
  cross: EuiIconCross,
  tokenString: EuiIconTokenString,
  lock: EuiIconLock,
  search: EuiIconSearch,
  warning: EuiIconWarning,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EuiProvider>
      <App />
    </EuiProvider>
  </StrictMode>
)
