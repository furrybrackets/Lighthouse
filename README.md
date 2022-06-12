# Lighthouse
Syntax highlighting API for everyone.

## How does Lighthouse work?
Lighthouse works by using VSCode syntax highlighting and shipping you already generated HTML.

### How fast is Lighthouse?
Lighthouse is fast, like *crazy* fast. It uses [`rayo.js`](https://github.com/GetRayo/rayo.js), a super-fast JavaSript HTTP framework.

## Getting Started
Lighthouse is completely free, forever. It provides you with an API for getting pre-styled HTML.

```html
<!-- ... -->
<head>
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<!-- ... -->
```

This will then allow you to make requests to the CDN using Lighthouse.

### Method 1: Auto

Lighthouse can automatically parse your HTML and render all `code` blocks.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... -->
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<body>
  <!-- stuff before your first code block -->
  <pre>
    <code lang="js" fixwhitespace="true">
      function foo(bar) {
        return bar*bar;
      }
      
      console.log(foo(3));
    </code>
  </pre>
</body>
```

This method has a few pitfalls.
#### Pitfall #1: HTML
Any XML/HTML cannot be easily rendered without `&lt;` because otherwise it will be parsed as it's own HTML tag.

*Example of a badly formatted `type:auto` code-block.*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... -->
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<body>
  <!-- stuff before your first code block -->
  <pre>
    <code lang="html">
<h1>Fucking cool!</h1>
    </code>
  </pre>
</body>
```

#### Pitfall #2: Anything that also uses `<` and `>`
C++ or *practically* any programming with generics have this pitfall.

*Example of poorly formatted Rust code.*
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... -->
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<body>
  <!-- stuff before your first code block -->
  <pre>
    <code lang="rust">
fn largest<T>(list: &[T]) -> T {
let mut largest = list[0];

for &item in list {
    if item > largest {
       largest = item;
    }
 }

largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}

    </code>
  </pre>
</body>
```

#### Pitfall #3: Annoying
Without said, this is the most annoying way of writing code, ever. The indentation problem is solved with a parameter, though.

##### `fixwhitespace`
`fixwhitespace` will remove any starting newlines (`\n`) and also will take the number of indents and/or spaces from line `1` and remove them from each line.

*Example of `fixwhitespace`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... -->
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<body>
  <!-- stuff before your first code block -->
  <pre>
    <code lang="js" fixwhitespace="true">
      function foo(bar) {
        return bar*bar;
      }
      
      console.log(foo(3));
    </code>
  </pre>
</body>
```
This will remove any prefixed `\n` (only 1 in this case) and find the number of standard spaces and indents (`{ spaces: 6, indents: 0 }`) and subtract them from each line before converting to `html`. This preserves any other indents for syntax formatting while not having unnecessary indents on each line.

*What Lighthouse sees.*
```js
// ...
const fixed = Lighthouse.removeWhitespace({
  newlines: 1,
  spaces: 6,
  indents: 0
}, code);
// ...
```
