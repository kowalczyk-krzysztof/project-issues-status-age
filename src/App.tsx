import { useState } from 'react'
import { Steps } from './components/steps'
import type { ProjectItemDTO } from './api'
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

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
      <EuiFlexItem>
        {data && (
          <div
            style={{
              overflowX: 'auto',
              padding: '1rem',
            }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Arial, sans-serif',
                border: '1px solid #ccc',
              }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    Title
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    URL
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    Status
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    Age
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx}>
                    <td
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        textAlign: 'left',
                      }}>
                      {item.title}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        textAlign: 'left',
                      }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#1a0dab',
                          textDecoration: 'underline',
                        }}>
                        View Issue
                      </a>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        textAlign: 'left',
                      }}>
                      {item.currentStatus}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        textAlign: 'left',
                      }}>
                      {item.age}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #ccc',
                        textAlign: 'left',
                      }}>
                      {item.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default App
