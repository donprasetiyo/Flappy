# Flappy Bird Clone in Javascript

Hi there. This is a Flappy Bird clone made using plain Javascript using ViteJS. It is playable on your browser and at this time can only be played on PC by using A key to jump and Space to restart the game.

To see more of my projects, visit donprasetiyo.com.

# How it works

User visit the flappy.donprasetiyo.com on their browser. They will see a welcome screen, which pauses the game temporarily until the user decide to play it by pressing A, which also makes the character the jump, which trigger wing flipping sound effect.

I use original's Flappy Bird's sound effects to make the game a bit more fun to play. 

There are one pipe and one hole that iterate every four seconds from the right screen to the left. When user succesfully pass the hole, the score counter increments and it will play the point sound effect.

When the character hit the pipe, it will fall and the game is over. If it simply falls to the ground, the game is over. User will see a text showing their score and instruct them to press Space to restart the game.

When user restart the game, it will reset the score counter, pause and reset the pipe and hole animations, setting the character's top position at 100px.

The game has been designed to be playable on any PC screen and responsive (except mobile). I have made the game to generate the hole position between the top screen and the bottom screen, so the character won't have to pass invisible hole to get more points.

You can test the responsiveness by resizing your web browser window and then reloading the web page.

# Installation

To install this game on your local environment, fork this repository, and clone that fork into your code editor. You would need NodeJS and NPM installed on your computer.

On your code editor's terminal:

    npm install

It will install required dependencies.

To run:

    npm run dev

