(function() {
  $(document).on('ready',function() {

    // clicking on a label selects the next label
    // if mouse is already down, mousing over a control toggles it
    // (unless it's already been toggled once for the current drag)
    var mousedown = false
    var toggled = []
    $(".selector").on('mousedown',function(e) {
      mousedown = true
      toggled.push(this)
      toggleControl(e,this)
    })
    $(document).on('mouseup',function(e) {
      mousedown = false
      toggled = []
    })
    $(".selector").on('mouseover',function(e) {
      if(mousedown && !containsObject(this,toggled)) {
        toggled.push(this)
        toggleControl(e,this)
      }
    })

    // initialize the slider
    $("#slider").slider({
      min: 150,
      max: 660,
      slide: updateGrid, // update the grid size in real time
      value: 350
    });

    // initialize the sorter
    $("#sortable").sortable({
      stop: updateGrid
    });

    // save and redirect to permalink
    $("#save-btn").on('click',function(e) {
      // they might need to fuck off to create an account or something
      // so we shove everything into localstorage for safe keeping
      localStorage.setItem('png-data',getDataUrl())
      localStorage.setItem('json-data',JSON.stringify(extractData()))
      window.location.href = "/grid/save"
    })

    // save the image from the link
    $("#save-link").on('mouseover',setDataLink)

    // kick off the grid, initially blank
    updateGrid()

  })

  // flip the control
  var toggleControl = function(e,that) {
    e.preventDefault()
    e.stopPropagation()
    var current = $(that).find("input:checked")
    var nextVal = ($(current).val() + 1) % 3
    var nextId = "#"+$(current).attr('name')+"-"+nextVal
    $(nextId).prop('checked',true)

    // we update the drawn grid whenever you make a selection
    updateGrid()
  }

  // turn the form data into a convenient JSON object
  var extractData = function() {
    var formId = "#skilldata"
    var start = $("#start").val()
    var end = $("#end").val()
    var shortId = $("#short_id").val()
    var skills = []
    $(formId).find("tbody tr").each(function(index,tr) {
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
      shortId: shortId,
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

  // change the destination of the link into the dataURL
  var setDataLink = function() {
    $(this).attr('href',getDataUrl())
  }

  // get the data, create a new canvas, and swap it in
  var updateGrid = function() {
    var gridData = extractData()
    var canvas = drawGrid(gridData)
    $("#drawn-grid").html(canvas)
  }

  // javascript, y u no have this?
  var containsObject = function(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

}());