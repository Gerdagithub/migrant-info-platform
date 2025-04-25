import { useEffect, useState } from 'react';
import "./CategoryPage.css";
import Navbar from './Navbar/Navbar';
import { CATEGORY_COLOR_LIST, CATEGORY_NAME_LIST } from '../constants';

export default function CategoryPage({ slug }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/categories/${slug}/`)
      .then(res => {
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCategory(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (category && category.faq_categories.length > 0) {
      setSelectedFaq(category.faq_categories[0].faq_title);
    }
  }, [category]);

  if (loading) return <p>Loading category: <strong>{slug}</strong>...</p>;

  if (notFound || !category) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>❌ Category "{slug}" not found</h2>
          <p>The category you're looking for does not exist or was removed.</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="btn btn-outline-secondary mt-3"
          >
            ← Back to Homepage
          </button>
        </div>
      </>
    );
  }

  const index = CATEGORY_NAME_LIST.findIndex(
    name => name.toLowerCase() === slug.toLowerCase()
  );

  const cat_color = CATEGORY_COLOR_LIST[index] || 'red';
  console.log(cat_color)

  return (
    <>
      	<div className="category-introduction" >
        <Navbar />
        {/* <div className="category-text-wrapper">
			<h1 className="category-title">{category.name}</h1>
			<div
				className="category-description"
				dangerouslySetInnerHTML={{ __html: category.description }}
			/>
        </div> */}
      	</div>
		<h1 className="category-title">{category.name}</h1>


      	<nav className="navbar navbar-expand-sm faq-categories-navbar">
        {category.faq_categories.map(section => (
        //   <button
        //     key={section.faq_title}
        //     className="btn"
        //     onClick={() => setSelectedFaq(section.faq_title)}
        //     style={{ fontWeight: selectedFaq === section.faq_title ? 'bold' : 'normal' }}
        //   >
        //     {section.faq_title}
        //   </button>
		<button
			key={section.faq_title}
			className={`btn faq-tab-btn ${selectedFaq === section.faq_title ? 'active-faq-tab' : ''}`}
			onClick={() => setSelectedFaq(section.faq_title)}
			style={{ '--category-color': cat_color }}
		>
			{section.faq_title}
		</button>

        ))}
      </nav>

      {category.faq_categories
        .filter(section => section.faq_title === selectedFaq || selectedFaq === null)
        .map(section => {
          const safeTitle = section.faq_title.replace(/\s+/g, '-').toLowerCase();
          return (
            <div key={section.faq_title} className="px-4 faq-category">
              {/* <h3>{section.faq_title}</h3> */}
              {/* <p>{section.description}</p> */}

             	<div 
					className="accordion" 
					id={`faqAccordion-${safeTitle}`}
					style={{ '--category-color': cat_color }}
				>
                {section.faqs.map((faq, i) => {
                  const collapseId = `collapse-${safeTitle}-${i}`;
                  const headingId = `heading-${safeTitle}-${i}`;
                  return (
                    <div className="accordion-item" key={i}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded="false"
                          aria-controls={collapseId}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className="accordion-collapse collapse"
                        aria-labelledby={headingId}
                        data-bs-parent={`#faqAccordion-${safeTitle}`}
                      >
                        <div 
							className="accordion-body"
						  	dangerouslySetInnerHTML={{ __html: faq.answer }}
						>
							{/* {faq.answer} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
}