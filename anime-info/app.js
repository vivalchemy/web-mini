let searchQuery;
let url = "https://graphql.anilist.co";
let catalogQuery = `
query($page: Int, $perPage: Int, $search: String, $type: MediaType) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: $type) {
      id
      status
      coverImage {
        large
      }
      title {
        romaji
        english
      }
      averageScore
      episodes
      nextAiringEpisode {
        airingAt
      }
    }
  }
}
`;

let catalogVariables = {
  page: 1,
  perPage: 20,
  search: "",
  type: "ANIME",
};

let options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query: catalogQuery,
    variables: catalogVariables,
  }),
};

// get the search query
document.querySelector(".search-btn").addEventListener("click", (event) => {
  event.preventDefault();
  searchQuery = document.querySelector("input[name='search']").value;
  catalogVariables.search = searchQuery;
  options.body = JSON.stringify({
    query: catalogQuery,
    variables: catalogVariables,
  });
  document.querySelector(".catalog").style.display = "grid";
  notify(searchQuery, "success", 5000);
  searchAnilistDB();
});

// remove a notification
function _removeNotification(notification, timeout) {
  const delay = 1000;
  new Promise((r) => setTimeout(r, timeout)).then(() => {
    notification.style.opacity = 0;
    notification.style.right = "-3rem";
    setTimeout(() => (notification.style.display = "none"), delay);
  });
}

// create a notification
async function notify(msg, status, timeout) {
  const delay = 1000;
  let notification = document.querySelector(".notification");
  notification.querySelector("div").innerText = msg;
  status === "success"
    ? (notification.className = "notification success")
    : (notification.className = "notification failure");
  await new Promise((r) => setTimeout(r, delay)).then(() => {
    notification.style.display = "flex";
    setTimeout(() => {
      notification.style.opacity = 1;
      notification.style.right = "2rem";
    }, 50);
  });

  _removeNotification(notification, timeout); // Hide notification after the specified timeout
}

// remove the notification when user clicks on it
document.querySelector(".notification").addEventListener("click", function () {
  _removeNotification(this, 50);
});

async function searchAnilistDB() {
  // console.log(url, options);
  await fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      updateCatalog(data);
    })
    .catch((err) => {
      console.error("Error :", err);
    });
}

function updateCatalog(data) {
  let template = document.getElementById("card-template");
  let catalog = document.querySelector(".catalog");
  let cards = document.querySelectorAll(".card");
  cards.forEach(function (card) {
    card.parentNode.removeChild(card);
  });
  data.data.Page.media.forEach((media) => {
    console.log(media);
    let templateClone = template.content.cloneNode(true);
    templateClone.querySelector(".card").setAttribute("id", media.id);
    templateClone
      .querySelector(".card-img > img")
      .setAttribute("src", media.coverImage.large);
    templateClone.querySelector(".card-title").innerText =
      media.title.english !== null ? media.title.english : media.title.romaji;
    catalog.appendChild(templateClone);
  });
  renderClick();
}

function renderClick() {
  let cards = document.querySelectorAll(".card");
  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      console.log(card.id);
      window.open(`https://anilist.co/anime/${card.id}`);
    });
  });
}
