$ =>
  $('.check_all').change =>
    $('.restaurant_row input').prop 'checked', $('.check_all').prop('checked')
