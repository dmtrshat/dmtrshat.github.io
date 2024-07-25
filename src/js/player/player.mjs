export function setupPlayer() {
  const artistIds = {
    PAPA_DIMA: "artist_0",
  };

  const albumIds = {
    PURE_MOMENTS_PT_1: "album_0",
  };

  const artists = [
    {
      id: artistIds.PAPA_DIMA,
      name: "Papa Dima",
    },
  ];

  const albums = [
    {
      id: albumIds.PURE_MOMENTS_PT_1,
      title: "Pure Moments pt. 1",
      artistId: artistIds.PAPA_DIMA,
      cover: "./assets/pure-moments-pt-1.webp",
    },
  ];

  const tracks = [
    {
      id: "track_0",
      title: "Pure Moments pt. 1",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/1._Pure_Moments_pt._1.wav",
    },
    {
      id: "track_1",
      title: "Golden Horizon",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/2._Golden_Horizon.wav",
    },
    {
      id: "track_2",
      title: "Dreamy River",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/3._Dreamy_River.wav",
    },
    {
      id: "track_3",
      title: "Captured Smiles",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/4._Captured_Smiles.wav",
    },
    {
      id: "track_4",
      title: "Captured Smiles (instrumental)",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/5._Captured_Smiles_(instrumental).wav",
    },
    {
      id: "track_5",
      title: "Harmony",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/6._Harmony.wav",
    },
    {
      id: "track_6",
      title: "Harmony (instrumental)",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/7._Harmony_(instrumental).wav",
    },
    {
      id: "track_7",
      title: "Canvas of Sound",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/8._Canvas_of_Sound.wav",
    },
    {
      id: "track_8",
      title: "To the Moon",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/9._To_the_Moon.wav",
    },
    {
      id: "track_9",
      title: "To the Moon (instrumental)",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/10._To_the_Moon_(instrumental).wav",
    },
    {
      id: "track_10",
      title: "Concert (ver. 1)",
      artistId: artistIds.PAPA_DIMA,
      albumId: albumIds.PURE_MOMENTS_PT_1,
      file: "./assets/music/Concert_(ver._1).wav",
    },
  ];

  const audio = new Audio();
  let isPlaying = false;
  let activeTrack = null;
  let prevTrack = null;
  let nextTrack = null;
  let lastPlayedTrack = null;

  const ELEMENT_IDS = {
    player: "player",
    playerTrackCover: "player__track-cover",
    playerTrackName: "player__track-name",
    playerTrackArtist: "player__track-artist",
    playerTrackAlbum: "player__track-album",
    playerCurrentTime: "player__current-time",
    playerEndTime: "player__end-time",
    playPauseButton: "player__track-control_play-pause",
    playPauseIcon: "player__track-control-icon_play-pause",
    prevButton: "player__track-control_prev",
    nextButton: "player__track-control_next",
    progressBar: "player__progress-bar",
    progressBarContainer: "player__progress-bar-container",
    tracksPapaDimaList: "tracks_papa-dima",
    playerCloseButton: "player__close",
  };

  const elements = Object.keys(ELEMENT_IDS).reduce((acc, key) => {
    acc[key] = document.getElementById(ELEMENT_IDS[key]);
    return acc;
  }, {});

  const ICONS = {
    play: `<svg class="g!opacity=0; g!aspect-ratio=1/1; g!pointer-events=none; play" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
    pause: `<svg class="g!opacity=0; g!aspect-ratio=1/1; g!pointer-events=none; pause" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>`,
  };

  const DATA_KEYS = {
    trackStatus: "data-track-status",
  };

  let angle = 0;
  let isSpinning = false;
  let spinInterval;

  const CLASS_NAMES = {
    activeTrackRow: [
      "g!color=var(--brand-11);",
      "g!background-color=var(--brand-4);",
    ],
  };

  function rotateVinyl() {
    angle = (angle + 2) % 360;
    elements.playerTrackCover.style.transform = `rotate(${angle}deg)`;
  }

  function startSpin() {
    if (!isSpinning) {
      isSpinning = true;
      spinInterval = setInterval(rotateVinyl, 20);
    }
  }

  function pauseSpin() {
    if (isSpinning) {
      isSpinning = false;
      clearInterval(spinInterval);
    }
  }

  function getTrackRowItemID(trackID) {
    return `track-row-item-${trackID}`;
  }

  function filterTracksByArtist(artistId) {
    return tracks.filter((track) => track.artistId === artistId);
  }

  function createTrackElement(track) {
    const rowItem = document.createElement("li");
    rowItem.classList.add(
      "g!padding=3px;",
      "g!cursor=pointer;",
      "g!hover:background-color=var(--brand-3);",
      "g!hover:color=var(--brand-11);",
      "g!{[data-track-status='active']_>_button_>_.pause}display=block;",
      "g!{[data-track-status='active']_>_button_>_.play}display=none;",
      "g!{[data-track-status='active']_>_button_>_svg}opacity=1;",
      "g!{[data-track-status='inactive']_>_button_>_.play}display=block;",
      "g!{[data-track-status='inactive']_>_button_>_.pause}display=none;",
      "g!{[data-track-status='inactive']_>_button_>_svg}opacity=0;",
      "g!{_>_button_svg}hover:opacity=1!important;"
    );
    rowItem.id = getTrackRowItemID(track.id);
    rowItem.setAttribute(DATA_KEYS.trackStatus, "inactive");

    const trackButton = document.createElement("button");
    trackButton.id = track.id;
    trackButton.classList.add(
      "g!background=none;",
      "g!cursor=pointer;",
      "g!border=none;",
      "g!font-size=mrs(14px_16px_380px_800px);",
      "g!color=inherit;",
      "g!width=100%;",
      "g!overflow=hidden;",
      "g!white-space=nowrap;",
      "g!text-overflow=ellipsis;",
      "g!display=grid;",
      "g!grid-template-columns=max-content_auto;",
      "g!align-items=center;",
      "g!justify-items=start;",
      "g!grid-column-gap=6px;"
    );

    const playIcon = document.createElement("div");
    playIcon.innerHTML = ICONS.play;
    const pauseIcon = document.createElement("div");
    pauseIcon.innerHTML = ICONS.pause;
    const trackTitle = document.createElement("p");
    trackTitle.classList.add("g!color=inherit;", "g!pointer-events=none;");
    trackTitle.textContent = track.title;

    trackButton.appendChild(playIcon.firstElementChild);
    trackButton.appendChild(pauseIcon.firstElementChild);
    trackButton.appendChild(trackTitle);

    rowItem.appendChild(trackButton);
    return rowItem;
  }

  function appendTracksToList(tracks, listElement) {
    tracks.forEach((track) => {
      listElement.appendChild(createTrackElement(track));
    });
  }

  function handleTrackClick(event, tracks) {
    if (event.target.tagName === "BUTTON") {
      const track = tracks.find((track) => track.id === event.target.id);
      if (track) {
        if (activeTrack && activeTrack.id == track.id) {
          if (isPlaying) {
            playerPause();
          } else {
            playerPlay();
          }
        } else {
          loadTrack(track);
          playerPlay();
        }
      }
    }
  }

  function addTrackListEventListeners() {
    elements.tracksPapaDimaList.addEventListener("click", (event) =>
      handleTrackClick(event, filterTracksByArtist(artistIds.PAPA_DIMA))
    );
  }

  function loadTrack(track) {
    lastPlayedTrack = activeTrack;

    stopTrack();

    elements.player.classList.replace("g!display=none;", "g!display=grid;");

    const currentTrackList = filterTracksByArtist(track.artistId);
    const activeTrackIndex = currentTrackList.findIndex(
      (t) => t.id === track.id
    );

    if (activeTrackIndex === -1) {
      throw new Error("Track not found");
    }

    prevTrack =
      activeTrackIndex === 0 ? null : currentTrackList[activeTrackIndex - 1];
    nextTrack =
      activeTrackIndex + 1 === currentTrackList.length
        ? null
        : currentTrackList[activeTrackIndex + 1];

    elements.prevButton.disabled = !prevTrack;
    elements.nextButton.disabled = !nextTrack;

    activeTrack = track;
    audio.src = track.file;
    elements.playerTrackName.textContent = track.title;
    elements.playerTrackArtist.textContent = getArtistName(track.artistId);
    elements.playerTrackAlbum.textContent = getAlbumTitle(track.albumId);
    elements.playerTrackCover.style.backgroundImage = `url(${getAlbumCover(
      track.albumId
    )})`;

    updateTrackRowStyle(activeTrack.id, CLASS_NAMES.activeTrackRow, true);
    if (lastPlayedTrack) {
      updateTrackRowStyle(
        lastPlayedTrack.id,
        CLASS_NAMES.activeTrackRow,
        false
      );
    }
  }

  function updateEndTime() {
    elements.playerEndTime.textContent = formatTime(audio.duration);
  }

  function playerPlay() {
    audio.play();
    isPlaying = true;
    elements.playPauseButton.dataset.playerState = "play";

    updateTrackStatus(activeTrack.id, "active");
    if (lastPlayedTrack) {
      updateTrackStatus(lastPlayedTrack.id, "inactive");
    }

    startSpin();
  }

  function playerPause() {
    audio.pause();
    isPlaying = false;
    elements.playPauseButton.dataset.playerState = "pause";

    updateTrackStatus(activeTrack.id, "inactive");

    pauseSpin();
  }

  function togglePlayPause() {
    isPlaying ? playerPause() : playerPlay();
  }

  function playPrevTrack() {
    if (prevTrack) {
      loadTrack(prevTrack);
      playerPlay();
    }
  }

  function playNextTrack() {
    if (nextTrack) {
      loadTrack(nextTrack);
      playerPlay();
    }
  }

  function stopTrack() {
    if (activeTrack) {
      updateTrackStatus(activeTrack.id, "inactive");
    }

    activeTrack = null;
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    elements.playPauseButton.dataset.playerState = "pause";
    elements.playerCurrentTime.textContent = "0:00";
    elements.progressBar.style.width = "0%";

    pauseSpin();
  }

  function closePlayer() {
    if (activeTrack) {
      updateTrackRowStyle(activeTrack.id, CLASS_NAMES.activeTrackRow, false);
      stopTrack();
    }

    elements.player.classList.replace("g!display=grid;", "g!display=none;");
  }

  function updateProgress() {
    elements.playerCurrentTime.textContent = formatTime(audio.currentTime);
    elements.progressBar.style.width = `${
      (audio.currentTime / audio.duration) * 100
    }%`;
  }

  function setProgress(e) {
    const rect = elements.progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
  }

  function updateTrackStatus(trackId, status) {
    document
      .getElementById(getTrackRowItemID(trackId))
      .setAttribute(DATA_KEYS.trackStatus, status);
  }

  function updateTrackRowStyle(trackId, classNames, add) {
    const trackRow = document.getElementById(getTrackRowItemID(trackId));
    classNames.forEach((className) => {
      add
        ? trackRow.classList.add(className)
        : trackRow.classList.remove(className);
    });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  function getArtistName(artistId) {
    return artists.find((artist) => artist.id === artistId).name;
  }

  function getAlbumTitle(albumId) {
    return albums.find((album) => album.id === albumId).title;
  }

  function getAlbumCover(albumId) {
    return albums.find((album) => album.id === albumId).cover;
  }

  elements.playerCloseButton.addEventListener("click", closePlayer);
  elements.playPauseButton.addEventListener("click", togglePlayPause);
  elements.prevButton.addEventListener("click", playPrevTrack);
  elements.nextButton.addEventListener("click", playNextTrack);
  elements.progressBarContainer.addEventListener("click", setProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateEndTime);

  appendTracksToList(
    filterTracksByArtist(artistIds.PAPA_DIMA),
    elements.tracksPapaDimaList
  );
  addTrackListEventListeners();
}
