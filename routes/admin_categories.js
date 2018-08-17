const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//Get pages INdex
router.get('/',(req,res)=>{
    Category.find((err,categories)=>{
        if(err)  return console.log(err);
        res.render('admin/categories',{
            categories
        })
    })
})

//get add category
router.get('/add-category',(req,res)=>{
    let title = '';

    //we sent title object in case of error handling
    res.render('admin/add_category',{
        title:title,
    })
})

//POST add category
router.post('/add-category',(req,res)=>{

    //validation 
    req.checkBody('title','title must have a value.').notEmpty();
  
    let title = req.body.title;
    let slug = title.replace(/\s+/g,'-').toLowerCase();

    let errors = req.validationErrors();


    if(errors){

        res.render('admin/add_category',{
            errors:errors,
            title:title
        })
    }else{
        Category.findOne({slug:slug},(err,category)=>{
            if(category){
                req.flash('danger','Category Title exists choose another.');
                res.render('admin/add_category',{
                    title:title
                })
            }else{
                let category = new Category({
                    title,
                    slug,
                })
                category.save((err)=>{
                    if(err) console.log(err);
                    req.flash('success','Category Added!');
                    res.redirect('/admin/categories');
                })
            }

        })
    }

})




//get edit category
router.get('/edit-category/:id',(req,res)=>{
    Category.findById(req.params.id,(err,category)=>{
        if(err) return console.log(err);
        
        res.render('admin/edit_category',{
            title:category.title,
            id:category._id 
        })
    })

})
//post edit category
router.post('/edit-category/:id',(req,res)=>{

    //validation 
    req.checkBody('title','title must have a value.').notEmpty();
  
    let title = req.body.title;
    let slug = title.replace(/\s+/g,'-').toLowerCase();
    let id = req.params.id;

    let errors = req.validationErrors();


    if(errors){
        
        res.render('admin/edit_category',{
            errors:errors,
            title:title,
            id
        })
    }else{
        Category.findOne({slug:slug,_id:{'$ne':id}},(err,category)=>{
            if(category){
                req.flash('danger','Category title exists choose another.');
                res.render('admin/edit_category',{
                    title:title,
                    id:id
                })
            }else{
                Category.findById(id,(err,category)=>{
                    if(err) return console.log(err);
                    category.title= title;
                    category.slug = slug;
                    
                    category.save((err)=>{
                        if(err) console.log(err);
                        req.flash('success','Category Added!');
                        res.redirect('/admin/categories/edit-category/'+id);
                    })
                })
                
            }

        })
    }

})

router.get('/delete-category/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        req.flash('success','Category Deleted');
        res.redirect('/admin/categories/');

    })
})


module.exports = router;