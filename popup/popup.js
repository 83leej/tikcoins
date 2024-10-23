   var is_session = false;
chrome.storage.session.get('sessionRunning', function (result) {
   is_session = result.sessionRunning;
    console.log(is_session);
    if(is_session==false){
        document.getElementById("sessionStatus").innerHTML = "Stopped";
        document.getElementById("startSession").innerHTML = "Start Session";
    }else{
        document.getElementById("sessionStatus").innerHTML = "Running";
        document.getElementById("startSession").innerHTML = "Stop Session";
    }
});

   


const name1 = document.querySelector("#startSession");

name1.addEventListener("click", function () {
    if(is_session==false){
        activateSession();
        is_session = true;
    }else{
        deactivatedSession(); 
        is_session = false;
    }
});

function activateSession(){
    chrome.storage.session.set( { sessionRunning: true } );
    document.getElementById("sessionStatus").innerHTML = "Running";
    document.getElementById("startSession").innerHTML = "Stop Session";
    
    var ssss = {};
    ssss = GetCurrentTab();
        console.log("logged-1", GetCurrentTab());
        chrome.storage.session.set( { sessionURL: ssss.url } );
        chrome.storage.session.set( { sessionTITLE: ssss.title } );
        chrome.storage.session.set( { sessionWID: ssss.id } );

    
    
    console.log("Started Session");
    //GetCurrentTab();
}

function deactivatedSession(){
    chrome.storage.session.set( { sessionRunning: false } );
    document.getElementById("sessionStatus").innerHTML = "Stopped";
    document.getElementById("startSession").innerHTML = "Start Session";
    console.log("Stopped Session");

}


function GetCurrentTab(){
    var blah =chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log("logged", tabs[0]);
     return tabs[0];
});
    console.log("logged-t", blah);
    return blah;
}