// Script da incollare in Estensioni → Apps Script del Google Sheet dei lead.
// Non serve modificare nulla: il codice segreto è già scritto qui sotto
// ed è lo stesso che trovi in .env.example (APPS_SCRIPT_SECRET).

var SHARED_SECRET = 'FPNBFm-m71_9-jTTJ9HMC-yZ6EIuQJxH';
var SPREADSHEET_ID = '1djnApjlN3Pr0ZbyjuF7LkazEth1_xPt5-F8VKGdValw';
var SHEET_NAME = 'Lead';
var HEADERS = ['Data', 'Nome', 'Cognome', 'Email', 'Libro', 'Ultimo accesso', 'Accessi'];

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss;
  try { ss = SpreadsheetApp.openById(SPREADSHEET_ID); } catch (e) { ss = SpreadsheetApp.getActiveSpreadsheet(); }
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.secret !== SHARED_SECRET) return json_({ ok: false, error: 'unauthorized' });
    var email = String(data.email || '').trim().toLowerCase();
    if (!email) return json_({ ok: false, error: 'missing email' });

    lock.waitLock(10000);
    var sh = getSheet_();
    var now = new Date();
    var last = sh.getLastRow();
    if (last > 1) {
      var emails = sh.getRange(2, 4, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).trim().toLowerCase() === email) {
          var r = i + 2;
          var count = Number(sh.getRange(r, 7).getValue()) || 1;
          sh.getRange(r, 2, 1, 2).setValues([[data.nome || '', data.cognome || '']]);
          sh.getRange(r, 6, 1, 2).setValues([[now, count + 1]]);
          return json_({ ok: true, updated: true });
        }
      }
    }
    sh.appendRow([now, data.nome || '', data.cognome || '', email, data.libro || '', now, 1]);
    return json_({ ok: true, created: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet() {
  return json_({ ok: true, service: 'lead-bonus' });
}
