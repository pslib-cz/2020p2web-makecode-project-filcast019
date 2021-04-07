 //plány--------------------------------------------------------------
/*
úterý - příprava
středa - dovymyšlení nápadu
čtvrtek - priprava textur
pátek - vlastnosti textur, funkce na zmenu levelu
sobota - level design, enemy movement, double jump
neděle - testování, doladění
zbytek - dodělat co se nestihlo nebo odložilo
7.4. hotovo - odevzdáno publikováno
*/
//on gameupdate------------------------------------------------------
game.onUpdate(function () {
    //enemy rotace
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        if (value.isHittingTile(CollisionDirection.Left)) {
            value.vx = 50
            value.setImage(assets.image`Enemy1 Right`)
        } else if (value.isHittingTile(CollisionDirection.Right)) {
            value.vx = -50
            value.setImage(assets.image`Enemy1 Left`)
        }
    }
    //sprite rotace
    for (let value of sprites.allOfKind(SpriteKind.Player)) {
        if (mySprite.vx < 0) {
            value.setImage(assets.image`Main Left`)
        } else if (0 < mySprite.vx) {
            value.setImage(assets.image`Main Right`)
        }
    }
})
//on overlaps--------------------------------------------------------
//konec hry
scene.onOverlapTile(SpriteKind.Player, assets.tile`trophy`, function (sprite, location) {
    info.setScore(100)
    game.over(true)
})
//reset levelu
scene.onOverlapTile(SpriteKind.Player, assets.tile`DeathTile`, function (sprite, location) {
    tiles.placeOnRandomTile(mySprite, assets.tile`SpawnTile`)
    info.changeLifeBy(-1)
})
//dalsi level
scene.onOverlapTile(SpriteKind.Player, assets.tile`FinnishLine`, function (sprite, location) {
    Level()
})
//zabiti a zraneni od ducha
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy()
    if (sprite.bottom < otherSprite.y) {
        mySprite.vy = -150
        music.baDing.play()
        info.changeScoreBy(1)
    } else {
        music.spooky.play()
        info.changeLifeBy(-1)
    }
})
//funkce-------------------------------------------------------------
function Level () {
    //zničit všechny enemáky po změně levelu
    for (let spawn of sprites.allOfKind(SpriteKind.Enemy)) {
        spawn.destroy()
    }
    //změna levelu
    NextLevel += 1
    if (NextLevel == 1) {
        //scene.setBackgroundColor(7)
        tiles.setTilemap(tilemap`level1`)
        scene.setBackgroundImage(assets.image`les`)
        info.player1.setLife(5)
    } else if (NextLevel == 2) {
        //scene.setBackgroundColor(8)
        tiles.setTilemap(tilemap`level2`)
        scene.setBackgroundImage(assets.image`water`)
        info.player1.setLife(5)
        info.changeScoreBy(10)
    } else if (NextLevel == 3) {
        //scene.setBackgroundColor(2)
        tiles.setTilemap(tilemap`level3`)
        scene.setBackgroundImage(assets.image`nebe`)
        info.player1.setLife(5)
        info.changeScoreBy(10)
    }
    //umisteni postavy na blok
    tiles.placeOnRandomTile(mySprite, assets.tile`SpawnTile`)
    //umisteni enemy na bloky
    for (let spawn of tiles.getTilesByType(assets.tile`Enemy1 Spawn`)) {
        ene1 = sprites.create(assets.image`Enemy1 Left`, SpriteKind.Enemy)
        tiles.placeOnTile(ene1, spawn)
        ene1.vx = -50
    }
}
//proměnné-----------------------------------------------------------
let mySprite = sprites.create(assets.image`Main Right`) 
mySprite.setKind(SpriteKind.Player)
let ene1: Sprite = null
let NextLevel = 0
let jump2 = 1
//pohyb a A/B tlacitka-----------------------------------------------
mySprite.ay = 500
controller.moveSprite(mySprite, 100, 0)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mySprite.tileKindAt(TileDirection.Bottom, assets.tile`transparency16`)) {
        if (jump2 == 1) {
            mySprite.vy = -100
            jump2 += 1
        } else {
            music.knock.play()
        }
    } else {
        jump2 = 0
        mySprite.vy = -160
        jump2 += 1
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    game.showLongText("Ovládání: WSAD + mezerník Skóre: výhra = 100 bodů    prohra = počet duchů + 10 za level                 Užívej si hru!      ---zmáčkněte mezerník---      ", DialogLayout.Full)
})
//nastavení kamery---------------------------------------------------
//mySprite.setPosition(25, 214)
scene.cameraFollowSprite(mySprite)
//nastaveni zivotu---------------------------------------------------
//info.player1.setLife(3)
//testovaci pozadi---------------------------------------------------
/*
scene.setBackgroundColor(6)
scene.setBackgroundImage(assets.image`les`)
tiles.setTilemap(tilemap`testovaci podložka`)
*/
//call funkce další level--------------------------------------------
mySprite.say("Enter(B) = info", 3000)
Level()