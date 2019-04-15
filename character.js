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

    this.name = this.nameStructure(name)
    this.race = race;
    this.profession = profession;
    this.strength = 4;
    this.defense = 2;
    this.luck = 3;
    this.speed = 2;
    this.maxHp = 4;
    this.hp = 4;
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
            if (player.berserkCount > 2) {
                player.berserkCount = 0;
                player.isBerserk = false;
                player.strength = player.berserkAtkHold
                console.log(" - Berserk has run out. - \n")
            }
        }

    }

};

module.exports = CreateCharacter;