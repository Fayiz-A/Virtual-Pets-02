class Food {
   constructor() {

   }

   preload() {
      this.image = loadImage('images/Milk.png');
   }

   readStock(data) {
      //synchronus function for reading the bottles remaining from the database
      foodStock = data.val();
   }

   writeStock(foodLeft) {
      //synchronus function for writing the bottles remaining in the database
      database.ref('/').update({
         food: foodLeft,
      }
      );
   }

   showFoodLeft() {
      //displays the milk bottles remaining
      push();//so that the formatting doesn't affect another block of code

      //formatting
      fill('white');
      textFont('cursive');
      textSize(20);

      if (foodStock) {
         //text
         //only displays this text when food stock is not undefined or null
         text('Milk bottles remaining: ' + foodStock, 20, 55);
      }

      pop();
   }

   feedDog() {
      //feeds the dog when the button is pressed
      if (foodStock >= 0) {
         //this ensures that the dog is fed only when there are milk bottles available
         foodStock--;

         food.writeStock(foodStock);//writes the bottles remaining in the database
         dog.addImage('dog image', happyDog_img);//changes the dog image
      }

      currentTime = hour();//gets the current hour
      if (currentTime) {
         //updates the feed time in database
         updateFeedTime(currentTime);
      }
   }

   addFood() {
      //function which executes when the user presses the add food button
      foodStock++;
      food.writeStock(foodStock);//writes the bottles remaining in the database
   }

   showWashroom() {
      background(washroom_img);
      
      food.readPetName();

      fill('Black');
      textSize(20);
      text(petName + ' is taking a bath.', 350, 20);
   }

   showGarden() {
      background(garden_img);

      food.readPetName();

      fill('Black');
      textSize(20);
      text(petName + ' is playing.', 350, 20);
   }

   display() {
      var bottleX = 10, bottleY = 100;
      for (var i = 1; i <= foodStock; i++) {
         image(this.image, bottleX, bottleY, 60, 100);
         bottleX += 40;

         if (i % 10 == 0) {
            bottleX = 10;
            bottleY += 90;
         }
      }

   }

   readPetName() {
      if(petName == "DOG'S NAME" || petName == null) {
         petName = 'The dog';
      }
   }
}