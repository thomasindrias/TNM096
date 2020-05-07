% Actions
act( go(X, Y), % Action name
     [shakey(S), at(S, X), on(S, floor), connected(X, Y)], % Pre-conditions
     [at(S, X)], % Delete
     [at(S, Y)]  % Add
     ).


initial_state( [

  % init
  shakey(s),
  at(s, room3),
  on(s, floor),

  % connected rooms
  connected(room1, corridor),
  connected(room2, corridor),
  connected(room3, corridor),
  connected(room4, corridor),
  connected(corridor, room1),
  connected(corridor, room2),
  connected(corridor, room3),
  connected(corridor, room4),
]).

