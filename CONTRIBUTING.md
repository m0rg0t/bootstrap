# Contributing to Bootstrap

Looking to contribute something to Bootstrap? **Here's how you can help.**



## Reporting issues

We only accept issues that are bug reports or feature requests. Bugs must be isolated and reproducible problems that we can fix within the Bootstrap core. Please read the following guidelines before opening any issue.

1. **Search for existing issues.** We get a lot of duplicate issues, and you'd help us out a lot by first checking if someone else has reported the same issue. Moreover, the issue may have already been resolved with a fix available.
2. **Create an isolated and reproducible test case.** Be sure the problem exists in Bootstrap's code with a [reduced test case](http://css-tricks.com/reduced-test-cases/) that should be included in each bug report.
3. **Include a live example.** Make use of jsFiddle or jsBin to share your isolated test cases.
4. **Share as much information as possible.** Include operating system and version, browser and version, version of Bootstrap, customized or vanilla build, etc. where appropriate. Also include steps to reproduce the bug.



## Pull requests

- CSS changes must be done in `.less` files first, never just the compiled `.css` files
- If modifying the `.less` files, always recompile and commit the compiled files `bootstrap.css` and `bootstrap.min.css`
- Try not to pollute your pull request with unintended changes--keep them simple and small
- Try to share which browsers your code has been tested in before submitting a pull request
- Pull requests should always be against the `master` branch, never against `gh-pages`.



## Coding standards

### HTML

- Two spaces for indentation, never tabs
- Double quotes only, never single quotes
- Always use proper indentation
- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags)

### CSS

- Adhere to the [Recess CSS property order](http://markdotto.com/2011/11/29/css-property-order/)
- Multiple-line approach (one property and value per line)
- Always a space after a property's colon (.e.g, `display: block;` and not `display:block;`)
- End all lines with a semi-colon
- For multiple, comma-separated selectors, place each selector on its own line
- Attribute selectors, like `input[type="text"]` should always wrap the attribute's value in double quotes, for consistency and safety (see this [blog post on unquoted attribute values](http://mathiasbynens.be/notes/unquoted-attribute-values) that can lead to XSS attacks).

### JS

- No semicolons
- Comma first
- 2 spaces (no tabs)
- strict mode
- "Attractive"



## License

By contributing your code, you agree to license your contribution under the terms of the APLv2: https://github.com/twbs/bootstrap/blob/master/LICENSE

## Reproducible maintenance of this Bootstrap 3 fork

Use Node 24 and `npm ci --ignore-scripts`. `npm run check` builds the distribution,
checks the existing JS style, verifies compiled CSS against the original 3.0.0
baseline, and runs the original QUnit assertions against source, concatenated,
and minified JS in Chromium. Install the browser with
`npx --no-install playwright install chromium`, or set `CHROMIUM_PATH` to an
installed Chromium executable. JSON assertion results and screenshots are saved
in `test-results/`; CI uploads them even on failure.

Less 4 replaces Recess using `math: always`, with JavaScript evaluation disabled.
Clean CSS runs at level 0 with IE8 compatibility. The CSS regression fingerprint
preserves rule order and repeated-property order; it normalizes declaration
ordering, equivalent color/zero spelling, whitespace, and eight-decimal numeric
serialization. Generated CSS formatting and JS minification therefore change,
but the Bootstrap 3 API and original QUnit cases remain intact. A new regression
also guards a delayed transition fallback against changes to feature detection;
the implementation now captures its event name when scheduling the fallback. Build banners
use the original 2013 copyright year for deterministic output. `npm run
check:dist` detects uncommitted generated distribution changes.

PhantomJS, automatic BrowserStack calls, and the Grunt Jekyll/remote HTML
validation integrations are no longer installed or invoked by `npm test`.
The historical docs and fixtures remain available; publishing the Jekyll docs,
paid browser services, and legacy IE testing are outside this offline CI job.
This is not an upgrade to Bootstrap 5 or a claim that Bootstrap 3 is supported.

On 2026-10-03 npm audit reported 13 high development-only dependency findings
through Grunt/JSHint/watch (braces, lodash, minimatch and dependent packages).
The current releases still expose those paths; recommended audit downgrades
are not treated as fixes. Do not feed untrusted templates or glob patterns to
this legacy build. The original vendored jQuery/QUnit and Bootstrap runtime
are deliberately retained as the regression baseline, not certified secure.
