const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://shivansh_v_singh:Test-123@cluster1shiva.xnvzobh.mongodb.net/?retryWrites=true&w=majority');

const itemSchema = mongoose.Schema({
    name: String
})
const Items = mongoose.model("Item", itemSchema);

const item1 = new Items({
    name: "Sleep"
});
const item2 = new Items({
    name:"Pencil"
    });
const item3 = new Items({
name:"Eraser"
});    


const listSchema =mongoose.Schema({
    name:String,
    items:[itemSchema]
})
const List = mongoose.model("List",listSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    var dayname = "Today";
    Items.find()               // This is to console log the data whichever is required
        .then(function (foundItem) {
            if (foundItem.length === 0) { Items.insertMany([item1,item2,item3]); }
            res.render("list", { dayname: dayname, Newitem: foundItem, time: "" })
        })

        .catch(function (err) {
            console.log(err);
        })
});
 
app.get("/:id",async function(req,res){
    var id=req.params.id;
    try{
    const data = await 
    List.findOne({
        name:id
      });

      if (!data) {
        List.create({
            name:id,
            items:[item1,item2,item3]
        });
        res.redirect("/"+id)              ///JUGAD ?????????????????????????????????
      }
      
      res.render("list", { dayname: id, Newitem: data.items, time: "" });
    }catch (error) {
      console.log(error);
     }
    })
//     List.find().then(function(FoundItems){
//     if(FoundItems.length===0){
//         const list=new List({
           
//            })
//            list.save();
//     }
        
//       })
//        .catch(function(err){
//         console.log(err);
//       })
    
// })

app.post("/", async function (req, res) {

    var itemName = req.body.taskk;
    var listName = req.body.list;
    const item = new Items({
        name: itemName
    })
    if(listName==="Today"){
    item.save();
  //  console.log(req.body.list);
    res.redirect("/")
    }
else{
    try{
   const data= await List.findOne({name:listName})
    if(data){
          data.items.push(item);
          data.save();
    }
    res.redirect("/"+listName)
}catch(err){
    console.log(err);
}
}
});
///////////////////*USE OF ASYNC AND AWAIT*///////////////////
//  app.post("/delete", async function (req, res) {

//     var itemid = req.body.checkbox;
//     var listName = req.body.listt;
//     await Items.findOneAndRemove({
//         _id: itemid  
//     })
 
//     res.redirect("/")
// })


app.post("/delete", async function (req, res) {

    var itemid = req.body.checkbox;
    var listName = req.body.listt;
    if(listName==="Today"){
    await Items.findOneAndRemove({
        _id: itemid  
    })
    res.redirect("/")
}
else{
await List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:itemid}}}, {
        new: true
      });
      res.redirect("/"+listName)
}
    
})
app.listen(3000, function () {
    console.log("Server is running on port 3000");
})




/*
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = mongoose.Schema({
    name: String
})
const Items = mongoose.model("Item", itemSchema);

const listSchema =mongoose.Schema({
    name:String,
    items:[itemSchema]
})
const List = mongoose.model("List",listSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    var dayname = "Today";
    Items.find()               // This is to console log the data whichever is required
        .then(function (foundItem) {
            res.render("list", { dayname: dayname, Newitem: foundItem, time: "" })
        })

        .catch(function (err) {
            console.log(err);
        })
});
 
app.get("/:id",function(req,res){
   var id=req.params.id;
   if(List.length===0){
   const list=new List({
    name:id,
    items:[{name:"pen"},{name:"pencil"}]
   })
   list.save();
}
});


app.post("/", function (req, res) {

    var itemName = req.body.taskk;
    const item = new Items({
        name: itemName
    })
    item.save();
    res.redirect("/")
})
///////////////////*USE OF ASYNC AND AWAIT*///////////////////
/*app.post("/delete", async function (req, res) {

    var itemid = req.body.checkbox;
    await Items.findOneAndRemove({
        _id: itemid  
    })
  
    
    res.redirect("/")
})

app.listen(3000, function () {
    console.log("Server is running on port 3000");
})
*/