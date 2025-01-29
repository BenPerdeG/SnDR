var mousedown = false;
  var mouseStartXposition;
  var zoomContainer = $("#container");
  var $box;
  var snapToGridContainer = $("#snapToGrid");
  var snapToGridValue = 20; // made 20 grid (first option) as default
 
  //handle changing of grid class and snap value
  function initGrid() {
    $('#parentContainer').removeClass();
    $('#parentContainer').addClass('grid g-'+$('#snapToGrid').val());

    snapToGridCount = parseInt(snapToGridContainer.val()); // how many grids

    //calc. the percentage of space a single grid would occupy
    snapToGridPct = 100/snapToGridCount; //%
    //convert that into absolute pixels considering our container div size
    //ie. how much space in pixel a grid would occuppy
    snapToGridValue = (snapToGridPct/100) * 2000; // * tamaño del lienzo

    //for decimal results
    snapToGridValue = parseInt((snapToGridValue))
  }

$(document).ready(function() {

  $('#snapToGrid').change(initGrid)

  $(".box").mousedown(function(event) {
    mousedown = true;
    $box = $(this);

    //UI feedback
    $box.css('cursor', 'pointer')
    $box.mouseup(function () {
      $(this).css('cursor', 'inherit');
    })
  });

  $("#parentContainer, .box").mouseup(function() {
    mousedown = false;
  });

  $("#parentContainer").mousemove(function(event) {
    if (mousedown) {
      var clientX = event.clientX;
      var clientY = event.clientY;

      // Include Scroll Left and Top
      clientX = clientX + $("#container").scrollLeft();
      clientY = clientY + $("#container").scrollTop();

      clientX = clientX - zoomContainer.offset().left;
      clientY = clientY - zoomContainer.offset().top;
 
      var snapedX = clientX - (clientX % snapToGridValue);
      var  snapedY = clientY - (clientY % snapToGridValue);

      $box.css({
        top: snapedY,
        left: snapedX
      })
    }
  });

  initGrid();//start on page load
});