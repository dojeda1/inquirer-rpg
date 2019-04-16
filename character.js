function CreateCharacter(name, race, profession) {

    this.nameStructure = function (roughName) {
        if (roughName != "") {
            var newName = roughName.trim();
            newName = newName.charAt(0).toUpperCase() + newName.slice(1);

        } else {
            var newName = "Thomas"
        }
        return newName;
    }

    this.randNum = function (x, y) {
        return Math.floor(Math.random() * y) + x
    }

    this.aOrAn = function (word) {

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

    this.removeItem = function (item, array) {
        var index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }

        // console.log(array);
    }

    this.name = this.nameStructure(name)
    this.race = race;
    this.profession = profession;
    this.strength = 4;
    this.defense = 2;
    this.luck = 3;
    this.speed = 2;
    this.maxHp = 20;
    this.hp = 20;
    this.maxMp = 4;
    this.mp = 4;
    this.level = 1;
    this.xp = 0;
    this.nextLevel = 50;
    this.inventory = ["Health Potion"];
    this.gold = 0;
    this.goldCount = 0;
    this.killCount = 0;
    this.isDead = false;
    this.isBerserk = false;
    this.berserkCount = 0;
    this.baseAtkHold = 0;

    this.checkStats = function () {

        this.inventory.sort();
        console.log("\n");
        console.log(" -- " + this.name + " -- ");
        console.log("lv." + this.level + " " + this.race + " " + this.profession);
        console.log("HP: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp + "  |  XP: " + this.xp + "/" + this.nextLevel);
        console.log("ATK: " + this.strength + "  |  DEF: " + this.defense + "  |  SPD: " + this.speed + "  |  LUCK: " + this.luck);
        console.log("Gold: " + this.gold);
        console.log(" -- Inventory -- ");
        console.log(this.inventory);
    }

    this.quickCheck = function () {
        console.log("\n" + this.name + " - " +
            "HP: " + this.hp + "/" + this.maxHp + " - MP: " + this.mp + "/" + this.maxMp + " - XP: " + this.xp + "/" + this.nextLevel + " - Gold: " + this.gold)
    }

    this.attack = function (opponent) {

        var luckCheck = opponent.speed - this.luck
        var criticalCheck = this.randNum(1, luckCheck)
        if (criticalCheck != 1) {
            opponent.hp -= this.strength;
            console.log("You attacked " + opponent.name + " for " + this.strength + " damage.")
            console.log(opponent.name + " has " + opponent.hp + " HP left.\n")
        } else {
            var newStrength = this.strength + Math.floor(this.strength / 2);
            opponent.hp -= newStrength;
            console.log("Critical hit for " + newStrength + " damage!!!")
            console.log(opponent.name + " has " + opponent.hp + " HP left.")
        }
        this.berserkCheck();
    }

    this.levelUp = function () {
        if (this.xp >= this.nextLevel) {
            this.level++;
            this.nextLevel += this.level * 50;
            this.strength += 2;
            this.defense += 1;
            this.speed += 1;
            this.luck += 1;
            this.maxHp += 5;
            this.hp = this.maxHp;
            this.maxMp += 3;
            this.mp = this.maxMp;
            console.log("\nYou are now lv." + this.level + "!!!")
        }
    }

    this.gainXp = function (opponent) {
        this.xp += opponent.xp;
        console.log("You gained " + opponent.xp + " XP.");
        console.log("Total XP: " + this.xp);
    }

    this.berserkCheck = function () {
        if (this.isBerserk === true) {
            this.berserkCount++;
            // console.log(this.berserkCount);
            if (this.berserkCount > 2) {
                this.berserkCount = 0;
                this.isBerserk = false;
                this.strength = this.berserkAtkHold
                console.log(" - Berserk has run out. - \n")
            }
        }

    }

};

CreateCharacter.prototype.refineCharacter = function (enemyDeathCheck, gameOverCheck, gameStateCheck) {
    switch (this.race) {

        case "Human":
            this.maxHp += 4
            this.hp += 4
            this.maxMp += 4
            this.mp += 4
            this.strength += 1
            this.defense += 1
            this.speed += 1
            this.luck += 0
            break;

        case "Elf":
            this.maxHp += 4
            this.hp += 4
            this.maxMp += 6
            this.mp += 6
            this.strength += 0
            this.defense += 0
            this.speed += 1
            this.luck += 1
            break;

        case "Dwarf":
            this.maxHp += 6
            this.hp += 6
            this.maxMp += 2
            this.mp += 2
            this.strength += 2
            this.defense += 1
            this.speed += 0
            this.luck += 0
            break;

    }

    switch (this.profession) {

        case "Warrior":
            this.maxHp += 4
            this.hp += 4
            this.maxMp += 0
            this.mp += 0
            this.strength += 2
            this.defense += 2
            this.speed += 0
            this.luck += 0

            this.special = {
                name: "Axe Strike *",
                mpCost: 6,

                move: function (opponent) {

                    if (this.mpCost <= player.mp) {
                        player.mp -= this.mpCost;
                        var luckCheck = (2 + opponent.speed - player.luck)
                        var criticalCheck = player.randNum(1, luckCheck);
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

                        if (this.mpCost <= player.mp) {

                            player.isBerserk = true
                            player.berserkCount = 0
                            player.berserkAtkHold = player.strength;

                            player.mp -= this.mpCost;

                            var luckCheck = (20 - player.luck)
                            var criticalCheck = player.randNum(1, luckCheck);

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
                    if (this.mpCost <= player.mp) {
                        player.mp -= this.mpCost;
                        var luckCheck = (2 + opponent.speed - player.luck)
                        var criticalCheck = player.randNum(1, luckCheck);
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
                    if (opponent.inventory.length != 0) {
                        if (this.mpCost <= player.mp) {
                            player.mp -= this.mpCost;
                            var stealCheck = player.randNum(1, player.luck);

                            if (stealCheck != 1) {

                                var monsterIndex = player.randNum(0, opponent.inventory.length);
                                var stealItem = opponent.inventory[monsterIndex];

                                var anA = player.aOrAn(stealItem);
                                player.removeItem(stealItem, opponent.inventory);
                                player.inventory.push(stealItem);
                                console.log("You stole " + anA + " " + stealItem + "!\n")

                                enemyDeathCheck();
                            } else {
                                console.log("You failed to steal anything...\n")
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
                    if (this.mpCost <= player.mp) {
                        player.mp -= this.mpCost;
                        var luckCheck = (2 + opponent.speed - player.luck)
                        var criticalCheck = player.randNum(1, luckCheck);
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
                        if (this.mpCost <= player.mp) {
                            player.mp -= this.mpCost;
                            var luckCheck = (20 - player.luck)
                            var criticalCheck = player.randNum(1, luckCheck);
                            var magicStrength = player.maxHp

                            if (criticalCheck != 1) {
                                player.hp += Math.floor(magicStrength * .75);
                                if (player.hp > player.maxHp) {
                                    player.hp = player.maxHp;
                                }
                                console.log("You recovered " + Math.floor(magicStrength * .75) + " HP.\n")
                                enemyDeathCheck();
                            } else {
                                player.hp += magicStrength;
                                if (player.hp > player.maxHp) {
                                    player.hp = player.maxHp;
                                }
                                console.log("You recovered full health!\n")
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
}

module.exports = CreateCharacter;