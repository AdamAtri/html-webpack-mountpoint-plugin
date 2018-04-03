module.exports = (function() {
  'use-strict';

  const PLUGIN = 'HtmlWebpackMountpointPlugin';

  function HtmlWebpackMountpointPlugin(options) {
    this.tagName = options.tagName || 'div';
    this.mountPoints = options.mountPoints instanceof Array ? options.mountPoints : [options.mountPoints];
  }

  HtmlWebpackMountpointPlugin.prototype.apply = function apply(compiler) {
    compiler.hooks['compilation'].tap(PLUGIN, this.hookHandler.bind(this));
  };

  HtmlWebpackMountpointPlugin.prototype.hookHandler = function hookHandler(compilation) {
    if (! compilation.hooks.htmlWebpackPluginAlterAssetTags) {
      const message = `It looks like we're missing something. Just add html-webpack-plugin first`;
      throw new Error(message);
    }
    compilation.hooks.htmlWebpackPluginAlterAssetTags
      .tapAsync(PLUGIN, (htmlPluginData, callback) => {
        if (this.mountPoints.length > 0) {
          this.addMountPoints(this.mountPoints, this.tagName, htmlPluginData, callback);
        }
        else {
          callback(null, htmlPluginData);
        }
      });
  };

  HtmlWebpackMountpointPlugin.prototype.addMountPoints = function addMountPoints(mpArray, tagName, plugindata, cb) {
    const mounts = mpArray.map( mp => ({
      tagName,
      closeTag: true,
      attributes: {
        id: mp
      }
    }));
    plugindata.body = mounts.concat(plugindata.body);
    cb(null, plugindata);
  };

  return HtmlWebpackMountpointPlugin;
})();
