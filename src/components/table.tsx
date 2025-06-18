import { useEffect, useState } from 'react'
import { EuiButton, EuiDataGrid, EuiFieldSearch, EuiFlexGroup, EuiSpacer } from '@elastic/eui'
import type { EuiDataGridSorting } from '@elastic/eui'
import type { ProjectItemDTO } from '../api'
import moment from 'moment'

const columns = [
  { id: 'title', displayAsText: 'Title' },
  { id: 'url', displayAsText: 'URL' },
  { id: 'currentStatus', displayAsText: 'Current Status' },
  { id: 'updatedAt', displayAsText: 'At this status since' },
  { id: 'queue', displayAsText: 'Queue' },
  { id: 'assignees', displayAsText: 'Assignees' },
]

type Props = {
  data: ProjectItemDTO[]
}

const toCsv = (items: ProjectItemDTO[]) => {
  const headerString = columns.map((column) => column.displayAsText).join(';')

  const safeStringify = (value: unknown) => {
    if (value === null || value === undefined) return ''
    if (Array.isArray(value)) return `"${value.join(', ')}"` // Format arrays nicely
    return `"${String(value).replace(/"/g, '""')}"` // Escape quotes per CSV spec
  }

  // @ts-expect-error cba dealing with this
  const rowItems = items.map((row) => columns.map(({ id }) => safeStringify(id === 'updatedAt' ? getTime(row[id]) : row[id])).join(';'))

  const csv = [headerString, ...rowItems].join('\r\n')

  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'export.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return csv
}

const getTime = (date?: string) => {
  if (!date) return 'N/A'
  const preciseDiff = moment.duration(moment().diff(moment(date)))
  const years = preciseDiff.years()
  const months = preciseDiff.months()
  const days = preciseDiff.days()
  const timeAgoParts = []
  if (years) timeAgoParts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (months) timeAgoParts.push(`${months} month${months > 1 ? 's' : ''}`)
  if (days) timeAgoParts.push(`${days} day${days > 1 ? 's' : ''}`)
  if (timeAgoParts.length === 0) return 'Today'
  return timeAgoParts.join(' ') + ' ago'
}

export const Table = ({ data }: Props) => {
  const [sortedData, setSortedData] = useState(data)
  const [sortingColumns, setSortingColumns] = useState<EuiDataGridSorting['columns']>([{ id: 'updatedAt', direction: 'desc' }])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setSortedData(data)
  }, [data])

  const onSort: EuiDataGridSorting['onSort'] = (columns) => {
    setSortingColumns(columns)
    if (columns.length === 0) {
      setSortedData(data)
      return
    }
    const [{ id, direction }] = columns
    const newSortedData = [...data].sort((a, b) => {
      const aValue = a[id as keyof ProjectItemDTO] as string | undefined
      const bValue = b[id as keyof ProjectItemDTO] as string | undefined
      if (id === 'updatedAt') {
        const aTime = aValue ? new Date(aValue).getTime() : direction === 'asc' ? Infinity : -Infinity
        const bTime = bValue ? new Date(bValue).getTime() : direction === 'asc' ? Infinity : -Infinity
        return direction === 'asc' ? aTime - bTime : bTime - aTime
      }
      return 0
    })
    setSortedData(newSortedData)
  }

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some(
      (value) => value && (value.toString().toLowerCase().includes(query.toLowerCase()) || getTime(value).toLowerCase().includes(query.toLowerCase()))
    )
  )

  return (
    <EuiFlexGroup
      direction="column"
      gutterSize="m">
      <EuiFlexGroup>
        <EuiFieldSearch
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isClearable
        />
        <EuiButton
          onClick={() => {
            toCsv(sortedData)
          }}
          disabled={!sortedData.length}>
          Export as CSV
        </EuiButton>
      </EuiFlexGroup>
      <EuiSpacer size="m" />
      <EuiDataGrid
        sorting={{
          columns: sortingColumns,
          onSort,
        }}
        aria-label="Project List"
        columnVisibility={{
          visibleColumns: columns.map((column) => column.id),
          setVisibleColumns: () => {},
        }}
        columns={columns}
        width={1600}
        height={960}
        rowCount={filteredData.length}
        renderCellValue={({ rowIndex, columnId }) => {
          const item = filteredData[rowIndex]
          if (!item) return null
          if (columnId === 'updatedAt') {
            return getTime(item.updatedAt)
          }
          if (columnId === 'url') {
            return (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer">
                {item.url}
              </a>
            )
          }
          return item[columnId as keyof ProjectItemDTO]
        }}
      />
    </EuiFlexGroup>
  )
}
