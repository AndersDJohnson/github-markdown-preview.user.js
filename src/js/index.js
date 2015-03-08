(function () {
  'use strict';

  var $ = window.$;

  var GitHubMarkdownPreview;
  var PreviewButton;
  var Preview;

  GitHubMarkdownPreview = function () {};


  GitHubMarkdownPreview.send = function (data, callback) {
    $.ajax({
      method: 'POST',
      url: 'https://api.github.com/markdown',
      data: JSON.stringify(data),
      success: function (data, status, xhr) {
        callback(null, data, status, xhr);
      },
      error: function (xhr, status, err) {
        callback(status, err, xhr);
      }
    });
  };


  GitHubMarkdownPreview.prototype.getContext = function () {
    return 'AndersDJohnson/magnificent.js';
  };


  GitHubMarkdownPreview.prototype.run = function () {

    this.context = this.getContext();

    $(function () {
      var $comments = $('.js-comment-update');

      $comments.each(function (i, el) {
        var $comment = $(el);
        new PreviewButton($comment);
      });
    });

  };

  PreviewButton = function ($comment) {
    var that = this;

    this.$comment = $comment;

    this.$el = $('<button class="button js-comment-preview-button" tabindex="1">Preview</button>');

    this.$el.on('click', $.proxy(this.click, this));

    var $prevSibling = $comment.find('.js-comment-cancel-button');
    this.$el.insertBefore($prevSibling);

    $comment.data('previewButton', this);

    return this;
  };


  PreviewButton.prototype.click = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $comment = this.$comment;

    var preview = $comment.data('preview');
    preview = preview || new Preview($comment);

    var text = $comment.find('.comment-form-textarea').val();

    preview.loading();

    GitHubMarkdownPreview.send({
      "text": text,
      "mode": "gfm",
      "context": "github/gollum"
    }, function (err, data) {
      if (err) {
        console.error(err);
        alert('Error: '+ err);
        return;
      }

      preview.html(data);
      //preview.show();
    });
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

    this.loading();

    //this.$el.hide();

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


  var gitHubMarkdownPreview = new GitHubMarkdownPreview();
  gitHubMarkdownPreview.run();

})();
