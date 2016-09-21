const fs = require('fs')
const path = require('path')

module.exports = {
  hooks: {
    'page:before': (page) => {
      const snippetRegexp = /^\s*\[snippet\]\(([^#\)]+)#?([^\)]+)?\)\s*$/gm

      const dir = path.dirname(page.rawPath)

      const sourceByFilepath = {}
      const readFilePromises = []

      // find all [snippet]() statements,
      // read and cache target files
      let snippetMatch
      while (snippetMatch = snippetRegexp.exec(page.content)) {
        const filename = snippetMatch[1]
        const filepath = path.join(dir, filename)
        readFilePromises.push(new Promise((resolve) => {
          fs.readFile(filepath, "utf-8", (err, source) => {
            if (err) return resolve()
            sourceByFilepath[filepath] = source
            resolve()
          })
        }))
      }

      // once all files are read, replace snippet statements with
      // appropriate file content
      return Promise.all(readFilePromises)
        .then(() => {
          page.content = page.content.replace(snippetRegexp, (snippetLink, filename, fragment) => {
            const filepath = path.join(dir, filename)
            const source = sourceByFilepath[filepath]
            if (!source) return `${snippetLink} *FILE NOT FOUND: ${filename}*`
            if (!fragment) return source
            // find the content between two anchors, which can be "### [fragment-nane]" or "/// [fragment-nane]"
            const fragmentRegexp = new RegExp(`[\\s\\S]*(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]([\\s\\S]*)(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]`)
            const fragmentMatch = source.match(fragmentRegexp)
            if (!fragmentMatch) return `${snippetLink} *FRAGMENT NOT FOUND: ${filename}#${fragment}*`
            return unindent(fragmentMatch[1])
          })
          return page
        })
    }
  }
}

const unindent = s => {
  // https://twitter.com/gasparnagy/status/778134306128551940
  for (; !s.match(/^\S/m); s = s.replace(/^\s/gm, ''));
  return s
}