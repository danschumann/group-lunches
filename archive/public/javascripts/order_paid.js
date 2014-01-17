$(function(){
  $('.order_paid').change(function(){
    var order_id = $(this).attr('data-order_id');
    var lunch_id = $(this).attr('data-lunch_id');
    $.post('/lunches/' + lunch_id + '/orders/' +order_id, {paid: $(this).val()});
  })
})
