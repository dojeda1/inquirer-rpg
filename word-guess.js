var currentWordArray = [];

function CreateLetter(letter) {
    this.value = letter;
    this.hidden = "*"
    this.type = "letter"
    this.isGuessed = false
}

function CreateSpace() {
    this.value = " ";
    this.type = "space"
}

function CreateApostrophe() {
    this.value = "'";
    this.type = "apostrophe"
}

function CreateWord(word) {
    this.word = word.toUpperCase();
    this.createArray = function (word) {
        for (i = 0; i < word.length; i++) {
            var currentLetter = word.charAt(i);
            console.log(currentLetter);
            var letterKeyCode = parseInt(word.charCodeAt(i));
            console.log(letterKeyCode);

            if (letterKeyCode != 32 && letterKeyCode != 39) {
                var newLetter = new CreateLetter(currentLetter);
                currentWordArray.push(newLetter);
            } else if (letterKeyCode === 32) {
                var newSpace = new CreateSpace(currentLetter);
                currentWordArray.push(newSpace);
            } else {
                var newApostrophe = new CreateApostrophe(currentLetter);
                currentWordArray.push(newApostrophe);
            }
            console.log(currentWordArray);
            console.log(currentWord);
        }
    }
}



var currentWord = new CreateWord("goblin's king");

currentWord.createArray(currentWord.word);

function displayWord() {
    var show = ""
    for (i = 0; i < currentWordArray.length; i++) {
        if (currentWordArray[i].type === "letter") {
            if (currentWordArray[i].isGuessed === false) {
                show = show + currentWordArray[i].hidden;
            } else if (currentWordArray[i].isGuessed === true) {
                show = show + currentWordArray[i].value;
            }

        } else if (currentWordArray[i].type === "space" || currentWordArray[i].type === "apostrophe") {
            show = show + currentWordArray[i].value;
        }
    }
    return show

}


console.log(currentWordArray[2].isGuessed)
currentWordArray[0].isGuessed = true;
currentWordArray[1].isGuessed = true;
currentWordArray[2].isGuessed = true;
currentWordArray[3].isGuessed = false;
currentWordArray[4].isGuessed = true;
currentWordArray[5].isGuessed = true;
currentWordArray[7].isGuessed = true;
currentWordArray[8].isGuessed = false;
currentWordArray[9].isGuessed = true;
currentWordArray[10].isGuessed = true;
console.log(currentWordArray[2].isGuessed)
console.log(currentWordArray)

console.log(displayWord());
console.log(currentWord.word);
if (displayWord() === currentWord.word) {
    console.log("You Win!!")
} else {
    console.log("now yet.")
}