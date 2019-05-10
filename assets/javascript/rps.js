//config firebase
var firebaseConfig = {
    apiKey: "AIzaSyDw8zeeMD81tnWQN68VlZ9jiJv-N559juk",
    authDomain: "rockpapers-33c61.firebaseapp.com",
    databaseURL: "https://rockpapers-33c61.firebaseio.com",
    projectId: "rockpapers-33c61",
    storageBucket: "rockpapers-33c61.appspot.com",
    messagingSenderId: "427588073192",
    appId: "1:427588073192:web:4e74a70db25b456a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a variable to reference the database.
var database = firebase.database();

function generateRandomNumber(){
    var x;
    var arr = [];
    //create a random array with 50 nos
    for (var i = 0; i < 50; i++)
    {
        arr.push(Math.trunc(Math.random() * 500) + 1);
    }
    //pick1 random number from the array
    var i = Math.trunc(Math.random() * 50 + 1);
    var x = arr[i];
    return x;
}

//initial values
var currchoice = "";
var isNew = true;
var newGameRef;
var winner;
var currKey;
var currPlayer = generateRandomNumber();
var result;

 function playGame(){
     //Initially there is no new data so create the data
     $("#score").text("");
     $("#otherPlayer").text("");

     currKey = $("#code-input").val();     
     var gameRef = database.ref("/gameData");
     //set the playerId in the local storage
     sessionStorage.clear();
     sessionStorage.setItem("current_player", currPlayer);

     if (currKey == "")
     {
         //New game set player1
         newGameRef = gameRef.push();
         newGameRef.set({
            player1: currPlayer,
            choice1: currchoice,
            player2: "",
            choice2: ""
          });
          //share the new Key on screen
          $("#game_Code").text(" " + newGameRef.key)
          currKey = newGameRef.key;
     }
     else
    {        
        //join game set player2
        isNew = false;
        // if a player is joinjing the game update his id
        database.ref("/gameData/"+ currKey).update({
            player2: currPlayer,
            choice2: ""
          });
     }    
    //create player 2 with same key 
    console.log("game: " + currKey + "player: " + sessionStorage.getItem("current_player") + " isNew: " + isNew);
 }

function sendPick(pick){
    //save the pick to db
    //update the record
    console.log("picked the pick");
    $("#score").text(pick);
    if (isNew)
    {
        database.ref("/gameData/"+ currKey).update({
            choice1: pick
          });
    }
    else
    {
        database.ref("/gameData/"+ currKey).update({
            choice2: pick
          });
    }
    //callback to read the data at our posts reference
    database.ref("/gameData/"+ currKey).on("value", function(snapshot) {
    console.log(snapshot.val());
    result = snapshot.val();

    var playerChoice1 = result.choice1;
    var playerChoice2 = result.choice2;  
    var player1 = result.player1;
    var player2 = result.player2;     

    if (playerChoice1 == "" || playerChoice2 == "")
    {
        //no need to check further
        console.log("Only one player played");
    }
    else
    {
        if (pick == playerChoice1)
        {
            $("#otherPlayer").text(playerChoice2);
        }
        else
        {
            $("#otherPlayer").text(playerChoice1);
        }
        console.log("1: choice: " + playerChoice1 + " winner " + player1);
        console.log("2: choice: " + playerChoice2 + " winner " + player2);

        winnerLogic(playerChoice1, playerChoice2, player1, player2);
    }         
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
}

function winnerLogic(playerChoice1, playerChoice2, player1, player2)
{
    console.log("calculate winning for - " + playerChoice1 + " " + playerChoice2 + " " + player1 + " " + player2);

    //basic logical flow for winner and looser
    if (playerChoice1 == "rock") 
        {
            if (playerChoice2 == "paper")
            {
                console.log(player2);
                alertPlayers(player2);
            }
            else if (playerChoice2 == "scissor")
            {
                alertPlayers(player1);              
            }
            else
            {
                winner = "tie";
            }
        }

    if (playerChoice1 == "paper")
    {
        if (playerChoice2 == "scissor")
        {
            alertPlayers(player2);
        }
        else if (playerChoice2 == "rock")
        {
            alertPlayers(player1);
        }
        else
        {
            winner = "tie";
        }
    }

    if (playerChoice1 == "scissor")
    {
        if (playerChoice2 == "rock")
        {
            alertPlayers(player2);
        }
        else if (playerChoice2 == "paper")
        {
            alertPlayers(player1);
        }
        else
        {
            winner = "tie";
        }
    }
}

function alertPlayers(winner)
{
    //get the current player to check winner
    var currentPlayer = sessionStorage.getItem("current_player");
    console.log(currentPlayer + " " + winner);
    if(currentPlayer == winner)
    {
        alert("You won!");
    }
    else
    {
        alert("You lost!");
    }
}


