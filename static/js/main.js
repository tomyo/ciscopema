$(document).ready(function() {
  // $(".video-link").jqueryVideoLightning({
  //     id: "x8ErOxGPiGY",
  //     autoplay: true,
  //     color: "white"
  // });
  $('.modalDialog').click(function(event){
    if (event.target.className == 'modalDialog') {
      event.target.firstElementChild.firstElementChild.click();
    }
  });
  $('#tourDates').click(function(event){
    $('#tourDatesSection').toggle();
  });
});
