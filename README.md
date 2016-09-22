# Snippets for GitBook

Include entire code files or fragments of code files in your pages.
Read files from file system, or from git.

## Installation

```
{
  "plugins": [
    "snippet@git+https://github.com/cucumber-ltd/gitbook-plugin-snippet.git"
  ],
  "pluginsConfig": {
    "snippet": {
      "problem": "fail"
    }
  }
}
```

The `problem` property can be `"warn"` ,`"error"` or `"fail"`. Default is `"error"`.

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

## Include files from git

Just apend `@` after the marker, followed by the commit message (or substring of commit message). Example:

    [snippet](some/file-with-fragment.rb#the-marker@this fixes a bug)

All branches will be searched. If multiple commits match the commit message, the most recent one is always picked.

## Inspiration

* https://github.com/rlmv/gitbook-plugin-include
* https://github.com/azu/gitbook-plugin-include-codeblock
