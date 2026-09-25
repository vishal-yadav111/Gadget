"use client";

export interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
  format?: "string" | "number" | "date" | "status" | "badge";
}

export interface ExcelExportOptions {
  filename: string;
  sheetName?: string;
  columns?: ExcelColumn[];
  rows?: Record<string, any>[];
  data?: Record<string, any>[];
  title?: string;
}

// CRC32 Table for standard ZIP checksums
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c;
}

function crc32(buffer: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buffer[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Escapes XML special characters for OpenXML
 */
function escapeXml(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Converts column index to Excel column letter (0 -> A, 25 -> Z, 26 -> AA)
 */
function getColumnLetter(colIndex: number): string {
  let temp = colIndex + 1;
  let letter = "";
  while (temp > 0) {
    let mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

interface ZipFileEntry {
  name: string;
  data: Uint8Array;
}

/**
 * Creates a standard PKZip archive containing the uncompressed (Stored, Method 0) OpenXML files.
 * Method 0 stored zip format is 100% compliant with the Open Packaging Conventions and Excel.
 */
function createZip(files: ZipFileEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralDirEntries: Uint8Array[] = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const fileCrc = crc32(file.data);
    const size = file.data.length;

    // Local file header (30 bytes + name length)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lView = new DataView(localHeader.buffer);
    lView.setUint32(0, 0x04034b50, true); // Local file header signature
    lView.setUint16(4, 20, true); // Version needed to extract (2.0)
    lView.setUint16(6, 0, true); // General purpose bit flag
    lView.setUint16(8, 0, true); // Compression method (0 = Stored / no compression)
    lView.setUint16(10, dosTime, true);
    lView.setUint16(12, dosDate, true);
    lView.setUint32(14, fileCrc, true);
    lView.setUint32(18, size, true); // Compressed size
    lView.setUint32(22, size, true); // Uncompressed size
    lView.setUint16(26, nameBytes.length, true);
    lView.setUint16(28, 0, true); // Extra field length
    localHeader.set(nameBytes, 30);

    localHeaders.push(localHeader);
    localHeaders.push(file.data);

    // Central directory header (46 bytes + name length)
    const cdEntry = new Uint8Array(46 + nameBytes.length);
    const cView = new DataView(cdEntry.buffer);
    cView.setUint32(0, 0x02014b50, true); // Central file header signature
    cView.setUint16(4, 20, true); // Version made by
    cView.setUint16(6, 20, true); // Version needed to extract
    cView.setUint16(8, 0, true); // General purpose bit flag
    cView.setUint16(10, 0, true); // Compression method
    cView.setUint16(12, dosTime, true);
    cView.setUint16(14, dosDate, true);
    cView.setUint32(16, fileCrc, true);
    cView.setUint32(20, size, true);
    cView.setUint32(24, size, true);
    cView.setUint16(28, nameBytes.length, true);
    cView.setUint16(30, 0, true); // Extra field length
    cView.setUint16(32, 0, true); // File comment length
    cView.setUint16(34, 0, true); // Disk number start
    cView.setUint16(36, 0, true); // Internal file attributes
    cView.setUint32(38, 0, true); // External file attributes
    cView.setUint32(42, offset, true); // Relative offset of local header
    cdEntry.set(nameBytes, 46);

    centralDirEntries.push(cdEntry);
    offset += localHeader.length + size;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const c of centralDirEntries) {
    centralDirSize += c.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eView = new DataView(eocd.buffer);
  eView.setUint32(0, 0x06054b50, true); // EOCD signature
  eView.setUint16(4, 0, true); // Disk number
  eView.setUint16(6, 0, true); // Disk with central directory
  eView.setUint16(8, files.length, true); // Total entries on this disk
  eView.setUint16(10, files.length, true); // Total entries
  eView.setUint32(12, centralDirSize, true); // Size of central directory
  eView.setUint32(16, centralDirOffset, true); // Offset of start of central directory
  eView.setUint16(20, 0, true); // ZIP comment length

  // Total size calculation
  let totalSize = offset + centralDirSize + 22;
  const zipBuffer = new Uint8Array(totalSize);
  let pos = 0;

  for (const chunk of localHeaders) {
    zipBuffer.set(chunk, pos);
    pos += chunk.length;
  }
  for (const chunk of centralDirEntries) {
    zipBuffer.set(chunk, pos);
    pos += chunk.length;
  }
  zipBuffer.set(eocd, pos);

  return zipBuffer;
}

/**
 * Builds the OpenXML worksheet XML
 */
function buildWorksheetXml(
  columns: ExcelColumn[],
  rows: Record<string, any>[],
  title?: string
): string {
  let currentRow = 1;
  let rowsXml = "";

  // Optional Title Row
  if (title) {
    rowsXml += `<row r="${currentRow}" ht="28" customHeight="1">`;
    rowsXml += `<c r="A${currentRow}" s="1" t="inlineStr"><is><t>${escapeXml(title)}</t></is></c>`;
    rowsXml += `</row>`;
    currentRow++;

    // Blank spacer row
    rowsXml += `<row r="${currentRow}" ht="10" customHeight="1"/>`;
    currentRow++;
  }

  // Header Row
  rowsXml += `<row r="${currentRow}" ht="26" customHeight="1">`;
  columns.forEach((col, idx) => {
    const cellRef = `${getColumnLetter(idx)}${currentRow}`;
    rowsXml += `<c r="${cellRef}" s="2" t="inlineStr"><is><t>${escapeXml(col.header)}</t></is></c>`;
  });
  rowsXml += `</row>`;
  currentRow++;

  // Data Rows
  rows.forEach((row, rowIdx) => {
    const isEven = rowIdx % 2 === 0;
    const defaultStyle = isEven ? 3 : 4; // 3 = DataEven, 4 = DataOdd

    rowsXml += `<row r="${currentRow}" ht="20" customHeight="1">`;
    columns.forEach((col, colIdx) => {
      const cellRef = `${getColumnLetter(colIdx)}${currentRow}`;
      const val = row[col.key];

      if (val === null || val === undefined || val === "") {
        rowsXml += `<c r="${cellRef}" s="${defaultStyle}" t="inlineStr"><is><t>—</t></is></c>`;
      } else if (typeof val === "number") {
        rowsXml += `<c r="${cellRef}" s="${defaultStyle}"><v>${val}</v></c>`;
      } else {
        const strVal = String(val).trim();
        const upper = strVal.toUpperCase();
        let style = defaultStyle;

        if (upper === "PASS" || upper === "ACTIVE" || upper === "VERIFIED") {
          style = 5; // Pass style (emerald)
        } else if (upper === "FAIL" || upper === "FAILED" || upper === "EXPIRED") {
          style = 6; // Fail style (rose)
        }

        rowsXml += `<c r="${cellRef}" s="${style}" t="inlineStr"><is><t>${escapeXml(strVal)}</t></is></c>`;
      }
    });
    rowsXml += `</row>`;
    currentRow++;
  });

  // Calculate Column Widths
  let colsXml = "<cols>";
  columns.forEach((col, idx) => {
    let width = col.width || 18;
    let maxLen = col.header.length;
    const sample = rows.slice(0, 50);
    for (const r of sample) {
      const v = r[col.key];
      if (v !== null && v !== undefined) {
        maxLen = Math.max(maxLen, String(v).length);
      }
    }
    width = Math.max(12, Math.min(maxLen + 4, 45));
    colsXml += `<col min="${idx + 1}" max="${idx + 1}" width="${width}" customWidth="1"/>`;
  });
  colsXml += "</cols>";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0">
      <pane ySplit="${title ? 3 : 1}" topLeftCell="A${title ? 4 : 2}" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  ${colsXml}
  <sheetData>
    ${rowsXml}
  </sheetData>
</worksheet>`;
}

/**
 * Builds the OpenXML Styles XML
 */
function buildStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <!-- 0: Default Segoe UI 10pt -->
    <font><sz val="10"/><color rgb="FF17284D"/><name val="Segoe UI"/><family val="2"/></font>
    <!-- 1: Header Title 14pt Bold -->
    <font><b/><sz val="14"/><color rgb="FF0052CC"/><name val="Segoe UI"/><family val="2"/></font>
    <!-- 2: Column Header 10pt Bold White -->
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/><family val="2"/></font>
    <!-- 3: Badge Font 9.5pt Bold -->
    <font><b/><sz val="9.5"/><name val="Segoe UI"/><family val="2"/></font>
  </fonts>
  <fills count="7">
    <!-- 0: None -->
    <fill><patternFill patternType="none"/></fill>
    <!-- 1: Gray125 -->
    <fill><patternFill patternType="gray125"/></fill>
    <!-- 2: Header Blue #0052CC -->
    <fill><patternFill patternType="solid"><fgColor rgb="FF0052CC"/></patternFill></fill>
    <!-- 3: Data Even White #FFFFFF -->
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/></patternFill></fill>
    <!-- 4: Data Odd Light Slate #F8FAFC -->
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>
    <!-- 5: Pass Emerald #ECFDF5 -->
    <fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>
    <!-- 6: Fail Rose #FFF1F2 -->
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFF1F2"/></patternFill></fill>
  </fills>
  <borders count="2">
    <!-- 0: None -->
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <!-- 1: Subtle Gray Border #DDE4F3 -->
    <border>
      <left style="thin"><color rgb="FFDDE4F3"/></left>
      <right style="thin"><color rgb="FFDDE4F3"/></right>
      <top style="thin"><color rgb="FFDDE4F3"/></top>
      <bottom style="thin"><color rgb="FFDDE4F3"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="7">
    <!-- 0: Default Cell -->
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center"/></xf>
    <!-- 1: Title Cell -->
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <!-- 2: Column Header Cell (#0052CC background, white text) -->
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <!-- 3: Data Even Row -->
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <!-- 4: Data Odd Row -->
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <!-- 5: Status PASS Cell -->
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <!-- 6: Status FAIL Cell -->
    <xf numFmtId="0" fontId="3" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
</styleSheet>`;
}

/**
 * Exports data to genuine Microsoft Excel (.xlsx) OpenXML binary workbook.
 * Natively opens in all Excel versions without format warnings!
 */
export function exportToExcel({
  filename,
  sheetName = "Report",
  columns,
  rows,
  data,
  title,
}: ExcelExportOptions): void {
  const actualRows = rows || data || [];

  // Infer columns if not explicitly provided
  let effectiveColumns = columns;
  if (!effectiveColumns || effectiveColumns.length === 0) {
    if (actualRows.length === 0) {
      console.warn("No rows or columns provided for Excel export.");
      return;
    }
    const keys = Object.keys(actualRows[0]);
    effectiveColumns = keys.map((key) => ({
      key,
      header: key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim(),
    }));
  }

  const cleanFilename = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;

  const encoder = new TextEncoder();

  // 1. [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  // 2. _rels/.rels
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  // 3. xl/_rels/workbook.xml.rels
  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  // 4. xl/workbook.xml
  const safeSheetName = escapeXml(sheetName.substring(0, 31).replace(/[\\/*?:[\]]/g, " "));
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <bookViews><workbookView xWindow="0" yWindow="0" windowWidth="20480" windowHeight="10240"/></bookViews>
  <sheets>
    <sheet name="${safeSheetName || "Sheet1"}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  // 5. xl/styles.xml
  const stylesXml = buildStylesXml();

  // 6. xl/worksheets/sheet1.xml
  const sheetXml = buildWorksheetXml(effectiveColumns, actualRows, title);

  const files: ZipFileEntry[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypesXml) },
    { name: "_rels/.rels", data: encoder.encode(rootRelsXml) },
    { name: "xl/_rels/workbook.xml.rels", data: encoder.encode(workbookRelsXml) },
    { name: "xl/workbook.xml", data: encoder.encode(workbookXml) },
    { name: "xl/styles.xml", data: encoder.encode(stylesXml) },
    { name: "xl/worksheets/sheet1.xml", data: encoder.encode(sheetXml) },
  ];

  // Package into true PKZip OpenXML .xlsx binary
  const zipBytes = createZip(files);

  const blob = new Blob([zipBytes as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default exportToExcel;
