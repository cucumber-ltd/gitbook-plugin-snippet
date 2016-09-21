const fs = require('fs')
const path = require('path')

module.exports = {
  hooks: {
    'page:before': (page) => {
      const re = /^\s*\[snippet\]\(([^#\)]+)#?([^\)]+)?\)\s*$/gm

      const dir = path.dirname(page.rawPath)

      const sourceByFilepath = {}
      const readFilePromises = []

      // find all [snippet]() statements,
      // read and cache target files
      let res
      while (res = re.exec(page.content)) {
        const filename = res[1]
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
          page.content = page.content.replace(re, function (match, filename, fragment) {
            const filepath = path.join(dir, filename)
            const source = sourceByFilepath[filepath]
            if (!source) return `${match} *FILE NOT FOUND: ${filename}*`
            if (!fragment) return source
            const fragmentRegexp = new RegExp(`[\\s\\S]*(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]([\\s\\S]*)(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]`)
            const m = source.match(fragmentRegexp)
            if (!m) return `${match} *FRAGMENT NOT FOUND: ${filename}#${fragment}*` //throw new Error(`Fragment [${fragment}] not found in ${filepath}`)
            return unindent(m[1])
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