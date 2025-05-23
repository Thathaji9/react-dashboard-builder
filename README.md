# Dynamic Dashboard Builder

A responsive and interactive dashboard application built with **React.js** and **TypeScript**, leveraging **React Grid Layout** for flexible grid management, **Recharts** for data visualization, and **D3.js** for custom interactive elements. This project allows users to dynamically create, arrange, resize, and configure various types of widgets on a grid-based layout, with robust data persistence via LocalStorage.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Running the Application](#running-the-application)
-   [Project Structure](#project-structure)
-   [Key Learnings & Challenges](#key-learnings--challenges)
-   [Future Enhancements](#future-enhancements)
-   [Screenshots](#screenshots)
-   [License](#license)
-   [Contact](#contact)

## Features

-   **Dynamic Widget Management:** Add new widgets via drag-and-drop from a toolbox, remove existing widgets, resize, and freely drag-and-drop widgets within the responsive grid.
-   **Multiple Widget Types:**
    -   **Text Widget:** Display and edit custom textual content.
    -   **Chart Widget:** Visualize data using interactive Bar, Line, and Pie charts (powered by Recharts). Customizable title, dataset, and chart type.
    -   **Table Widget:** Display tabular data with configurable columns and rows (editable via raw JSON input for flexibility).
    -   **D3.js Widget:** A custom interactive D3.js visualization (e.g., a dynamic circle) with configurable properties like radius and color.
-   **Interactive Grid Layout:** Utilizes `react-grid-layout` for a highly flexible, responsive, and intuitive drag-and-drop grid system.
-   **Widget Configuration Modal:** A dedicated modal for each widget type, allowing users to easily edit its content and properties with real-time validation.
-   **Dashboard Persistence:** Automatically saves the current dashboard layout and all widget-specific data to the browser's LocalStorage, ensuring state is retained across sessions.
-   **Responsive Design:** The dashboard and widgets adapt gracefully to different screen sizes and device orientations.
-   **User-Friendly UI/UX:**
    -   Clear "Edit" and "Remove" actions on each widget.
    -   A subtle drag handle (`⋮⋮`) for intuitive widget dragging.
    -   Informative "Drag widgets here to get started!" message when the dashboard is empty.
    -   Confirmation modal for clearing all widgets or removing individual ones.
    -   Input validation with clear error messages in the configuration modal.
-   **TypeScript:** The entire codebase is written in TypeScript, ensuring type safety, enhancing code readability, and improving maintainability.

## Technologies Used

-   **React.js:** Core frontend library for building component-based user interfaces.
-   **TypeScript:** Superset of JavaScript providing static type checking.
-   **React Grid Layout:** A powerful grid layout system for React, enabling drag-and-drop, resizing, and responsive layouts.
-   **Recharts:** A composable charting library built on React components for intuitive data visualization.
-   **D3.js:** Data-Driven Documents library used for creating custom, interactive visualizations.
-   **Vite:** A fast build tool and development server, chosen for its performance benefits.
-   **HTML5 & CSS3:** For structuring content and styling the application.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm or Yarn (npm is used in the commands below)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Thathaji9/react-dashboard-builder.git](https://github.com/Thathaji9/react-dashboard-builder.git)
    cd react-dashboard-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

To run the application in development mode:

```bash
npm run dev