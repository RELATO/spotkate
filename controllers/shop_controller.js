var models = require('../models/models.js');
var cloudinary = require('cloudinary');

//Autoload en caso de :shopId lo precarga y gestiona posibles errores
exports.load = function(req, res, next, shopId){
	models.Shops.find({
		where: {id: Number(shopId)},
		include: [{model:models.PhotosShop},{model:models.CommentShop}]
	}).then(function(shop){
		if(shop){
			req.shop = shop;
			next();
		}else{
			next(new Error('Esta tienda todavia no esta creada ¡ANIMATE y CREALA!!!'));
		}
	}).catch(function(error){next(error);});
};
//MW que permite al admin crear shop
exports.adminRequired = function(req, res, next){	
	var isAdmin = req.session.user.isAdmin;	
	if(isAdmin){
		next();
	}else{
		res.redirect('/');
	}
};
//MW que permite acciones solo a admin o al creador del shop
exports.ownershipRequired = function(req, res, next){
	var objShopOwner = req.shop.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;
	
	if(isAdmin || objShopOwner===logUser){
		next();
	}else{
		res.redirect('/');
	}
};
//GET/shops lista los spots
exports.shops = function(req, res){
	models.Shops.findAll().then(function(shops){
	res.render('shops/index', {shops:shops, errors:[]});	
	});
};
//GET/shop/:shopId lista los datos de una shop
exports.show = function(req, res){
	res.render('shops/show', {shop:req.shop, errors:[]});	
};
//GET/shop/new
exports.new = function(req, res){
	var shop = models.Shops.build({//crea un objeto
		nombre:'nombre',
		ciudad:'ciudad',
		lat:'lat',
		lng:'lng',
		descripcion:'descripcion',
		creado_por:'creado_por',
		UserId:'UserId',
		creado_el:'creado_el',
		imagen: 'imagen'
	});
	res.render('shops/new', {shop:shop, errors:[]});
};
//POST/shop/create
exports.create = function(req, res){
	var hora = new Date();
	req.body.shop.creado_el = hora.getDate() + "/" + (hora.getMonth() +1) + "/" + hora.getFullYear()+" a las "+hora.getHours()+":"+hora.getMinutes('mm');
	if(req.files.photo.name){		
		var publicId = req.session.id + hora.getHours()+hora.getMinutes()+hora.getSeconds(); 
		cloudinary.uploader.upload(req.files.photo.path,
  		function(result) {},{public_id:publicId});
		req.body.shop.image = publicId;
	};	
	var shop = models.Shops.build(req.body.shop);
	//guarda en DB los campos de la shop
	shop.validate().then(function(err){
		if(err){
			res.render('shops/new', {shop:shop,errors:err.errors});
		}else{
		shop.save({fields:["nombre", "ciudad", "descripcion", "creado_por", "UserId", "creado_el", "image", "lat", "lng"]})
	.then(function(){
		res.redirect('/shops');})}
	});
};
//GET/shop/:shopsId/edit
exports.edit = function(req, res){
	var shop = req.shop; //autoload de instancia de shop
	res.render('shops/edit', {shop:shop, errors:[]});
};
//PUT/shop/:shopsId
exports.update = function(req, res){
	req.shop.nombre = req.body.shop.nombre;
    req.shop.ciudad = req.body.shop.ciudad;
	req.shop.descripcion = req.body.shop.descripcion;
	req.shop.lat = req.body.shop.lat;
	req.shop.lng = req.body.shop.lng;
	req.shop.image = req.body.shop.image;
		
	req.shop.validate().then(function(err){
		if(err){
			res.render('shops/edit', {shop:req.shop, errors:err.errors});
		}else{
			req.shop.save({fields:["nombre", "ciudad", "descripcion", "lat", "lng", "image"]})
			.then(function(){res.redirect('/shops');});
		}
	});
};
//DELETE/shop/:shopsId
exports.destroy = function (req, res, next){
	req.shop.destroy().then(function(){
		res.redirect('/shops');
	}).catch(function(error){next(error)});
};