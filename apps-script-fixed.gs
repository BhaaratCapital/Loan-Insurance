const SHEET_NAME = 'Sheet1';
const POSTS_SHEET = 'Posts';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.type === 'lead') {
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(['ID','Name','PAN','Phone','City',
          'Employment','Service','ServiceType','Timestamp','Source']);
      }
      sheet.appendRow([
        data.id, data.fullName, data.panNumber, data.phone,
        data.city, data.employment, data.service,
        data.serviceType, data.timestamp, data.source
      ]);
    }
    
    if (data.type === 'post') {
      let sheet = ss.getSheetByName(POSTS_SHEET);
      if (!sheet) {
        sheet = ss.insertSheet(POSTS_SHEET);
        sheet.appendRow(['ID','PostType','Title','Tag',
          'Content','ImageUrl','VideoUrl','CoverImage',
          'Caption','Description','Pinned','Timestamp']);
      }
      sheet.appendRow([
        data.id, data.postType, data.title, data.tag,
        data.content||'', data.imageUrl||'',
        data.videoUrl||'', data.coverImage||'',
        data.caption||'', data.description||'',
        data.pinned, data.timestamp
      ]);
    }

    if (data.type === 'delete_post' || data.type === 'delete_lead') {
      const sheetName = data.type === 'delete_post' ? POSTS_SHEET : SHEET_NAME;
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        const rows = sheet.getDataRange().getValues();
        for (let i = rows.length - 1; i >= 1; i--) {
          if (rows[i][0] === data.id) { sheet.deleteRow(i + 1); break; }
        }
      }
    }

    if (data.type === 'toggle_pin') {
      const sheet = ss.getSheetByName(POSTS_SHEET);
      if (sheet) {
        const rows = sheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][0] === data.id) {
            sheet.getRange(i + 1, 11).setValue(data.pinned);
            break;
          }
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({success:false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // ── GET se lead save karna (no-cors fallback) ──
    if (action === 'saveLead') {
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(['ID','Name','PAN','Phone','City',
          'Employment','Service','ServiceType','Timestamp','Source']);
      }
      sheet.appendRow([
        e.parameter.id || '',
        e.parameter.fullName || '',
        e.parameter.panNumber || '',
        e.parameter.phone || '',
        e.parameter.city || '',
        e.parameter.employment || '',
        e.parameter.service || '',
        e.parameter.serviceType || '',
        e.parameter.timestamp || new Date().toISOString(),
        e.parameter.source || 'contact.html'
      ]);
      return json({success: true});
    }

    if (action === 'getLeads') {
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) return json([]);
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) return json([]);
      const leads = rows.slice(1).map(r => ({
        id: r[0], fullName: r[1], panNumber: r[2], phone: r[3],
        city: r[4], employment: r[5], service: r[6],
        serviceType: r[7], timestamp: r[8], source: r[9]
      })).filter(l => l.id); // empty rows filter
      return json(leads);
    }
    
    if (action === 'getPosts') {
      const sheet = ss.getSheetByName(POSTS_SHEET);
      if (!sheet) return json([]);
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) return json([]);
      const posts = rows.slice(1).map(r => ({
        id: r[0], type: r[1], title: r[2], tag: r[3],
        content: r[4], imageUrl: r[5], videoUrl: r[6],
        coverImage: r[7], caption: r[8], description: r[9],
        pinned: r[10] === true || r[10] === 'true',
        timestamp: r[11]
      })).filter(p => p.id);
      return json(posts);
    }

    if (action === 'clearLeads') {
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (sheet && sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
      return json({success: true});
    }
    
    // Test ping
    if (action === 'ping') {
      return json({status: 'ok', message: 'Apps Script is working!'});
    }

    return json({error: 'Unknown action'});
  } catch(err) {
    return json({error: err.message});
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
