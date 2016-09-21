const fs = require('fs')
const path = require('path')

module.exports = {
  hooks: {
    'page:before': (page) => {
      const re = /^\s*\[snippet\]\(([^#\)]+)#?([^\)]+)?\)\s*$/gm

      const dir = path.dirname(page.rawPath)
      // construct path from gitbook binary to target include
      const makePath = function (filename) {
        return path.join(dir, filename)
      }

      const sourceByFilepath = {}
      const readFilePromises = []

      // find all [snippet]() statements,
      // read and cache target files
      let res
      while (res = re.exec(page.content)) {
        const filename = res[1]
        const filepath = makePath(filename)
        readFilePromises.push(new Promise((resolve, reject) => {
          fs.readFile(filepath, "utf-8", (err, source) => {
            if (err) return reject(err)
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
            const filepath = makePath(filename)
            const source = sourceByFilepath[filepath]
            if (!fragment) return source
            const fragmentRegexp = new RegExp(`[\\s\\S]*###\\s*\\[${fragment}\\]([\\s\\S]*)###\\s*\\[${fragment}\\]`)
            const m = source.match(fragmentRegexp)
            return unindent(m[1])
          })
          return page
        })
    }
  }
}

const unindent = s => {
  // https://twitter.com/gasparnagy/status/778134306128551940
  for(;!s.match(/^\S/m);s = s.replace(/^\s/gm, ''));
  return s
}