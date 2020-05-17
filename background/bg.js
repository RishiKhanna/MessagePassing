'use strict';

var logact = null;

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { init: "extension clicked" }, function(response) {
            console.log(response.completed);
        });
    });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    const xhr = new XMLHttpRequest();
    xhr.open(msg.method, msg.url);
    xhr.setRequestHeader("content-type", "application/json");

    xhr.onload = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            const { decryptedData } = JSON.parse(this.responseText);
            sendResponse(decryptedData);
        }
    }

    xhr.send(JSON.stringify({ 'decryptedData': msg.body }));
    return true;
});


function saveAction() {

    // fetch("https://hzsvc-dataprotectui-q-c.hzn-svc.use1.sqa.aws.asurion.net/dataprotect/ui/decrypt/v1/submit", {
    //         "headers": {
    //             "accept": "*/*",
    //             "accept-language": "en-US,en;q=0.9",
    //             "content-type": "application/json",
    //             "sec-fetch-dest": "empty",
    //             "sec-fetch-mode": "cors",
    //             "sec-fetch-site": "none",
    //             "cache-control": "no-cache"
    //         },
    //         "referrerPolicy": "no-referrer-when-downgrade",
    //         "body": "{\n    \"c\": \"awskms:aes:1:enterprise.sprint@asurion.com||In4zZ4iRpf5DcwgB0SVyvR51NDxbCuKl157Wttqm7nDvZYRqbZq7eD2tpUskaOhk\"\n}",
    //         "method": "POST",
    //         "mode": "cors",
    //         "credentials": "omit"
    //     }).then(response => response.json())
    //     .then(data => {
    //         console.log('Success:', data);
    //     }).catch(error => {
    //         console.error('Error:', error);
    //     });
}