// Add this to Extensions > Apps Script in a Google Sheet.
// Publish as a Web app: Execute as ME; Who has access: Anyone.
const SHEET_NAME = 'Responses';
const HEADERS = [
  'Received at', 'Submission ID', 'Workshop code', 'Sequence',
  'Rock count', 'Paper count', 'Scissors count', 'Consecutive repeats',
  ...Array.from({length: 30}, (_, i) => 'Move ' + (i + 1))
];

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const id = String(data.id || '');
    const code = String(data.workshop_code || '').toUpperCase();
    const moves = String(data.moves || '').toUpperCase();
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27,40}$/i.test(id) ||
        !/^[A-Z0-9_-]{3,24}$/.test(code) ||
        !/^[RPS]{30}$/.test(moves)) {
      return ContentService.createTextOutput('Invalid submission');
    }
    const sheet = setupSheet();
    const last = sheet.getLastRow();
    // Idempotency: re-sending the same submission should not add a second row.
    if (last > 1) {
      const ids = sheet.getRange(2, 2, last - 1, 1).getValues();
      if (ids.some(row => row[0] === id)) return ContentService.createTextOutput('Already received');
    }
    const seq = moves.split('');
    const count = m => seq.filter(x => x === m).length;
    const repeats = seq.slice(1).filter((m, i) => m === seq[i]).length;
    sheet.appendRow([new Date(), id, code, moves, count('R'), count('P'), count('S'), repeats, ...seq]);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('Error');
  } finally {
    lock.releaseLock();
  }
}
