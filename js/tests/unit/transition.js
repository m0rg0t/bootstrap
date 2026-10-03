$(function () {

    module("transition")

      test("should be defined on jquery support object", function () {
        ok($.support.transition !== undefined, 'transition object is defined')
      })

      test("should provide an end object", function () {
        ok($.support.transition ? $.support.transition.end : true, 'end string is defined')
      })

      asyncTest("should retain the transition event while its fallback is pending", function () {
        var previous = $.support.transition
        var $el = $('<div />')
        $.support.transition = { end: 'syntheticTransitionEnd' }
        $el.one('syntheticTransitionEnd', function () {
          $.support.transition = previous
          ok(true, 'scheduled fallback retains its original event name')
          start()
        })
        $el.emulateTransitionEnd(0)
        $.support.transition = false
      })

})
