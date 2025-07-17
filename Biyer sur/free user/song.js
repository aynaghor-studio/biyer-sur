const songs = [
  {
    title: "Pehli Baar",
    artist: "Ranveer Singh",
    src: "songs/hindi/'Pehli Baar' VIDEO Song  Dil Dhadakne Do  Ranveer Singh, Anushka Sharma  T-Series.mp3",
    image: "images/hindi/Pehli baar-dhadak.jpg",
    language: "Hindi"
  },
  {
    title: "Badtameez Dil",
    artist: "Harmony Crew",
    src: "songs/hindi/Badtameez Dil Full Song HD Yeh Jawaani Hai Deewani  PRITAM  Ranbir Kapoor, Deepika Padukone.mp3",
    image: "images/hindi/Badtameez dil.jpg",
    language: "Hindi"
  },
  {
    title: "Kalyana Sangeetham",
    artist: "Carnatic Beats",
    src: "songs/song3.mp3",
    image: "images/song3.jpg",
    language: "Tamil"
  }
];

const languages = [
  "Hindi", "Punjabi", "Tamil", "Telugu", "Malayalam", "Kannada",
  "Bengali", "Marathi", "Assamese", "Odia", "Gujarati", "Konkani",
  "Manipuri", "Nepali", "Bodo", "Dogri", "Kashmiri", "Maithili", "Santhali", "Urdu"
];

function renderFilters() {
  const container = document.getElementById("filters");
  container.innerHTML = "";
  languages.forEach(lang => {
    const btn = document.createElement("button");
    btn.textContent = lang;
    btn.className = "px-3 py-1 rounded text-white text-sm";
    btn.style.backgroundColor = getRandomColor();
    btn.addEventListener("click", () => filterSongs(lang));
    container.appendChild(btn);
  });
}

function renderSongs(songList) {
  const container = document.getElementById("song-container");
  container.innerHTML = "";

  let currentAudio = null;

  songList.forEach(song => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow-md";
    card.id = `song-${song.title.replace(/\s+/g, '-').toLowerCase()}`;

    const audioId = `audio-${song.title.replace(/\s+/g, '-').toLowerCase()}`;

    card.innerHTML = `
      <img src="${song.image}" alt="${song.title}" class="w-full h-40 object-cover rounded mb-2">
      <h3 class="text-lg font-semibold">${song.title}</h3>
      <p class="text-sm text-gray-600 mb-2">${song.artist}</p>
      <audio id="${audioId}" controls class="w-full">
        <source src="${song.src}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button class="mt-2 flex items-center text-[#B71C1C]" onclick="showConfirmPopup('${song.title}')">
        <span class="material-icons mr-1">favorite</span> Save to Playlist
      </button>
    `;

    container.appendChild(card);

    // Attach event listener to pause other audio
    const audioElement = card.querySelector("audio");
    audioElement.addEventListener("play", () => {
      if (currentAudio && currentAudio !== audioElement) {
        currentAudio.pause();
      }
      currentAudio = audioElement;
    });
  });
}

function getRandomColor() {
  const colors = ["#B71C1C", "#3F51B5", "#FFC107", "#2E7D32", "#6D4C41"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function filterSongs(lang) {
  const filtered = songs.filter(song => song.language === lang);
  renderSongs(filtered);
}

let pendingSaveTitle = null;

function showConfirmPopup(songTitle) {
  pendingSaveTitle = songTitle;
  document.getElementById("modalMessage").textContent = `Add "${songTitle}" to your playlist?`;
  document.getElementById("confirmModal").classList.remove("hidden");
}

function hideConfirmPopup() {
  document.getElementById("confirmModal").classList.add("hidden");
  pendingSaveTitle = null;
}

function saveToPlaylistConfirmed() {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

  if (pendingSaveTitle && !playlist.includes(pendingSaveTitle)) {
    playlist.push(pendingSaveTitle);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    renderPlaylist();
  }

  hideConfirmPopup();
}

function renderPlaylist() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";

  const playlist = JSON.parse(localStorage.getItem("playlist")) || [];

  playlist.forEach(songTitle => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200 transition";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = songTitle;
    titleSpan.className = "cursor-pointer hover:underline";
    titleSpan.onclick = () => scrollToSongCard(songTitle);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.className = "ml-2 text-red-500 hover:text-red-700";
    removeBtn.onclick = () => removeFromPlaylist(songTitle);

    li.appendChild(titleSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function scrollToSongCard(songTitle) {
  const cardId = `song-${songTitle.replace(/\s+/g, '-').toLowerCase()}`;
  const card = document.getElementById(cardId);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("ring", "ring-[#B71C1C]", "ring-offset-2");

    setTimeout(() => {
      card.classList.remove("ring", "ring-[#B71C1C]", "ring-offset-2");
    }, 2000);
  }
}

function removeFromPlaylist(songTitle) {
  let playlist = JSON.parse(localStorage.getItem("playlist")) || [];
  playlist = playlist.filter(title => title !== songTitle);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  renderPlaylist();
}

function openPlaylistSidebar() {
  document.getElementById("playlist-sidebar").classList.remove("translate-x-full");
}

function closePlaylistSidebar() {
  document.getElementById("playlist-sidebar").classList.add("translate-x-full");
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderSongs(songs);
  renderPlaylist();

  document.getElementById("togglePlaylist").addEventListener("click", openPlaylistSidebar);
  document.getElementById("closePlaylist").addEventListener("click", closePlaylistSidebar);
  document.getElementById("confirmSave").addEventListener("click", saveToPlaylistConfirmed);
  document.getElementById("cancelSave").addEventListener("click", hideConfirmPopup);
});
