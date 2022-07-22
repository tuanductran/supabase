const template = `

# <%= info.title %>

<%= info.description %>

<% sections.forEach(function(section){ %>

## <%= section.title %>

<% section.parameters.forEach(function(parameter){ %>
### \`<%- parameter.title %>\`

| Parameter | Required     | Default                |
| :-------- | :------- | :------------------------- |
| \`<%- parameter.title %>\` | \`<%= parameter.required %>\` | \`<%- parameter?.default %>\` |

<%- parameter.description %>

See also:

<% parameter.links?.forEach(function(link){ %>
- [<%- link.name %>](<%- link.link %>)
<% }); %>

<% }); %>

<% }); %>
`.trim()

export default template
