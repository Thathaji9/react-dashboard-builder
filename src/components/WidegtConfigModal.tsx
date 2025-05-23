import React, { useState, useEffect } from "react";
import "./WidgetConfigModal.css";

interface WidgetConfigModalProps {
  widget: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({
  widget,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState(widget.data || {});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setFormData(widget.data || {});
    setValidationErrors({});
  }, [widget]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChartDatasetChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const parsed = value
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    setFormData((prev: any) => ({ ...prev, dataset: parsed }));
    if (validationErrors.dataset) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dataset;
        return newErrors;
      });
    }
  };

  const handleTableDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    try {
      const parsed = JSON.parse(value);
      setFormData((prev: any) => ({
        ...prev,
        columns: parsed.columns,
        rows: parsed.rows,
      }));
      if (validationErrors.tableData) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.tableData;
          return newErrors;
        });
      }
    } catch (error) {
      setFormData((prev: any) => ({ ...prev, rawTableData: value }));
      setValidationErrors((prev) => ({
        ...prev,
        tableData: "Invalid JSON format for table data.",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (widget.type === "text" && !formData.content?.trim()) {
      errors.content = "Text content cannot be empty.";
    }
    if (widget.type === "chart") {
      if (!formData.title?.trim())
        errors.title = "Chart title cannot be empty.";
      if (
        !Array.isArray(formData.dataset) ||
        formData.dataset.length === 0 ||
        formData.dataset.some(isNaN)
      ) {
        errors.dataset = "Dataset must be a comma-separated list of numbers.";
      }
    }
    if (widget.type === "table") {
      if (!formData.rawTableData?.trim()) {
        errors.tableData = "Table data cannot be empty.";
      } else {
        try {
          const parsed = JSON.parse(formData.rawTableData);
          if (!Array.isArray(parsed.columns) || !Array.isArray(parsed.rows)) {
            errors.tableData =
              'Table data must be a JSON object with "columns" (array) and "rows" (array).';
          }
        } catch (err) {
          errors.tableData = "Invalid JSON format for table data.";
        }
      }
    }
    if (widget.type === "d3") {
      if (isNaN(parseInt(formData.radius)) || parseInt(formData.radius) <= 0) {
        errors.radius = "Radius must be a positive number.";
      }
      if (!formData.color?.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
        errors.color = "Color must be a valid hex code (e.g., #RRGGBB).";
      }
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    let dataToSave = { ...formData };
    if (widget.type === "table" && formData.rawTableData) {
      try {
        const parsedTableData = JSON.parse(formData.rawTableData);
        dataToSave = { ...dataToSave, ...parsedTableData };
        delete dataToSave.rawTableData;
      } catch (e) {
        console.error("Failed to parse table data on submit", e);
        return;
      }
    }

    onSave(dataToSave);
  };

  const renderConfigFields = () => {
    switch (widget.type) {
      case "text":
        return (
          <>
            <label>Content:</label>
            <textarea
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              rows={5}
            />
            {validationErrors.content && (
              <p className="error-message">{validationErrors.content}</p>
            )}
          </>
        );
      case "chart":
        return (
          <>
            <label>Chart Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
            />
            {validationErrors.title && (
              <p className="error-message">{validationErrors.title}</p>
            )}

            <label>Dataset (comma-separated numbers):</label>
            <textarea
              name="dataset"
              value={
                Array.isArray(formData.dataset)
                  ? formData.dataset.join(", ")
                  : ""
              }
              onChange={handleChartDatasetChange}
              rows={3}
            />
            {validationErrors.dataset && (
              <p className="error-message">{validationErrors.dataset}</p>
            )}

            <label>Chart Type:</label>
            <select
              name="chartType"
              value={formData.chartType || "bar"}
              onChange={handleChange}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </>
        );
      case "table":
        const initialTableData = {
          columns: formData.columns || [],
          rows: formData.rows || [],
        };
        return (
          <>
            <label>Table Data (JSON format):</label>
            <textarea
              name="rawTableData"
              value={
                formData.rawTableData ||
                JSON.stringify(initialTableData, null, 2)
              }
              onChange={handleTableDataChange}
              rows={8}
            />
            {validationErrors.tableData && (
              <p className="error-message">{validationErrors.tableData}</p>
            )}
          </>
        );
      case "d3":
        return (
          <>
            <label>Radius:</label>
            <input
              type="number"
              name="radius"
              value={formData.radius || ""}
              onChange={handleChange}
            />
            {validationErrors.radius && (
              <p className="error-message">{validationErrors.radius}</p>
            )}

            <label>Color (Hex code):</label>
            <input
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
            />
            {validationErrors.color && (
              <p className="error-message">{validationErrors.color}</p>
            )}
          </>
        );
      default:
        return <p>No configurable options for this widget type.</p>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="widget-config-modal">
        <h3>
          Configure {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}{" "}
          Widget
        </h3>
        <form onSubmit={handleSubmit}>
          {renderConfigFields()}
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WidgetConfigModal;
