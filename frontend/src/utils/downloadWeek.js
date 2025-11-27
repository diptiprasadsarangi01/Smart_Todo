import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

export const downloadWeek = async (weekDataObj = {}) => {
  const days = Object.keys(weekDataObj);

  if (!days.length) {
    alert("No week data available");
    return;
  }

  const tableRows = [];

  // -------------------------------------------------------
  // 🔷 HEADER
  // -------------------------------------------------------
  tableRows.push(
    new TableRow({
      children: [
        createHeaderCell("Day"),
        createHeaderCell("Task Title"),
        createHeaderCell("Priority"),
        createHeaderCell("Due Date"),
      ],
    })
  );

  // -------------------------------------------------------
  // ROWS with PROPER ROWSPAN LOGIC
  // -------------------------------------------------------
  days.forEach((day) => {
    const tasks = weekDataObj[day] || [];

    // -------------------------------------------
    // ⭐ CASE 1: No tasks
    // -------------------------------------------
    if (tasks.length === 0) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: "F0F0F0" },
              borders: cellBorders,
              children: [new Paragraph(day)],
            }),
            createCell("No tasks"),
            createCell("-"),
            createCell("-"),
          ],
        })
      );
      return;
    }

    // -------------------------------------------
    // ⭐ CASE 2: Tasks exist — use ROWSPAN
    // -------------------------------------------
    const rowSpanCount = tasks.length;

    tasks.forEach((task, index) => {
      const rowCells = [];

      // First row → add DAY cell with actual rowSpan
      if (index === 0) {
        rowCells.push(
          new TableCell({
            rowSpan: rowSpanCount,
            verticalAlign: "center",
            shading: { fill: "F0F0F0" },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: day, bold: true })],
              }),
            ],
          })
        );
      }

      // 🔥 IMPORTANT:
      // On merged rows, DO NOT insert any placeholder cell.
      // Word automatically applies rowspan correctly when omitted.

      // Task Title
      rowCells.push(createCell(task.title));

      // Priority Badge
      rowCells.push(createPriorityCell(task.priority));

      // Due Date
      rowCells.push(
        createCell(
          new Date(task.dueDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        )
      );

      tableRows.push(new TableRow({ children: rowCells }));
    });
  });

  // -------------------------------------------------------
  // 🔷 FINAL DOC
  // -------------------------------------------------------
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "📅 Weekly Tasks Overview",
                bold: true,
                size: 36,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "week-tasks.docx");
};

/* ========================================================
    ⭐ Helper Functions
======================================================== */

function createHeaderCell(text) {
  return new TableCell({
    shading: { fill: "E5E5E5" },
    borders: cellBorders,
    margins: { top: 200, bottom: 200, left: 200, right: 200 },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true })],
      }),
    ],
  });
}

// Normal Cell
function createCell(text) {
  return new TableCell({
    borders: cellBorders,
    margins: { top: 200, bottom: 200, left: 200, right: 200 },
    children: [new Paragraph(String(text))],
  });
}

// Priority badge
function createPriorityCell(priority) {
  const colors = {
    high: "FF4C4C", // red
    medium: "FFA500", // orange
    low: "4CAF50", // green
  };

  const bg = colors[priority?.toLowerCase()] || "DDDDDD";

  return new TableCell({
    shading: { fill: bg },
    borders: cellBorders,
    margins: { top: 150, bottom: 150, left: 150, right: 150 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: priority.toUpperCase(),
            bold: true,
            color: "FFFFFF",
          }),
        ],
      }),
    ],
  });
}

/* ========================================================
    ⭐ Borders
======================================================== */

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: "808080" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "808080" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "808080" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "808080" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "B0B0B0" },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "B0B0B0" },
};

const cellBorders = {
  top: { style: BorderStyle.SINGLE, color: "A0A0A0", size: 1 },
  bottom: { style: BorderStyle.SINGLE, color: "A0A0A0", size: 1 },
  left: { style: BorderStyle.SINGLE, color: "A0A0A0", size: 1 },
  right: { style: BorderStyle.SINGLE, color: "A0A0A0", size: 1 },
};
