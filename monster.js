function CreateMonster(name, maxHp, maxMp, strength, speed, xp, gold, invArr) {

    this.name = name
    this.type = "common"
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.maxMp = maxMp;
    this.mp = maxMp;
    this.strength = strength;
    this.speed = speed;
    this.xp = xp;
    this.inventory = invArr;
    this.gold = gold;
    this.isDead = false;



};

CreateMonster.prototype.randNum = function (x, y) {
    return Math.floor(Math.random() * y) + x
}

CreateMonster.prototype.checkStats = function () {
    console.log("\n");
    console.log(" -- " + this.name + " -- ");
    console.log("HP: " + this.hp + "/" + this.maxHp + "  |  MP: " + this.mp + "/" + this.maxMp + "  |  Strength: " + this.strength);
    console.log("XP: " + this.xp);
    console.log(" -- Inventory -- ");
    console.log(this.inventory);
    console.log("\n");
}

CreateMonster.prototype.attack = function (opponent) {
    var SpeedNum = this.speed - player.speed
    var missCheck = this.randNum(1, SpeedNum)

    if (missCheck != 1) {

        var newStrength = this.strength - Math.floor(player.defense / 3)

        opponent.hp -= newStrength;

        console.log(this.name + " attacked you for " + newStrength + " damage.")
        console.log("You have " + opponent.hp + " HP left.")

    } else {
        console.log(this.name + " missed!")
    }

}

module.exports = CreateMonster