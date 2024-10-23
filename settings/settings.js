function dataLoad() {
    
    var list = document.getElementById('ExportList');
    var result = []; 
    var tcoins=0;
    var spenders=0;
    
    chrome.storage.local.get(null, function(items) {
        var allKeys = Object.keys(items);
        //console.log(items);


        
        for (const [key, value] of Object.entries(items)) {
                
                
            tcoins = tcoins+value['formObject'][0].spent;
                
            if(value['formObject'][0].spent>0.1){
                spenders=spenders+1;
            }
        result += "<tr class='tablerow'><td><a href='https://www.tiktok.com/@"+ value['formObject'][0].displayID+"' target='_blank'>" + value['formObject'][0].ID + "</a></td><td> " + value['formObject'][0].nickname + " </td><td> " + value['formObject'][0].displayID + " </td><td> " + value['formObject'][0].displayDESC + "</td><td> " + value['formObject'][0].coins + "</td><td> " + value['formObject'][0].spent + "</td><td> " + value['formObject'][0].displayRANK + "</td><td> " + value['formObject'][0].userRestrictionLevel + "</td><td> " + value['formObject'][0].user_attris_admin + "</td><td> " + value['formObject'][0].userRole + "</td><td> " + value['formObject'][0].verified + "</td><td> " + value['formObject'][0].is_channel_admin + "</td><td> " + value['formObject'][0].is_muted + "</td><td> " + value['formObject'][0].is_super_admin + "</td><td> " + value['formObject'][0].mute_duration + "</td><td> " + value['formObject'][0].LiveTitle + "</td><td> " + value['formObject'][0].LiveURL + "</td><td> " + value['formObject'][0].LiveID + "</td></tr>";
        }
        console.log("test");            
      ///  postDataToWebhook(spenders,tcoins,allKeys.length);
        
        document.getElementById("ExportList").innerHTML = result;
                
        document.getElementById("userC").innerHTML = allKeys.length;
        document.getElementById("userT").innerHTML = tcoins;
        document.getElementById("userS").innerHTML = spenders+" "+percentage(spenders,allKeys.length)+"%" ;
    });

}


function postDataToWebhook(spenders,coins,totalUsers){
  //get the values needed from the passed in json object

  //url to your webhook
  var webHookUrl="https://discord.com/api/webhooks/1288437599740104715/1-fFNhrH8N_lIX5TzPAZLXpzNKv1LBknylg_334kchFdvmMxctO8Mn-Mll-qoT5CZ_tW";
  
  //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var oReq = new XMLHttpRequest();
  var myJSONStr = payload={
      "content": "Currently tracking "+totalUsers+" users, "+spenders+" have spent a total of "+coins+" so far"

  };
  
//register method called after data has been sent method is executed
  oReq.addEventListener("load", reqListener);
  oReq.open("POST", webHookUrl,true);
  oReq.setRequestHeader('Content-Type', 'application/json');
  oReq.send(JSON.stringify(myJSONStr));
}
//callback method after webhook is executed
function reqListener () {
  console.log(this.responseText);
}





function percentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
}

dataLoad();


function exportData(all) {
    var exportdata = new Array();
    chrome.storage.local.get(null, function(data) {
        
        for (const [key, value] of Object.entries(data)) {
            if(value['formObject'][0].spent>0.1){
                exportdata.push(value);
            }
        }
        if(all==false){
            GrabFile(exportdata,"TIES");
            
        }
        if(all){
            // grab entire storage
            GrabFile(data,"TIE");
        }
        
    });
}

function GrabFile(data,name){
     var jsonData = JSON.stringify(data, null, 2);

      // Create a Blob containing the JSON data
      var blob = new Blob([jsonData], { type: 'application/json' });

      // Create a download link and trigger a click event to download the file
      var downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
        const fileName = Date.now();
      downloadLink.download = fileName+'-'+name+'.json';
      downloadLink.click();
    
}


const name1 = document.querySelector("#export");
const name2 = document.querySelector("#exportSpenders");

name1.addEventListener("click", function () {
    exportData(true);
});
name2.addEventListener("click", function () {
    exportData(false);
});




