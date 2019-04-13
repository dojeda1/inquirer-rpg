var inquirer = require("inquirer");

// gameplay stage variables
var isInTown = false;
var isExploring = true;
var isFighting = false;
var isBuying = false;
var isSelling = false;
// console.log("f-" + isFighting + " E-" + isExploring + " t-" + isInTown);

function gameStateCheck() {

    if (isFighting === true) {
        fight();
    } else if (isExploring === true) {
        whereTo();
    } else if (isInTown === true) {
        goToTown();
    } else if (isBuying === true) {
        buy();
    } else if (isSelling === true) {
        sell();
    }
}

function nameStructure(roughName) {
    if (roughName != "") {
        var newName = roughName.trim();
        newName = newName.charAt(0).toUpperCase() + newName.slice(1);

    } else {
        var newName = "Thomas"
    }
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

function runLoss() {

    isFighting = false;
    isExploring = true;
    isInTown = false;
    isBuying = false;
    isSelling = false;
    // console.log("f-" + isFighting + " E-" + isExploring + " t-" + isInTown);

    var amount = randNum(0, Math.floor(player.gold / 2));
    player.gold -= amount;
    console.log("You lost " + amount + " gold.")

    var loseHealth = randNum(0, 3)
    player.hp -= loseHealth
    console.log("You lost " + loseHealth + " HP.")



}

var shopInventory = ["< Go back", "Health Potion", "Mana Potion", "Old Hat"];

// character creators
function CreateCharacter(name, race, profession) {

    this.name = nameStructure(name)
    this.race = race;
    this.profession = profession;
    this.strength = 4;
    this.defense = 4;
    this.luck = 4;
    this.speed = 4;
    this.maxHp = 4;
    this.hp = 4;
    this.maxMp = 4;
    this.mp = 4;
    this.level = 1;
    this.xp = 0;
    this.nextLevel = 40;
    this.inventory = ["< Go back", "Health Potion", "Mana Potion", "Old hat"];
    this.gold = 0;
    this.killCount = 0;
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("HP: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp);
        console.log("ATK: " + this.strength + "  |  DEF: " + this.defense + "  |  SPD: " + this.speed + "  |  LUCK: " + this.luck);
        console.log("XP: " + this.xp + " | to next level: " + (this.nextLevel - this.xp));
        console.log("Gold: " + this.gold);
        console.log(" -- Inventory -- ");
        console.log(this.inventory.slice(1));
        console.log("\n");
    }

    this.attack = function (opponent) {

        var luckCheck = opponent.speed - this.luck
        var criticalCheck = randNum(1, luckCheck)
        if (criticalCheck != 1) {
            opponent.hp -= this.strength;
            console.log("You attacked " + opponent.name + " for " + this.strength + " damage.")
            console.log(opponent.name + " has " + opponent.hp + " HP left.")
        } else {
            var newStrength = this.strength + Math.floor(this.strength / 2);
            opponent.hp -= newStrength;
            console.log("Critical hit for " + newStrength + " damage!!!")
            console.log(opponent.name + " has " + opponent.hp + " HP left.")
        }
    }

    this.levelUp = function () {
        if (this.xp >= this.nextLevel) {
            this.level++;
            this.nextLevel += this.level * 30;
            this.strength += 2;
            this.defense += 1;
            this.speed += 1;
            this.luck += 1;
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

function CreateMonster(name, strength, speed, maxHp, maxMp, xp, gold, invArr) {

    this.name = name
    this.strength = strength;
    this.speed = speed;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.maxMp = maxMp;
    this.mp = maxMp;
    this.xp = xp;
    this.inventory = invArr;
    this.gold = gold;
    this.isDead = false;

    this.checkStats = function () {

        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("HP: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp + "  |  Strength: " + this.strength);
        console.log("XP: " + this.xp);
        console.log(" -- Inventory -- ");
        console.log(this.inventory);
        console.log("\n");
    }

    this.attack = function (opponent) {
        var SpeedNum = this.speed - player.speed
        var missCheck = randNum(1, SpeedNum)

        if (missCheck != 1) {

            var newStrength = this.strength - Math.floor(player.defense / 4)

            opponent.hp -= newStrength;

            console.log(this.name + " attacked you for " + newStrength + " damage.")
            console.log("You have " + opponent.hp + " HP left.")
        } else {
            console.log(this.name + " missed!")
        }

    }

};

// create monsters
var currentEnemy = {};
monsters = []
//                            name, strength, speed, maxHp, maxMp, xp, gold, invArr
var slime = new CreateMonster("Slime", 3, 10, 10, 0, 10, 10, ["Health Potion"]);
monsters.push(slime);
var wolf = new CreateMonster("Wolf", 5, 15, 12, 0, 12, 12, ["Health Potion"]);
monsters.push(wolf);
var goblin = new CreateMonster("Goblin", 6, 12, 15, 0, 15, 15, ["Health Potion"]);
monsters.push(goblin);
var orc = new CreateMonster("Orc", 8, 18, 20, 0, 20, 20, ["Health Potion"]);
monsters.push(orc);
var ogre = new CreateMonster("Ogre", 10, 12, 25, 0, 25, 25, ["Health Potion"]);
monsters.push(ogre);
var giant = new CreateMonster("Giant", 15, 10, 30, 10, 30, 30, ["Health Potion"]);
monsters.push(giant);
var demon = new CreateMonster("Demon", 15, 20, 35, 10, 35, 35, ["Health Potion"]);
monsters.push(demon);
var dragon = new CreateMonster("Dragon", 16, 18, 40, 10, 40, 40, ["Health Potion"]);
monsters.push(dragon);

// console.log("Monsters Available: " + monsters.length)

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
            switch (player.race) {

                case "Human":
                    player.maxHp += 4
                    player.hp += 4
                    player.maxMp += 4
                    player.mp += 4
                    player.strength += 1
                    player.defense += 1
                    player.speed += 1
                    player.luck += 0
                    break;

                case "Elf":
                    player.maxHp += 4
                    player.hp += 4
                    player.maxMp += 6
                    player.mp += 6
                    player.strength += 0
                    player.defense += 0
                    player.speed += 1
                    player.luck += 1
                    break;

                case "Dwarf":
                    player.maxHp += 6
                    player.hp += 6
                    player.maxMp += 2
                    player.mp += 2
                    player.strength += 2
                    player.defense += 1
                    player.speed += 0
                    player.luck += 0
                    break;

            }

            switch (player.profession) {

                case "Warrior":
                    player.maxHp += 4
                    player.hp += 4
                    player.maxMp += 0
                    player.mp += 0
                    player.strength += 2
                    player.defense += 2
                    player.speed += 0
                    player.luck += 0

                    player.special = {
                        name: "Fireball",
                        mpCost: 6,

                        move: function (opponent) {
                            if (player.special.mpCost <= player.mp) {
                                player.mp -= player.special.mpCost;
                                var luckCheck = (2 + opponent.speed - player.luck)
                                var criticalCheck = randNum(1, luckCheck);
                                var magicStrength = player.strength + Math.floor(player.maxMp / 3)

                                if (criticalCheck != 1) {

                                    opponent.hp -= magicStrength;
                                    console.log("Your flames hit " + opponent.name + " for " + magicStrength + " damage.")
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.")
                                    enemyDeathCheck();
                                } else {
                                    var newStrength = magicStrength + Math.floor(magicStrength / 2);
                                    opponent.hp -= newStrength;
                                    console.log("Critical hit for " + newStrength + " damage!!!");
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.");
                                    enemyDeathCheck();
                                }
                            } else {
                                console.log("You do not have enough MP to perform this move.");
                                console.log("--------\n");
                                gameOverCheck();
                            }
                        }
                    }
                    break;

                case "Rogue":
                    player.maxHp += 0
                    player.hp += 0
                    player.maxMp += 2
                    player.mp += 2
                    player.strength += 0
                    player.defense += 0
                    player.speed += 1
                    player.luck += 2

                    player.special = {
                        name: "Fireball",
                        mpCost: 6,

                        move: function (opponent) {
                            if (player.special.mpCost <= player.mp) {
                                player.mp -= player.special.mpCost;
                                var luckCheck = (2 + opponent.speed - player.luck)
                                var criticalCheck = randNum(1, luckCheck);
                                var magicStrength = player.strength + Math.floor(player.maxMp / 3)

                                if (criticalCheck != 1) {

                                    opponent.hp -= magicStrength;
                                    console.log("Your flames hit " + opponent.name + " for " + magicStrength + " damage.")
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.")
                                    enemyDeathCheck();
                                } else {
                                    var newStrength = magicStrength + Math.floor(magicStrength / 2);
                                    opponent.hp -= newStrength;
                                    console.log("Critical hit for " + newStrength + " damage!!!");
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.");
                                    enemyDeathCheck();
                                }
                            } else {
                                console.log("You do not have enough MP to perform this move.");
                                console.log("--------\n");
                                gameOverCheck();
                            }
                        }
                    }
                    break;



                case "Mage":
                    player.maxHp += 0
                    player.hp += 0
                    player.maxMp += 4
                    player.mp += 4
                    player.strength += 0
                    player.defense += 0
                    player.speed += 0
                    player.luck += 1

                    player.special = {
                        name: "Fireball",
                        mpCost: 6,

                        move: function (opponent) {
                            if (player.special.mpCost <= player.mp) {
                                player.mp -= player.special.mpCost;
                                var luckCheck = (2 + opponent.speed - player.luck)
                                var criticalCheck = randNum(1, luckCheck);
                                var magicStrength = player.strength + Math.floor(player.maxMp / 3)

                                if (criticalCheck != 1) {

                                    opponent.hp -= magicStrength;
                                    console.log("Your flames hit " + opponent.name + " for " + magicStrength + " damage.")
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.")
                                    enemyDeathCheck();
                                } else {
                                    var newStrength = magicStrength + Math.floor(magicStrength / 2);
                                    opponent.hp -= newStrength;
                                    console.log("Critical hit for " + newStrength + " damage!!!");
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.");
                                    enemyDeathCheck();
                                }
                            } else {
                                console.log("You do not have enough MP to perform this move.");
                                console.log("--------\n");
                                gameOverCheck();
                            }
                        }
                    }

            }

            // testing area
            player.checkStats();

            whereTo();

        });
}

function whereTo() {

    isFighting = false;
    isExploring = true;
    isInTown = false;
    isBuying = false;
    isSelling = false;
    // console.log("f-" + isFighting + " E-" + isExploring + " t-" + isInTown);

    inquirer.prompt({
            type: "list",
            message: "Where to next?",
            name: "action",
            choices: ["Next battle", "Go to town", "Use item", "Check stats", "Quit"]
        })
        .then(function (choice) {
            switch (choice.action) {

                case "Next battle":
                    monsterEncounter();
                    break;

                case "Go to town":

                    var safeTripCheck = randNum(1, player.luck)
                    if (safeTripCheck != 1) {
                        console.log("\nYou got to town safely.\n")
                        goToTown();
                    } else {
                        console.log("\nYou have been ambushed!");
                        monsterEncounter();
                    }

                    break;

                case "Use item":
                    useItem();
                    break;

                case "Check stats":
                    player.checkStats();
                    whereTo();
                    break;

                case "Quit":
                    quit();
                    break;
            }
        })
}


function monsterEncounter() {

    isFighting = true;
    isExploring = false;
    isInTown = false;
    isBuying = false;
    isSelling = false;
    // console.log("F-" + isFighting + " e-" + isExploring + " t-" + isInTown);

    var floorNum = 0;
    var rangeNum = 0;

    if (player.level >= 5) {
        floorNum = player.level - 5;
        rangeNum = 5
    } else {
        floorNum = 0;
        rangeNum = player.level;
    }
    var monNum = randNum(floorNum, rangeNum)
    currentEnemy = monsters[monNum];
    var firstLetter = currentEnemy.name.charAt(0);
    var anA = "a";
    if (firstLetter === "A" || firstLetter === "E" || firstLetter === "I" || firstLetter === "O" || firstLetter === "U") {
        anA = "an";
    } else {
        anA = "a";
    }

    console.log("\nYou encountered " + anA + " " + currentEnemy.name + ".")
    console.log("HP: " + currentEnemy.hp + "/" + currentEnemy.maxHp + "  |  MP: " + currentEnemy.mp + "/" + currentEnemy.maxMp + "  |  Strength: " + currentEnemy.strength + "\n");

    fight();

}

function fight() {
    inquirer.prompt({
            type: "list",
            message: "Next move?",
            name: "action",
            choices: ["Attack", player.special.name, "Use item", "Check stats", "Run"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Attack":
                    console.log("\n--------")
                    player.attack(currentEnemy);
                    enemyDeathCheck();
                    break;

                case player.special.name:
                    console.log("\n--------")
                    player.special.move(currentEnemy);
                    break;

                case "Use item":

                    useItem();

                    break;

                case "Check stats":
                    player.checkStats();
                    fight();
                    break;

                case "Run":

                    console.log("\n--------")
                    console.log("You Ran Away.")
                    runLoss();
                    console.log("--------\n")
                    gameOverCheck();

                    break;
            }
        })
}

function enemyDeathCheck() {
    if (currentEnemy.hp <= 0) {
        console.log("You killed " + currentEnemy.name + ".\n");
        player.killCount++;
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

        gameOverCheck();

    }
}

function goToTown() {

    isFighting = false;
    isExploring = false;
    isInTown = true;
    isBuying = false;
    isSelling = false;
    // console.log("f-" + isFighting + " e-" + isExploring + " T-" + isInTown);

    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Stay at Inn", "Go to shop", "Use item", "Check stats", "Leave town"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Stay at Inn":
                    stayAtInn();
                    break;

                case "Go to shop":
                    shop();
                    break;

                case "Use item":
                    useItem();
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



function stayAtInn() {
    var cost = 10 + (player.level - 1) * 2;
    console.log("Staying the night will cost " + cost + " gold.")
    inquirer.prompt({
            type: "confirm",
            name: "isStaying",
            message: "Is that okay?",
            default: true
        })
        .then(function (choice) {
            if (choice.isStaying === true) {
                if (player.gold >= cost) {
                    player.gold -= cost;
                    player.hp = player.maxHp;
                    player.mp = player.maxMp;
                    console.log("\nYou feel well rested.\n")
                    goToTown();
                } else {
                    console.log("\nYou cannot afford to stay here.\n")
                    goToTown();
                }
            } else {
                console.log("\nYou left.\n")
                goToTown();

            }
        });
}

function shop() {
    inquirer.prompt({
            type: "list",
            message: "What do you want to do?",
            name: "action",
            choices: ["Buy", "Sell", "< Go back"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Buy":
                    buy();
                    break;

                case "Sell":
                    sell();
                    break;

                case "< Go back":
                    goToTown();
                    break;


            };
        })
}

function buy() {

    isFighting = false;
    isExploring = false;
    isInTown = false;
    isBuying = true;
    isSelling = false;

    inquirer.prompt({
            type: "list",
            message: "What do you want to buy?",
            name: "action",
            choices: shopInventory
        })
        .then(function (choice) {
            switch (choice.action) {
                case "< Go back":
                    shop();;
                    break;

                case "Health Potion":
                    itemPurchase("Health Potion", 5);
                    break;

                case "Mana Potion":
                    itemPurchase("Mana Potion", 5)
                    break;

                case "Old hat":
                    itemPurchase("Old hat", 100)
                    break;


            };
        })
}

function itemPurchase(item, cost) {
    console.log(item + " costs " + cost + " gold.")
    inquirer.prompt({
            type: "confirm",
            name: "isBuying",
            message: "Is that okay?",
            default: true
        })
        .then(function (choice) {
            if (choice.isBuying === true) {
                if (player.gold >= cost) {
                    player.gold -= cost;
                    player.inventory.push(item);
                    console.log("\nYou purchased a " + item + ".\n")
                    gameStateCheck();

                } else {
                    console.log("\nYou cannot afford this item.\n")
                    gameStateCheck();

                }
            } else {
                console.log("\nYou decided against it.\n")
                gameStateCheck();

            }
        });
}

function sell() {

    isFighting = false;
    isExploring = false;
    isInTown = false;
    isBuying = false;
    isSelling = true;

    inquirer.prompt({
            type: "list",
            message: "What do you want to sell?",
            name: "action",
            choices: player.inventory
        })
        .then(function (choice) {
            switch (choice.action) {
                case "< Go back":
                    shop();;
                    break;

                case "Health Potion":
                    itemSell("Health Potion", 3);
                    break;

                case "Mana Potion":
                    itemSell("Mana Potion", 3)
                    break;

                case "Old hat":
                    itemSell("Old hat", 100)
                    break;


            };
        })

}

function itemSell(item, cost) {
    console.log(item + " sells for " + cost + " gold.")
    inquirer.prompt({
            type: "confirm",
            name: "isSelling",
            message: "Is that okay?",
            default: true
        })
        .then(function (choice) {
            if (choice.isSelling === true) {

                player.gold += cost;
                removeItem(item, player.inventory);
                console.log("\nYou sold a " + item + ".\n")
                gameStateCheck();


            } else {
                console.log("\nYou decided against it.\n")
                gameStateCheck();

            }
        });
}

function useItem() {
    inquirer.prompt({
            type: "list",
            message: "What do you want to use?",
            name: "action",
            choices: player.inventory
        })
        .then(function (choice) {
            switch (choice.action) {

                case "< Go back":

                    gameStateCheck();

                    break;

                case "Health Potion":

                    if (player.hp < player.maxHp) {
                        player.hp += 10
                        if (player.hp > player.maxHp) {
                            player.hp = player.maxHp;
                        }

                        console.log("\n--------");
                        console.log("You recovered " + 10 + " HP")
                        removeItem("Health Potion", player.inventory);

                        if (isFighting === true) {
                            currentEnemy.attack(player);
                        }
                        console.log("--------\n");
                        gameStateCheck();
                    } else {
                        console.log("\nYou are already at full Health.\n")
                        gameStateCheck();
                    }

                    break;

                case "Mana Potion":

                    if (player.mp < player.maxMp) {
                        player.mp += 10
                        if (player.mp > player.maxMp) {
                            player.mp = player.maxMp;
                        }
                        console.log("\n--------");
                        console.log("You recovered " + 8 + " MP")
                        removeItem("Mana Potion", player.inventory);

                        if (isFighting === true) {
                            currentEnemy.attack(player);
                        }
                        console.log("--------\n");
                        gameStateCheck();
                    } else {
                        console.log("\nYou are already at full Mana.\n")
                        gameStateCheck();
                    }

                    break;

                case "Hat":
                    console.log("--------\n");
                    console.log("It looks good on you...")
                    console.log("--------\n");

                    gameStateCheck();

                    break;

            };
        })
}


function removeItem(item, array) {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
    // console.log(array);
}

function gameOverCheck() {
    if (player.hp <= 0) {

        console.log("\n--------")
        console.log(currentEnemy.name + " has Killed you.\n");
        console.log(player.name + " reached lv." + player.level);
        console.log("and killed " + player.killCount + " monsters.\n")
        console.log(" -- GAME OVER -- ");
        console.log("--------\n")
    } else if (isFighting === true) {
        fight();
    } else if (isExploring === true) {
        whereTo();
    }
}

function quit() {
    inquirer.prompt({
            type: "confirm",
            name: "isQuiting",
            message: "Are you sure you want to quit?",
            default: true
        })
        .then(function (choice) {
            if (choice.isQuiting === true) {
                console.log("Good bye " + player.name + ".");
            } else {
                console.log("\nYou continued playing.\n")
                gameStateCheck();

            }
        });
}

gameStart();