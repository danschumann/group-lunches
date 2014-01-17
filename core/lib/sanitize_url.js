var starts_with_http = /^http(s)?:\/\//i;

module.exports = function(url){
  
  if(!url) return;
  url = url.trim();
  if ( !url ) return;
  
  if( !url.match(starts_with_http) ){
    url = 'http://' + url;
  }
  
  return url;
}
