_ = require('underscore');

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
};

starts_with_http = /^http(s)?:\/\//i;
String.prototype.sanitize_url = function(){

  if (!this) return;

  str = this.trim();
  if(!str.match(starts_with_http)){
    str = 'http://' + str;
  }
  return str;
}

String.prototype.html_safe = function(){
  return _.escape(this).replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
}
