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
    this.wordArray = [];


}

CreateWord.prototype.createArray = function (word) {
    this.wordArray = [];
    for (i = 0; i < word.length; i++) {
        var currentLetter = word.charAt(i);
        // console.log(currentLetter);
        var letterKeyCode = parseInt(word.charCodeAt(i));
        // console.log(letterKeyCode);

        if (letterKeyCode != 32 && letterKeyCode != 39) {
            var newLetter = new CreateLetter(currentLetter);
            this.wordArray.push(newLetter);
        } else if (letterKeyCode === 32) {
            var newSpace = new CreateSpace(currentLetter);
            this.wordArray.push(newSpace);
        } else {
            var newApostrophe = new CreateApostrophe(currentLetter);
            this.wordArray.push(newApostrophe);
        }
        // console.log(this.wordArray);
        // console.log(this);
    }
}

CreateWord.prototype.displayWord = function () {
    var show = ""
    for (i = 0; i < this.wordArray.length; i++) {
        if (this.wordArray[i].type === "letter") {
            if (this.wordArray[i].isGuessed === false) {
                show = show + this.wordArray[i].hidden;
            } else if (this.wordArray[i].isGuessed === true) {
                show = show + this.wordArray[i].value;
            }

        } else if (this.wordArray[i].type === "space" || this.wordArray[i].type === "apostrophe") {
            show = show + this.wordArray[i].value;
        }
    }
    return show

}

// varthis = new CreateWord("goblin's king");

//this.createArray(this.word);

// console.log(this.wordArray[2].isGuessed)
//this.wordArray[0].isGuessed = true;
//this.wordArray[1].isGuessed = true;
//this.wordArray[2].isGuessed = true;
//this.wordArray[3].isGuessed = false;
//this.wordArray[4].isGuessed = true;
//this.wordArray[5].isGuessed = true;
//this.wordArray[7].isGuessed = true;
//this.wordArray[8].isGuessed = false;
//this.wordArray[9].isGuessed = true;
//this.wordArray[10].isGuessed = true;
// console.log(this.wordArray[2].isGuessed)
// console.log(this.wordArray)

// console.log(this.displayWord());
// console.log(this.word);
// if (this.displayWord() ===this.word) {
//     console.log("You Win!!")
// } else {
//     console.log("now yet.")
// }

module.exports = CreateWord