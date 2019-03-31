var router = require('express').Router();
var Product = require('../models/product');
var Category = require('../models/category');
var User = require('../models/user');

router.get('/',function(req,res){
  res.render('main/home');
});
router.get('/products/:id',function(req,res,next){
  Product
    .find({category: req.params.id})
    .populate('category')
    .exec(function(err,products){
      if(err) return next(err);
      res.render('main/category',{products : products});
    });
});

router.get('/categories',function(req,res,next){
  Category
    .find()
    .populate()
    .exec(function(err, categories){
      if(err) return next(err);
      categories = categories.map(item => {
        return {
          "url": "https://amazon-clone-hp.herokuapp.com/category/" + item.id,
          "type": "json_plugin_url",
          "title": item.name
        }
      });
      res.send({
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": "Hello! How's it going?",
                "buttons": categories
              }
            }
          }
        ]
      });
    });
});

router.get('/category/:id',function(req,res,next){
  Product
    .find({category: req.params.id})
    .populate('category')
    .exec(function(err,products){
      if(err) return next(err);
      products = products.map(item => {
        return {
          "title": item.name,
          "image_url":"http://rockets.chatfuel.com/assets/shirt.jpg",
          "subtitle":"in stock",
          "buttons":[
            {
              "type":"web_url",
              "url":"https://amazon-clone-hp.herokuapp.com/product/" + item.id,
              "title": "Buy Now"
            }
          ]
        }
      });
      res.send({
        "messages": [
           {
             "attachment":{
               "type":"template",
               "payload":{
                 "template_type":"list",
                 "top_element_style":"large",
                 "elements": products.slice(0,3)
               }
             }
           }
         ]
      });
    });
});

router.get('/product/:id',function(req,res,next){
  Product
    .findOne({_id: req.params.id})
    .populate('category')
    .exec(function(err,product){
      if(err) return next(err);
      res.render('main/product', { product: product});
    });
});

router.get('/checkout',function(req,res,next){
  res.render('main/checkout', { });
});

module.exports = router;
