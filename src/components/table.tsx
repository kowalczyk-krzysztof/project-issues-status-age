import { useEffect, useState } from 'react'
import { EuiDataGrid, EuiFieldSearch, EuiFlexGroup, EuiSpacer } from '@elastic/eui'
import type { EuiDataGridSorting } from '@elastic/eui'
import type { ProjectItemDTO } from '../api'
import moment from 'moment'

const columns = [
  { id: 'title', displayAsText: 'Title' },
  { id: 'url', displayAsText: 'URL' },
  { id: 'currentStatus', displayAsText: 'Current Status' },
  { id: 'updatedAt', displayAsText: 'At this status since' },
  { id: 'queue', displayAsText: 'Queue' },
]

type Props = {
  data: ProjectItemDTO[]
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
      <EuiFieldSearch
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        isClearable
      />
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
