# Snippets for GitBook

Include entire code files or snippets of code files in your pages.

```
{
  "plugins": ["snippet"],
}
```

## Whole files

Let's say you have `some/file.rb`:

```ruby
puts "hello"
```

You can slurp that into a Markdown file:

    Look at this code:

    ```ruby
    [snippet](some/file.rb)
    ```

This will replace the `[snippet](...)` link with the entire contents of the file:

    Look at this code:

    ```ruby
    puts "hello"
    ```

## Fragments

Let's say you have `some/file-with-fragments.rb` with [doxygen-like](https://www.stack.nl/~dimitri/doxygen/manual/commands.html#cmdsnippet) fragments:

```ruby
class Fragment
  ### [the-fragment]
  if true
    puts "the fragment"
  end
  ### [the-fragment]
end
```

Slurp in just the fragment:

    Look at this code:

    ```ruby
    [snippet](some/file-with-fragments.rb#the-fragment)
    ```

Result:

    Look at this code:

    ```ruby
    if true
      puts "the fragment"
    end
    ```

Note that the fragment has been unindented while preserving whitespace.

## Inspiration

* https://github.com/rlmv/gitbook-plugin-include
* https://github.com/azu/gitbook-plugin-include-codeblock
