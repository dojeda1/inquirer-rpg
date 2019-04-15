console.log("888888888888888888888888888888888888888888888888888888888")
console.log("888888888888888888888888888888888888888888888888888888888")
console.log("8888888888        888888        888888        88888888888")
console.log("8888888888  88888  88888  88888  8888  888888888888888888")
console.log("8888888888        888888        88888  8888    8888888888")
console.log("8888888888  8   88888888  88888888888  888888  8888888888")
console.log("8888888888  888   888888  888888888888        88888888888")
console.log("888888888888888888888888888888888888888888888888888888888")
console.log("888888888888888888888888888888888888888888888888888888888")

// cheat checks
var arg1 = process.argv[2]
var arg2 = process.argv[3]
var arg3 = process.argv[4]

var inquirer = require("inquirer");
var CreateCharacter = require("./character.js");
var CreateMonster = require("./monster.js");
var CreateItem = require("./items.js")

// gameplay stage variables
var isInTown = false;
var isExploring = true;
var isFighting = false;
var isBuying = false;
var isSelling = false;
var isInDungeon = false;

var wasAmbushed = false;

var monsters = [];
var itemsCommon = [];
var itemsUncommon = [];
var itemsRare = [];
var shopInventory = [];
var chestInventory = [];

function aOrAn(word) {

    var firstLetter = word.charAt(0);
    var anA = "";
    if (firstLetter === "A" || firstLetter === "E" || firstLetter === "I" || firstLetter === "O" || firstLetter === "U") {
        anA = "an";
        return anA
    } else {
        anA = "a";
        return anA
    }
}

function gameStateCheck() {

    if (isFighting === true && isExploring === true) {
        fight();
    } else if (isExploring === true) {
        whereTo();
    } else if (isInTown === true && isBuying === false && isSelling === false) {
        goToTown();
    } else if (isBuying === true) {
        buy();
    } else if (isSelling === true) {
        sell();
    } else if (isFighting === true && isInDungeon === true) {
        fightDungeon();
    } else if (isInDungeon === true) {
        whereToDungeon();
    }
}

function changeState(fighting, exploring, inTown, buying, selling, dungeon) {
    isFighting = fighting;
    isExploring = exploring;
    isInTown = inTown;
    isBuying = buying;
    isSelling = selling;
    isInDungeon = dungeon;
}

function randNum(x, y) {
    return Math.floor(Math.random() * y) + x
}

function printBox(text) {
    console.log("\n--------")
    console.log(text)
    console.log("--------")
}

function dropGold() {
    var amount = randNum(0, currentEnemy.gold);
    player.gold += amount;
    player.goldCount += amount;
    console.log(currentEnemy.name + " dropped " + amount + " gold.")
}

function dropLoot() {
    var lootCheck = randNum(1, 5);
    if (lootCheck === 1) {
        if (currentEnemy.inventory.length > 0) {
            var itemNum = randNum(0, currentEnemy.inventory.length);
            var item = currentEnemy.inventory[itemNum];
            removeItem(item, currentEnemy.inventory);
            player.inventory.push(item);
            var anA = aOrAn(item);
            console.log(currentEnemy.name + " dropped " + anA + " " + item + ".")
        }
    }
}

function mimicDrop() {

    for (i = 0; i < 3; i++) {

        if (currentEnemy.inventory.length > 0) {
            var itemNum = randNum(0, currentEnemy.inventory.length);
            var item = currentEnemy.inventory[itemNum];
            player.inventory.push(item);
            removeItem(item, currentEnemy.inventory);

            var anA = aOrAn(item);
            console.log(currentEnemy.name + " dropped " + anA + " " + item + ".")
            currentEnemy.name
        }
    }
}

function runLoss() {

    changeState(false, true, false, false, false, false);

    var amount = randNum(0, Math.floor(player.gold / 2));
    player.gold -= amount;
    console.log("You lost " + amount + " gold.")

    var loseHealth = randNum(0, 3)
    player.hp -= loseHealth
    console.log("You lost " + loseHealth + " HP.")



}



// create itemsCommon
//                         name, buyCost, sellCost, effectNum
var hPot = new CreateItem("Health Potion", 10, 5, 10)
hPot.effect = function (user) {

    if (user.hp < user.maxHp) {
        user.hp += Math.floor(user.maxHp * .5)
        if (user.hp > user.maxHp) {
            user.hp = user.maxHp;
        }

        console.log("\n--------");
        if (user.name === player.name) {
            console.log("You recovered " + Math.floor(user.maxHp * .5) + " HP")
        } else {
            console.log(user.name + " recovered " + Math.floor(user.maxHp * .5) + " HP")
        }

        removeItem(hPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(user);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Health.")
        gameStateCheck();
    }
};
itemsCommon.push(hPot);

var megaHPot = new CreateItem("Mega Health Potion", 25, 15, 20)
megaHPot.effect = function (user) {

    if (user.hp < user.maxHp) {
        user.hp += Math.floor(user.maxHp * .75)
        if (user.hp > user.maxHp) {
            user.hp = user.maxHp;
        }

        console.log("\n--------");
        if (user.name === player.name) {
            console.log("You recovered " + Math.floor(user.maxHp * .75) + " HP")
        } else {
            console.log(user.name + " recovered " + Math.floor(user.maxHp * .75) + " HP")
        }

        removeItem(megaHPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(user);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Health.")
        gameStateCheck();
    }
};
itemsCommon.push(megaHPot);

var maxHPot = new CreateItem("Max Health Potion", 40, 25, 20)
maxHPot.effect = function (user) {

    if (user.hp < user.maxHp) {
        user.hp += user.maxHp
        if (user.hp > user.maxHp) {
            user.hp = user.maxHp;
        }

        console.log("\n--------");
        if (user.name === player.name) {
            console.log("You recovered " + user.maxHp + " HP")
        } else {
            console.log(user.name + " recovered " + user.maxHp + " HP")
        }

        removeItem(maxHPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(user);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Health.")
        gameStateCheck();
    }
};
itemsUncommon.push(maxHPot);

var mPot = new CreateItem("Mana Potion", 10, 5, 8)
mPot.effect = function (user) {

    if (user.mp < user.maxMp) {
        user.mp += Math.floor(user.maxMp * .5)
        if (user.mp > user.maxMp) {
            user.mp = user.maxMp;
        }
        console.log("\n--------");
        if (user.name === user.name) {
            console.log("You recovered " + Math.floor(user.maxMp * .5) + " MP")
        } else {
            console.log(user.name + " recovered " + Math.floor(user.maxMp * .5) + " MP")
        }

        removeItem(mPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(player);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Mana.")
        gameStateCheck();
    }
}
itemsCommon.push(mPot);

var megaMPot = new CreateItem("Mega Mana Potion", 25, 15, 8)
megaMPot.effect = function (user) {

    if (user.mp < user.maxMp) {
        user.mp += Math.floor(user.maxMp * .75)
        if (user.mp > user.maxMp) {
            user.mp = user.maxMp;
        }
        console.log("\n--------");
        if (user.name === user.name) {
            console.log("You recovered " + Math.floor(user.maxMp * .75) + " MP")
        } else {
            console.log(user.name + " recovered " + Math.floor(user.maxMp * .75) + " MP")
        }

        removeItem(megaMPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(player);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Mana.")
        gameStateCheck();
    }
}
itemsCommon.push(megaMPot);

var maxMPot = new CreateItem("Max Mana Potion", 40, 25, 8)
maxMPot.effect = function (user) {

    if (user.mp < user.maxMp) {
        user.mp += user.maxMp
        if (user.mp > user.maxMp) {
            user.mp = user.maxMp;
        }
        console.log("\n--------");
        if (user.name === user.name) {
            console.log("You recovered " + user.maxMp + " MP")
        } else {
            console.log(user.name + " recovered " + user.maxMp + " MP")
        }

        removeItem(maxMPot.name, user.inventory);

        if (isFighting === true && user.name === player.name) {
            currentEnemy.attack(player);
        }
        console.log("--------");
        gameStateCheck();
    } else {
        printBox("You are already at full Mana.")
        gameStateCheck();
    }
}
itemsUncommon.push(maxMPot);

var oldHat = new CreateItem("Old Hat", 100, 100, 0);
oldHat.effect = function () {
    printBox("It looks good on you...")
    gameStateCheck();
}
itemsRare.push(oldHat);

// create monsters
var currentEnemy = new CreateMonster("", 0, 0, 0, 0, 0, 0, []);

//                            name, maxHp, maxMp, strength, speed, xp, gold, invArr
var slime = new CreateMonster("Slime", 10, 0, 3, 12, 10, 10, [mPot.name]);
monsters.push(slime);
var wolf = new CreateMonster("Wolf", 12, 0, 6, 15, 12, 12, [mPot.name]);
monsters.push(wolf);
var goblin = new CreateMonster("Goblin", 15, 0, 9, 16, 15, 15, [hPot.name, oldHat.name]);
monsters.push(goblin);
var orc = new CreateMonster("Orc", 20, 0, 10, 20, 20, 20, [hPot.name]);
monsters.push(orc);
var ogre = new CreateMonster("Ogre", 25, 0, 15, 15, 25, 25, [megaHPot.name]);
monsters.push(ogre);
var giant = new CreateMonster("Giant", 30, 10, 20, 12, 30, 30, [megaHPot.name]);
monsters.push(giant);
var demon = new CreateMonster("Demon", 35, 10, 25, 25, 35, 35, [hPot.name]);
monsters.push(demon);
var dragon = new CreateMonster("Dragon", 50, 10, 30, 20, 40, 40, [hPot.name, oldHat.name]);
monsters.push(dragon);

// console.log("Monsters Available: " + monsters.length)
// console.log(monsters)

function gameStart() {
    console.log("\n")
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
                        name: "Axe Strike *",
                        mpCost: 6,

                        move: function (opponent) {
                            if (player.special.mpCost <= player.mp) {
                                player.mp -= player.special.mpCost;
                                var luckCheck = (2 + opponent.speed - player.luck)
                                var criticalCheck = randNum(1, luckCheck);
                                var magicStrength = player.strength + Math.floor(player.maxMp / 3)

                                if (criticalCheck != 1) {

                                    opponent.hp -= magicStrength;
                                    console.log("Your axe hit " + opponent.name + " for " + magicStrength + " damage.")
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.\n")
                                    enemyDeathCheck();
                                } else {
                                    var newStrength = magicStrength + Math.floor(magicStrength / 2);
                                    opponent.hp -= newStrength;
                                    console.log("Critical hit for " + newStrength + " damage!!!");
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.\n");
                                    enemyDeathCheck();
                                }
                            } else {
                                console.log("You do not have enough MP to perform this move.");
                                console.log("--------\n");
                                gameOverCheck();
                            }
                        }
                    }

                    player.special2 = {
                        name: "Berserk *",
                        mpCost: 8,

                        move: function () {

                            if (player.isBerserk === false) {

                                if (player.special2.mpCost <= player.mp) {

                                    player.isBerserk = true
                                    player.berserkCount = 0
                                    player.berserkAtkHold = player.strength;

                                    player.mp -= player.special2.mpCost;

                                    var luckCheck = (20 - player.luck)
                                    var criticalCheck = randNum(1, luckCheck);

                                    if (criticalCheck === 1) {

                                        player.strength = player.strength * 2;

                                        console.log("Your strength temporarily doubled!")
                                        enemyDeathCheck();
                                    } else {
                                        player.strength = Math.floor(player.strength * 1.5);
                                        console.log("Your strength temporarily increased.")
                                        enemyDeathCheck();
                                    }
                                } else {
                                    console.log("You do not have enough MP to perform this move.");
                                    console.log("--------");
                                    gameOverCheck();
                                }
                            } else {
                                console.log("You are already Berserk.");
                                console.log("--------");
                                gameOverCheck()
                            }
                        }
                    }
                    break;

                case "Rogue":
                    player.maxHp += 2
                    player.hp += 2
                    player.maxMp += 2
                    player.mp += 2
                    player.strength += 1
                    player.defense += 0
                    player.speed += 2
                    player.luck += 2

                    player.special = {
                        name: "Dagger Slash *",
                        mpCost: 6,

                        move: function (opponent) {
                            if (player.special.mpCost <= player.mp) {
                                player.mp -= player.special.mpCost;
                                var luckCheck = (2 + opponent.speed - player.luck)
                                var criticalCheck = randNum(1, luckCheck);
                                var magicStrength = player.strength + Math.floor(player.maxMp / 3)

                                if (criticalCheck != 1) {

                                    opponent.hp -= magicStrength;
                                    console.log("Your dagger hit " + opponent.name + " for " + magicStrength + " damage.")
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.\n")
                                    enemyDeathCheck();
                                } else {
                                    var newStrength = magicStrength + Math.floor(magicStrength / 2);
                                    opponent.hp -= newStrength;
                                    console.log("Critical hit for " + newStrength + " damage!!!");
                                    console.log(opponent.name + " has " + opponent.hp + " HP left.\n");
                                    enemyDeathCheck();
                                }
                            } else {
                                console.log("You do not have enough MP to perform this move.");
                                console.log("--------\n");
                                gameOverCheck();
                            }
                        }
                    }

                    player.special2 = {
                        name: "Steal *",
                        mpCost: 5,

                        move: function (opponent) {
                            if (currentEnemy.inventory.length != 0) {
                                if (player.special2.mpCost <= player.mp) {
                                    player.mp -= player.special2.mpCost;
                                    var luckCheck = (opponent.speed - player.luck)
                                    var stealCheck = randNum(1, luckCheck);

                                    if (stealCheck <= 8) {

                                        var monsterIndex = randNum(0, currentEnemy.inventory.length);
                                        var stealItem = currentEnemy.inventory[monsterIndex];

                                        var anA = aOrAn(stealItem);
                                        removeItem(stealItem, currentEnemy.inventory);
                                        player.inventory.push(stealItem);
                                        console.log("You stole " + anA + " " + stealItem + "!\n")

                                        enemyDeathCheck();
                                    } else {
                                        console.log("You failed to steal anything...")
                                        enemyDeathCheck();
                                    }
                                } else {
                                    console.log("You do not have enough MP to perform this move.");
                                    console.log("--------");
                                    gameOverCheck();
                                }
                            } else {
                                console.log("There is nothing left to steal.");
                                console.log("--------");
                                gameOverCheck();
                            }
                        }
                    }
                    break;



                case "Mage":
                    player.maxHp += 2
                    player.hp += 2
                    player.maxMp += 4
                    player.mp += 4
                    player.strength += 0
                    player.defense += 0
                    player.speed += 0
                    player.luck += 1

                    player.special = {
                        name: "Fireball *",
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

                    player.special2 = {
                        name: "Heal *",
                        mpCost: 10,

                        move: function () {

                            if (player.hp < player.maxHp) {
                                if (player.special2.mpCost <= player.mp) {
                                    player.mp -= player.special2.mpCost;
                                    var luckCheck = (20 - player.luck)
                                    var criticalCheck = randNum(1, luckCheck);
                                    var magicStrength = player.maxHp

                                    if (criticalCheck != 1) {
                                        player.hp += Math.floor(magicStrength * .75);
                                        if (player.hp > player.maxHp) {
                                            player.hp = player.maxHp;
                                        }
                                        console.log("Your recovered " + magicStrength + " HP.")
                                        enemyDeathCheck();
                                    } else {
                                        player.hp += magicStrength;
                                        if (player.hp > player.maxHp) {
                                            player.hp = player.maxHp;
                                        }
                                        console.log("Your recovered full health!")
                                        enemyDeathCheck();
                                    }
                                } else {
                                    console.log("You do not have enough MP to perform this move.");
                                    console.log("--------\n");
                                    gameOverCheck();
                                }
                            } else {
                                printBox("You are already at full Health.")
                                gameStateCheck();
                            }

                        }
                    }

            }

            // add cheats
            if (arg1 === "bigHealth" || arg2 === "bigHealth" || arg3 === "bigHealth") {
                player.maxHp += 100;
                player.hp += 100;
                console.log("\nbigHealth activated.")
            }

            if (arg1 === "bigMana" || arg2 === "bigMana" || arg3 === "bigMana") {
                player.maxMp += 100;
                player.mp += 100;
                console.log("\nbigMana activated.")
            }

            if (arg1 === "bigMoney" || arg2 === "bigMoney" || arg3 === "bigMoney") {
                player.gold += 250;
                console.log("\nbigMoney activated.")
            }

            if (arg1 === "godMode" || arg2 === "godMode" || arg3 === "godMode") {
                player.maxHp += 1000;
                player.hp += 1000;
                player.maxMp += 1000;
                player.mp += 1000;
                player.maxGold += 1000;

                console.log("\ngodMode activated.")
            }

            if (arg1 === "lv") {

                var lvNum = parseInt(arg2)
                console.log("\nlv" + lvNum + "activated.")

                for (i = 1; i < lvNum; i++) {
                    player.xp += (player.nextLevel - player.xp);
                    player.levelUp();
                }
            }

            if (arg1 === "item") {

                console.log("\nitem " + arg2 + " activated.")
                switch (arg2) {

                    case "hPot":
                        player.inventory.push(hPot.name);
                        break;

                    case "megaHPot":
                        player.inventory.push(megaHPot.name);
                        break;

                    case "maxHPot":
                        player.inventory.push(maxHPot.name);
                        break;

                    case "mPot":
                        player.inventory.push(mPot.name)
                        break;

                    case "megaMPot":
                        player.inventory.push(megaMPot.name)
                        break;

                    case "maxMPot":
                        player.inventory.push(maxMPot.name)
                        break;

                    case "oldHat":
                        player.inventory.push(oldHat.name)
                        break;
                }

            }
            player.checkStats();
            whereTo();



        });
}


function whereTo() {

    changeState(false, true, false, false, false, false);
    wasAmbushed = false;

    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "Where to next?",
            name: "action",
            choices: ["Next battle", "Go to town", "Use Item", "Check Stats", "< Quit"]
        })
        .then(function (choice) {
            switch (choice.action) {

                case "Next battle":
                    var battleCheck = randNum(1, 10)
                    if (battleCheck === 1) {
                        chestEncounter();
                    } else if (battleCheck > 4) {
                        dungeonEncounter();
                    } else {
                        monsterEncounter();
                    }
                    break;

                case "Go to town":

                    var safeTripCheck = randNum(1, player.luck)
                    if (safeTripCheck != 1) {
                        printBox("You got to town safely.")
                        goToTown();
                    } else {
                        wasAmbushed = true
                        monsterEncounter();
                    }

                    break;

                case "Use Item":
                    useItem();
                    break;

                case "Check Stats":
                    player.checkStats();
                    whereTo();
                    break;

                case "< Quit":
                    quit();
                    break;
            }
        })
}

function whereToDungeon() {

    changeState(false, false, false, false, false, true);

    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Venture Deeper", "Use Item", "Check Stats", "< Leave Dungeon"]
        })
        .then(function (choice) {
            switch (choice.action) {

                case "Venture Deeper":
                    var battleCheck = randNum(1, 10)
                    if (battleCheck === 1) {
                        chestEncounter();
                    } else {
                        monsterEncounter();
                    }
                    break;

                case "Use Item":
                    useItem();
                    break;

                case "Check Stats":
                    player.checkStats();
                    whereToDungeon();
                    break;

                case "< Leave Dungeon":
                    printBox("You left the dungeon and its loot behind.")
                    whereTo();
                    break;
            }
        })
}


function monsterEncounter() {

    isFighting = true

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
    //  name, maxHp, maxMp, strength, speed, xp, gold, invArr
    currentEnemy.name = monsters[monNum].name;
    currentEnemy.maxHp = monsters[monNum].maxHp;
    currentEnemy.hp = monsters[monNum].hp;
    currentEnemy.maxMp = monsters[monNum].maxMp;
    currentEnemy.mp = monsters[monNum].mp;
    currentEnemy.strength = monsters[monNum].strength;
    currentEnemy.xp = monsters[monNum].xp;
    currentEnemy.inventory = Array.from(monsters[monNum].inventory);
    currentEnemy.gold = monsters[monNum].gold;
    currentEnemy.isDead = monsters[monNum].isDead;

    if (isInDungeon === true) {
        for (i = 0; i < 2; i++) {
            var randItem = randNum(0, itemsUncommon.length);
            currentEnemy.inventory.push(itemsUncommon[randItem].name);
        }

        currentEnemy.name = "Vicious " + currentEnemy.name;
        currentEnemy.maxHp += 5;
        currentEnemy.hp += 5;
        currentEnemy.maxMp += 5;
        currentEnemy.mp += 5;
        currentEnemy.strength += 5;
        currentEnemy.xp += 10;
        currentEnemy.gold += 30;

    }


    var anA = aOrAn(currentEnemy.name);

    console.log("\n--------")
    if (wasAmbushed === false) {
        console.log("You encountered " + anA + " " + currentEnemy.name + ".")
    } else {
        console.log("You have been ambushed by " + anA + " " + currentEnemy.name + "!!!")
    }
    console.log("HP: " + currentEnemy.hp + "/" + currentEnemy.maxHp + "  |  MP: " + currentEnemy.mp + "/" + currentEnemy.maxMp + "  |  Strength: " + currentEnemy.strength);
    console.log("--------")
    if (isExploring === true) {
        fight();
    } else if (isInDungeon === true) {
        fightDungeon()
    }

}

function mimicEncounter() {
    fight = true;

    currentEnemy.name = "Mimic"
    currentEnemy.maxHp = (player.level * 5) + 5;
    currentEnemy.hp = (player.level * 5) + 5;
    currentEnemy.maxMp = 10;
    currentEnemy.mp = 10;
    currentEnemy.strength = player.level * 3;
    currentEnemy.xp = player.level * 5 + 5;
    currentEnemy.inventory = Array.from(chestInventory);
    currentEnemy.gold = 60;
    currentEnemy.isDead = false;


    var anA = aOrAn(currentEnemy.name);

    console.log("\n--------")
    console.log("It was a trap.")
    console.log("You were tricked by " + anA + " " + currentEnemy.name + "!")

    console.log("HP: " + currentEnemy.hp + "/" + currentEnemy.maxHp + "  |  MP: " + currentEnemy.mp + "/" + currentEnemy.maxMp + "  |  Strength: " + currentEnemy.strength);
    console.log("--------")
    fight();


}

function chestEncounter() {

    chestInventory = [];
    for (i = 0; i < 3; i++) {
        var randItem = randNum(0, itemsCommon.length);
        chestInventory.push(itemsCommon[randItem].name);

    }

    for (i = 0; i < 2; i++) {
        var randItem = randNum(0, itemsUncommon.length);
        chestInventory.push(itemsUncommon[randItem].name);

    }

    for (i = 0; i < 1; i++) {
        var randItem = randNum(0, itemsRare.length);
        chestInventory.push(itemsRare[randItem].name);

    }

    printBox("You found a chest!")

    player.quickCheck();
    inquirer.prompt({
            type: "confirm",
            message: "Open it?",
            name: "openChest",
        })
        .then(function (choice) {
            if (choice.openChest === true) {
                var openCheck = randNum(1, 5)
                if (openCheck != 1) {
                    console.log("\n--------")
                    console.log("You opened the chest.\n")

                    var amount = randNum(10, 30);
                    player.gold += amount;
                    player.goldCount += amount;
                    console.log("You got " + amount + " gold.")

                    for (i = 0; i < 2; i++) {
                        var itemNum = randNum(0, chestInventory.length)
                        var item = chestInventory[itemNum];
                        player.inventory.push(chestInventory[itemNum]);
                        removeItem(item, chestInventory);


                        var anA = aOrAn(item)

                        console.log("You got " + anA + " " + item + ".");

                    }

                    console.log("--------")
                    gameStateCheck();

                } else {

                    mimicEncounter();
                }

            } else {
                printBox("You decided to leave it alone.")
                gameStateCheck();

            }
        })
}

function dungeonEncounter() {
    printBox("You came across an old dungeon.")

    player.quickCheck();
    inquirer.prompt({
            type: "confirm",
            message: "Do you dare to enter?",
            name: "enterDungeon",
        })
        .then(function (choice) {
            if (choice.enterDungeon === true) {

                changeState(false, false, false, false, false, true);

                printBox("You stepped into the dungeon.");

                whereToDungeon();

            } else {
                printBox("You decided to move on.")
                gameStateCheck();

            }
        })
}

function fight() {
    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "Next move?",
            name: "action",
            choices: ["Attack", player.special.name, player.special2.name, "Use Item", "Check Stats", "< Run"]
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

                case player.special2.name:
                    console.log("\n--------")
                    player.special2.move(currentEnemy);
                    break;

                case "Use Item":
                    useItem();
                    break;

                case "Check Stats":
                    player.checkStats();
                    fight();
                    break;

                case "< Run":

                    console.log("\n--------")
                    console.log("You Ran Away.")
                    runLoss();
                    console.log("--------")
                    gameOverCheck();

                    break;
            }
        })
}

function fightDungeon() {
    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "Next move?",
            name: "action",
            choices: ["Attack", player.special.name, player.special2.name, "Use Item", "Check Stats", "< Escape Dungeon"]
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

                case player.special2.name:
                    console.log("\n--------")
                    player.special2.move(currentEnemy);
                    break;

                case "Use Item":
                    useItem();
                    break;

                case "Check Stats":
                    player.checkStats();
                    fight();
                    break;

                case "< Escape Dungeon":

                    console.log("\n--------")
                    console.log("You fled the dungeon.")
                    runLoss();
                    console.log("--------")
                    gameOverCheck();

                    break;
            }
        })
}

function enemyDeathCheck() {
    if (currentEnemy.hp <= 0) {
        console.log("You killed " + currentEnemy.name + "!\n");
        player.killCount++;
        dropGold();
        if (currentEnemy.name === "Mimic") {
            mimicDrop();
        } else {
            dropLoot();
        };

        player.gainXp(currentEnemy);
        player.levelUp();

        console.log("--------");
        if (isExploring === true) {
            whereTo();
        } else if (isInDungeon === true) {
            whereToDungeon();
        }


    } else {
        currentEnemy.attack(player);
        console.log("--------")

        gameOverCheck();

    }
}

function goToTown() {
    // give shop random set of items each town visit
    if (isExploring === true) {
        shopInventory = [];
        for (i = 0; i < 4; i++) {
            var randItem = randNum(0, itemsCommon.length);
            shopInventory.push(itemsCommon[randItem].name);

        }

        for (i = 0; i < 1; i++) {
            var randItem = randNum(0, itemsUncommon.length);
            shopInventory.push(itemsUncommon[randItem].name);

        }

        for (i = 0; i < 1; i++) {
            var randItem = randNum(0, itemsRare.length);
            shopInventory.push(itemsRare[randItem].name);

        }
    }

    changeState(false, false, true, false, false, false);

    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "What next?",
            name: "action",
            choices: ["Stay at Inn", "Go to Shop", "Use Item", "Check Stats", "< Leave Town"]
        })
        .then(function (choice) {
            switch (choice.action) {
                case "Stay at Inn":
                    stayAtInn();
                    break;

                case "Go to Shop":
                    shop();
                    break;

                case "Use Item":
                    useItem();
                    break;

                case "Check Stats":
                    player.checkStats();
                    goToTown();
                    break;

                case "< Leave Town":
                    printBox("You went adventuring.")
                    whereTo();
                    break;
            };
        })
}



function stayAtInn() {
    if (player.hp < player.maxHp || player.mp < player.maxMp) {
        var cost = 10 + (player.level - 1) * 2;
        printBox("Staying the night will cost " + cost + " gold.")

        player.quickCheck();
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
                        printBox("You feel well rested.")
                        goToTown();
                    } else {
                        printBox("You cannot afford to stay here.")
                        goToTown();
                    }
                } else {
                    printBox("You left.")
                    goToTown();

                }
            });
    } else {
        printBox("You are already at full Health and Mana.")
        gameStateCheck();
    }


}

function shop() {

    player.quickCheck();
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

    changeState(false, false, true, true, false, false);

    shopInventory.sort();
    shopInventory.push("< Go Back");


    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "What do you want to buy?",
            name: "action",
            choices: shopInventory
        })
        .then(function (choice) {
            removeItem("< Go Back", shopInventory);
            switch (choice.action) {
                case "< Go Back":
                    shop();;
                    break;

                case hPot.name:
                    itemPurchase(hPot.name, hPot.buyCost);
                    break;

                case megaHPot.name:
                    itemPurchase(megaHPot.name, megaHPot.buyCost);
                    break;

                case maxHPot.name:
                    itemPurchase(maxHPot.name, maxHPot.buyCost);
                    break;

                case mPot.name:
                    itemPurchase(mPot.name, mPot.buyCost)
                    break;

                case megaMPot.name:
                    itemPurchase(megaMPot.name, megaMPot.buyCost)
                    break;

                case maxMPot.name:
                    itemPurchase(maxMPot.name, maxMPot.buyCost)
                    break;

                case oldHat.name:
                    itemPurchase(oldHat.name, oldHat.buyCost)
                    break;


            };
        })
}

function itemPurchase(item, cost) {
    printBox(item + " costs " + cost + " gold.")

    player.quickCheck();
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
                    removeItem(item, shopInventory);
                    printBox("You purchased a " + item + ".")
                    gameStateCheck();

                } else {
                    printBox("You cannot afford this item.")
                    gameStateCheck();

                }
            } else {
                printBox("You decided against it.")
                gameStateCheck();

            }
        });
}

function sell() {

    changeState(false, false, true, false, true, false);

    player.inventory.sort();
    player.inventory.push("< Go Back")

    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "What do you want to sell?",
            name: "action",
            choices: player.inventory
        })
        .then(function (choice) {
            removeItem("< Go Back", player.inventory);
            switch (choice.action) {

                case "< Go Back":
                    shop();;
                    break;

                case hPot.name:
                    itemSell(hPot.name, hPot.sellCost);
                    break;

                case megaHPot.name:
                    itemSell(megaHPot.name, megaHPot.sellCost);
                    break;

                case maxHPot.name:
                    itemSell(maxHPot.name, maxHPot.sellCost);
                    break;

                case mPot.name:
                    itemSell(mPot.name, mPot.sellCost)
                    break;

                case megaMPot.name:
                    itemSell(megaMPot.name, megaMPot.sellCost)
                    break;

                case maxMPot.name:
                    itemSell(maxMPot.name, maxMPot.sellCost)
                    break;

                case oldHat.name:
                    itemSell(oldHat.name, oldHat.sellCost)
                    break;


            };
        })

}

function itemSell(item, cost) {
    printBox(item + " sells for " + cost + " gold.")

    player.quickCheck();
    inquirer.prompt({
            type: "confirm",
            name: "isSelling",
            message: "Is that okay?",
            default: true
        })
        .then(function (choice) {
            if (choice.isSelling === true) {

                player.gold += cost;
                player.goldCount += cost;
                removeItem(item, player.inventory);
                shopInventory.push(item);
                printBox("You sold a " + item + ".")
                gameStateCheck();


            } else {
                printBox("You decided against it.")
                gameStateCheck();

            }
        });
}

function useItem() {

    player.inventory.sort();
    player.inventory.push("< Go Back");

    player.quickCheck();
    inquirer.prompt({
            type: "list",
            message: "What do you want to use?",
            name: "action",
            choices: player.inventory
        })
        .then(function (choice) {
            removeItem("< Go Back", player.inventory);
            switch (choice.action) {

                case "< Go Back":
                    gameStateCheck();
                    break;

                case hPot.name:
                    hPot.effect(player);
                    break;

                case megaHPot.name:
                    megaHPot.effect(player);
                    break;

                case maxHPot.name:
                    maxHPot.effect(player);
                    break;

                case mPot.name:
                    mPot.effect(player);
                    break;

                case megaMPot.name:
                    megaMPot.effect(player);
                    break;

                case maxMPot.name:
                    maxMPot.effect(player);
                    break;

                case oldHat.name:
                    oldHat.effect();
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
        console.log(currentEnemy.name + " has killed you.\n");
        console.log(player.name + " reached lv." + player.level + ".");
        if (player.killcount != 1) {
            console.log(player.killCount + " monsters killed.")
        } else {
            console.log(player.killCount + " monster killed.")
        }
        console.log(player.goldCount + " gold earned.\n")
        console.log(" -- GAME OVER -- ");
        console.log("--------")
    } else if (isFighting === true && isExploring === true) {
        fight();
    } else if (isExploring === true) {
        whereTo();

    } else if (isFighting === true && isInDungeon === true) {
        fightDungeon();

    } else if (isInDungeon === true) {
        whereToDungeon();
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
                printBox("Good bye " + player.name + ".")
            } else {
                printBox("You continued playing.")
                gameStateCheck();

            }
        });
}

gameStart();