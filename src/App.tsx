import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import TextWidget from "./components/TextWidget";
import ChartWidget from "./components/ChartWidget";
import TableWidget from "./components/TableWidget";
import D3Widget from "./components/D3Widget";
import WidgetConfigModal from "./components/WidegtConfigModal";
import ConfirmationModal from "./components/ConfirmationModal";
import "./global.css";
import "./App.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "text" | "chart" | "table" | "d3";
  data?: any;
}

interface DraggableItem {
  type: Widget["type"];
  w: number;
  h: number;
}

const TOOLBOX_ITEMS: DraggableItem[] = [
  { type: "text", w: 2, h: 2 },
  { type: "chart", w: 4, h: 4 },
  { type: "table", w: 4, h: 4 },
  { type: "d3", w: 3, h: 3 },
];

function App() {
  const getDefaultWidgets = (): Widget[] => [
    {
      i: "1",
      x: 0,
      y: 0,
      w: 2,
      h: 3,
      type: "text",
      data: { content: "Welcome to your Dashboard!" },
    },
    {
      i: "2",
      x: 2,
      y: 0,
      w: 4.5,
      h: 4,
      type: "chart",
      data: {
        chartType: "bar",
        dataset: [10, 20, 30],
        title: "My First Chart",
      },
    },
    {
      i: "3",
      x: 7,
      y: 0,
      w: 3.5,
      h: 4,
      type: "table",
      data: {
        columns: ["Name", "Age"],
        rows: [
          { Name: "Alice", Age: 30 },
          { Name: "Bob", Age: 24 },
        ],
      },
    },
  ];
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const savedWidgets = localStorage.getItem("dashboardWidgets");
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        if (
          Array.isArray(parsed) &&
          parsed.every((w) => typeof w === "object" && w !== null && "i" in w)
        ) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse initial saved widgets:", e);
      }
    }
    return getDefaultWidgets();
  });

  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<DraggableItem | null>(null);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    if (widgets.length === 0 && gridKey !== 0) {
      setGridKey(0);
    } else if (widgets.length > 0 && gridKey === 0) {
      setGridKey((prev) => prev + 1);
    }
  }, [widgets, gridKey]);

  const saveDashboard = () => {
    localStorage.setItem("dashboardWidgets", JSON.stringify(widgets));
    alert("Dashboard layout saved successfully!");
  };

  const loadDashboard = () => {
    const savedWidgets = localStorage.getItem("dashboardWidgets");
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        if (
          Array.isArray(parsed) &&
          parsed.every((w) => typeof w === "object" && w !== null && "i" in w)
        ) {
          setWidgets(parsed);
          alert("Dashboard layout loaded successfully!");
        } else {
          alert("Saved data is corrupted. Loading default layout.");
          setWidgets(getDefaultWidgets());
        }
      } catch (e) {
        console.error("Failed to parse saved widgets:", e);
        alert("Error loading dashboard. Loading default layout.");
        setWidgets(getDefaultWidgets());
      }
    } else {
      alert("No saved dashboard found!");
    }
  };

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    const updatedWidgets = widgets.map((widget) => {
      const layoutItem = newLayout.find((item) => item.i === widget.i);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return widget;
    });

    const finalWidgets = updatedWidgets.filter((widget) =>
      newLayout.some((item) => item.i === widget.i && item.i !== "dummy")
    );

    setWidgets(finalWidgets);
  };

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: DraggableItem
  ) => {
    console.log(item);
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDrop = (
    _: ReactGridLayout.Layout[],
    droppedLayoutItem: ReactGridLayout.Layout,
    __: Event
  ) => {
    if (!draggingItem) {
      return;
    }

    const newId = `widget-${Date.now()}`;
    const newWidget: Widget = {
      i: newId,
      x: droppedLayoutItem.x,
      y: droppedLayoutItem.y,
      w: draggingItem.w,
      h: draggingItem.h,
      type: draggingItem.type,
      data: getDefaultWidgetData(draggingItem.type),
    };

    setWidgets((prevWidgets) => {
      const updated = [...prevWidgets, newWidget];
      return updated;
    });

    setDraggingItem(null);
  };

  const handleRemoveClick = (id: string) => {
    setWidgetToDelete(id);
  };

  const confirmRemoval = () => {
    if (widgetToDelete) {
      if (widgetToDelete === "all") {
        setWidgets([]);
        setEditingWidget(null);
        localStorage.removeItem("dashboardWidgets");
      } else {
        const updatedWidgets = widgets.filter((w) => w.i !== widgetToDelete);
        setWidgets(updatedWidgets);
        if (editingWidget && editingWidget.i === widgetToDelete) {
          setEditingWidget(null);
        }
      }
    }
    setWidgetToDelete(null);
  };

  const updateWidgetData = (id: string, newData: any) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.i === id
        ? { ...widget, data: { ...widget.data, ...newData } }
        : widget
    );
    setWidgets(updatedWidgets);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const getDefaultWidgetData = (type: Widget["type"]) => {
    switch (type) {
      case "text":
        return { content: 'New Text Block. Click "Edit" to change me!' };
      case "chart":
        return {
          chartType: "bar",
          dataset: [40, 25, 60, 15],
          title: "My New Chart",
        };
      case "table":
        return {
          columns: ["Product", "Quantity"],
          rows: [
            { Product: "A", Quantity: 10 },
            { Product: "B", Quantity: 20 },
          ],
        };
      case "d3":
        return { radius: 50, color: "#61dafb" };
      default:
        return {};
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "text":
        return <TextWidget content={widget.data?.content || ""} />;
      case "chart":
        return (
          <ChartWidget
            chartType={widget.data?.chartType || "bar"}
            data={widget.data?.dataset || []}
            title={widget.data?.title || ""}
          />
        );
      case "table":
        return (
          <TableWidget
            columns={widget.data?.columns || []}
            rows={widget.data?.rows || []}
          />
        );
      case "d3":
        return (
          <D3Widget
            radius={widget.data?.radius || 50}
            color={widget.data?.color || "#61dafb"}
          />
        );
      default:
        return <div>Unknown Widget Type</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dynamic Dashboard Builder</h1>
        <div className="dashboard-controls">
          <button onClick={saveDashboard} className="control-btn save-btn">
            Save Dashboard
          </button>
          <button onClick={loadDashboard} className="control-btn load-btn">
            Load Dashboard
          </button>
        </div>
      </header>
      <div className="main-content-area">
        <aside className="toolbox">
          <h2>Widgets</h2>
          {TOOLBOX_ITEMS.map((item) => (
            <div
              key={item.type}
              className="toolbox-item"
              draggable={true}
              onDragStart={(e) => onDragStart(e, item)}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Widget
              <span className="item-size">
                ({item.w}x{item.h})
              </span>
            </div>
          ))}
          <div className="clear-dashboard">
            <button onClick={() => setWidgetToDelete("all")}>
              Clear All Widgets
            </button>
          </div>
        </aside>
        <main className="dashboard-main" onDragOver={handleDragOver}>
          {widgets.length === 0 && (
            <div className="empty-dashboard-message">
              <h2>Drag widgets here to get started!</h2>
              <p>
                Choose a widget type from the left sidebar and drag it onto the
                dashboard.
              </p>
              <p>You can then edit, resize, and move them around.</p>
            </div>
          )}
          <ResponsiveGridLayout
            key={gridKey}
            useCSSTransforms={false}
            className="layout"
            layouts={{
              lg: widgets.map((w) => ({
                i: w.i,
                x: w.x,
                y: w.y,
                w: w.w,
                h: w.h,
              })),
            }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            onLayoutChange={onLayoutChange}
            compactType="vertical"
            preventCollision={false}
            draggableCancel=".widget-actions, .widget-actions button, .widget-actions span"
            draggableHandle=".widget-drag-handle"
            isDroppable={true}
            onDrop={onDrop}
            droppingItem={
              draggingItem
                ? { i: "__dropping__", w: draggingItem.w, h: draggingItem.h }
                : undefined
            }
          >
            {widgets?.map((widget) => (
              <div key={widget.i} className="widget-item">
                <div className="widget-drag-handle"></div>
                <h3 className="widget-title">
                  {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}{" "}
                  Widget
                  {widget.data?.title && `: ${widget.data.title}`}{" "}
                </h3>
                {renderWidgetContent(widget)}
                <div className="widget-actions">
                  <button
                    className="edit-widget-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingWidget(widget);
                    }}
                  >
                    Edit
                  </button>
                  <span
                    className="remove-widget"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveClick(widget.i);
                    }}
                  >
                    &times;
                  </span>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </main>
      </div>

      {editingWidget && (
        <WidgetConfigModal
          widget={editingWidget}
          onSave={(updatedData) => {
            updateWidgetData(editingWidget.i, updatedData);
            setEditingWidget(null);
          }}
          onClose={() => setEditingWidget(null)}
        />
      )}

      {widgetToDelete && (
        <ConfirmationModal
          message={
            widgetToDelete === "all"
              ? "Are you sure you want to remove ALL widgets from the dashboard?"
              : `Are you sure you want to remove this ${
                  widgets.find((w) => w.i === widgetToDelete)?.type
                } widget?`
          }
          onConfirm={() => confirmRemoval()}
          onCancel={() => setWidgetToDelete(null)}
        />
      )}
    </div>
  );
}

export default App;
