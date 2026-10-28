/**
 * MonteRojo · Receptor de respuestas para Google Sheets.
 * Pegar en Extensiones > Apps Script de la hoja de cálculo y publicar como
 * aplicación web (Ejecutar como: yo / Acceso: Cualquier persona).
 */

// Códigos de las 18 preguntas (los no respondidos quedan en blanco)
var QUESTION_CODES = [
  'SH01-1', 'SH01-2', 'SH03-1', 'SH03-2', 'PMV02-1', 'PMV02-2',
  'EF01-1', 'EF01-2', 'EF02-1', 'EF02-2', 'EF03-1', 'EF03-2',
  'CM01-1', 'CM01-2', 'CM02-1', 'CM02-2', 'CM03-1', 'CM03-2'
];

var BASE_COLUMNS = [
  'timestamp', 'participantId', 'alias', 'ageRange',
  'initialAnswer', 'path'
];
var END_COLUMNS = ['totalA', 'totalB', 'profile', 'userAgent'];

function getHeaders_() {
  return BASE_COLUMNS.concat(QUESTION_CODES, END_COLUMNS);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // evita filas mezcladas con envíos simultáneos
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSheet();
    var headers = getHeaders_();

    // Crea la fila de encabezados la primera vez
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    var row = headers.map(function (h) {
      return data[h] !== undefined && data[h] !== null ? data[h] : '';
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Útil para comprobar en el navegador que el despliegue está activo
function doGet() {
  return ContentService.createTextOutput('MonteRojo endpoint activo');
}
