const assert = require('assert')
const plugin = require('..')

describe("snippet", () => {
  let instance, errors, warnings

  beforeEach(() => {
    warnings = []
    errors = []
    instance = {
      options: {
        pluginsConfig: {
          snippet: {
            problem: 'warn'
          }
        }
      },
      log: {
        warn: (message) => warnings.push(message),
        error: (message) => errors.push(message)
      }
    }

  })

  it("includes the entire file when there is no fragment", () => {
    const page = {
      rawPath: __filename,
      content: `one
[snippet](hello.rb)
two
[snippet](world.rb)
three
`
    }
    return plugin.hooks['page:before'].bind(instance)(page)
      .then(() => {
        const expected = `one
puts "hello"

two
puts "world"

three
`
        assert.equal(page.content, expected)
      })
  })

  it("includes unindented ### fragment", () => {
    const page = {
      rawPath: __filename,
      content: `one
[snippet](fragment.rb#the-fragment)
two
`
    }
    return plugin.hooks['page:before'].bind(instance)(page)
      .then(() => {
        const expected = `one
if true
  puts "the fragment"
end

two
`
        assert.equal(page.content, expected)
      })
  })

  it("includes unindented /// fragment", () => {
    const page = {
      rawPath: __filename,
      content: `one
[snippet](fragment.js#the-fragment)
two
`
    }
    return plugin.hooks['page:before'].bind(instance)(page)
      .then(() => {
        const expected = `one
if (true) {
  console.log("the fragment")
}

two
`
        assert.equal(page.content, expected)
      })
  })

  describe('warnings', () => {
    beforeEach(() => {
      instance.options.pluginsConfig.snippet.problem = 'warn'
    })

    it("preserves the link and appends FILE NOT FOUND", () => {
      const page = {
        rawPath: __filename,
        content: `[snippet](nosuch.js)`
      }
      return plugin.hooks['page:before'].bind(instance)(page)
        .then(() => {
          const expected = `[snippet](nosuch.js) *FILE NOT FOUND: nosuch.js*`
          assert.equal(page.content, expected)
          assert.deepEqual(warnings.map(x => x.trim()), ["nosuch.js: " + expected])
          assert.deepEqual(errors, [])
        })
    })

    it("preserves the link and appends FRAGMENT NOT FOUND", () => {
      const page = {
        rawPath: __filename,
        content: `[snippet](hello.rb#nosuch)`
      }
      return plugin.hooks['page:before'].bind(instance)(page)
        .then(() => {
          const expected = `[snippet](hello.rb#nosuch) *FRAGMENT NOT FOUND: hello.rb#nosuch*`
          assert.equal(page.content, expected)
          assert.deepEqual(warnings.map(x => x.trim()), ["hello.rb: " + expected])
          assert.deepEqual(errors, [])
        })
    })
  })

  describe("git history", () => {
    it("includes the fragment from file based on commit message", () => {
      const commitMessage = "First commit"
      const page = {
        rawPath: __filename,
        content: `one
[snippet](fragment.rb#the-fragment@${commitMessage})
two
`
      }
      return plugin.hooks['page:before'].bind(instance)(page)
        .then(() => {
          const expected = `one
if true
  puts "the fragment"
end

two
`
          assert.equal(page.content, expected)
        })
    })
  })

})
