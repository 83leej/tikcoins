// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)");

const TIKTOK_ORIGIN = 'https://www.tiktok.com/';
    var obj = {};
    obj["sessionStart"] = null;
    obj["sessionEnd"] = null;
    obj["sessionRunning"] = false;
    chrome.storage.session.set(obj).then(() => {
       // console.log(obj);
    });
// service-worker.js

// Wrap in an onInstalled callback to avoid unnecessary work
// every time the service worker is run
chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // Declare a rule to enable the action on example.com pages
    let exampleRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostSuffix: '.tiktok.com'},
        })
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    // Finally, apply our new array of rules
    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
}
///////////////////////////////////////////
//// get url params from the ranklist
///////////////////////////////////////////
function getURLparams(data){ 
    var url = new URL(data);
    var c = url.searchParams.get("room_id");
    var c2 = url.searchParams.get("root_referer");
   // console.log(Object.fromEntries(data));
    var datas = new Array();
    datas[0] = c;
    datas[1] = c2;
    var obj= {};
    obj[datas[0]] = currentLiveTitle;
    chrome.storage.session.set(obj).then(() => {
      console.log(obj);
    });
    return datas;
}
///////////////////////////////////////////
//// Main data runner to fetch, parse and 
//// Store data in chromes local storage
///////////////////////////////////////////
function GetData(file) {
        var urldata = getURLparams(file);

var result = [];   
fetch(file).then((response) => {
    
        return response.json();

    }).then(json => {
        var users = json.data.ranks;

        Object.keys(users).forEach(function(key){

            var obj= {};

            var title = users[key].user.id;
            var coins = users[key].score;
            var nickname = users[key].user.nickname;
            var displayID = users[key].user.display_id;
            var displayDESC = users[key].user.bio_description;
            var displayRANK = users[key].rank;
            var userRestrictionLevel = users[key].user_restriction_level;
            var user_attris_admin = users[key].user.user_attr.is_admin;
            var userRole = users[key].user.user_role;
            var verified = users[key].user.verified;
            var is_channel_admin = users[key].user.user_attr.is_channel_admin;
            var is_muted = users[key].user.user_attr.is_muted;
            var is_super_admin = users[key].user.user_attr.is_super_admin;
            var mute_duration = users[key].user.user_attr.mute_duration;
            var spent = coins * 0.16420361247;

            var formObject =  {
                "formObject": [{
                    "LiveTitle": urldata[0],
                    "LiveURL": urldata[0],
                    "LiveID": urldata[0],
                    "ID": title,
                    "coins": coins,
                    "nickname": nickname,
                    "displayID": displayID,
                    "displayDESC": displayDESC,
                    "displayRANK": displayRANK,
                    "userRestrictionLevel": userRestrictionLevel,
                    "user_attris_admin": user_attris_admin,
                    "userRole": userRole,
                    "verified": verified,
                    "is_muted": is_muted,
                    "is_channel_admin": is_channel_admin,
                    "is_super_admin": is_super_admin,
                    "mute_duration": mute_duration,
                    "is_muted": is_muted,
                    "spent": spent
                }]
            };        

            
            obj[title] = formObject;
            chrome.storage.local.set(obj).then(() => {

            });

        });


        chrome.storage.session.get(null, function(items) {
            console.log(items);


        });
        chrome.storage.local.get(null, function(items) {
            var allKeys = Object.keys(items);
            var tcoins=0;
            var spenders=0;
            for (const [key, value] of Object.entries(items)) {
                tcoins = tcoins+value['formObject'][0].spent;
                    if(value['formObject'][0].spent>0.1){
                        spenders=spenders+1;
                    }
            }

        });
    });
}


    var currentLiveTitle = "";
    var currentLiveURL = "";
    var currentLiveID = 0;
    var found = true;

///////////////////////////////////////////
//// butchered way to get room info - needs reworking
///////////////////////////////////////////

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          console.log(tabs[0]);

  if(tabs[0].url.indexOf("/live") != -1){

      currentLiveTitle = tabs[0].title;
      currentLiveURL = tabs[0].url;
      currentLiveID = tabs[0].id;
  }
});
            

///////////////////////////////////////////
//// watch all webrequests for the ranklist
///////////////////////////////////////////

chrome.webRequest.onCompleted.addListener(function (details) {
    
    chrome.storage.session.get('sessionRunning', function (result) {
        is_session = result.sessionRunning;
        console.log(is_session);
    });
    
   // console.log(details);
  if(details.url.indexOf("/webcast/ranklist/online_audience/") != -1){
    if (is_session==true){
      //found=false;
      GetData(details.url);
    }
  }
}, {urls: ['<all_urls>']});

