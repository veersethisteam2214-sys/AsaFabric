const ASA_CONFIG = {
  folderId: '194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff',
  firstPage: 1,
  lastReferencePage: 5,
  lastPage: 32,
  ownerRanges: [
    [1, 12, 'Shaan'],
    [13, 24, 'Veer'],
    [25, 32, 'Krish'],
  ],
  controlSheet: 'Control Panel',
  masterSheet: 'Master List',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ASA Fabric')
    .addItem('Refresh Drive/page status', 'asaRefreshPageStatus')
    .addItem('Show pages missing PDF', 'asaShowMissingPdf')
    .addItem('Show pages needing check', 'asaShowNeedsCheck')
    .addToUi();
}

function asaPageName_(pageNo) {
  return 'Page ' + String(pageNo).padStart(2, '0');
}

function asaPageOwner_(pageNo) {
  for (const [start, end, owner] of ASA_CONFIG.ownerRanges) {
    if (pageNo >= start && pageNo <= end) return owner;
  }
  return '';
}

function asaPdfMap_() {
  const folder = DriveApp.getFolderById(ASA_CONFIG.folderId);
  const files = folder.getFiles();
  const map = {};
  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName();
    if (/^Page \d{2}\.pdf$/i.test(name)) map[name] = file.getUrl();
  }
  return map;
}

function asaHeaderMap_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((header, idx) => {
    if (header) map[String(header)] = idx + 1;
  });
  return map;
}

function asaColLetter_(col) {
  let s = '';
  while (col > 0) {
    const r = (col - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    col = Math.floor((col - 1) / 26);
  }
  return s;
}

function asaRefreshPageStatus() {
  const ss = SpreadsheetApp.getActive();
  const control = ss.getSheetByName(ASA_CONFIG.controlSheet);
  const master = ss.getSheetByName(ASA_CONFIG.masterSheet);
  if (!control || !master) throw new Error('Control Panel and Master List are required.');

  const c = asaHeaderMap_(control);
  const m = asaHeaderMap_(master);
  const controlPage = asaColLetter_(c['Page']);
  const pdfPresent = asaColLetter_(c['PDF in Drive']);
  const needsCheck = asaColLetter_(c['Needs Check']);
  const ok = asaColLetter_(c['OK']);
  const masterPage = asaColLetter_(m['Page']);
  const masterNeedsCheck = asaColLetter_(m['Needs Check']);
  const masterOk = asaColLetter_(m['OK']);
  const pdfs = asaPdfMap_();
  for (let pageNo = ASA_CONFIG.firstPage; pageNo <= ASA_CONFIG.lastPage; pageNo++) {
    const row = pageNo + 1;
    const page = asaPageName_(pageNo);
    const pageSheet = ss.getSheetByName(page);
    const pdfName = page + '.pdf';
    const pageCell = `${controlPage}${row}`;
    control.getRange(row, c['Page']).setValue(page);
    control.getRange(row, c['Owner']).setValue(asaPageOwner_(pageNo));
    control.getRange(row, c['PDF in Drive']).setValue(Boolean(pdfs[pdfName]));
    if (pdfs[pdfName]) control.getRange(row, c['PDF']).setFormula(`=HYPERLINK("${pdfs[pdfName]}","${pdfName}")`);
    if (pageSheet) control.getRange(row, c['Page Tab']).setFormula(`=HYPERLINK("#gid=${pageSheet.getSheetId()}","${page}")`);
    const needsUpdating = pageNo > ASA_CONFIG.lastReferencePage ? 'TRUE' : 'FALSE';
    control.getRange(row, c['Status']).setFormula(`=IF(${pdfPresent}${row}=FALSE,"MISSING PDF",IF(${needsUpdating},"NEED UPDATING",IF(${needsCheck}${row}>0,"CHECK",IF(${ok}${row}<${asaColLetter_(c['Lines'])}${row},"OPEN","DONE"))))`);
    control.getRange(row, c['Lines']).setFormula(`=COUNTIF('${ASA_CONFIG.masterSheet}'!${masterPage}:${masterPage},${pageCell})`);
    control.getRange(row, c['Needs Check']).setFormula(`=COUNTIFS('${ASA_CONFIG.masterSheet}'!${masterPage}:${masterPage},${pageCell},'${ASA_CONFIG.masterSheet}'!${masterNeedsCheck}:${masterNeedsCheck},TRUE)`);
    control.getRange(row, c['OK']).setFormula(`=COUNTIFS('${ASA_CONFIG.masterSheet}'!${masterPage}:${masterPage},${pageCell},'${ASA_CONFIG.masterSheet}'!${masterOk}:${masterOk},TRUE)`);
    if (pageNo > ASA_CONFIG.lastReferencePage && c['Notes']) {
      control.getRange(row, c['Notes']).setValue('NEED UPDATING - roll-level verification pending.');
    }
  }
  SpreadsheetApp.getUi().alert('Drive PDFs, page links, and status formulas refreshed.');
}

function asaShowMissingPdf() {
  asaShowPagesByStatus_('MISSING PDF', 'Pages missing PDF');
}

function asaShowNeedsCheck() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(ASA_CONFIG.controlSheet);
  if (!sheet) throw new Error('Control Panel sheet is missing.');
  const c = asaHeaderMap_(sheet);
  const values = sheet.getDataRange().getDisplayValues();
  const pages = [];
  for (let i = 1; i < values.length; i++) {
    if (Number(values[i][c['Needs Check'] - 1] || 0) > 0) pages.push(values[i][c['Page'] - 1]);
  }
  SpreadsheetApp.getUi().alert(pages.length ? pages.join(', ') : 'No pages currently need check.');
}

function asaShowPagesByStatus_(status, title) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(ASA_CONFIG.controlSheet);
  if (!sheet) throw new Error('Control Panel sheet is missing.');
  const c = asaHeaderMap_(sheet);
  const values = sheet.getDataRange().getDisplayValues();
  const pages = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i][c['Status'] - 1] === status) pages.push(values[i][c['Page'] - 1]);
  }
  SpreadsheetApp.getUi().alert(title + ': ' + (pages.length ? pages.join(', ') : 'none'));
}
