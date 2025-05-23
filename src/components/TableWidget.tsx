import React from "react";
import "./WidgetStyles.css";

interface TableWidgetProps {
  columns: string[];
  rows: { [key: string]: any }[];
}

const TableWidget: React.FC<TableWidgetProps> = ({ columns, rows }) => {
  const effectiveColumns =
    columns && columns.length > 0
      ? columns
      : rows && rows.length > 0
      ? Object.keys(rows[0])
      : [];

  return (
    <div className="widget-content table-widget">
      <h4 className="table-title">Data Table</h4>
      {effectiveColumns.length > 0 && rows && rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              {effectiveColumns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {effectiveColumns.map((col, colIndex) => (
                  <td
                    key={`<span class="math-inline">\{rowIndex\}\-</span>${colIndex}`}
                  >
                    {row[col] !== undefined ? row[col].toString() : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No table data provided. Click "Edit" to add some!</p>
      )}
    </div>
  );
};

export default TableWidget;
