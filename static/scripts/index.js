let characterId = -1;
let characterData = [];
let configurationData = {};

$( document ).ready(function() {
  console.log( "ready!" );
  $("#dislike").on('click', dislike);
  $("#like").on('click', like);
});

$.getJSON("https://matcheverafter.com:8080/", function(result) {
  configurationData = result.configuration;
  characterData = result.characters;

  // determine user matches based on configurationData.matchOdds
  characterData[0].match = true;
  characterData.forEach( character => 
    character.match = (Math.random() < configurationData.matchOdds)
  );
  
  shuffle(characterData);

  // characterData[0] is the user. Start the page with characterData[1]
  console.log("playing as " + characterData[0].name)
  let name = `<b>${characterData[0].shortName}</b>`;
  document.getElementById('username').innerHTML = name;
  $('.user-picture').attr('src', `${configurationData.characterImages}${characterData[0].image}`);

  characterId = 1;
  updatePage(characterData[characterId]);
});

function updatePage(character) {
  console.log(`showing character ${character.name}`);
  $("#characterName").text(character.name);
  $("#characterImage img").attr('src',
    "static/images/loading.gif");
  $("#characterImage img").attr('src',
    configurationData.characterImages + character.image);
  $("#characterAge").innerHTML('&nbsp;&nbsp;Age:&nbsp;' + character.age);
  $("#characterHeight").innerHTML('&nbsp;&nbsp;Height:&nbsp;' +
    character.height);
  $("#characterBio").innerHTML(character.bio);
  $("#characterJob").innerHTML('&nbsp;&nbsp;Job:&nbsp;' + character.job);
  $("#characterDrinks").innerHTML('&nbsp;&nbsp;Drinks&nbsp;Alcohol:&nbsp;' +
    character.drinksAlcohol);
  $("#characterChildren").innerHTML('&nbsp;&nbsp;Wants&nbsp;Children:&nbsp;' +
    character.wantsChildren);
  $("#characterLocation").innerHTML('&nbsp;&nbsp;Location:&nbsp;' +
    character.location);
}

function dislike() {
  if (characterId==-1)
    return;

  console.log("disliked " + characterData[characterId].name);
  if (characterData[characterId].match)
    console.log("user just missed a match!");

  showNext();
}

function like() {
  if (characterId==-1)
    return;

  console.log("liked " + characterData[characterId].name);
  // determine if the user has matched with a 40% chance of matching
  if (characterData[characterId].match)
    {
      console.log("it's a match!");
      // make the jquery modal appear on the screen.
      
      $('#myModal').modal('show');
      var observer = new MutationObserver( () => {
        showNext();
        observer.disconnect();
        });
      observer.observe(document.getElementById('myModal'),
        {attributes: true});
    }
  else
    showNext();
}

function showNext() {
  characterId++;
  if (characterId==characterData.length)
    characterId = 1;

  updatePage(characterData[characterId]);
}
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex)
    {
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
