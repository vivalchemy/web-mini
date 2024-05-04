div = document.querySelector("div");
quoteLocation = div.querySelector("p");
authorLocation = div.querySelector("span");

async function getQuotes() {
  quoteLocation.textContent = "Loading...";
  authorLocation.style.display = "none";
  await fetch("https://api.quotable.io/random")
    .then((res) => res.json())
    .then((data) => {
      quoteLocation.textContent = data.content;
      authorLocation.textContent = data.author;
      authorLocation.style.display = "inline";
    })
    .catch((err) => {
      console.error("Error", err);
    });
}
getQuotes();

document.addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    getQuotes();
  }
});
