var inquirer = require("inquirer");

function CreateCharacter(name, race, profession) {

    this.name = name;
    this.race = race;
    this.profession = profession;
    this.strength = 5;
    this.mp = 10;
    this.hp = 10;
    this.level = 1;
    this.xp = 0;
    this.inventory = []

    this.checkStats = function () {

        console.log("\n")
        console.log(" -- " + this.name + " -- ")
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("Strength: " + this.strength + ", Hp: " + this.hp + ", MP: " + this.mp);
        console.log("XP: " + this.xp)
        console.log("\n")
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log(this.name + " attacked " + opponent.name + " for " + this.strength + " damage.")
        console.log(opponent.name + " has " + opponent.hp + " HP left.")
    }

};

inquirer
    .prompt([{
            type: "input",
            message: "Hello Adventurer! What is your name?",
            name: "name"
        },

        {
            type: "list",
            message: "What race are you?",
            name: "race",
            choices: ["Human", "Elf", "Dwarf"]
        },
        {
            type: "list",
            message: "What is your profession?",
            name: "profession",
            choices: ["Warrior", "Rogue", "Mage"]
        }
    ])
    .then(function (newPlayer) {

        console.log("Character Created")
        var player = new CreateCharacter(newPlayer.name, newPlayer.race, newPlayer.profession);

        // testing area

        player.checkStats();
    });