module.exports = (function() {
  'use-strict';

  const PLUGIN = 'HtmlWebpackMountpointPlugin';

  function HtmlWebpackMountpointPlugin(options) {
    if (options instanceof Array) {
      this.mountPoints = options;
    }
    else if (typeof options.tagName === 'string') {
      this.mountPoints = options.mountPoints instanceof Array ? options.mountPoints :
                         typeof options.mountPoints === 'string' ? [options.mountPoints]: null;
      this.mountPoints = this.mountPoints.map(mp => {
        if (! mp ) return null;
        return {
          tagName: options.tagName || 'div',
          id: mp
        };
      }).filter( mp => !!mp);
    }
    else if (options.mountPoints instanceof Array)
      this.mountPoints = options.mountPoints;

    if (options.headTags)
      this.headTags = options.headTags;

    if (! this.mountPoints )
      throw new Error('"mountPoints" option must be a string or an array of string.');

  }

  HtmlWebpackMountpointPlugin.prototype.apply = function apply(compiler) {
    compiler.hooks['compilation'].tap(PLUGIN, this.hookHandler.bind(this));
  };

  HtmlWebpackMountpointPlugin.prototype.hookHandler = function hookHandler(compilation) {
    if (! compilation.hooks.htmlWebpackPluginAlterAssetTags) {
      const message = "It looks like we're missing something. Just add html-webpack-plugin first";
      throw new Error(message);
    }
    compilation.hooks.htmlWebpackPluginAlterAssetTags
      .tapAsync(PLUGIN, (htmlPluginData, callback) => {
        try {
          if (this.mountPoints.length > 0) {
            htmlPluginData = this.addMountPoints(this.mountPoints, htmlPluginData);
          }
          if (this.headTags) {
            htmlPluginData = this.addHeadTags(this.headTags, htmlPluginData);
          }
          callback(null, htmlPluginData);
        }
        catch(e) { callback(e, htmlPluginData); }
      });
  };

  HtmlWebpackMountpointPlugin.prototype.addMountPoints = function addMountPoints(mpArray, plugindata) {
      const mounts = mpArray.map( mp => ({
        tagName: mp.tagName,
        closeTag: true,
        attributes: Object.assign({id: mp.id}, this.convertCommon(mp.attributes))
      }));
      plugindata.body = mounts.concat(plugindata.body);
      return plugindata;
  };

  HtmlWebpackMountpointPlugin.prototype.addHeadTags = function addHeadTags(htArray, plugindata) {
      const tags = htArray.map( ht => ({
        tagName: ht.tagName,
        selfClosingTag: ht.closeTag || false,
        attributes: ht.attributes
      }));
      plugindata.head = tags.concat(plugindata.head);
      return plugindata;
  };

  HtmlWebpackMountpointPlugin.prototype.convertCommon = function convertCommon(attrsObj) {
    if (attrsObj && attrsObj['className']) {
      attrsObj['class'] = attrsObj.className;
      delete attrsObj.className;
    }
    return attrsObj;
  }

  return HtmlWebpackMountpointPlugin;
})();
