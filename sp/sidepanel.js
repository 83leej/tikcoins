///////////////////////////////////////////
////Get Percentage of 2 values
///////////////////////////////////////////
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
    console.log("url "+c, c2);
    var datas = new Array();
    datas[0] = c;
    datas[1] = c2;
    return datas;
}
///////////////////////////////////////////
//// Main data runner to fetch, parse and 
//// Store data in chromes local storage
///////////////////////////////////////////
function GetData(file) {
    
var list = document.getElementById('demo');
var result = [];   
fetch(file).then((response) => {
    
        return response.json();

    }).then(json => {
    var urldata = getURLparams(file);
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
            //console.log(title,nickname,displayID);

            var formObject =  {
                "formObject": [{
                    "LiveTitle": urldata[1],
                    "LiveURL": urldata[1],
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

            result += "<tr><td><a href='https://www.tiktok.com/@"+ displayID+"' target='_blank'>" + title + "</a></td><td> " + nickname + " </td><td> " + displayID + " </td><td> " + displayDESC + "</td><td> " + coins + "</td><td> " + spent + "</td><td> " + displayRANK + "</td><td> " + userRestrictionLevel + "</td><td> " + user_attris_admin + "</td><td> " + userRole + "</td><td> " + verified + "</td><td> " + is_channel_admin + "</td><td> " + is_muted + "</td><td> " + is_super_admin + "</td><td> " + mute_duration + "</td><td> " + urldata[1] + "</td><td> " + urldata[1] + "</td><td> " + urldata[0] + "</td></tr>";
            document.getElementById("demo").innerHTML = result;
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

            document.getElementById("userC").innerHTML = allKeys.length;
            document.getElementById("userT").innerHTML = tcoins;
            document.getElementById("userS").innerHTML = spenders+" %"+percentage(spenders,allKeys.length) ;
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
        currentLiveTitle = tabs[0].title;
        currentLiveURL = tabs[0].url;
        currentLiveID = tabs[0].id;
        document.getElementById("streamI").innerHTML = currentLiveTitle +" "+currentLiveURL +" ["+currentLiveID+"]";
    });
            

///////////////////////////////////////////
//// watch all webrequests for the ranklist
///////////////////////////////////////////

    chrome.webRequest.onCompleted.addListener(function (details) {    
        if(details.url.indexOf("/webcast/ranklist/online_audience/") != -1){

            //var urldata = getURLparams(details.url);
                
            if (found){
                //found=false;
                GetData(details.url);  
            }
        }


    }, {urls: ['<all_urls>']});