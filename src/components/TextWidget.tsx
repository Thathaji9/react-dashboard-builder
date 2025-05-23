import React from "react";
import "./WidgetStyles.css";

interface TextWidgetProps {
  content: string;
}

const TextWidget: React.FC<TextWidgetProps> = ({ content }) => {
  return (
    <div className="widget-content text-widget">
      <h4>Text Content</h4>
      <p>{content || "No text content provided."}</p>
    </div>
  );
};

export default TextWidget;
