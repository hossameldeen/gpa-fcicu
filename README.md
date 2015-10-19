# GPA scraper and calculator for FCI-CU
Chrome extension to scrape an FCI-CU student's ecom account and calculate their GPA from its data.

## How to use
It's not done yet. Will explain how to use here when done.
Basic functionality is already done, so, if you know how to run a Chrome extension in developer mode, feel free to run it. Should take less than a minute to calculate.

## I'm using Mozilla Firefox
Most of the code is about `XMLHttpRequest`, something not specifically related to Chrome, so most probably it'll be easy to port to a Firefox plugin.

## Roadmap

### Soon isA
- Move work to backend.
- Update interface & class diagrams.
- Make a design for the storage, and don't include the HTML stuff of course.
- Make new design to include the storage and periodic stuff.
- If it came out to be complicated, make formal design for the message passing.

### Mid isA
- Include other pages, not just GPA.
- Make good UI (Probably, not me).

### Later isA
- Enforce Singletons somehow.
- Check if the sender is from the same extension.
- move to safe parsing.
- See if there're any other security flaws and mend them.
- See if there're rough places where you can use formal methods to make sure of correctness.

### Notes
- If idle for some time, event page will be suspended. So, what happens if (1) an XHR takes quite some time or (2) the interval between requests was increased and became too big for the event page idleness time? Investigation needed.
- In function constructors, initialize (if you'll) private members at the top. If you don't, probably-not-meant stuff could happen. Example: If you call a function in the constructor and this function is written above the variable initialization, the variable's variable will be undefined. May be what you intended, but probably it isn't.
- I sometimes return the error message 'true'. It's a bug and I have a good guess where causes it, but will delay that stuff till we're done to hopefully add sound error checking isA (I really doubt I'll).


## Warnings
- It's still vulnerable to any XSS attacks! Use at your own risk and don't do stupid stuff.
- When I used to send requests without delay in-between, ecom suspected me of DOS attack and banned my public IP. Now, I'm making a 1-second interval between each request to the ecom. So, anyway, there's always the risk of getting suspected of DOS attack and getting banned. In that case, for me, turning off the router for a few minutes changed my public IP and thus removed my ban. If that didn't solve you problem, probably go to the ecom staff with your public IP to unban you (Note: The email they write when you get banned that you should send to doesn't work).
- In some cases, you may not get logged out after the extension is done working.
- I've done testing with different accounts and cases, but still I may have made a mistake here or there, so if I calculated it wrong and you suicided, I'm sorry!
