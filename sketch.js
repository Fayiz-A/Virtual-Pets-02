//variables
var dog;
var dog_img, happyDog_img;//images 
var database, foodStock;//variables for database reference

function preload() {
  //loads the images
  dog_img = loadImage('images/dogImg.png');
  happyDog_img = loadImage('images/dogImg1.png');
}

async function setup() {
  createCanvas(800, 700);//creates the canvas

  database = await firebase.database();//initialising the database
  await database.ref('food').on('value', readStock);//reads the bottles remaining

  //creating and adding image to the dog sprite
  dog = createSprite(280, 330, 40, 80);
  dog.addImage('dog image', dog_img);
  dog.scale = 0.3;
}


function draw() {
  background(46, 139, 87);//clears the background

  if (keyWentDown('UP_ARROW')) {
    //feeds the dog when up_arrow key is pressed
    if (foodStock > 0) {
      //this ensures that the dog is fed only when there are milk bottles
      foodStock--;
      writeStock(foodStock);//writes the bottles remaining in the database
      dog.addImage('dog image', happyDog_img);//changes the dog image
    }
  }

  //for displaying text
  showInstructions();
  showFoodLeft();

  drawSprites();//draws the sprites
}

async function readStock(data) {
  //synchronus function for reading the bottles remaining from the database

  foodStock = await data.val();
}

async function writeStock(foodLeft) {
  //synchronus function for writing the bottles remaining in the database

  await database.ref('/').update({
    food: foodLeft,
  }
  );
}

function showFoodLeft() {
  //displays the milk bottles remaining
  push();//so that the formatting doesn't affect another block of code

  //formatting
  fill('white');
  textFont('cursive');
  textSize(20);

  if (foodStock) {
    //text
    //only displays this text when food stock is not undefined or null
    text('Milk bottles remaining: ' + foodStock + '/20', 20, 55);
  }

  pop();
}

function showInstructions() {
  //function for displaying the instructions
  push();//so that the formatting doesn't affect another block of code

  //formatting
  fill('white');
  textFont('cursive');
  textSize(20);

  //text
  text('Press the up_arrow key to feed the hungry dog a milk bottle', 20, 30);

  pop();
}
