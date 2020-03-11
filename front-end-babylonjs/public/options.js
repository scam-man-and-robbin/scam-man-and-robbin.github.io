window.initialGameOptions = {
    
    /**
     * Main Options
     */
    
    'debugMode': true, // Enable it to show debug messages on console

    /**
     * Colors (All in Hexadecimal)
     */

    // Object Colors
    'backgroundColor': '#636e72',
    'playerColor': '#e74c3c',
    'monsterColor': '#788ca3',
    'coinColor': '#f1c40f',
    'tileLightColor': '#f2a682',
    'tileDarkColor': '#f28f66',
    'hazardColor': '#96FFF3',

    // Text Colors
    'pointsTextColor': '#000000',
    'pointsTextOutlineColor': '#000000',
    'recordTextColor': '#000000',

    // Player Options
    'player': {
        'defaultSpeed': 15,
        'increaseSpeedRatio': 2,
        'lives': 3,
        'scamStartAfter' : 5000, // 5 seconds,
        'godMode': false
    },

    'gameLength' : 270, // in seconds
    'messageReadTime': 6 // in seconds
};