$ =>
  $('.notify_me input').each (n, el) =>
    $(el).change =>
      $('.popup_notification').remove()
      $.post '/restaurants/' + $(el).attr('data-id') + '/notify', {notify: $(el).prop('checked')}, (res) =>
          console.log res
          $n = $('<div class="popup_notification">Saved preference</div>').appendTo('body')
          setTimeout =>
            $n.remove()
          , 1000

