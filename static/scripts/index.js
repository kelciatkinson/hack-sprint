let characterId = -1;
let characterData = [];
let configurationData = {};

$( document ).ready(function() {
  console.log( "ready!" );
  $("#dislike").on('click', dislike);
  $("#like").on('click', like);
  $("#chatTextbox").on('keypress', function(event) {
    // If the user presses the "Enter" key
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Call your custom function here
        sendChat();
    }
  });
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
  $('.user-picture').attr('src',
    `${configurationData.characterImages}${characterData[0].image}`);

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
  $("#chatCharacterImage img").attr('src',
    configurationData.characterImages + character.image);
  $("#characterAge").text(' Age: ' + character.age);
  $("#characterHeight").text(' Height: ' + character.height);
  $("#characterBio").text(character.bio);
  $("#characterJob").text(' Job: ' + character.job);
  $("#characterDrinks").text(' Drinks Alcohol: ' +
    character.drinksAlcohol);
  $("#characterChildren").text(' Wants Children: ' +
    character.wantsChildren);
  $("#characterLocation").text(' Location: ' +
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
        resetModal();
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

function sendChat(){
  const p = '<p style="text-align: left; font-weight: normal; font-style: ' +
    'normal; font-family: Times; font-size: 14pt;"';
  $("#chatCharacterImage").remove();
  const userMessage = $("#chatTextbox").val();

  var newDiv = document.createElement("div");
  newDiv.id = "chat";
  newDiv.innerHTML = p + '>You: ' + userMessage + '</p>';
  document.getElementById('myModal').appendChild(newDiv);

  const chatTextboxDiv = document.getElementById('chatTextboxDiv').outerHTML;
  const submitbutton = document.getElementById('submitbutton').outerHTML;
  $("#chatTextboxDiv").remove();
  $("#submitbutton").remove();

  const POST_data = JSON.stringify({
    "characterBio": characterData[characterId].bio,
    "characterName": characterData[characterId].name,
    "userMessage": userMessage});

  const url = "https://matcheverafter.com:8080/";

  $.post(url, POST_data, function(data, textStatus) {
    let response = data.characterResponse;
    // remove any text between * characters:
    response = response.replace(/\*[^*]*\*/g, "");

    document.getElementById('chat').innerHTML = p + '>You: ' + userMessage +
    '</p>' + p + ' id="characterResponse">' + characterData[characterId].name +
    ': </p>';
    //document.getElementById('chat').innerHTML = stringToType.substring(0, startTypingAt)
    typeWriter('characterResponse', response, 0);
    

    // add the chatTextboxDiv and submitbutton back to the modal dialog:
    // document.getElementsByClassName('message-box')[0].innerHTML += chatTextboxDiv + submitbutton;
  }, "json");
}

var speed = 10;
setInterval(() => {
  speed = Math.floor(Math.random() * 61) + 5;
}, 50);

function typeWriter(id, txt, i) {
  if (i < txt.length) {
    document.getElementById(id).innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed, id, txt, i);
  }
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function resetModal() {
  const text = `<p>You're a match!</p>
  <div class="message-box">
      <div id="chatCharacterImage" class="profile">
          <img src="static/images/loading.gif" class="profile-picture">
      </div>
      <div id="chatTextboxDiv" class="profile">
        <input type="text" id="chatTextbox" placeholder="Write them a message">
      </div>
      <button type="submit" id="submitbutton" onclick="sendChat();">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
              viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
              <path d="M13 18l6 -6"></path>
              <path d="M13 6l6 6"></path>
          </svg>
      </button>
  </div>`
  document.getElementById('myModal').innerHTML = text;
  $("#chatTextbox").on('keypress', function(event) {
    // If the user presses the "Enter" key
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Call your custom function here
        sendChat();
    }
  });
}
