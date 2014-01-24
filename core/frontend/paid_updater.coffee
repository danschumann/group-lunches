$ =>
  $('.paid_amount').change (e) =>
    $(e.target).val parseFloat $(e.target).val()

    $.post "/orders/#{$(e.target).attr('data-id')}", paid: $(e.target).val(), (res) =>

      $(e.target).val res
      $n = $('<div class="popup_notification">Saved</div>').appendTo('body')
      setTimeout =>
        $n.remove()
      , 1000
      window.location.reload()
