require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.SECRET, {useNewUrlParser: true});

const itemsSchema = {
	name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
	name: "Click + to add a new item"
});

const defaultItems = [item1]; 

const listSchema= {
	name: String,
	items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

let day = date.getDate();

app.set('view engine', 'ejs');

app.get("/", function(req, res){
	
	Item.find({}, function(err, foundItems){

		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function(err){
				if(err) {
					console.log(err);
				} else {
					console.log("Sucess");
			}
	});
			res.redirect("/");
		} else {
			res.render("list", {listtitle: day, NewListItem: foundItems});
		}
		
	});
		
});

app.get("/:customListName", function(req, res){
	const customListName = _.capitalize(req.params.customListName);

	List.findOne({name: customListName}, function(err, foundList){
		if (!err){
			if(!foundList){
				//Create a new list 
				const list = new List({
					name: customListName,
					items: defaultItems
				});

				list.save();
				res.redirect("/" + customListName);
			} else {
				//Show an existing list 

				res.render("list", {listtitle: foundList.name, NewListItem: foundList.items});
				
			}
		}
	});

	
});

app.post("/", function(req, res){


	const itemName = req.body.NewInput;
	const listName = req.body.list;

	const item = new Item({
		name: itemName
	});

	if (listName === day){
		item.save();
		res.redirect("/");
	} else {
		List.findOne({name: listName}, function(err, foundList){
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
	}

});

app.post("/delete", function(req,res){
	const checkedItemID = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === day) {
		Item.findByIdAndRemove(checkedItemID, function(err){
		if(!err){
			console.log("Sucessfully deleted");
			res.redirect("/");
		}
	});
	} else {
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
			if (!err){
				res.redirect("/" + listName);
			}
		});
	}

	
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
	console.log("Sever started");
});


 