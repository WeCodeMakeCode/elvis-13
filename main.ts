enum SpriteKindLegacy {
    Player,
    Projectile,
    Food,
    Enemy,
    snake_body_sprite,
    snake_head_sprite,
    border
}
sprites.onOverlap(SpriteKindLegacy.snake_head_sprite, SpriteKindLegacy.snake_body_sprite, function (sprite, otherSprite) {
    game.over(false, effects.dissolve)
})
sprites.onOverlap(SpriteKindLegacy.snake_head_sprite, SpriteKindLegacy.border, function (sprite, otherSprite) {
    game.over(false, effects.dissolve)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 3
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 2
})
function make_snake_head () {
    head_up = img`
f f f f f f f f 
f f f f f f f f 
d d d d d d d d 
d d f d d f d d 
d d d d d d d d 
d d d d d d d d 
d d d 2 2 d d d 
d d d d d d d d 
`
    head_down = head_up.clone()
    head_down.flipY()
    head_right = img`
d d d d d d f f 
d d d d d d f f 
d d d d f d f f 
d 2 d d d d f f 
d 2 d d d d f f 
d d d d f d f f 
d d d d d d f f 
d d d d d d f f 
`
    head_left = head_right.clone()
    head_left.flipX()
    snake_head_image = head_up
    snake_head = sprites.create(snake_head_image, SpriteKindLegacy.snake_head_sprite)
    snake_head.y = scene.screenHeight() / 2 + 10
}
function get_snake_speed_from_player () {
    if (game.ask("Faster Snake?")) {
        move_frequency = 100
    } else {
        move_frequency = 500
    }
}
function move_last_body_sprite_to_where_head_was () {
    snake_list.insertAt(0, snake_list.pop())
    snake_list[0].x = head_X_prior
    snake_list[0].y = head_Y_prior
    snake_list[0].setImage(snake_body_image)
}
function move_snake () {
    head_X_prior = snake_head.x
    head_Y_prior = snake_head.y
    move_snake_head()
    move_last_body_sprite_to_where_head_was()
    put_shoes_on_new_last_snake_sprite()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    b_go = !(b_go)
})
function make_snake_body_cell_image () {
    snake_body_image = image.create(cell_side, cell_side)
    snake_cell_m1 = cell_side - 1
    snake_body_image.fill(15)
    snake_body_image.drawLine(0, 0, snake_cell_m1, snake_cell_m1, 3)
    snake_body_image.drawLine(0, snake_cell_m1, snake_cell_m1, 0, 3)
}
function make_sandwiches () {
    if (n_sandwiches < 4) {
        for (let index = 0; index < Math.randomRange(2, 3); index++) {
            sandwiche_sprite = sprites.create(img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
e e e e e e e e e e e e e e e e 
e e e e e e e e e e e e e e e e 
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
d 4 4 5 5 d 5 5 4 4 d d 5 4 5 5 
d 5 5 5 5 d 5 5 5 5 d d 5 5 5 5 
d 5 5 5 5 d 5 5 5 5 d d 5 5 5 5 
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 
e e e e e e e e e e e e e e e e 
e e e e e e e e e e e e e e e e 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, SpriteKindLegacy.Food)
            X = Math.randomRange(8, scene.screenWidth() - 8)
            Y = Math.randomRange(8, scene.screenHeight() - 8)
            sandwiche_sprite.setPosition(X, Y)
            n_sandwiches += 1
        }
    }
}
function make_snake () {
    cell_side = 8
    make_snake_head()
    make_snake_body(4, 4)
    snake_direction = 0
}
function put_shoes_on_new_last_snake_sprite () {
    last_snake_sprite = snake_list[snake_list.length - 1]
    last_snake_sprite.setImage(blue_suade_shoes)
}
function lengthen_snake_by_one_sprite () {
    snake_len_m1 = snake_list.length - 1
    body_last_sprite = snake_list[snake_len_m1]
    snake_len_m2 = snake_len_m1 - 1
    body_next_to_last_sprite = snake_list[snake_len_m2]
    dx = body_next_to_last_sprite.x - body_last_sprite.x
    dy = body_next_to_last_sprite.y - body_last_sprite.y
    X = body_last_sprite.x + dx
    Y = body_last_sprite.y + dy
    add_body_sprite_to_end(X, Y)
    put_shoes_on_new_last_snake_sprite()
}
function make_borders () {
    let border_sprite: Sprite[] = []
    border_sprites = []
    border_sprite.push(sprites.create(image.create(scene.screenWidth(), 1), SpriteKindLegacy.border))
    border_sprite[0].top = 0
    border_sprite.push(sprites.create(image.create(1, scene.screenHeight()), SpriteKindLegacy.border))
    border_sprite[1].left = 0
    border_sprite.push(sprites.create(border_sprite[0].image.clone(), SpriteKindLegacy.border))
    border_sprite[2].bottom = scene.screenHeight() - 1
    border_sprite.push(sprites.create(border_sprite[1].image.clone(), SpriteKindLegacy.border))
    border_sprite[3].right = scene.screenWidth() - 1
    for (let value of border_sprite) {
        value.image.fill(9)
    }
}
function add_body_sprite_to_end (x: number, y: number) {
    last_snake_sprite = sprites.create(snake_body_image, SpriteKindLegacy.snake_body_sprite)
    last_snake_sprite.setPosition(x, y)
    snake_list.push(last_snake_sprite)
}
sprites.onOverlap(SpriteKindLegacy.snake_head_sprite, SpriteKindLegacy.Food, function (sprite, otherSprite) {
    b_go = false
    info.changeScoreBy(1)
    music.playTone(262, music.beat(BeatFraction.Half))
    otherSprite.destroy(effects.spray, 500)
    n_sandwiches += -1
    lengthen_snake_by_one_sprite()
    make_sandwiches()
    b_go = true
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 1
})
function move_snake_head () {
    if (snake_direction == 0) {
        snake_head.setPosition(head_X_prior, head_Y_prior - cell_side)
        snake_head.setImage(head_up)
    } else if (snake_direction == 1) {
        snake_head.setPosition(head_X_prior + cell_side, head_Y_prior)
        snake_head.setImage(head_right)
    } else if (snake_direction == 2) {
        snake_head.setPosition(head_X_prior, head_Y_prior + cell_side)
        snake_head.setImage(head_down)
    } else {
        snake_head.setPosition(head_X_prior - cell_side, head_Y_prior)
        snake_head.setImage(head_left)
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 0
})
function make_snake_body (n_vertical_cells: number, n_horizontal_cells: number) {
    make_snake_body_cell_image()
    blue_suade_shoes = img`
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
8 8 8 8 8 8 8 8 
`
    snake_list = sprites.allOfKind(SpriteKindLegacy.snake_body_sprite)
    Y = snake_head.y
    for (let index = 0; index <= n_vertical_cells - 1; index++) {
        Y = Y + cell_side
        add_body_sprite_to_end(snake_head.x, Y)
    }
    X = snake_head.x
    for (let index = 0; index <= n_horizontal_cells - 1; index++) {
        X = X - cell_side
        add_body_sprite_to_end(X, Y)
    }
    put_shoes_on_new_last_snake_sprite()
}
let border_sprites: number[] = []
let dy = 0
let dx = 0
let body_next_to_last_sprite: Sprite = null
let snake_len_m2 = 0
let body_last_sprite: Sprite = null
let snake_len_m1 = 0
let blue_suade_shoes: Image = null
let last_snake_sprite: Sprite = null
let Y = 0
let X = 0
let sandwiche_sprite: Sprite = null
let snake_cell_m1 = 0
let cell_side = 0
let snake_body_image: Image = null
let head_Y_prior = 0
let head_X_prior = 0
let snake_list: Sprite[] = []
let move_frequency = 0
let snake_head: Sprite = null
let snake_head_image: Image = null
let head_left: Image = null
let head_right: Image = null
let head_down: Image = null
let head_up: Image = null
let snake_direction = 0
let n_sandwiches = 0
let b_go = false
b_go = false
scene.setBackgroundColor(7)
make_snake()
n_sandwiches = 0
make_sandwiches()
music.setVolume(255)
info.setScore(0)
make_borders()
get_snake_speed_from_player()
b_go = true
game.onUpdateInterval(move_frequency, function () {
    if (b_go) {
        move_snake()
    }
})
