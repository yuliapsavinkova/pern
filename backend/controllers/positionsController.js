// controllers/positionsController.js
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export const getPositions = async (req, res) => {
  const sheetName = req.query.sheet;
  const range = req.query.range;
  const ticker = req.query.ticker;
  console.log(sheetName);
  console.log(ticker);
  debugger;

  if (!sheetName || !range) {
    return res.status(400).json({ error: 'Sheet name and range are required' });
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching data from Google Sheets:', err);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
};
