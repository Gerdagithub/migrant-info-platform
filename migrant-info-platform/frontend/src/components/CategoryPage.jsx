import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';

export default function CategoryPage({ slug }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>{category.name}</h1>
        <p>{category.description}</p>

        {category.faq_categories.map(section => (
          <div key={section.faq_title} className="mt-4">
            <h3>{section.faq_title}</h3>
            <p>{section.description}</p>
            {section.faqs.map((faq, i) => (
              <details key={i} className="mb-2">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}