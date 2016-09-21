const assert = require('assert')
const plugin = require('..')

describe("snippet", () => {
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
    return plugin.hooks['page:before'](page)
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
    return plugin.hooks['page:before'](page)
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
    return plugin.hooks['page:before'](page)
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

  it("preserves the link and appends FILE NOT FOUND", () => {
    const page = {
      rawPath: __filename,
      content: `[snippet](nosuch.js)`
    }
    return plugin.hooks['page:before'](page)
      .then(() => {
        const expected =  `[snippet](nosuch.js) *FILE NOT FOUND: nosuch.js*`
        assert.equal(page.content, expected)
      })
  })

  it("preserves the link and appends FRAGMENT NOT FOUND", () => {
    const page = {
      rawPath: __filename,
      content: `[snippet](hello.rb#nosuch)`
    }
    return plugin.hooks['page:before'](page)
      .then(() => {
        const expected =  `[snippet](hello.rb#nosuch) *FRAGMENT NOT FOUND: hello.rb#nosuch*`
        assert.equal(page.content, expected)
      })
  })
})
