
%   Blocks World

%  To run this example, first consult the planner you want to use
%  (strips.pl or idstrips.pl) and then consult the blocks.pl example
%  In the query window, run the goal:
%  ?- plan.

:- use_module(library(clpfd)).

block(X) :- X in 2..4 \/ 6.
triangle(X) :- X in 1 \/ 5.

editable(X) :- X in 1..6.
table(X) :- X in 7.

r(X) :- X in 1 \/ 4.
g(X) :- X in 2 \/ 5.
b(X) :- X in 3 \/ 6.

% actions
act( pick_from_table(X),                             % action name
     [handempty,  top(X), on(X,7)],  % preconditions
     [handempty, on(X, 7)],                      % delete
     [holding(X)]                                    % add
     ):-
     editable(X).


act( pickup_from_block(X,Y),
     [handempty, top(X), on(X,Y)],
     [handempty, on(X, Y)],
     [holding(X), top(Y)]
     ):-
     editable(X).


act( putdown_on_table(X),
     [holding(X)],
     [holding(X)],
     [handempty, on(X,7)]
     ):-
     editable(X).


act(  putdown_on_block(X,Y),
     [holding(X), top(Y)],
     [holding(X), top(Y)],
     [handempty, on(X,Y)]
     ):-
     editable(X), block(Y).


goal_state( [
  on(X, Y),
  on(Y, Z)
  ]):-
  g(Y), b(Z).

initial_state(
     [      handempty,

            % Blocks position
            on(1,7),
            on(2,7),
            on(3,4),
            on(4,7),
            on(5,6),
            on(6,7),

            % On top
            top(1),
            top(2),
            top(3),
            top(5)
     ]).
