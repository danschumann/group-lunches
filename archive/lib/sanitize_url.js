var starts_with_http = /^http(s)?:\/\//i;

module.exports = function(url){
  
  if(!url) return;
  url = url.trim();
  if ( !url ) return;
  
  console.log( !url.match(starts_with_http) );
  if( !url.match(starts_with_http) ){
    url = 'http://' + url;
  }
  
  return url;
}
