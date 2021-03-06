% Actions
act( go(From, To), % Action name
     [shakey(S), at(S, From), on(S, floor), binding(From, To)], % Pre-conditions
     [at(S, From)], % Delete
     [at(S, To)]  % Add
     ).

% Push Box Actions
act( pushBox(B, From, To), % Action name
     [shakey(S), box(B), at(S, From), at(B, From), on(S, floor), binding(From, To)], % Pre-conditions
     [at(S, From), at(B, From)], % Delete
     [at(S, To), at(B, To)]  % Add
     ).

% Climbing Actions
act( climbUp(B),
    [shakey(S), on(S, floor), box(B), at(S, X), at(B, X)],
    [on(S, floor)],
    [on(S, box)]
    ).

act( climbDown(B),
    [shakey(S), box(B), on(S, B), at(S,X), at(B,X)],
    [on(S, box)],
    [on(S, floor)]
    ).

% Lights Actions
act( turnOn(), % Action name
     [shakey(S), switch(L), box(B), at(B, X), on(S, box), at(S, X), at(L, X), lights(X, off)], % Pre-conditions
     [lights(L, off)], % Delete
     [lights(L, on)]  % Add
     ).

act( turnOff(), % Action name
     [shakey(S), box(B), at(B, X), on(S, box), at(S, X), lights(X, on)], % Pre-conditions
     [lights(X, on)], % Delete
     [lights(X, off)]  % Add
     ).

% Goal State
goal_state( [
  lights(light1, off),
  at(box2, room2)
  ]).

% Initial State
initial_state( [

  % init
  shakey(s),
  at(s, room3),
  on(s, floor),

  % Connect the rooms
  binding(room1, corridor),
  binding(room2, corridor),
  binding(room3, corridor),
  binding(room4, corridor),
  binding(corridor, room1),
  binding(corridor, room2),
  binding(corridor, room3),
  binding(corridor, room4),
  
  % Bind Rooms and Switches
  binding(room1, light1),
  binding(room2, light2),
  binding(room3, light3),
  binding(room4, light4),
  binding(light1, room1),
  binding(light2, room2),
  binding(light3, room3),
  binding(light4, room4),

  % Set lights state
  lights(light1, on),
  lights(light2, off),
  lights(light3, off),
  lights(light4, on),

  % Block IDs
  box(box1),
  box(box2),
  box(box3),
  box(box4),
  
  % Block bindings
  at(box1, room1),
  at(box2, room1),
  at(box3, room1),
  at(box4, room1)
]).

