$ =>
  $(document).scroll =>
    if $(window).scrollTop() > $('.logo').offset().top + 55
      $('.navmiddle').show()
    else
      $('.navmiddle').hide()

  $(document).scroll =>
    if $(window).scrollTop() > $('.header').outerHeight()
      $('.navbar_container').height $('.navbar').height()
      $('.navbar').css
        position: 'fixed'
        top: 0
        left: 0
    else
      $('.navbar').css
        position: 'inherit'
