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

  it("includes unindented fragment", () => {
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
})
