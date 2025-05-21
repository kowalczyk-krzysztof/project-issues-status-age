import { EuiDataGrid } from '@elastic/eui'

// Define the ProjectItemDTO type
export type ProjectItemDTO = {
  title: string
  url: string
  currentStatus: string
  age: string
  updatedAt: string
}

// Example data
const projectItems: ProjectItemDTO[] = [
  {
    title: 'Project A',
    url: 'https://example.com/a',
    currentStatus: 'Active',
    age: '2 years',
    updatedAt: '2025-05-20',
  },
  {
    title: 'Project B',
    url: 'https://example.com/b',
    currentStatus: 'Completed',
    age: '1 year',
    updatedAt: '2025-04-15',
  },
  {
    title: 'Project C',
    url: 'https://example.com/c',
    currentStatus: 'On Hold',
    age: '3 years',
    updatedAt: '2025-01-10',
  },
]

// Define the columns for the grid
const columns = [
  {
    id: 'title',
    displayAsText: 'Title',
  },
  {
    id: 'url',
    displayAsText: 'URL',
  },
  {
    id: 'currentStatus',
    displayAsText: 'Current Status',
  },
  {
    id: 'age',
    displayAsText: 'Age',
  },
  {
    id: 'updatedAt',
    displayAsText: 'Updated At',
  },
]

export const Table = ({ data }: { data: ProjectItemDTO[]}) => {
  return (
    <EuiDataGrid
      aria-label="Project List"
      columnVisibility={{
        visibleColumns: columns.map((column) => column.id),
        setVisibleColumns: () => {},
      }}
      columns={columns}
      rowCount={projectItems.length}
      renderCellValue={({ rowIndex, columnId }) => {
        const item = projectItems[rowIndex]
        if (!item) return null
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

