import { useState } from 'react'
import { fetchAllProjectItems, getProjectId } from './api'
import { EuiIcon } from '@elastic/eui'

function App() {
  const [projectNumber, setProjectNumber] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [orgName, setOrgName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [data, setData] = useState([])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div>
        <EuiIcon type="arrowLeft"></EuiIcon>
        <label
          style={{
            marginRight: '12px',
          }}
          htmlFor="githubToken">
          GitHub Token with permissions read:project authorized for the organization the project lives in
        </label>
        <input
          id="githubToken"
          type="text"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="Enter GitHub token"
        />
      </div>
      <div>
        <label
          style={{
            marginRight: '12px',
          }}
          htmlFor="projectNumber">
          Project Number (the number at the end of the URL)
        </label>
        <input
          id="projectNumber"
          type="text"
          value={projectNumber}
          onChange={(e) => setProjectNumber(e.target.value)}
          placeholder="Enter project number"
        />
      </div>
      <div>
        <label
          style={{
            marginRight: '12px',
          }}
          htmlFor="orgName">
          GitHub Organization Name (e.g Elastic)
        </label>
        <input
          id="orgName"
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter org name"
        />
      </div>
      <button
        onClick={async () => {
          const projectId = await getProjectId(Number(projectNumber), githubToken, orgName)
          setProjectId(projectId)
        }}>
        Get project ID
      </button>
      {projectId && (
        <span
          style={{
            marginTop: '12px',
            textDecoration: 'underline',
            color: 'green',
          }}>
          {projectId}
        </span>
      )}

      <button
        style={{
          marginTop: '12px',
        }}
        onClick={async () => {
          const data = await fetchAllProjectItems(projectId, githubToken)
          // @ts-expect-error deal with this later
          setData(data)
        }}>
        Once you have the project ID - enter it to the input next to this button and click it
      </button>
      <input
        id="projectId"
        type="text"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        placeholder="Project ID"
      />
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
                    {/*// @ts-expect-error - deal with it later */}
                    {item.title}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    <a
                      /*// @ts-expect-error - deal with it later */
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
                    {/*// @ts-expect-error - deal with it later */}
                    {item.currentStatus}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    {/*// @ts-expect-error - deal with it later */}
                    {item.age}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}>
                    {/*// @ts-expect-error - deal with it later */}
                    {item.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
