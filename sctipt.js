//tool function and classes

class SoundFabric {
    constructor(path) {
        this.path = path;
        this.audio = null;
    }

    play() {
        if (this.audio != null) {
            this.audio.pause();
        }
        this.audio = new Audio(this.path);
        this.audio.play();
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function changeText(newText) {
    $(".action-text").text(newText);
}

function createSoundDict(){
    let soundNames = ["green", "red", "yellow", "blue", "wrong"];
    let sounds = (soundNames).map(x => new SoundFabric(`music/${x}.mp3`))
    let soundDict = {};
    for (let i = 0; i < sounds.length; i++) {
        let key = soundNames[i];
        let value = sounds[i];
        soundDict[key] = value;
    }
    return soundDict;
}


//game variables


let game = true;
let firstGame = true;
let colorComb = [];
let pressedColors = [];
let colors = ["green", "red", "yellow", "blue"];
let effectsDelay = 100;
let levelSwitchDelay = 500;
let soundDict = createSoundDict();


//game logic functions


function reloadVars(){
    game = true;
    colorComb = [];
    pressedColors = [];
    firstGame = false;
}

async function goToNextLevel() {
    pressedColors = [];
    let newColor = colors[Math.floor(Math.random() * 4)]
    colorComb.push(newColor);
    changeText(`Level ${colorComb.length}`);
    await sleep(levelSwitchDelay);
    if (game) {
        clickEffect($("." + newColor), newColor);
    }
}

async function gameOverEffect(){
    soundDict['wrong'].play();
    let body = $("body");
    body.addClass("game-over");
    await  sleep(effectsDelay);
    body.removeClass("game-over");
}

async function clickEffect(buttonJq, color){
    soundDict[color].play();
    buttonJq.addClass("pressed");
    await sleep(effectsDelay);
    buttonJq.removeClass("pressed");
}


// event listeners add


$(".button").on("click",  function () {
    if (!game) {
        gameOverEffect();
        return null;
    }
    //get color of a button
    let buttonJq = $(this);
    let color = buttonJq.attr("class").split(" ").filter((element) => colors.includes(element))[0];
    //click
    clickEffect(buttonJq, color);

    // check click correctness
    if  (color === colorComb[pressedColors.length]){
        pressedColors.push(color);
        //last button pressed?
        if (pressedColors.length === colorComb.length ){
            goToNextLevel();
        }
    }
    else {
        gameOverEffect();
        changeText("Press any key to restart");
        game = false;
    }
} )

$(document).on("keypress", function (e) {
    let key = e.key;
    if ((firstGame && key === "a") ||  !game) {
        reloadVars();
        goToNextLevel();
    }
})
