

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

var isSignup=false;
app.get('/', function (req, res) {
  isSignup=true;
res.sendFile(__dirname+"/login.html");
    // var dayname = "Today";
    // Items.find()               // This is to console log the data whichever is required
    //     .then(function (foundItem) {
    //         if (foundItem.length === 0) { Items.insertMany([item1,item2,item3]); }
    //         res.render("list", { dayname: dayname, Newitem: foundItem, time: "" })
    //     })

    //     .catch(function (err) {
    //         console.log(err);
    //     })
});
 
app.post("/login",async function(req,res){
  var usrnm=req.body.username;
  var pswd=req.body.password;
  var lnk=usrnm.slice(1,2)+"v"+pswd.slice(0,1)+pswd.slice(2,3)+"79"+usrnm.slice(usrnm.length/2,usrnm.length/2+1)+pswd.slice(pswd.length-1,pswd.length)+pswd.slice(pswd.length-2,pswd.length-1);

  try{
    const data= await List.findOne({name:lnk})
     if(data){
      res.redirect("/"+lnk);  
     }
     else{
      res.redirect(__dirname+"signup.html");
     }
 }catch(err){
     console.log(err);
 }

})
app.post("/register",(req,res)=>{
  var usrnm=req.body.username;
  var pswd=req.body.password;
  var lnk=usrnm.slice(1,2)+"v"+pswd.slice(0,1)+pswd.slice(2,3)+"79"+usrnm.slice(usrnm.length/2,usrnm.length/2+1)+pswd.slice(pswd.length-1,pswd.length)+pswd.slice(pswd.length-2,pswd.length-1);
 res.redirect("/"+lnk); 
})
app.get("/:id",async function(req,res){
  if(isSignup==true){
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
     }}
     else{
      res.redirect("/");
     }
    })

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
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
})