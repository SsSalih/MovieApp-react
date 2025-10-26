import React from "react";
import "../../index.css";

export default function BootstrapPagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
  maxButtons = 4,
}) {
  if (totalPages <= 1) return null;

  const createRange = () => {
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    
    while (end - start + 1 < maxButtons && (start > 1 || end < totalPages)) {
      if (start > 1) start -= 1;
      if (end < totalPages) end += 1;
      if (start === 1 && end === totalPages) break;
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return { pages, start, end };
  };

  const { pages } = createRange();

  const handleClick = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <nav aria-label="Sayfa navigasyonu" className="d-flex justify-content-center p-4 bg-dark">
  <ul className="pagination mb-0">
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        style={{
          backgroundColor: "#222",
          color: "#f1f1f1",
          borderColor: "#444",
        }}
        onClick={() => handleClick(currentPage - 1)}
        aria-label="Önceki"
      >
        &laquo;
      </button>
    </li>

    {pages.map((p) => (
      <li
        key={p}
        className={`page-item ${p === currentPage ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handleClick(p)}
          style={{
            backgroundColor: p === currentPage ? "#555" : "#222",
            color: "#f1f1f1",
            borderColor: "#444",
          }}
        >
          {p}
        </button>
      </li>
    ))}

    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button
        className="page-link"
        style={{
          backgroundColor: "#222",
          color: "#f1f1f1",
          borderColor: "#444",
        }}
        onClick={() => handleClick(currentPage + 1)}
        aria-label="Sonraki"
      >
        &raquo;
      </button>
    </li>
  </ul>
</nav>

  );
}

