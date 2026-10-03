/* global QUnit */
(function () {
  'use strict'
  QUnit.config.reorder = false
  window.__results = { failures: [], tests: [] }
  QUnit.log = function (details) {
    if (!details.result) window.__results.failures.push({ message: details.message, actual: String(details.actual), expected: String(details.expected) })
  }
  QUnit.testDone = function (details) { window.__results.tests.push(details) }
  QUnit.done = function (details) { window.__results.summary = details }
}())
