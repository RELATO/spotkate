var models = require('../models/models.js');

//GET/spot/:spotsId/comment/new
exports.new = function(req, res){
	res.render('commentSpot/new', {spotid:req.params.spotsId, errors:[]});
};

//POST/spot/:spotsId/comment
exports.create = function(req, res, next){
	var hora = new Date();
	var momento = hora.getDate() + "/" + (hora.getMonth() +1) + "/" + hora.getFullYear()+" a las "+hora.getHours()+":"+hora.getMinutes('mm');
	var comment = models.CommentSpot.build({
		comentario : req.body.commentSpot.texto,		
		spotId : req.params.spotsId,
		creado_por : req.body.commentSpot.creado_por,
		creado_el : momento,
		UserId : req.session.user.id
		});
	comment.validate().then(function(err){
		if(err){
			res.render('commentSpot/new', {comment:comment, errors:err.errors});
		}else{
			comment.save().then(function(){res.redirect('/spot/'+req.params.spotsId)})
		}
	}).catch(function(error){next(error)});
};
