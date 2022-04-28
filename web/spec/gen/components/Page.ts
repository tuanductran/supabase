type PageParmas = {
  id: string
  title: string
  titleSize?: 'h2' | 'h3'
  slug: string
  specFileName: string
  description?: string
  parameters?: string
  examples?: string[]
  spotlight?: string
  notes?: string
  result?: string
  errors?: string
}

const Page = ({
  id,
  title,
  titleSize = 'h3',
  slug,
  specFileName,
  description = '',
  parameters = '',
  examples = [],
  spotlight = '',
  notes = '',
  result = '',
  errors = '',
}: PageParmas) =>
  `
${titleSize === 'h2' ? `## ${title}` : `### ${title}`}

${description}

${spotlight}

${parameters ? `#### Parameters` : ''}

${parameters}

${notes ? '#### Notes' : ''}

${notes}

${result ? `#### Result` : ''}

${result}

${errors ? `#### Errors` : ''}

${errors}

${examples.length > 0 ? '#### Examples' : ''}

${examples.join(`\n\n`)}


<br />
<br />
<br />
`

export default Page
