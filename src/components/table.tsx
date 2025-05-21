import { useEffect, useState } from 'react'
import { EuiDataGrid } from '@elastic/eui'
import type { EuiDataGridSorting } from '@elastic/eui'
import type { ProjectItemDTO } from '../api'
import moment from 'moment'

const columns = [
  { id: 'title', displayAsText: 'Title' },
  { id: 'url', displayAsText: 'URL' },
  { id: 'currentStatus', displayAsText: 'Current Status' },
  { id: 'updatedAt', displayAsText: 'At this status since' },
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

    // TODO: Fix sorting
    const newSortedData = [...data].sort((a, b) => {
      const aValue = a[id as keyof ProjectItemDTO]
      const bValue = b[id as keyof ProjectItemDTO]

      if (id === 'updatedAt') {
        const aDate = new Date(aValue as string)
        const bDate = new Date(bValue as string)
        return direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
      }

      if (aValue! < bValue!) return direction === 'asc' ? -1 : 1
      if (aValue! > bValue!) return direction === 'asc' ? 1 : -1
      return 0
    })

    setSortedData(newSortedData)
  }

  return (
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
      rowCount={sortedData.length}
      renderCellValue={({ rowIndex, columnId }) => {
        const item = sortedData[rowIndex]
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
  )
}
