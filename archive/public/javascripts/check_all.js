$(function(){
  $('.check_all').change(function(){
    console.log('rh/');
    $('.pick_restaurant').prop('checked', $(this).is(':checked'))
  });
});
