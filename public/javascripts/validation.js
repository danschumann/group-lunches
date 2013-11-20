$(document).ready(function(){
  
  // For some reason this is broken.
  // Where's the $.fn.validate() method?
  try{
    //validate restaurant creation
    $("#formRestaurant").validate();
    

    //validate order creation
    $("#formOrder").validate();
  } catch(er){}

});
