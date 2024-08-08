let characterId = -1;
let characterData = [];
let configurationData;

$( document ).ready(function() {
  console.log( "ready!" );
  $("#dislike").on('click', dislike);
  $("#like").on('click', like);
  $('#myModal').jqm();
});

$.getJSON("api/characterData.json", function(result){
  characterData = result.characters;
  configurationData = result.configuration;
  shuffle(characterData);
  // characterData[0] is the user. Start the page with characterData[1]
  console.log("playing as " + characterData[0].name)
  characterId = 1;
  updatePage(characterData[characterId]);
});

function updatePage(character) {
  $("#characterName").text(character.name);
  $("#characterImage img").attr('src', 'static/images/' + character.image);
  $("#characterAge").text(character.age);
  $("#characterHeight").text(character.height);
  $("#characterBio").text(character.bio);
}

function dislike() {
  if (characterId==-1)
    return;

  console.log("disliked " + characterId);
  characterId++;
  if (characterId==characterData.length) {
    characterId = 1;
  }
  updatePage(characterData[characterId]);
}

function like() {
  if (characterId==-1)
    return;

  console.log("liked " + characterId);
  // determine if the user has matched with a 40% chance of matching
  if (Math.random() < 0.4) {
    console.log("it's a match!");
    // make the jquery modal appear on the screen.

    $("#myModal").jqm('open');
  }
  characterId++;
  if (characterId==characterData.length) {
    characterId = 1;
  }
  updatePage(characterData[characterId]);
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


