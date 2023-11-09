const apiBaseURL = `https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/`;

const state = {
  RuffPlayers: [],
  FluffPlayers: []
};

const main = document.querySelector(`main`);
const body = document.querySelector(`body`);

//pull data from api
const getAllPlayers = async () => {
  const response = await fetch(`${apiBaseURL}teams`);
  const jsonResponse = await response.json();
  state.RuffPlayers = jsonResponse.data.teams[0].players;
  state.FluffPlayers = jsonResponse.data.teams[1].players;
    renderAllPlayers();
}

//pull player details data from api
const getPlayerDetails = async (id) => {
  const response = await fetch(`${apiBaseURL}players/${id}`);
  const responseJson = await response.json();
  const playerDetails = responseJson.data;
  console.log(playerDetails.player)
  renderDetails(playerDetails.player);
}

//render player
const renderDetails = (detailsOfAPlayer) => {
  const html = `
    <main>
      <h2 id="detailh2">Player Name:${detailsOfAPlayer.name}</h2>
      <h3 id="breedh3">Breed:${detailsOfAPlayer.breed}</h3>
      <h3 id="statush3">Status:${detailsOfAPlayer.status}</h3>
      <img src="${detailsOfAPlayer.imageUrl}" alt="image of a player"/>
    </main>
    <button id="back-button">Go back to Player List</button> </br>
    <button id="delete-button">DELETE PLAYER (CAN NOT REVERSE)</button>
  `;

  // fetch('${apiBaseURL}players', {
  //   method: 'DELETE',
  // });
  // try {
  //   const response = await fetch(
  //     '${apiBaseURL}players/1',
  //     {
  //       method: 'DELETE',
  //     }
  //   );
  //   const result = await response.json();
  //   console.log(result);
  // } catch (err) {
  //   console.error(err);
  // }

  main.innerHTML = html;
  body.replaceChildren(main);

  const backButton = document.querySelector(`#back-button`);
    backButton.addEventListener(`click`, () => {
    renderAllPlayers();
  })
}

//render Ruff roster with eventlistenter to click on player name to get details.
const renderAllPlayers = () => {
  const RuffRoster = state.RuffPlayers.map((singleTeam) => {
    return `<li id="${singleTeam.id}">${singleTeam.name}</li>`
  });

  const olRuff = document.createElement(`ol`);
  olRuff.innerHTML = RuffRoster.join(``);
  const h2Ruff = document.querySelector(`#Team-Ruff`)
  h2Ruff.appendChild(olRuff);

  const FluffRoster = state.FluffPlayers.map((singleTeam) => {
    return `<li id="${singleTeam.id}">${singleTeam.name}</li>`
  });

  const olFluff = document.createElement(`ol`);
  olFluff.innerHTML = FluffRoster.join(``);
  const h2Fluff = document.querySelector(`#Team-Fluff`)
  h2Fluff.appendChild(olFluff);

  const listPlayers = document.querySelectorAll(`li`);
  listPlayers.forEach((PlayerListItem) => {
    PlayerListItem.addEventListener(`click`, (event) => {
      getPlayerDetails(event.target.id)
    });
  });
}

getAllPlayers();

//form to add players to team Fluff
const form = document.querySelector(`form`);
form.addEventListener(`submit`, async (event) => {
  event.preventDefault();

  const nameInput = document.querySelector(`#name`);
  const breedInput = document.querySelector(`#breed`);
  const statusInput = document.querySelector(`#status`);
  const teamIdInput = document.querySelector(`#teamId`);
  const imageUrlInput = document.querySelector(`#imgUrl`);

  fetch(`${apiBaseURL}players`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({
      name: nameInput.value,
      breed: breedInput.value,
      status: statusInput.value,
      teamId: teamIdInput.value,
      imageUrl: imageUrlInput.value,
    })
  });
  const responseJson = await response.json();
  const newPlayer = responseJson.data;

  state.FluffPlayers.push(newPlayer);
  renderAllPlayers();
})