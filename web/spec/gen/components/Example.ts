type params = { name: string; description: string; codeBlock?: string; tabs?: string; note: string }

const Example = ({ name, description = '', tabs = '', note = '', codeBlock = '' }: params) => {
  if (note !== '') {
    const [noteTitle, ...noteText] = note.split('\n')
    console.log(noteText)
    note = `
:::note ${noteTitle}
  ${noteText.join('\n')}
:::
`
  }
  return `

#### ${name}

${description}

${tabs}

${codeBlock}

${note}

`
}

export default Example
