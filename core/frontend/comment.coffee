$ =>
  $('.comments_container').scrollTop 9999999
  $('.make_comment').keydown (e) =>
    if e.keyCode is 13 and not e.shiftKey
      e.preventDefault()
      $('.make_comment').parents('form').submit()
