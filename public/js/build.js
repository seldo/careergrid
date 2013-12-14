(function() {
  $(window).on('load',function() {

    // clicking on a label selects the next label
    $(".selector").on('mousedown',toggleControl)

    // initialize the slider
    $("#slider").slider({
      min: 150,
      max: 660,
      slide: updateGrid, // update the grid size in real time
      value: 350
    });

    // show the grid as an image
    $("#save-btn").on('click',savePNG)

    // save the image from the link
    $("#save-link").on('mouseover',setDataLink)

    // kick off the grid, initially blank
    updateGrid()

  })

  // flip the control
  var toggleControl = function(e) {
    e.preventDefault()
    e.stopPropagation()
    var current = $(this).find("input:checked")
    var nextVal = ($(current).val() + 1) % 3
    $("#"+$(current).attr('name')+"-"+nextVal).prop('checked',true)

    // we update the drawn grid whenever you make a selection
    updateGrid()
  }

  // turn the form data into a convenient JSON object
  var extractData = function(formSelector) {
    var start = $("#start").val()
    var end = $("#end").val()
    var skills = []
    $(formSelector).find("tbody tr").each(function(index,tr) {
      var skill = $(tr).find('*[data-skill-name]').attr('data-skill-name')
      var intensities = $.map($(tr).find('td input:checked'), function(el,index) {
        return $(el).val()
      })
      skills.push({
        name: skill,
        intensities: intensities
      })
    })
    return {
      start: start,
      end: end,
      skills: skills
    }
  }

  // turn our JSON object into a beautiful butterfly
  var drawGrid = function(data) {
    var dotSize = 20
    var dotPadding = 6 // distance between dots. Halved at the edges.
    var marginLeft = 15
    var marginTop = 15
    var paddingLeft = 10
    var paddingTop = 35
    var paddingRight = 20
    var textWidthLeft = 100
    var canvas = $("<canvas></canvas>")

    // size according to selections and scaling factor
    var totalRows = data.skills.length
    var baseWidth = marginLeft + textWidthLeft + paddingLeft + (data.end-data.start)*(dotSize+dotPadding) + paddingRight
    var baseHeight = marginTop + paddingTop + totalRows*(dotSize+dotPadding)
    var realWidth = $("#slider").slider("value")
    var scaleRatio = baseWidth/realWidth
    var realHeight = baseHeight/scaleRatio

    canvas.attr('id','grid')
    canvas.attr('width',realWidth).attr('height',realHeight)
    canvas.scaleCanvas({
      x: 0, y: 0,
      scale: 1/scaleRatio
    })

    // column headings
    var cols = 0;
    for(var y = data.start; y <= data.end; y++) {
      canvas.drawText({
        fillStyle: "#000",
        strokeStyle: "#000",
        strokeWidth: 1,
        x: marginLeft + textWidthLeft + (dotSize+dotPadding)*cols,
        y: marginTop,
        fontSize: "10pt",
        fontFamily: "Arial",
        text: y,
        fromCenter: false, // Measure (x, y) from the text's top-left corner
        rotate: -50 // Rotate the text
      })
      cols++
    }

    // skill rows
    for(var row = 0; row < totalRows; row++) {
      var skill = data.skills[row]
      var totalCols = data.end - data.start + 1;
      // skill label
      canvas.drawText({
        fillStyle: "#000",
        strokeStyle: "#000",
        strokeWidth: 1,
        x: marginLeft + textWidthLeft - paddingLeft,
        y: marginTop + paddingTop + (dotSize+dotPadding)*row,
        fontSize: "10pt",
        fontFamily: "Arial",
        text: skill.name,
        align: "right",
        respectAlign: true,
        maxWidth: textWidthLeft
      })
      // intensities
      for(var col = 0; col < skill.intensities.length; col++) {
        var intensity = skill.intensities[col]
        var intensityDot = {
          x: marginLeft + textWidthLeft + paddingLeft + (dotSize+dotPadding)*col,
          y: marginTop + paddingTop + (dotSize+dotPadding)*row,
          radius: (dotSize/2)
        }
        if (intensity == 1) intensityDot.strokeStyle = "#000"
        else if (intensity == 2) intensityDot.fillStyle = "#000"
        canvas.drawArc(intensityDot);
      }
    }

    return canvas
  }

  // turn the canvas into a PNG
  var getDataUrl = function() {
    return $("#grid").getCanvasImage("png")
  }
  /*
  var showPNG = function() {
    document.location = getDataUrl()
  }
  */
  var setDataLink = function() {
    $(this).attr('href',getDataUrl())
  }

  // login, create account or just show image
  var savePNG = function() {
    window.open('/save','SaveWindow', 500, 500);
  }

  // get the data, create a new canvas, and swap it in
  var updateGrid = function() {
    var gridData = extractData("#skilldata")
    var canvas = drawGrid(gridData)
    $("#drawn-grid").html(canvas)
  }

}());