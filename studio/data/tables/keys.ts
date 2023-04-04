export const tableKeys = {
  table: (projectRef: string | undefined, id: number | undefined) =>
    ['projects', projectRef, 'table', id] as const,
}
