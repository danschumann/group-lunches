var
  bookshelf = require('../models/base'),
  LunchController = require('./lunches');
  Comment = require('../models/comment').Comment;

module.exports = {

  create: function(req, res, next){

    req.params.lunch_id = parseInt(req.params.lunch_id);

    var attributes = {
      user_id: req.session.user_id,
      lunch_id: req.params.lunch_id,
      content: _.escape(req.body.content),
    };

    var comment = Comment.forge(attributes);
    if (comment.validate().hasError()) {
      req.error(comment.errors);
      return LunchController.show(req, res, next);
    }

    comment.save()
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id);
    });

  },
  
};
