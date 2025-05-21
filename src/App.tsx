import { useState } from 'react'
import { Steps } from './components/steps'
import type { ProjectItemDTO } from './api'
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import { Table } from './components/table'

function App() {
  const [data, setData] = useState<ProjectItemDTO[]>([])
  const [isFetchingData, setIsFetchingData] = useState(false)

  return (
    <EuiFlexGroup
      gutterSize="m"
      style={{
        margin: '1rem',
      }}>
      <EuiFlexItem grow={false}>
        <Steps
          data={data}
          setData={setData}
          setIsFetchingData={setIsFetchingData}
          isFetchingData={isFetchingData}
        />
      </EuiFlexItem>
      <Table data={data} />
    </EuiFlexGroup>
  )
}

export default App
