# Complete Backend API Implementation Guide for QC Reports

This guide provides the complete, copy-paste-ready Node.js/Express and SQL implementation to create all 6 QC Report endpoints in your backend project:
`c:\Users\Vishal Yadav\Desktop\inhouse_xcqc_brahma_backend_apis` (running at `http://localhost:5009`).

---

## 📁 1. Projec
St Structure in your Backend

Ensure your `inhouse_xcqc_brahma_backend_apis` repository has the following files:

```text
inhouse_xcqc_brahma_backend_apis/
├── .env
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js                  <-- MSSQL Database Connection Pool
│   ├── controllers/
│   │   └── report.controller.js   <-- All 6 Report Handlers & SQL Queries
│   └── routes/
│       └── report.routes.js       <-- Express Routes under /Report
```

---

## 📦 2. Install Required Dependencies

If you haven't already installed `mssql` and `cors`, run this command in your backend project directory:

```bash
npm install mssql cors dotenv express
```

---

## ⚙️ 3. Database Connection (`src/config/db.js`)

Create or update `src/config/db.js` with your SQL Server connection:

```javascript
// src/config/db.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'your_db_password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'XtraCover_QC',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true for Azure, false for local/on-prem
    trustServerCertificate: true, // true for self-signed certificates
    enableArithAbort: true,
  },
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log('✅ Connected to SQL Server Database');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed! Bad Config: ', err);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
};
```

Add these settings to your `.env` file:
```env
PORT=5009
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_SERVER=your_sql_server_ip_or_host
DB_NAME=your_database_name
DB_PORT=1433
DB_ENCRYPT=false
```

---

## 🎮 4. Report Controller (`src/controllers/report.controller.js`)

This controller handles:
1. **Laptop QC Reports** (`tbl_QCResult_LP`)
2. **Mobile QC Reports** (`tbl_QCResult`)
3. **Motherboard QC Reports** (`tbl_QCResult_MB`)
4. **Motherboard Housing QC Reports** (`tbl_QCResult_MH`)
5. **Desktop QC Reports** (`tbl_QCResult_DT`)
6. **Desktop Motherboard QC Reports** (`tbl_QCResult_DTMB`)

```javascript
// src/controllers/report.controller.js
const { sql, poolPromise } = require('../config/db');

/**
 * Generic helper to query QC tables supporting:
 * - DataTables pagination (start, length, draw)
 * - Date range filters (FromDate, ToDate)
 * - Global search (search[value])
 * - Column-specific filters (brand, model, imei, serial, status, uid)
 */
async function queryQcTable(req, res, tableName) {
  try {
    const pool = await poolPromise;
    const body = req.body || {};

    const draw = parseInt(body.draw || 1, 10);
    const start = parseInt(body.start || 0, 10);
    const length = parseInt(body.length || 50, 10);
    const searchValue = (body.search && body.search.value) ? body.search.value.trim() : (body.Search || body.search || '').trim();

    // Custom Filters
    const fromDate = body.FromDate || body.fromDate || null;
    const toDate = body.ToDate || body.toDate || null;
    const uid = body.uid || body.UserId || null;
    const status = body.status || body.QCResult || null;

    let whereClauses = ['1=1'];
    const request = pool.request();

    // Filter by User ID / Partner ID
    if (uid && uid !== '0' && uid !== 'ALL') {
      whereClauses.push('(uid = @uid OR CreatedBy = @uid)');
      request.input('uid', sql.NVarChar, uid);
    }

    // Filter by Date Range
    if (fromDate) {
      whereClauses.push('CreatedOn >= @fromDate');
      request.input('fromDate', sql.DateTime, new Date(fromDate));
    }
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      whereClauses.push('CreatedOn <= @toDate');
      request.input('toDate', sql.DateTime, endOfDay);
    }

    // Filter by QC Result / Test Status
    if (status && status !== 'ALL') {
      whereClauses.push('(QCResult = @status OR test_status = @status)');
      request.input('status', sql.NVarChar, status);
    }

    // Global Search across common identifiers
    if (searchValue) {
      whereClauses.push(`(
        imei_1 LIKE @search OR 
        serial_number LIKE @search OR 
        brand_name LIKE @search OR 
        model_name LIKE @search OR 
        uid LIKE @search OR
        certificate_number LIKE @search OR
        workorderid LIKE @search
      )`);
      request.input('search', sql.NVarChar, `%${searchValue}%`);
    }

    const whereSql = whereClauses.join(' AND ');

    // 1. Get Total Count
    const totalCountResult = await pool.request().query(`SELECT COUNT(*) AS total FROM ${tableName}`);
    const recordsTotal = totalCountResult.recordset[0].total;

    // 2. Get Filtered Count
    const countQuery = `SELECT COUNT(*) AS filtered FROM ${tableName} WHERE ${whereSql}`;
    const filteredCountResult = await request.query(countQuery);
    const recordsFiltered = filteredCountResult.recordset[0].filtered;

    // 3. Get Paginated Data
    // Re-bind inputs for the data query
    const dataRequest = pool.request();
    if (uid && uid !== '0' && uid !== 'ALL') dataRequest.input('uid', sql.NVarChar, uid);
    if (fromDate) dataRequest.input('fromDate', sql.DateTime, new Date(fromDate));
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      dataRequest.input('toDate', sql.DateTime, endOfDay);
    }
    if (status && status !== 'ALL') dataRequest.input('status', sql.NVarChar, status);
    if (searchValue) dataRequest.input('search', sql.NVarChar, `%${searchValue}%`);

    dataRequest.input('offset', sql.Int, start);
    dataRequest.input('limit', sql.Int, length);

    const dataQuery = `
      SELECT * 
      FROM ${tableName}
      WHERE ${whereSql}
      ORDER BY mstid DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const dataResult = await dataRequest.query(dataQuery);

    // Return exact format expected by DataTables and GadgetIQ UI
    return res.status(200).json({
      draw: draw.toString(),
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: dataResult.recordset,
    });
  } catch (error) {
    console.error(`Error querying ${tableName}:`, error);
    return res.status(500).json({
      RespCode: 500,
      RespMsg: error.message || 'Internal Server Error',
      data: [],
      recordsTotal: 0,
      recordsFiltered: 0,
    });
  }
}

// 1. Laptop QC Reports
exports.getLaptopReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult_LP');
};

// 2. Mobile QC Reports
exports.getMobileReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult');
};

// 3. Motherboard QC Reports
exports.getMotherboardReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult_MB');
};

// 4. Motherboard Housing QC Reports
exports.getMotherboardHousingReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult_MH');
};

// 5. Desktop QC Reports
exports.getDesktopReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult_DT');
};

// 6. Desktop Motherboard QC Reports
exports.getDesktopMotherboardReports = async (req, res) => {
  return queryQcTable(req, res, 'tbl_QCResult_DTMB');
};
```

---

## 🛣️ 5. Report Routes (`src/routes/report.routes.js`)

Create `src/routes/report.routes.js`:

```javascript
// src/routes/report.routes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// 1. Laptop Reports
router.post('/Get_AddOnViewQcResultlp', reportController.getLaptopReports);

// 2. Mobile Reports (supports both legacy endpoints)
router.post('/Get_AddOnViewQcResult', reportController.getMobileReports);
router.post('/GetQCWorkOrderList', reportController.getMobileReports);

// 3. Motherboard Reports
router.post('/Get_AddOnViewQcResultmb', reportController.getMotherboardReports);

// 4. Motherboard Housing Reports
router.post('/Get_AddOnViewQcResultmh', reportController.getMotherboardHousingReports);

// 5. Desktop Reports
router.post('/Get_AddOnViewQcResultdt', reportController.getDesktopReports);

// 6. Desktop Motherboard Reports
router.post('/Get_AddOnViewQcResultdtmb', reportController.getDesktopMotherboardReports);

module.exports = router;
```

---

## 🚀 6. Mount Router in App (`src/app.js`)

Add the `/Report` route in `src/app.js`:

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const reportRoutes = require('./routes/report.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Maps both /Report/... and /api/evaluate/... to our controller
app.use('/Report', reportRoutes);
app.use('/api/evaluate', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`🚀 Brahma Backend API Server running on port ${PORT}`);
});

module.exports = app;
```

---

## 🧪 7. Verification & Testing

Start your backend server:
```bash
npm run dev
# or: node src/app.js
```

Test with `curl` or Postman:

```bash
# Test Laptop Reports (POST)
curl -X POST http://localhost:5009/Report/Get_AddOnViewQcResultlp \
  -H "Content-Type: application/json" \
  -d '{"draw": 1, "start": 0, "length": 10}'
```

Expected JSON response:
```json
{
  "draw": "1",
  "recordsTotal": 435,
  "recordsFiltered": 435,
  "data": [
    {
      "mstid": 617357,
      "brand_name": "HP",
      "model_name": "HP 240 G7 Notebook PC",
      "serial_number": "5CG9456ZV6",
      "Processor_Family": "Core i3",
      "Generation": "8th Gen",
      "RAM": "8GB",
      "storage": "256.05 GB (RAID SSD 256.05 GB 100% GOOD)",
      "battery_capacity": "34.43 Wh",
      "B_BatteryHealth": "Good",
      "QCResult": "PASS"
    }
  ]
}
```

Once running, refresh `http://localhost:3000/gadgetiq/reports/laptop` — all 435+ live laptop records with detailed hardware specifications will load instantly!
