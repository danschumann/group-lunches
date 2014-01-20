$ =>
  $('.notify_me input').each (n, el) =>
    $(el).change =>
      $.post '/restaurants/' + $(el).attr('data-id') + '/notify',
        notify: $(el).prop('checked')
        (res) =>
          console.log res

