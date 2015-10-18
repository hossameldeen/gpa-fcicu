## Soon isA
- Move work to backend.
- Update interface & class diagrams.
- Make a design for the storage, and don't include the HTML stuff of course.
- Make new design to include the storage and periodic stuff.
- If it came out to be complicated, make formal design for the message passing.

## Mid isA
- Include other pages, not just GPA.
- Make good UI (Probably, not me).

## Later isA
- Enforce Singletons somehow.
- Check if the sender is from the same extension.
- move to safe parsing.
- See if there're any other security flaws and mend them.
- See if there're rough places where you can use formal methods to make sure of correctness.

## Notes
- If idle for some time, event page will be suspended. So, what happens if (1) an XHR takes quite some time or (2) the interval between requests was increased and became too big for the event page idleness time? Investigation needed.
- In function constructors, initialize (if you'll) private members at the top. If you don't, probably-not-meant stuff could happen. Example: If you call a function in the constructor and this function is written above the variable initialization, the variable's variable will be undefined. May be what you intended, but probably it isn't.
- I sometimes return the error message 'true'. It's a bug and I have a good guess where causes it, but will delay that stuff till we're done to hopefully add sound error checking isA (I really doubt I'll).
