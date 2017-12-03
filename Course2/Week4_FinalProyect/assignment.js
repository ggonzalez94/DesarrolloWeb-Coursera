function showTemplate(template,data){
  var html = template(data);
  $("#content").html(html);

}
$(document).ready(function(){
  //Compile all templates
  var source = $("#animals-template").html();
  var animals_template = Handlebars.compile(source);
  source = $("#specie-template").html();
  var specie_template = Handlebars.compile(source);
  source = $("#individual-animal-template").html();
  var individual_animal_template = Handlebars.compile(source);

  var current_specie = animals_data.category[0]; //Initialize current_specie for specie-template
  var current_animal = current_specie.animals[0]; //Initialize current_animal for animal-template
  showTemplate(animals_template,animals_data);  //Show animals-template

  //I need to use event handlers on document instead of clases itself because otherwise i would
  //have needed to refresh the event handlers when i change the template
  //Update the template to specie-template when clicking on some thumbnail
  $(document).on('click','.specie-thumbnail',function(){
    var index = $(this).data("id");
    current_specie = animals_data.category[index];
    //current_animal = current_specie[0];
    showTemplate(specie_template,current_specie);
    $(".active").removeClass("active"); //Remove active from other components
    $("#"+current_specie.name).addClass("active");  //Add active to the Specie
  });

  //Dislay a modal view when clicking on individual animal
  $(document).on('click','.individual-animal',function(){
    var index = $(this).data("id");
    console.log(index);
    current_animal = current_specie.animals[index];
    showTemplate(individual_animal_template,current_animal);
    $("#myModal").modal('show');
    $('#myModal').on('hidden.bs.modal', function (){
      showTemplate(specie_template,current_specie);
    });
  });

  //Return to animals-template when clicking on Home or MyAnimals in navbar
  $(document).on('click','.inicio',function(){
    showTemplate(animals_template,animals_data);
    $(".active").removeClass("active"); //Remove active from other components
    $("#home").addClass("active");  //Add active class to home
  });
  //Update the template to the corresponding specie when clicking on the dropdown menu
  $(".menu_specie").click(function(){
    var id = $(this).attr("id");  //get the id of the specie i just clicked on
    var index = animals_data.category.findIndex(function(specie){ //get the index using array method findIndex
      return specie.name == id;
    });
    current_specie = animals_data.category[index];
    current_animal = current_specie[0];
    showTemplate(specie_template,current_specie);   //update the template
    $(".active").removeClass("active"); //Remove active from other components
    $("#"+current_specie.name).addClass("active");  //Add active to the Specie
  });

  $('#submit').click(function (e) {


      // get the search text which is the
      // contents of the search box
      var search_text = $('#searchbox').val().toLowerCase();

      // print the search box
      // (this is an example of using
      // console.log for debugging)
      console.log(search_text)

      // create a new array of data with only
      // the data that contains the search string
      var filteredData = {
        animals : []
      };
      for (var i = 0; i < animals_data.category.length; i++) {
        var animales = animals_data.category[i].animals.filter(function(d){

          // return true if the name contains
          // the search text
          if (d.name.toLowerCase().search(search_text) > -1){
            return true;
          }

          // if we reach here it means we haven't
          // found a match so return false
          return false;
        })
          filteredData.animals = filteredData.animals.concat(animales);
      }
      current_specie = filteredData;
      showTemplate(specie_template,filteredData);
  });


});
