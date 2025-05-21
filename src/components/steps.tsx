import { EuiSteps, EuiButton, EuiFormRow, EuiFieldText, EuiText } from '@elastic/eui'
import { useState } from 'react'
import type { ProjectItemDTO } from '../api'
import { fetchAllProjectItems, getProjectId } from '../api'

type Props = {
  data: ProjectItemDTO[]
  setData: (data: ProjectItemDTO[]) => void
  setIsFetchingData: (isFetching: boolean) => void
  isFetchingData: boolean
}

export const Steps = ({ data, setData, setIsFetchingData, isFetchingData }: Props) => {
  const [projectNumber, setProjectNumber] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [orgName, setOrgName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [isFetchingProjectId, setIsFetchingProjectId] = useState(false)

  const handleGetProjectId = async () => {
    setIsFetchingProjectId(true)
    const projectId = await getProjectId(Number(projectNumber), githubToken, orgName)
    setProjectId(projectId)
    setIsFetchingProjectId(false)
  }

  const handleGetData = async () => {
    setIsFetchingData(true)
    const data = await fetchAllProjectItems(projectId, githubToken)
    setData(data)
    setIsFetchingData(false)
  }

  const steps = [
    {
      title: 'Add GitHub Organization Name',
      children: (
        <EuiFormRow
          helpText="GitHub organization under which the project lives (e.g elastic)"
          label="GitHub Organization Name">
          <EuiFieldText
            onChange={(e) => {
              setOrgName(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: orgName ? 'complete' : 'incomplete',
    },
    {
      title: 'Add GitHub token',
      children: (
        <EuiFormRow
          helpText={
            <EuiText size="xs">
              GitHub Token with permissions <strong>read:project</strong> authorized for the organization from first step
            </EuiText>
          }
          label="GitHub Token">
          <EuiFieldText
            onChange={(e) => {
              setGithubToken(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: githubToken && orgName ? 'complete' : 'incomplete',
    },
    {
      title: 'Add Project Number',
      children: (
        <EuiFormRow
          helpText="The number at the end of the project URL (e.g 1234 in https://github.com/orgs/foo/projects/1234"
          label="Project Number">
          <EuiFieldText
            onChange={(e) => {
              setProjectNumber(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: githubToken && orgName && projectNumber ? 'complete' : 'incomplete',
    },
    {
      title: 'Get Project ID',
      children: (
        <EuiButton
          disabled={!githubToken || !orgName || !projectNumber}
          onClick={handleGetProjectId}
          isLoading={isFetchingProjectId}>
          Get Project ID
        </EuiButton>
      ),
      status: githubToken && orgName && projectNumber && projectId ? 'complete' : 'incomplete',
    },
    {
      title: 'Fetch Data',
      children: (
        <EuiButton
          disabled={!githubToken || !orgName || !projectNumber || !projectId}
          onClick={handleGetData}
          isLoading={isFetchingData}>
          Fetch Data
        </EuiButton>
      ),
      status: githubToken && orgName && projectNumber && projectId && data?.length ? 'complete' : 'incomplete',
    },
  ]

  // @ts-expect-error - status type is not exported
  return <EuiSteps steps={steps} />
}
