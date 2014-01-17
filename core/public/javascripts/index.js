console.log('runs');
$(function(){
  setTimeout(function(){
    $('.markdown_content').flowtype({
     fontRatio : 30,
     lineRatio : 1.45
    });
  }, 400);
});

// HACK: dev to generate timestamp
// TODO: create cli
window.dateString = (new Date).toISOString().replace(/:/g, '-').replace('.', '-')
