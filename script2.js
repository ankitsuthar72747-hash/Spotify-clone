let currentSong = new Audio();
let currentIndex = 0;
let play = document.getElementById("play");
let previous = document.getElementById("previous");
let next = document.getElementById("next");

let songs = [];
let currentFolder = "";


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
async function getSongs(folder) {

    let response = await fetch("songs.json");
    let data = await response.json();

    songs = data[folder] || [];

    return songs;
}

// async function getSongs(folder) {

//     // let a = await fetch(`songs/${folder}/`);
//     // let response = await a.text();

//     let div = document.createElement("div");
//     div.innerHTML = response;

//     let links = div.getElementsByTagName("a");

//     songs = [];

//     for (let element of links) {
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`songs/${folder}/`)[1]);
//         }
//     }

//     return songs;
// }


const playMusic = (track, pause=false) => {

    if(!track) return;   // 🔹 prevents undefined error

  currentSong.src = `songs/${currentFolder}/` + track;
    currentIndex = songs.indexOf(track);

    if(!pause){
        currentSong.play();
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML =
        decodeURI(track).replace(".mp3","")

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    // CARD CLICK
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            currentFolder = item.currentTarget.dataset.folder;

            songs = await getSongs(currentFolder);

            let songUL = document.querySelector(".songList ul");
            songUL.innerHTML = "";
            for (const song of songs) {

              songUL.innerHTML += `
<li data-song="${song}">
    
    <div class="songleft">
        <img class="invert musicicon" src="music.svg">

        <div class="info">
            <div class="songname">${decodeURI(song).replace(".mp3","")}</div>
            <div class="artist">Artist</div>
        </div>
    </div>

    <div class="songright">
        <img class="invert playicon" src="play.svg">
    </div>

</li>`;
            }

            // SONG CLICK
            Array.from(songUL.getElementsByTagName("li")).forEach(li => {

    li.addEventListener("click", () => {

        let track = li.getAttribute("data-song");
        playMusic(track);

    });

});
            // autoplay first song
           if (songs.length > 0) {
    playMusic(songs[0], true);
}

        });

    });


    // PLAY / PAUSE
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }

    });


    // TIME UPDATE
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

   if (currentSong.duration) {
    document.querySelector(".circle").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
}

});


    // SEEKBAR
document.querySelector(".seekbar").addEventListener("click", e => {

    if (!currentSong.duration) return;   // prevents error

    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;

});


    // SIDEBAR
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });


    // PREVIOUS
    previous.addEventListener("click", () => {

        if (currentIndex > 0) {
            playMusic(songs[currentIndex - 1]);
        }

    });


    // NEXT
    next.addEventListener("click", () => {

        if (currentIndex < songs.length - 1) {
            playMusic(songs[currentIndex + 1]);
        }

    });


    // VOLUME
    document.querySelector(".range input").addEventListener("change", e => {

        currentSong.volume = e.target.value / 100;

    });

}

main();
