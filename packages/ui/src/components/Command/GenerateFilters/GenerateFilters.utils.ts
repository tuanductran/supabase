import { codeBlock } from 'common-tags'

export const generatePrompt = (prompt: string) => {
  return codeBlock`    
    Filter operators:
    "=": equals (don't use for null)
    "<>": not equal (don't use for null)
    ">": greater than
    "<": less than
    ">=": greater than or equal
    "<=": less than or equal
    "~~": like operator
    "~~*": ilike operator
    "in": one of a list of values
    
    Generate a filter object based on the query below, outputting this format:
    {
      column: string, // column name
      operator: string, // operator from above filter operators
      value: string, // user-determined value
    }
    
    Example query:
    where fruit contains the word banana and not null
    
    Example output:
    [{ column: 'fruit', operator: '~~', value: '%banana%' }, { column: 'fruit', operator: 'is', value: 'not null' }]
    
    Example query:
    name is jug
    
    Example output:
    [{ column: 'name', operator: '=', value: 'jug' }]

    Query:
    ${prompt}
    
    Output:
  `
}
