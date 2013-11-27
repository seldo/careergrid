(function() {
  $(window).on('load',function() {
    // the selected label is visible, but clicking on it selects the next one
    $(".selector").on('click',function(e) {
      e.preventDefault()
      e.stopPropagation()
      var current = $(this).find("input:checked")
      var nextVal = ($(current).val() + 1) % 3
      $("#"+$(current).attr('name')+"-"+nextVal).prop('checked',true)
    })
  })

  var eventually = function() {
    // Draw a circle
    $("canvas").drawArc({
      fillStyle: "#00A8C6",
      x: 100, y: 100,
      radius: 50
    });
  }
}());