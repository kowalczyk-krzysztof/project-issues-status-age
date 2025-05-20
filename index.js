const { parseArgs } = require('node:util')
const fs = require('fs')
const path = require('path')

const {
  values: { github_token, project_id },
} = parseArgs({
  options: {
    github_token: { type: 'string' },
    project_id: { type: 'string' },
  },
})

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${github_token}`,
}

const writeCSV = (items, filename = 'project_issues.csv') => {
  const header = ['title', 'url', 'currentStatus', 'age']
  const rows = items.map((item) =>
    header
      .map((field) => {
        // Escape double quotes and wrap fields in quotes
        const value = item[field] ?? ''
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  )
  const csvContent = [header.join(','), ...rows].join('\n')
  const filePath = path.join(process.cwd(), filename)
  fs.writeFileSync(filePath, csvContent, { encoding: 'utf8' })
  console.log(`CSV written to: ${filePath}`)
}

const getAge = (date) => {
  if (!date) {
    return 'N/A'
  }
  const pastDate = new Date(date)
  const now = new Date()

  const diffMs = now - pastDate

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60)
  const diffSeconds = Math.floor((diffMs / 1000) % 60)

  return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes, ${diffSeconds} seconds`
}

const mapToDTO = (item) => {
  if (!item.content || !item.content.title || !item.content.number) {
    // Skip or handle non-issue items
    return null
  }
  return {
    title: item.content.title,
    url: `https://github.com/${item.content.repository.nameWithOwner}/issues/${item.content.number}`,
    currentStatus: item.fieldValueByName?.name ?? 'N/A',
    age: getAge(item.fieldValueByName?.updatedAt),
  }
}

const query = `
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
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              updatedAt
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

async function fetchAllProjectItems() {
  let after = null
  let hasNextPage = true
  const allItems = []

  while (hasNextPage) {
    const body = JSON.stringify({
      query,
      variables: {
        projectId: project_id,
        after,
      },
    })

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body,
    })

    const json = await res.json()
    const data = json.data.node.items

    allItems.push(...data.nodes)
    hasNextPage = data.pageInfo.hasNextPage
    after = data.pageInfo.endCursor
  }

  return allItems
}

;(async () => {
  const items = await fetchAllProjectItems()
  if (items?.length > 0) {
    const mapped = items.map(mapToDTO).filter(Boolean)
    writeCSV(mapped)
  }
})()
