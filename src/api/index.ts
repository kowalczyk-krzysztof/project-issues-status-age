export type ProjectItemDTO = {
  title: string
  url: string
  currentStatus: string
  updatedAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToDTO = (item: any) => {
  if (!item.content || !item.content.title || !item.content.number || item.status?.name?.includes('Done')) {
    // Skip or handle non-issue items and done items
    return null
  }
  return {
    title: item.content.title,
    url: `https://github.com/${item.content.repository.nameWithOwner}/issues/${item.content.number}`,
    currentStatus: item.status?.name ?? 'N/A',
    updatedAt: item.status?.updatedAt,
    queue: item.queue?.name ?? 'N/A',
  }
}

const getProjectsQuery = `
query($projectId: ID!, $after: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      title
      items(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          status: fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              updatedAt
            }
          }
          queue: fieldValueByName(name: "Queue") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
            }
          }
          content {
            ... on Issue {
              number
              title
              repository {
                nameWithOwner
              }
              createdAt
            }
          }
        }
      }
    }
  }
}
`

const getProjectIdQuery = `
  query($projectNumber: Int!, $orgName: String!) {
    organization(login: $orgName) {
      projectV2(number: $projectNumber) {
        id
      }
    }
  }
`

export const getProjectId = async (projectNumber: number, githubToken: string, orgName: string) => {
  const body = JSON.stringify({
    query: getProjectIdQuery,
    variables: {
      projectNumber,
      orgName,
    },
  })

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${githubToken}`,
    },
    body,
  })
  const json = await res.json()

  return json?.data?.organization?.projectV2?.id
}

export const fetchAllProjectItems = async (projectId: string, githubToken: string): Promise<ProjectItemDTO[]> => {
  let after = null
  let hasNextPage = true
  const allItems = []

  while (hasNextPage) {
    const body = JSON.stringify({
      query: getProjectsQuery,
      variables: {
        projectId,
        after,
      },
    })

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${githubToken}`,
      },
      body,
    })

    const json = await res.json()
    const data = json.data.node.items

    allItems.push(...data.nodes)
    hasNextPage = data.pageInfo.hasNextPage
    after = data.pageInfo.endCursor
  }

  console.log('allItems', allItems)

  // @ts-expect-error - deal with it later
  return allItems.map(mapToDTO).filter(Boolean) ?? []
}
