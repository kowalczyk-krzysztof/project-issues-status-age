import { useState } from 'react'
import { Steps } from './components/steps'
import type { ProjectItemDTO } from './api'
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import { Table } from './components/table'

function App() {
  const [data, setData] = useState<ProjectItemDTO[]>([])

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
        />
      </EuiFlexItem>
      {/* {data.length > 0 && <Table data={data} />} */}
      <Table data={data} />
    </EuiFlexGroup>
  )
}

export default App
