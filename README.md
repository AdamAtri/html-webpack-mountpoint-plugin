# html-webpack-mountpoint-plugin

This is a naive utility that adds application mount points to the default html template provided by [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) (use with **webpack4**)

### Basic Usage
to install:
- `npm i html-webpack-mountpoint-plugin --save-dev`  
or
- `yarn add html-webpack-mountpoint-plugin -D`



webpack.config.js
```javascript

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackMountpointPlugin = require('html-webpack-mountpoint-plugin');
...
{
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WebpackMountpointTest',
      <options>
    }),
    new HtmlWebpackMountpointPlugin({
      tagName: 'section',
      mountPoints: ['app-hook', 'dialogs-hook']
    }) ...

    or

    new HtmlWebpackMountpointPlugin([
      {
        tagName: 'section',
        id: 'app-hook',
        attributes: {
          className: 'mounted-spa'
        }
      },
      {
        tagName: 'div',
        id: 'dialogs-hook',
        attributes: {
          className: 'dialogs mounted'
        }
      },
    ])
  ], ...
}
```

produces:  index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>WebpackMountpointTest</title>
  </head>
  <body>
    <section id="app-hook"></section>
    <section id="dialogs-hook"></section>
    <script type="text/javascript" src="src.bundle.js"></script>
  </body>
  <!--  or  -->
  <body>
    <section id="app-hook" class="spa mount"></section>
    <div id="dialogs-hook" class="too-cool"></div>
    <script type="text/javascript" src="src.bundle.js"></script>
  </body>
</html>
```
