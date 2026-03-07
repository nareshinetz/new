import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { myTheme } from "./AgGridTheme";

const AgGridTable = ({
  rowData = [],
  columnDefs = [],
  totalRows = 0,
  loadingMessage = "Loading data...",
  onPaginationChanged
}) => {

  const rows = Array.isArray(rowData) ? rowData : [];

  const calculatedHeight = useMemo(() => {
    const headerHeight = 56;   // AG Grid default
    const rowHeight = 42;      // AG Grid default
    const paginationHeight = 60; // bottom pagination area
    const maxRows = 10;

    if (rows.length === 0) {
      return 180;
    }

    const visibleRows = Math.min(rows.length, maxRows);

    return headerHeight + (visibleRows * rowHeight) + paginationHeight;
  }, [rows.length]);

  return (
    <div style={{ height: calculatedHeight, width: "100%" }}>
      <AgGridReact
        theme={myTheme}
        rowData={rows}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        rowHeight={42}
        headerHeight={56}
        animateRows={true}
        domLayout="normal"
        onPaginationChanged={onPaginationChanged}
        
      />
    </div>
  );
};

export default AgGridTable;