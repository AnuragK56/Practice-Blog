var express= require("Express");
    bodyparser=require("body-parser");
    mongoose =require("mongoose");
    app=express();
    methodOverride=require("method-override");
    expressanitizer=require("express-sanitizer");
const port = 3000;


 //APP CONFIG
mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressanitizer());
app.use(methodOverride("_method"));


//Mongoose config
var blogSchema=new mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date,default:Date.now}
    }
);
var Blog=mongoose.model("Blog",blogSchema);

//Restful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error!!!!!");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
    
});
app.get("/blogs/new",function(req,res){
res.render("new");
});

//Create Blog

app.post("/blogs",function (req,res) {
    req.body.blog.body=req.sanitize( req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })       
})

//Blog Show
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show",{blog:foundBlog});
       }
   })
});

//Edit Route

app.get("/blogs/:id/edit",function (req,res) { 
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
 });


 //Update Route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

//Delete Route
app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       }else
       res.redirect("/blogs");
   })
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


