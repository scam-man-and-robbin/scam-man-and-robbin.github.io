# scam-man-and-robbin

## Use folder "front-end-babylonjs" for babylonJS.

    $ cd front-end-babylonjs
# 1. Setup Environment & Up application 
For development, you will only need Node.js installed on your environment and please use the appropriate Editorconfig plugin for your editor (not mandatory) 
## 1.1. Prerequisite 
Node is easy to install & now includes NPM & check it by running by below command 

    $ node --version v10.16.3 
    $ npm --version 6.9.0 
 
### 1.1.1. On OS X 
You will need to use a Terminal. On OS X, you can find the default terminal in 
`/Applications/Utilities/Terminal.app`. 
Please install Homebrew if it's not already done with the following command. 

    $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" 
    
If everything when fine, you should run 

    $ brew install node 1.1.2. On Linux 
    $ sudo apt-get install python-software-properties $ sudo add-apt-repository ppa:chris-lea/node.js $ sudo apt-get update $ sudo apt-get install nodejs 
 
### 1.1.3. On Windows 
Just go on official Node.js website & grab the installer. Also, be sure to have `git` available in your PATH, `npm` might need it 

## 1.2. Download source code $ git clone
https://github.com/PensionBee/scam-man-and-robbin

        $ cd front-end 
        $ npm install 
 
### 1.3. Start local server 
Our preferred method was using a simple HTTP server using python. XAMPP or WAMP shall server the purpose 

    $ cd public 
    # Windows 
    $ python -m http.server 
    # Ubuntu
    $ python -m SimpleHttpServer
 
### 1.4. Development - Watch for Changes 

    $ npm run development -- --watch   
    
# 2 Directory Structure 
 
## 2.1 public directory 
This folder has to be the root directory when hosted on server / GitHub pages. Key files and folders are described below 
 
1.  Assets directory contains css, js, sounds and graphics. 
2.  Build directory having the webpack build files that will be generated based on environment. 
3.  index.html – This file will be loaded when launched from the browser. 
4.  options.js – This file will have configurable values such as game length, speed etc. 
5.  stage.json file contains JSON data mentioning which scams/boons to appear in each stage 
6.  message.json file containing scams/boons information such as display text, names, icon path 

## 2.2 src directory 
1.  Base directory Contains resuable methods for loading sounds, UI elements, Screens etc. 
2.  Game directory 
    1. Levels 
        1. Counters Directory – For handling Age Counter and Stage Screens.
        2. Generators Directory – For handling Coins(tiles), Scams and Boons. 
        3. HomeRunnerLevel.js – For home landing page with banner and start button. 
        4. RunnerLevel.js – For actual 3 staged gameplay controlling the generators. 
        5. TutorialLevel.js – For tutorial page related logics and actions.
        
    2. Player.js – For handling scam man behaviours including appearance, movements, shooting, calculating coins, scams, boons etc. 
3.  Libs directory BabylonJS and Hammer.js related library files. These files will be minimalized into vendor.js in build directory. 
4.  Game.js  Main javascript file where all other aspects are controlled and an abstract level is maintained from this file. 
 
Other files as package.json (where node packages are defined) and webpack-mix.js (where src files are mixed as single build files). 
 
# 3 Hosting 
To deploy code run the below build command to create build version for Live environment 
 
    $ npm run production 
 
## 3.1 Azure Static Website 
 Our approach was using a VS Code editor with Azure extension 
 Under Storage Sub Menu, select on Deploy Static Website icon 
 Select for the public directory 
 Choose Storage Account or create a new one 
 Confirm and upload to deploy 
 
## 3.2 GitHub Pages 
 To host using GitHub Pages we would suggest creating a symlink of the public directory in another location 
 Now use this location as a new git repository. This as similar to setting up a new GitHub repository 
 Once the files are push to the git we will be able to access the game from the public facing url. 
 For more information refer the link 
 
 
