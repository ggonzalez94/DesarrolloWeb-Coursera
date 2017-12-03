$(document).ready(function(){
  $(".image-thumbnail").click(function(e){
    var imagen = $(this).attr("id");
    $(".big_image").attr("src",imagen+".jpg");
  });
});
