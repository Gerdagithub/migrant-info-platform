import React, { useState } from 'react';
import "./FaqCategoriesCarousel.css";

export default function FaqCategoriesCarousel({
  category,
  selectedFaq,
  setSelectedFaq,
  cat_color
}) {
  const VISIBLE = 4;
  const total = category.faq_categories.length;
  const windowSize = Math.min(VISIBLE, total);
  const [startIndex, setStartIndex] = useState(0);

  // build a circular window of up to 4 items
  const visibleCategories = total <= VISIBLE
    ? category.faq_categories
    : Array.from({ length: windowSize }, (_, i) =>
        category.faq_categories[(startIndex + i) % total]
      );

  const handlePrev = () => {
    if (total > VISIBLE) {
      setStartIndex(i => (i - 1 + total) % total);
    }
  };

  const handleNext = () => {
    if (total > VISIBLE) {
      setStartIndex(i => (i + 1) % total);
    }
  };

  return (
    <div className="faq-carousel-container">
      <button
        className="btn btn-outline-secondary me-2 faq-carousel-btn"
        onClick={handlePrev}
      >
        ‹
      </button>

      <nav className="navbar navbar-expand-sm faq-categories-navbar flex-grow-1">
        <div className="d-flex">
          {visibleCategories.map(section => (
            <button
              key={section.faq_title}
              className={`btn faq-tab-btn${selectedFaq === section.faq_title ? ' active-faq-tab' : ''}`}
              onClick={() => setSelectedFaq(section.faq_title)}
              style={{ '--category-color': cat_color }}
            >
              {section.faq_title}
            </button>
          ))}
        </div>
      </nav>

      <button
        className="btn btn-outline-secondary ms-2 faq-carousel-btn"
        onClick={handleNext}
      >
        ›
      </button>
    </div>
  );
}