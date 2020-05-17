'use strict';

var logact = null;

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(response) {
            console.log(response.farewell);
        });
    });
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.logact == 'downvoted') {
        logact = 'downvoted';
    } else if (msg.logact == 'upvoted') {
        logact = 'upvoted';
    } else if (msg.logact == 'user commented') {
        logact = 'user commented on the answer';
    } else if (msg.logact == 'user shared') {
        logact = 'user shared the answer';
    } else if (msg.logact == 'user searched') {
        logact = 'user searched in the search field';
    } else if (msg.logact == 'scrolled') {
        logact = 'scrolled entire page';
    }


    if (logact != null)
        saveAction();
})


function saveAction() {
    // var req = new XMLHttpRequest();

    // req.open("POST","http://localhost:3000/api/action");

    // req.setRequestHeader("Content-Type","application/json");

    // req.send(JSON.stringify({'eventype': logact}));

    // req.onreadystatechange = function() 
    // { 
    //     if(req.readyState==4) 
    //     {console.log(req.responseText); 
    //     }

    // }
    fetch("https://hzsvc-dataprotectui-q-c.hzn-svc.use1.sqa.aws.asurion.net/dataprotect/ui/decrypt/v1/submit", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "none",
                "cache-control": "no-cache"
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": "{\n    \"c\": \"awskms:aes:1:enterprise.sprint@asurion.com||In4zZ4iRpf5DcwgB0SVyvR51NDxbCuKl157Wttqm7nDvZYRqbZq7eD2tpUskaOhk\"\n}",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
}