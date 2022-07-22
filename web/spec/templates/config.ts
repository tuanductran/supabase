const template = `

# <%= info.title %>

<%= info.description %>

<% sections.forEach(function(section){ %>

## <%= section.title %>

<% section.parameters.forEach(function(parameter){ %>
### \`<%- parameter.title %>\`

| Parameter | Required     | Default                |
| :-------- | :------- | :------------------------- |
| \`<%- parameter.title %>\` | \`<%= parameter.required %>\` | \`<%- parameter.default %>\` |

<%- parameter.description %>

<% }); %>

<% }); %>
`.trim()

export default template
