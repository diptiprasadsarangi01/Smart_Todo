import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";

export const downloadWeek = async (weekDataObj = {}) => {
  const days = Object.keys(weekDataObj);

  if (!days.length) {
    alert("No week data available");
    return;
  }

  // -----------------------------
  // Convert object into table rows
  // -----------------------------
  const tableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Day", bold: true })] })],
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Task Title", bold: true })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Priority", bold: true })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: "Due Date", bold: true })] })],
        }),
      ],
    }),
  ];

  // -----------------------------
  // Task rows
  // -----------------------------
  days.forEach((day) => {
    const tasks = weekDataObj[day] || [];

    if (tasks.length === 0) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(day)] }),
            new TableCell({ children: [new Paragraph("No tasks")] }),
            new TableCell({ children: [new Paragraph("-")] }),
            new TableCell({ children: [new Paragraph("-")] }),
          ],
        })
      );
      return;
    }

    tasks.forEach((task, i) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(i === 0 ? day : "")], // show day only once
            }),
            new TableCell({
              children: [new Paragraph(task.title)],
            }),
            new TableCell({
              children: [new Paragraph(task.priority)],
            }),
            new TableCell({
              children: [
                new Paragraph(
                  new Date(task.dueDate).toLocaleDateString("en-US")
                ),
              ],
            }),
          ],
        })
      );
    });
  });

  // -----------------------------
  // Final Document
  // -----------------------------
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Weekly Tasks Overview",
                bold: true,
                size: 32,
              }),
            ],
          }),

          new Paragraph({ text: "" }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `week-tasks.docx`);
};
