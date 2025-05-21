import { EuiSteps, EuiButton, EuiFormRow, EuiFieldText, EuiText, EuiFieldPassword } from '@elastic/eui'
import type { EuiStepStatus } from '@elastic/eui'
import { useState } from 'react'
import type { ProjectItemDTO } from '../api'
import { fetchAllProjectItems, getProjectId } from '../api'

type Props = {
  data: ProjectItemDTO[]
  setData: (data: ProjectItemDTO[]) => void
  isFetchingData: boolean
  setIsFetchingData: (isFetching: boolean) => void
}

export const Steps = ({ data, setData, isFetchingData, setIsFetchingData }: Props) => {
  const [projectNumber, setProjectNumber] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [orgName, setOrgName] = useState('elastic')
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
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: orgName ? ('complete' as EuiStepStatus) : ('incomplete' as EuiStepStatus),
    },
    {
      title: 'Add GitHub token',
      children: (
        <EuiFormRow
          helpText={
            <EuiText size="xs">
              GitHub Token with permissions <strong>read:project</strong>, authorized for the organization from first step
            </EuiText>
          }
          label="GitHub Token">
          <EuiFieldPassword
            value={githubToken}
            onChange={(e) => {
              setGithubToken(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: githubToken && orgName ? ('complete' as EuiStepStatus) : ('incomplete' as EuiStepStatus),
    },
    {
      title: 'Add Project Number',
      children: (
        <EuiFormRow
          helpText='The number after "/projects/" in the project URL (e.g 1234 in https://github.com/orgs/foo/projects/1234)'
          label="Project Number">
          <EuiFieldText
            value={projectNumber}
            isInvalid={!Number.isInteger(Number(projectNumber))}
            onChange={(e) => {
              setProjectNumber(e.target.value)
            }}
          />
        </EuiFormRow>
      ),
      status: githubToken && orgName && projectNumber ? ('complete' as EuiStepStatus) : ('incomplete' as EuiStepStatus),
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
      status: githubToken && orgName && projectNumber && projectId ? ('complete' as EuiStepStatus) : ('incomplete' as EuiStepStatus),
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
      status: githubToken && orgName && projectNumber && projectId && data?.length ? ('complete' as EuiStepStatus) : ('incomplete' as EuiStepStatus),
    },
  ]

  return <EuiSteps steps={steps} />
}
