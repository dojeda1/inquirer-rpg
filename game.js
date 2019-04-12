var inquirer = require("inquirer");

function nameStructure(roughName) {
    var newName = roughName.trim();
    newName = newName.charAt(0).toUpperCase() + newName.slice(1);
    return newName;
}

function CreateCharacter(name, race, profession) {

    this.name = nameStructure(name)
    this.race = race;
    this.profession = profession;
    this.strength = 5;
    this.mp = 10;
    this.hp = 10;
    this.level = 1;
    this.xp = 0;
    this.inventory = ["sword", "hat"];
    this.gold = 0

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("Strength: " + this.strength + ", Hp: " + this.hp + ", MP: " + this.mp);
        console.log("XP: " + this.xp);
        console.log("Gold: " + this.gold);
        console.log("Inventory: " + this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log(this.name + " attacked " + opponent.name + " for " + this.strength + " damage.")
        console.log(opponent.name + " has " + opponent.hp + " HP left.")
    }

};

function CreateMonster(name, strength, hp, mp, xp) {

    this.name = name
    this.strength = strength;
    this.mp = mp;
    this.hp = hp;
    this.xp = xp;
    this.inventory = [];
    this.gold = 0

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("Strength: " + this.strength + ", Hp: " + this.hp + ", MP: " + this.mp);
        console.log("XP: " + this.xp);
        console.log("Gold: " + this.gold);
        console.log("Inventory: " + this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log(this.name + " attacked " + opponent.name + " for " + this.strength + " damage.")
        console.log(opponent.name + " has " + opponent.hp + " HP left.")
    }

};

function gameStart() {
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

            player = new CreateCharacter(newPlayer.name, newPlayer.race, newPlayer.profession);


            goblin = new CreateMonster("Goblin", 2, 10, 0, 10);

            // testing area

            player.checkStats();
            goblin.checkStats();
            fight();
        });
}

function fight() {
    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Fight", "Check Stats", "Run"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Fight":
                    console.log("\n--------")
                    player.attack(goblin);
                    goblin.attack(player);
                    console.log("--------\n")
                    fight();
                    break;

                case "Check Stats":
                    player.checkStats();
                    fight();
                    break;

                case "Run":
                    console.log("You Ran Away")
                    // exitGame();
                    break;
            }
        })
}

gameStart();