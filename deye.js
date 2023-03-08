// Auslesen der Datenpunkte eines Solarinverters Deye Solar SUN600 und baugleiche
// (Bosswerk MI600, ..)? 
// --------------------------------------------------------------------------------
// Erstellt: 01.2023 Achim Bäcker
// ================================================================================
 
// Die Daten werden ohne externe App + Verbindung (bsp: Solarman) über den
// Webserver im Inverter abgerufen. 
// 
// Hierzu im Inverter das WLan einstellen und eine IP vergeben bzw. DHCP aktivieren. 
// 
// ================================================================================
// Einrichten:
// 1. Variable SolarFolder anpassen... hier werden die Datenpunkte erstellt
//    Funktion CreateDatapoints einmalig aufrufen
// 2. Über den Radar2-Adapter schaue ich das der Inverter online ist (er schaltet
//    sich bei zu wenig Sonne aus) Online-ID in SolarOnlineVar eintragen
// 3. Url des Inverters anpassen (SolarUrl) , Username und Passwort müssen mit übergeben
//     werden, am besten erst einmal die Url im Browser testen. Wenn die Url passt, öffnet 
//    sich eine Webseite wo man nur Striche sieht. Hier im Browser Quelltext 
//    anzeigen wählen... noch vor dem Body ist eine Liste mit den Aktualwerten
// 
// Hier auf eigene Anlage anpassen
var SolarFolder     = "0_userdata.0.Bosswerk1";
var SolarOnlineVar  = "radar2.0.Solar._here";    
var SolarUrl        ="http://admin:admin@192.168.1.18/status.html";
 
// Datenpunkte erstellen, kann nach einmaligem Aufruf deaktiviert werden
 
CreateDatapoints(SolarFolder);   // <<<<<----- Einmalig aufrufen
 
 
// ================================================================================
 
schedule('*/5 5-22 * * *', GetData); // zwischen 5-22Uhr alle 5min ausführen
 
 
function GetData(){
    // zyklisches abholen der Daten, falls Solaranlage online ist
    var SolarIsOnline = getState(SolarOnlineVar).val;
    if (SolarIsOnline) {
        getWebsite();
    }
}
 
var http=require('http');
 
function getWebsite(){
    // laden der Website und wandeln in ein Zeilen-Array
    // Werte Suchen und wegschreiben 
 
    http.get(SolarUrl, function(res){
        var str = "";
        console.log('Response is '+res.statusCode);
 
        if (res.statusCode != 200) {
            console.log("non-200 response status code:", res.statusCode);
            console.log("for url:", SolarUrl);
            res.resume();
            return;
        }
 
        res.on('data', function (chunk) {
                str += chunk;
        });
 
        res.on('end', function () {
            var arr = str.split("\n");
            readSolData(arr, "webdata_sn");
            readSolData(arr, "webdata_msvn");
            readSolData(arr, "webdata_ssvn");
            readSolData(arr, "webdata_pv_type");
            readSolData(arr, "webdata_rate_p");
            readSolData(arr, "webdata_now_p", true);
            readSolData(arr, "webdata_today_e", true);
            readSolData(arr, "webdata_total_e", true);
            readSolData(arr, "webdata_alarm");
            readSolData(arr, "webdata_utime");
            readSolData(arr, "cover_mid");
            readSolData(arr, "cover_ver");
            readSolData(arr, "cover_wmode");
            readSolData(arr, "cover_ap_ssid");
            readSolData(arr, "cover_ap_ip");
            readSolData(arr, "cover_ap_mac");
            readSolData(arr, "cover_sta_ssid");
            readSolData(arr, "cover_sta_rssi");
            readSolData(arr, "cover_sta_ip");
            readSolData(arr, "cover_sta_mac");
            readSolData(arr, "status_a");
            readSolData(arr, "status_b");
            readSolData(arr, "status_c");
 
        });
 
    });
 }
 
function readSolData(arr, dataPoint, isNumber = false){
    // Suchen des "dataPoint" und lesen dew zugehörigen Wertes,
    // dieser wird dann in den gleichnamigen Datenpunkt geschrieben
    var sub;
    var dpSearch = "var " + dataPoint;
     
     for (var i = 0; i < arr.length; i++){
        if (arr[i].includes(dpSearch)) {
            sub = arr[i].split("\"");
            var res = sub[1];
 
            if (isNumber){
                res = parseFloat(res);
            }
            
            setState(SolarFolder + '.' + dataPoint, res);
 
            break;
           } 
        }
}
 
function CreateDatapoints(myFolder){
    // Datenpunkte anlegen, muss nur einmalig aufgerufen werden
     createState(myFolder + '.' + 'cover_ap_ip', '', {type: 'string',name: 'cover_ap_ip',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_ap_mac', '', {type: 'string',name: 'cover_ap_mac',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_ap_ssid', '', {type: 'string',name: 'cover_ap_ssid',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_mid', '', {type: 'string',name: 'cover_mid',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_sta_ip', '', {type: 'string',name: 'cover_sta_ip',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_sta_mac', '', {type: 'string',name: 'cover_sta_mac',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_sta_rssi', '', {type: 'string',name: 'cover_sta_rssi',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_sta_ssid', '', {type: 'string',name: 'cover_sta_ssid',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_ver', '', {type: 'string',name: 'cover_ver',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'cover_wmode', '', {type: 'string',name: 'cover_wmode',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'status_a', '', {type: 'string',name: 'status_a',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'status_b', '', {type: 'string',name: 'status_b',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'status_c', '', {type: 'string',name: 'status_c',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_alarm', '', {type: 'string',name: 'webdata_alarm',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_msvn', '', {type: 'string',name: 'webdata_msvn',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_now_p', 0, {type: 'number',name: 'webdata_now_p',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_pv_type', '', {type: 'string',name: 'webdata_pv_type',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_rate_p', '', {type: 'string',name: 'webdata_rate_p',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_sn', '', {type: 'string',name: 'webdata_sn',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_ssvn', '', {type: 'string',name: 'webdata_ssvn',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_today_e', 0, {type: 'number',name: 'webdata_today_e',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_total_e', 0, {type: 'number',name: 'webdata_total_e',read: true,write: true,role: 'state'});
     createState(myFolder + '.' + 'webdata_utime', '', {type: 'string',name: 'webdata_utime',read: true,write: true,role: 'state'});
 
     }
 
 
 
