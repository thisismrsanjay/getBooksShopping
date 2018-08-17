const express = require('express');
const router = express.Router();
const Page = require('../models/page');

//Get pages INdex
router.get('/',(req,res)=>{
    Page.find({}).sort({sorting:1}).exec((err,pages)=>{
        res.render('admin/pages',{
            pages:pages
        })
    })
})

//get add page
router.get('/add-page',(req,res)=>{
    let title = '';
    let slug  = '';
    let content = '';

    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    })
})

//POST add page
router.post('/add-page',(req,res)=>{

    //validation 
    req.checkBody('title','title must have a value.').notEmpty();
    req.checkBody('content','content must have a value.').notEmpty();
    
    
  
    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug=="") slug=title.replace(/\s+/g,'-').toLowerCase();
    let content = req.body.content;

    let errors = req.validationErrors();


    if(errors){
        
        res.render('admin/add_page',{
            errors:errors,
            title:title,
            slug:slug,
            content:content
        })
    }else{
        Page.findOne({slug:slug},(err,page)=>{
            if(page){
                req.flash('danger','Page slug exists choose another.');
                res.render('admin/add_page',{
                    title:title,
                    slug:slug,
                    content:content
                })
            }else{
                let page = new Page({
                    title,
                    slug,
                    content,
                    sorting:100
                })
                page.save((err)=>{
                    if(err) console.log(err);
                    req.flash('success','Page Added!');
                    res.redirect('/admin/pages');
                })
            }

        })
    }

})

//post
router.post('/reorder-pages',(req,res)=>{
    var ids = req.body['id[]'];
    var count = 0 ; 
    for(let i=0;i<ids.length;i++){
        var id= ids[i];
        count++;


        (function(count){
            Page.findById(id,(err,page)=>{
            page.sorting=count;
            page.save((err)=>{
                if(err) return console.log(err);
                })
            })
        })(count);
        
    }
})


//get edit page
router.get('/edit-page/:id',(req,res)=>{
    Page.findById(req.params.id,(err,page)=>{
        if(err) return console.log(err);
        
        res.render('admin/edit_page',{
            title:page.title,
            slug:page.slug,
            content:page.content,
            id:page._id 
        })
    })

})
//post edit page
router.post('/edit-page/:id',(req,res)=>{

    //validation 
    req.checkBody('title','title must have a value.').notEmpty();
    req.checkBody('content','content must have a value.').notEmpty();
    
    
  
    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug=="") slug=title.replace(/\s+/g,'-').toLowerCase();
    let content = req.body.content;
    let id = req.params.id;

    let errors = req.validationErrors();


    if(errors){
        
        res.render('admin/edit_page',{
            errors:errors,
            title:title,
            slug:slug,
            content:content,
            id
        })
    }else{
        Page.findOne({slug:slug,_id:{'$ne':id}},(err,page)=>{
            if(page){
                req.flash('danger','Page slug exists choose another.');
                res.render('admin/edit_page',{
                    title:title,
                    slug:slug,
                    content:content,
                    id:id
                })
            }else{
                Page.findById(id,(err,page)=>{
                    if(err) return console.log(err);
                    page.title= title;
                    page.slug = slug;
                    page.content = content;
                    page.save((err)=>{
                        if(err) console.log(err);
                        req.flash('success','Page Added!');
                        res.redirect('/admin/pages/edit-page/'+id);
                    })
                })
                
            }

        })
    }

})

router.get('/delete-page/:id',(req,res)=>{
    Page.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        req.flash('success','Page Deleted');
        res.redirect('/admin/pages/');

    })
})


module.exports = router;