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
    this.maxHp = 10;
    this.hp = 10;
    this.maxMp = 10;
    this.mp = 10;
    this.level = 1;
    this.xp = 0;
    this.nextLevel = 20;
    this.inventory = ["sword", "hat"];
    this.gold = 0;
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("Strength: " + this.strength + ", Hp: " + this.hp + "/" + this.maxHp + ", MP: " + this.mp + "/" + this.maxMp);
        console.log("XP: " + this.xp + ", to next level: " + (this.nextLevel - this.xp));
        console.log("Gold: " + this.gold);
        console.log("Inventory: " + this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log(this.name + " attacked " + opponent.name + " for " + this.strength + " damage.")
        console.log(opponent.name + " has " + opponent.hp + " HP left.")
    }

    this.levelUp = function () {
        if (this.xp >= this.nextLevel) {
            this.level++;
            this.nextLevel = (this.nextLevel + (this.nextLevel * 1.5));
            this.strength += 2;
            this.maxHp += 5;
            this.hp = this.maxHp;
            this.maxMp += 4;
            this.mp = this.maxMp;
            console.log("You are now lv." + this.level + "!!!")
        }
    }

    this.gainXp = function (opponent) {
        this.xp += opponent.xp;
        console.log("You gained " + opponent.xp + " XP");
        console.log("Total XP: " + this.xp);
    }

};

function CreateMonster(name, strength, hp, mp, xp) {

    this.name = name
    this.strength = strength;
    this.maxHp = 10;
    this.hp = 10;
    this.maxMp = 10;
    this.mp = 10;
    this.xp = xp;
    this.inventory = [];
    this.gold = 0
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("Strength: " + this.strength + ", Hp: " + this.hp + "/" + this.maxHp + ", MP: " + this.mp + "/" + this.maxMp);
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

// create monsters
var currentEnemy = {};
var goblin = new CreateMonster("Goblin", 2, 10, 0, 10);

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

            // testing area
            currentEnemy = goblin
            player.checkStats();

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
                    player.attack(currentEnemy);
                    if (currentEnemy.hp <= 0) {
                        console.log("You killed " + currentEnemy.name);
                        player.gainXp(currentEnemy);
                        player.levelUp();
                        console.log("--------\n")

                        currentEnemy = goblin;
                        fight();

                    } else {
                        currentEnemy.attack(player);
                        console.log("--------\n")

                        if (player.hp <= 0) {

                            console.log(currentEnemy.name + "Has Killed you");
                            console.log(" -- Game Over -- ");
                            console.log("--------\n")
                        } else {
                            fight();
                        }

                    }
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