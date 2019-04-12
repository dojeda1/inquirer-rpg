var inquirer = require("inquirer");

function nameStructure(roughName) {
    var newName = roughName.trim();
    newName = newName.charAt(0).toUpperCase() + newName.slice(1);
    return newName;
}

function randNum(x, y) {
    return Math.floor(Math.random() * y) + x
}

function dropGold() {
    var amount = randNum(0, currentEnemy.gold);
    player.gold += amount;
    console.log(currentEnemy.name + " dropped " + amount + " gold.")
}

function runGoldLoss() {
    var amount = randNum(0, Math.floor(player.gold / 2));
    player.gold -= amount;
    console.log("You lost " + amount + " gold.")
}

dropGold
// character creators
function CreateCharacter(name, race, profession) {
    // nameStructure(name)
    this.name = "Thomas"
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
    this.inventory = ["potion", "hat"];
    this.gold = 0;
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("Hp: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp + "  |  Strength: " + this.strength);
        console.log("XP: " + this.xp + " | to next level: " + (this.nextLevel - this.xp));
        console.log("Gold: " + this.gold);
        console.log(" -- Inventory -- ");
        console.log(this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log("You attacked " + opponent.name + " for " + this.strength + " damage.")
        console.log(opponent.name + " has " + opponent.hp + " HP left.")
    }

    this.levelUp = function () {
        if (this.xp >= this.nextLevel) {
            this.level++;
            this.nextLevel = ((this.nextLevel * 2) + (this.level * 10));
            this.strength += 2;
            this.maxHp += 5;
            this.hp = this.maxHp;
            this.maxMp += 4;
            this.mp = this.maxMp;
            console.log("\nYou are now lv." + this.level + "!!!")
        }
    }

    this.gainXp = function (opponent) {
        this.xp += opponent.xp;
        console.log("You gained " + opponent.xp + " XP.");
        console.log("Total XP: " + this.xp);
    }

};

function CreateMonster(name, strength, maxHp, maxMp, xp, gold) {

    this.name = name
    this.strength = strength;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.maxMp = maxMp;
    this.mp = maxMp;
    this.xp = xp;
    this.inventory = [];
    this.gold = gold;
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("Hp: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp + "  |  Strength: " + this.strength);
        console.log("XP: " + this.xp);
        console.log(" -- Inventory -- ");
        console.log(this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        opponent.hp -= this.strength;
        console.log(this.name + " attacked you for " + this.strength + " damage.")
        console.log("You have " + opponent.hp + " HP left.")


    }

};

// create monsters
var currentEnemy = {};
monsters = []
//                            name, strength, maxHp, maxMp, xp, gold
var slime = new CreateMonster("Slime", 2, 10, 0, 10, 10);
monsters.push(slime);
var goblin = new CreateMonster("Goblin", 5, 15, 0, 15, 15);
monsters.push(goblin);
var orc = new CreateMonster("Orc", 8, 20, 0, 20, 20);
monsters.push(orc);

// console.log(monsters)
console.log("Monster: " + monsters.length)

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
            player.checkStats();
            whereTo();
        });
}

function whereTo() {
    inquirer.prompt({
            type: "list",
            message: "Where to next?",
            name: "action",
            choices: ["Next battle", "Go to town", "Check stats", "Quit"]
        })
        .then(function (choice) {
            switch (choice.action) {

                case "Next battle":
                    monsterEncounter();
                    break;

                case "Go to town":
                    console.log("\nYou went to town.\n")
                    goToTown();
                    break;

                case "Check stats":
                    player.checkStats();
                    whereTo();
                    break;

                case "Quit":
                    console.log("Good bye " + player.name + ".");
                    break;
            }
        })
}

function monsterEncounter() {
    var monNum = randNum(0, player.level)
    currentEnemy = monsters[monNum];

    console.log("\nYou encountered a " + currentEnemy.name + ".\n")

    fight();

}

function fight() {
    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Attack", "Use item", "Check stats", "Run"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Attack":
                    console.log("\n--------")
                    player.attack(currentEnemy);
                    if (currentEnemy.hp <= 0) {
                        console.log("You killed " + currentEnemy.name + ".\n");
                        dropGold();
                        player.gainXp(currentEnemy);
                        player.levelUp();
                        currentEnemy.hp = currentEnemy.maxHp;
                        currentEnemy.mp = currentEnemy.maxMp;
                        console.log("--------\n");

                        whereTo();

                    } else {
                        currentEnemy.attack(player);
                        console.log("--------\n")

                        if (player.hp <= 0) {

                            console.log(currentEnemy.name + " has Killed you.");
                            console.log(" -- GAME OVER -- ");
                            console.log("--------\n")
                        } else {
                            fight();
                        }

                    }
                    break;

                case "Use item":
                    console.log("You used an Item.")
                    fight();
                    break;

                case "Check stats":
                    player.checkStats();
                    fight();
                    break;

                case "Run":

                    console.log("\n--------")
                    console.log("You Ran Away.")
                    runGoldLoss();
                    console.log("--------\n")
                    whereTo();

                    break;
            }
        })
}

function goToTown() {
    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Stay at Inn", "Go to shop", "Check stats", "Leave town"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Stay at Inn":
                    stayAtInn();
                    break;

                case "Go to shop":
                    dogMode();
                    break;

                case "Check stats":
                    player.checkStats();
                    goToTown();
                    break;

                case "Leave town":
                    whereTo();
                    break;
            };
        })
}

gameStart();

function stayAtInn() {
    var cost = 10;
    console.log("Staying the night will cost " + cost + " gold.")
    inquirer.prompt({
            type: "confirm",
            name: "isStaying",
            message: "Is that okay?",
            default: true
        })
        .then(function (choice) {
            if (player.gold >= cost) {
                if (choice.isStaying === true) {
                    player.gold -= cost;
                    player.hp = player.maxHp;
                    player.mp = player.maxMp;
                    console.log("\nYou feel well rested.\n")
                    goToTown();
                } else {
                    goToTown();
                }
            } else {
                console.log("\nYou cannot afford to stay here.\n")
                goToTown();

            }
        });
}