# Snippets for GitBook

Include entire code files or fragments of code files in your pages.

## Installation

```
{
  "plugins": [
    "snippet@git+https://github.com/cucumber-ltd/gitbook-plugin-snippet.git"
  ]
}
```

## Include entire file

Let's say you have a file `some/file.rb`:

```ruby
puts "hello"
```

You can include its contents in a document as follows:

    Look at this code:

    ```ruby
    [snippet](some/file.rb)
    ```

The `[snippet](...)` link will be replaced with the entire contents of the file:

    Look at this code:

    ```ruby
    puts "hello"
    ```

## Include fragments from files

Let's say you have a file `some/file-with-fragment.rb` with 
[doxygen-like](https://www.stack.nl/~dimitri/doxygen/manual/commands.html#cmdsnippet) block markers:

```ruby
class Fragment
  ### [the-marker]
  if true
    puts "the fragment"
  end
  ### [the-marker]
end
```

You can include just the fragment between the markers as follows:

    Look at this code:

    ```ruby
    [snippet](some/file-with-fragment.rb#the-marker)
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
