export const EMPTY_GAME =
`#################
#               #
#               #
#               #
#               #
#       P       #
#################

// Legend
P = Player

// Rules
{ <HORIZONTAL> Player } -> { HORIZONTAL Player }
`

export const examples = {
simple_movement:
`
##################
#                #
#                #
#       P        #
#       #        #
#      ###       #
#     #####      #
#                #
#                #
##################
  
P = Player
# = Brick
  
// Accelerate down, like gravity
{ Player } -> { DOWN Player }

// Move sideways with <LEFT> and <RIGHT> arrow keys
{ <HORIZONTAL> Player } -> { HORIZONTAL Player }
`,

gravity_flip:
`
#################
#               #
#               #
#               #
#               #
#  P    G    X  #
#################

// Legend
P = Player
G = Goomba
X = Goal

// Horizontal input move player horizontally
{ <HORIZONTAL> Player } -> { HORIZONTAL Player }

// Press Action1 (X) to flip
DOWN { Player <ACTION> | Any } -> { Player FLIP | Any }
UP { Player <ACTION> | Any } -> { Player !FLIP | Any }

// Flipped Player falls up, unflipped Player falls down
{ Player FLIP } -> { Player UP }
{ Player !FLIP } -> { Player DOWN }

// If Player touches Goomba, player dies
{ Player | Goomba } -> { DEAD Player | Goomba }

// Win state
{ Player | Goal } -> { Player WIN | Goal }
`,

sliding_puzzle:
`
###################
#    #      #     #
#                 #
#                 #
#                 #
#   P    G  # x   #
###################

// Legend
P = Player
G = Goomba
x = Goal
# = Brick

Flippable = [ Player Goomba ]

{ <UP> STATIONARY Flippable } -> { Flippable gravity: 1 }
{ <DOWN> STATIONARY Flippable } -> { Flippable gravity: 2 }
{ <LEFT> STATIONARY Flippable } -> { Flippable gravity: 3 }
{ <RIGHT> STATIONARY Flippable } -> { Flippable gravity: 4 }

{ Flippable gravity: 1 } -> { Flippable UP rotation:180 }
{ Flippable gravity: 2 } -> { Flippable DOWN rotation:0 }
{ Flippable gravity: 3 } -> { Flippable LEFT rotation:90 }
{ Flippable gravity: 4 } -> { Flippable RIGHT rotation:-90 }

{ Goomba | Any } -> { Goomba | Goomba }

// Win state
{ Player | Goal } -> { Player WIN | Goal }
`,

simple_platformer:
`
##################
#                #
#                #
#                #
#                #
#                #
#     ###?#  G   #
#                #
#    P           #
##################

P = Player
# = Brick
? = QuestionBrick
G = Goomba

// List syntax
ThingsThatFall = [ Player Goomba ]

// Accelerate down, like gravity. On everything in the list
{ ThingsThatFall } -> { DOWN ThingsThatFall }

// Move sideways with <LEFT> and <RIGHT> arrow keys
{ <HORIZONTAL> Player } -> { HORIZONTAL Player }

// Jump when <UP> is pressed and when the bottom of Player
// is touching Wall (Wall = anything)
DOWN { <UP> Player | Wall } -> { JUMP Player | Wall }

// Player dies if touching Goomba on the side or from below
HORIZONTAL { Player | Goomba } -> { DEAD Player | Goomba }
UP { Player | Goomba } -> { DEAD Player | Goomba }

// Jumping on top of Goomba kills the Goomba
DOWN { Player | Goomba } -> { Player | DEAD Goomba }

// Break bricks by head-butting
UP { Player | Brick } -> { Player | DEAD Brick }

// Head-butting QuestionBrick turns it into a Goomba
UP { Player | QuestionBrick } -> { Player | JUMP Goomba }
`,

four_way_movement:
`
###############
#             #
#             #
#             #
#      P      #
#             #
#             #
###############

P = Player

// MOVE is shorthand for UP, DOWN, LEFT and RIGHT
// You can also use HORIZONTAL or VERTICAL
{ <MOVE> Player } -> { MOVE Player }
`,

follow_player:
`
##################
#                #
#   G            #
#                #
#                #
#                #
#                #
#           P    #
#                #
##################

P = Player
G = Goomba

{ <MOVE> Player } -> { MOVE Player }
UP { Goomba > Player } -> { SLOW_UP Goomba > Player }
DOWN { Goomba > Player } -> { SLOW_DOWN Goomba > Player }
LEFT { Goomba > Player } -> { SLOW_LEFT Goomba > Player }
RIGHT { Goomba > Player } -> { SLOW_RIGHT Goomba > Player }

`
}