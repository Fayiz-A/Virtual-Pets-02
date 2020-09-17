//variables
var dog;//sprite
var dog_img, happyDog_img, bedroom_img, washroom_img, garden_img;//images 
var petName;//dog's name

//variables for database reference
var database, foodStock;
var feedTime, lastFed, currentTime, lastFedTime;

//object variables
var food;

//html elements
var feedButton, addFoodButton;
var dogName;

//gameState
var gameState;

function preload() {
  //loads the images
  dog_img = loadImage('images/dogImg.png');
  happyDog_img = loadImage('images/dogImg1.png');

  garden_img = loadImage('images/garden.png');
  bedroom_img = loadImage('images/bedroom.png');
  washroom_img = loadImage('images/washroom.png');
}

function setup() {
  createCanvas(800, 700);//creates the canvas

  //creation of object and preloading its assets
  food = new Food();
  food.preload();

  database = firebase.database();//initialising the database
  database.ref('food').on('value', food.readStock);//reading value from its node

  //creating and adding image to the dog sprite
  dog = createSprite(380, 400, 40, 80);
  dog.addImage('dog image', dog_img);
  dog.scale = 0.3;


  //creating and positioning buttons
  feedButton = createButton('Feed the dog');
  feedButton.position(700, 100);
  feedButton.mousePressed(food.feedDog);

  addFoodButton = createButton('Add food');
  addFoodButton.position(800, 100);
  addFoodButton.mousePressed(food.addFood);


  //creating and positioning input bar
  dogName = createInput("DOG'S NAME");
  dogName.position(800, 200);

  readState();
}

function draw() {
  background(46, 139, 87);//clears the background

  //for displaying text
  food.showFoodLeft();
  showLastFedTime();


  food.display();

  drawSprites();//draws the sprites

  petName = dogName.value();

  if(petName != "DOG'S NAME" && petName !== null) {
    feedButton.html('Feed ' + petName);
  }

  if(gameState != 'hungry') {
    feedButton.hide();
    addFoodButton.hide();

    dog.visible = false;
  } else {
    feedButton.show();
    addFoodButton.show();

    dog.visible = true;
  }

  currentTime = hour();

  if(currentTime == lastFed+1) {
    food.showGarden();
    gameState = 'playing';
    updateState(gameState);
  } 
  else if(currentTime > lastFed + 1 && currentTime < lastFed + 4) {
    food.showWashroom();
    gameState = 'bathing';
    updateState(gameState);
  } 
  else {
    gameState = 'hungry';
    updateState(gameState);
  }
}

function showLastFedTime() {
  //retrieves the time when the dog was last fed
  fedTime = database.ref('feedTime');
  fedTime.on('value', (data) => { 
    lastFed = data.val();
  });

  push();//so that the formatting doesn't affect another block of code

  //formatting
  fill('white');
  textSize(20);

  //this is for converting and showing the time in 12 hours clock from 24 hours clock
  if (lastFed > 12) {
    lastFedTime = lastFed % 12 + ' pm';
  }

  else if (lastFed == 0) {
    lastFedTime = '12 am';
  }

  else if(lastFed == 12) {
    lastFedTime = '12 pm';
  }
  
  else {
    lastFedTime = lastFed + ' am';
  }

  if (lastFed) {
    //displays the message
    text('Last feed: ' + lastFedTime, 20, 100);
  }

  pop();
}

function updateFeedTime(time) {
  //writes the time of feeding in database
  database.ref('/').update({
    feedTime: time,
  });
}

function readState() {
  //reads the state from the database
  database.ref('gameState').on('value', (data)=> {
    gameState = data.val();
  })
}

function updateState(state) {
  //updates the gamestate in database
  database.ref('/').update({
    gameState: state,
  });
}