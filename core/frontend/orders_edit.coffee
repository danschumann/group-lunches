$ =>
  $('.previous_food').each (n, el) ->
    $(el).click =>
      $('[name=food]').val $(el).find('input.name').val()
      $('[name=price]').val $(el).find('input.price').val()
