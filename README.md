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
    <code lang="js">
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

*Example of a badly formatted `type:auto` code-block*
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
