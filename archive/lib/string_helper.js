if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
};

String.prototype.html_safe = function(){
  return _.escape(this).replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
}
