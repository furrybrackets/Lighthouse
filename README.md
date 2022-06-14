# Lighthouse
Syntax highlighting API for everyone.

## How does Lighthouse work?
Lighthouse works by using VSCode syntax highlighting and shipping you already generated HTML.

## Getting Started
Lighthouse is completely free, forever. It provides you with an API for getting pre-styled HTML.

```html
<!-- ... -->
<head>
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<!-- ... -->
<script>
  const lh = Lighthouse.Lighthouse({
    lang: 'javascript', // default: 'javascript'
    lineNumbers: true, // default: false
    theme: 'github-dark', // default: 'material-palenight',
    // api: 'https://someapi.dev', (default is Lighthouse API website)
    // In Node.js:
    // fileTheme: JSON.parse(fs.readFileSync('./theme'))
  })
</script>
```

This will then allow you to make requests using Lighthouse.

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
<script>
  const lh = Lighthouse.Lighthouse({
    lang: 'javascript', // default: 'javascript'
    lineNumbers: true, // default: false
    theme: 'github-dark', // default: 'material-palenight',
    // api: 'https://someapi.dev', (default is Lighthouse API website)
    // In Node.js:
    // fileTheme: JSON.parse(fs.readFileSync('./theme'))
  })
  
  lh.fillCodeBlocks();
</script>
<body>
  <!-- stuff before your first code block -->
  <pre>
    <code lang="js">
function foo(bar) {
    return bar*bar;
};
      
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
Without said, this is the most annoying way of writing code, ever.

#### Pitfall #4: No API Calls
This doesn't allow you to use any info outside your HTML files. Self-explanatory.

### Method 2: JavaScript Generator
Lighthouse also has a JavaScript API which can be used to request HTML straight from the API. It comes as the main JavaScript.

*How to setup Lighthouse.js`

Header:

```html
<!-- ... -->
<head>
  <script src="lighthouse-api.dev/cdn/latest.min.js"></script>
  <link href="lighthouse-api.dev/cdn/latest.min.css" rel="stylesheet">
</head>
<!-- ... -->
<code id="foo"></code>
```
JavaScript for the page:
```js
// ...
 const lh = Lighthouse.Lighthouse({
    lang: 'javascript', // default: 'javascript'
    lineNumbers: true, // default: false
    theme: 'github-dark', // default: 'material-palenight',
    // api: 'https://someapi.dev', (default is Lighthouse API website)
    // In Node.js:
    // fileTheme: JSON.parse(fs.readFileSync('./theme'))
})
  
// to get HTML

lh.getHTML(`return x;`).then(html => {
  do.something(html);
})
```

This will generate a code-block that can be used. 
