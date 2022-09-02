const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const matter = require('gray-matter')

const algoliasearch = require('algoliasearch/lite')

async function generateSearch() {
  try {
    dotenv.config()

    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
      throw new Error('NEXT_PUBLIC_ALGOLIA_APP_ID is not defined')
    }

    if (!process.env.ALGOLIA_SEARCH_ADMIN_KEY) {
      throw new Error('ALGOLIA_SEARCH_ADMIN_KEY is not defined')
    }

    // imports and try/catch loop here

    const CONTENT_PATH = path.join(process.cwd(), 'docs/guides')
    const contentFilePaths = fs
      .readdirSync(CONTENT_PATH)
      // Only include md(x) files
      .filter((path) => /\.mdx?$/.test(path))

    async function getAllBlogPosts() {
      const articles = contentFilePaths.map((filePath) => {
        const source = fs.readFileSync(path.join(CONTENT_PATH, filePath))
        const { content, data } = matter(source)

        return {
          content, // this is the .mdx content
          data, // this is the frontmatter
          filePath, // this is the file path
        }
      })

      return articles
    }

    const posts = await getAllBlogPosts()

    function transformPostsToSearchObjects(articles) {
      const transformed = articles.map((article) => {
        return {
          objectID: article.data.title,
          title: article.data.title,
          description: article.data.description,
          slug: article.filePath,
          tagsCollection: { tags: article.data.tags }, // we can nest objects in Algolia!
          date: article.data.publishedAt,
          type: 'article',
          content: article.content,

          // ...
        }
      })

      return transformed
    }

    const transformed = transformPostsToSearchObjects(posts)

    console.log('It works!')

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_ADMIN_KEY
    )

    // initialize the index with your index name
    const index = client.initIndex('supa-docs')

    // add the data to the index
    const algoliaResponse = await index.saveObjects(transformed)

    console.log(
      `Successfully added ${
        algoliaResponse.objectIDs.length
      } records to Algolia search! Object IDs:\n${algoliaResponse.objectIDs.join('\n')}`
    )
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

generateSearch()
