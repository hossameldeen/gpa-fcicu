# GPA scraper and calculator for FCI-CU
Chrome extension to scrape an FCI-CU student's ecom account and calculate their GPA from its data.

## How to use
It's not done yet. Will explain how to use here when done.
Basic functionality is already done, so, if you know how to run a Chrome extension in developer mode, feel free to run it. Should take less than a minute to calculate.

## I'm using Mozilla Firefox
Most of the code is about `XMLHttpRequest`, something not specifically related to Chrome, so most probably it'll be easy to port to a Firefox plugin.

## Warnings
- It's vulnerable to any XSS attacks! Use at your own risk and don't do stupid stuff.
- When I used to send requests without delay in-between, ecom suspected me of DOS attack and banned my public IP. Now, I'm making a 1-second interval between each request to the ecom. So, anyway, there's always the risk of getting suspected of DOS attack and getting banned. In that case, for me, turning off the router for a few minutes changed my public IP and thus removed my ban. If that didn't solve you problem, probably go to the ecom staff with your public IP to unban you (Note: The email they write when you get banned that you should send to doesn't work).
- I've done testing with different accounts and cases, but still I may have made a mistake here or there, so if I calculated it wrong and you suicided, I'm sorry!

## Next Steps
- Make good a good design. Perhaps even show the result and how it was calculated in a new tab.
- See if you can
- Perhaps, just perhaps, it could be
- Edit README.
