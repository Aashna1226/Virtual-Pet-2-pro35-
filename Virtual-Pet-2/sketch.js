var canvas, dog;
var dogImg, happyDogImg, foodS, foodStock;
var database;
var feed, addFood;
var fedTime, lastFed;
var foodObj;

function preload()
{
  dogImg = loadImage("../images/dogImg.png");
  happyDogImg = loadImage("../images/dogImg1.png");
}

function setup() {
  database = firebase.database();

  createCanvas(650, 750);
  dog = createSprite(370, 490, 10, 5);
  dog.addImage(dogImg);
  dog.scale=0.6;

  foodObj = new Food();

  foodStock=database.ref('FOOD');
  foodStock.on("value", readStock);

  feed=createButton("Feed the Dog");
  feed.position(620,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(790,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  foodObj.display();
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDogImg);
  }

  drawSprites();

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
      text("Last Feed: "+lastFed%12 + "PM", 80, 60);
  }
  else if(lastFed==0){
      text("Last Feed: 12 AM", 350, 30);
  }
  else{
      text("Last Feed: "+lastFed + "AM", 80, 60);
  }
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  


}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}