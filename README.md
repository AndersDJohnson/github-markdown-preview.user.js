# github-markdown-preview.user.js

Preview comment edits on [GitHub][GitHub]'s [issues][gh-issues] & [pull requests][gh-pulls]. Not sure why GitHub is missing this feature, but user scripts to the rescue!

Talks to the [GitHub API for Markdown](gh-api-md) to render comment previews in [GitHub Flavored Markdown], including issues and PRs references for the current repository.

If it stops working for you at any point, it might be because you've exceeded what the API allows with [rate limiting][gh-rate-limit] for unauthenticated requests. If this becomes a problem, please let us know, and we could look at possibly integrating OAuth as an application, or allowing the user to configure a personal access token.

## Install

### Chrome

#### TamperMonkey
1. Install [Tampermonkey] Chrome extension.
2. Open script URL in Chrome: https://github.com/AndersDJohnson/github-markdown-preview.user.js/raw/master/src/js/github-markdown-preview.user.js
3. Should see Tampermonkey page. Choose "Install" button.

#### Native

See [Chromium User Scripts]. Have not tested.

### Firefox

#### GreaseMonkey

See [GreaseMonkey]. Have not tested.

## Usage

Go to any GitHub issue or pull request and edit one of your comments.
You should see a new "Preview" button, which will render a preview
of your comment beneath the form.

[GitHub]: https://github.com
[gh-issues]: https://github.com/issues
[gh-pulls]: https://github.com/pulls
[gh-api-md]: https://developer.github.com/v3/markdown/
[gh-rate-limit]: https://developer.github.com/v3/#rate-limiting
[GitHub Flavored Markdown]: https://help.github.com/articles/github-flavored-markdown/
[Tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
[Tumblr]: http://www.tumblr.com
[Tumblr Dashboard]: http://www.tumblr.com/dashboard
[Chromium User Scripts]: http://www.chromium.org/developers/design-documents/user-scripts
[GreaseMonkey]: http://www.greasespot.net/
