$ =>
  lr_id = $('[data-already_voted]').attr('data-already_voted')
  console.log lr_id

  $('[data-already_voted]').parents('.errors:first').insertBefore($("[name=lunch_restaurant_id][value=#{lr_id}]"))
    .html 'You already voted for that'
