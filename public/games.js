
const cards = document.querySelectorAll(".game-card");
const searchInput = document.querySelector("#game-search");
const filterButtons = document.querySelectorAll("[data-filter]");
const noResults = document.querySelector("#no-results");

let activeFilter = "all";

// GameDistribution automatically receives the current gg math page URL.
function gameDistributionUrl(gameId) {
  const url = new URL(
    `https://html5.gamedistribution.com/${gameId}/`
  );

  url.searchParams.set("gd_sdk_referrer_url", window.location.href);

  return url.toString();
}

// GAME LIBRARY
const games = {
  moto: {
    title: "Moto X3M",
    url: gameDistributionUrl("5b0abd4c0faa4f5eb190a9a16d5a1b4c")
  },

  slope: {
    title: "Slope",
    url: "https://gamezipper.com/slope/?utm_source=embed"
  },

  run3: {
    title: "Run 3",
    url: ""
  },

  driveMad: {
    title: "Drive Mad",
    url: ""
  },

  basketball: {
    title: "Basketball Stars",
    url: gameDistributionUrl("69d78d071f704fa183d75b4114ae40ec")
  },

  vex5: {
    title: "Vex X3M",
    url: gameDistributionUrl("0a3c55fe33ba415f9b761b5831e75b27")
  },

  snowRider: {
    title: "Snow Rider 3D",
    url: gameDistributionUrl("3b79a8537ebc414fb4f9672a9b8c68c8")
  }
};


// SEARCH AND FILTER
function updateGames() {
  const search = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  cards.forEach((card) => {
    const name = card.dataset.search.toLowerCase();
    const category = card.dataset.category;

    const matchesSearch = name.includes(search);
    const matchesFilter =
      activeFilter === "all" || category === activeFilter;

    card.hidden = !(matchesSearch && matchesFilter);

    if (!card.hidden) {
      visibleCount++;
    }
  });

  noResults.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", updateGames);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    updateGames();
  });
});

updateGames();


// GAME PLAYER
const player = document.querySelector("#game-player");
const frame = document.querySelector("#game-frame");
const playerTitle = document.querySelector("#player-title");
const closeButton = document.querySelector("#close-game");
const fullscreenButton = document.querySelector("#fullscreen-game");
const frameContainer = document.querySelector(".game-frame-container");

// OPEN GAMES
document.querySelectorAll("[data-game]").forEach((button) => {
  button.addEventListener("click", () => {
    const game = games[button.dataset.game];

    if (!game || !game.url) {
      alert("This game does not have an available embed yet.");
      return;
    }

    playerTitle.textContent = game.title;
    frame.src = game.url;
    player.hidden = false;

    player.scrollIntoView({ behavior: "smooth" });
  });
});

// CLOSE GAME
closeButton.addEventListener("click", () => {
  frame.src = "about:blank";
  player.hidden = true;
});

// FULLSCREEN
fullscreenButton.addEventListener("click", () => {
  if (frameContainer.requestFullscreen) {
    frameContainer.requestFullscreen();
  }
});
