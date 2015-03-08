// ==UserScript==
// @name       GitHub Markdown Preview
// @namespace  https://github.com/AndersDJohnson/
// @version    1.0.0
// @description GitHub markdown previews for editing comments.
// @author     Anders D. Johnson
// @copyright  2015+, Anders D. Johnson
// @match      *://*.github.com/*/pull/*
// @match      *://*.github.com/*/issue/*
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

/*global GM_xmlhttpRequest: true */

(function () {
  'use strict';

  var $ = window.$;

  var GitHubMarkdownPreview;
  var PreviewButton;
  var Preview;

  GitHubMarkdownPreview = function () {};


  GitHubMarkdownPreview.send = function (data, callback) {
    GM_xmlhttpRequest({ // jshint ignore:line
      method: "POST",
      url: "https://api.github.com/markdown",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      onload: function(response) {
        if (response.status < 400) {
          callback(null, response.responseText, response.statusText, response);
        }
        else {
          callback(response.statusText, response.responseText, response.statusText, response);
        }
      }
    });
  };


  GitHubMarkdownPreview.prototype.init = function () {
    this.inited = true;
    this.context = this.getContext();
  };


  GitHubMarkdownPreview.prototype.getContext = function () {
    var pathname = window.location.pathname || '';
    return this.parseContext(pathname);
  };


  GitHubMarkdownPreview.prototype.parseContext = function (pathname) {
    pathname = pathname || '';
    var match = pathname.match(/\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : null;
  };


  GitHubMarkdownPreview.prototype.run = function () {
    var that = this;

    if (! this.inited) {
      this.init();
    }

    $(function () {
      var $comments = $('.js-comment-update');

      $comments.each(function (i, el) {
        var $comment = $(el);
        new PreviewButton($comment, that.context);
      });
    });

  };

  PreviewButton = function ($comment, context) {
    var that = this;

    this.context = context;

    if ($comment.data('previewButton')) {
      return;
    }

    this.$comment = $comment;

    this.$el = $('<button class="button js-comment-preview-button" tabindex="1">Preview</button>');

    this.$el.on('click', $.proxy(this.click, this));

    var $prevSibling = $comment.find('.js-comment-cancel-button');
    this.$el.insertBefore($prevSibling);

    $comment.data('previewButton', this);

    var $hidePreviewOnClick = $comment.find('.js-comment-cancel-button, [type="submit"]');
    $hidePreviewOnClick.on('click', $.proxy(this.hidePreviewOnClick, this));

    var preview = $comment.data('preview');
    this.preview = preview || new Preview($comment);

    return this;
  };


  PreviewButton.prototype.click = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $comment = this.$comment;
    var context = this.context;
    var preview = this.preview;

    var text = $comment.find('.comment-form-textarea').val();

    preview.loading();
    preview.show();

    var reqData ={
      "text": text,
      "mode": "gfm"
    };
    if (context) {
      reqData.context = context;
    }

    GitHubMarkdownPreview.send(reqData, function (err, data, status, xhr) {
      if (err) {
        console.error(err, data, status, xhr);
        preview.html('Error loading preview: status: "' + status + '", data: "' + data + '"');
        return;
      }

      preview.html(data);
    });
  };


  PreviewButton.prototype.hidePreviewOnClick = function (e) {
    this.preview.html('');
    this.preview.hide();
  };


  Preview = function ($comment) {
    var that = this;

    this.$comment = $comment;

    this.loadingHtml = 'Loading preview&hellip;';

    this.$el = $(
      '<div class="preview-content">\n\
        <div class="comment">\n\
          <div class="comment-content">\n\
            <div class="comment-body markdown-body"></div>\n\
          </div>\n\
        </div>\n\
      </div>'
    );

    this.hide();

    $comment.append(this.$el);
    $comment.data('preview', this);

    return this;
  };


  Preview.prototype.loading = function () {
    this.html(this.loadingHtml);
  };


  Preview.prototype.html = function (html) {
    this.$el.find('.comment-body.markdown-body').html(html);
  };


  Preview.prototype.show = function () {
    this.$el.show();
  };


  Preview.prototype.hide = function () {
    this.$el.hide();
  };


  var gitHubMarkdownPreview = new GitHubMarkdownPreview();

  setInterval(function () {
    gitHubMarkdownPreview.run();
  }, 1000);

})();
