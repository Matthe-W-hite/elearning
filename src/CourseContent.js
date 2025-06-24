import React, { useState, useEffect, useRef } from "react";

async function translateHtml(html, targetLang = "en") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.innerText;
  const res = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source: "pl", target: targetLang, format: "text" })
  });
  const data = await res.json();
  return `<p>${data.translatedText}</p>`;
}

function CourseContent({ selectedTopic, selectedQuest }) {
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef();

  // Animacja fade-in przy każdej zmianie treści
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove("fade-in");
      // trigger reflow
      void contentRef.current.offsetWidth;
      contentRef.current.classList.add("fade-in");
    }
  }, [selectedTopic, selectedQuest, translated]);

  const handleTranslate = async (html) => {
    setLoading(true);
    setError(null);
    try {
      const translatedHtml = await translateHtml(html);
      setTranslated(translatedHtml);
    } catch (e) {
      setError("Błąd tłumaczenia. Spróbuj ponownie później.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTranslated(null);
    setError(null);
  };

  if (selectedQuest) {
    return (
      <div className="quest-section fade-in" ref={contentRef}>
        <h3>{selectedQuest.title}</h3>
        <div style={{marginBottom: 12}}>
          {translated ? (
            <button onClick={handleReset}>Pokaż oryginał</button>
          ) : (
            <button onClick={() => handleTranslate(selectedQuest.content)} disabled={loading}>
              {loading ? "Tłumaczenie..." : "Tłumacz na angielski"}
            </button>
          )}
        </div>
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <div dangerouslySetInnerHTML={{ __html: translated || selectedQuest.content }} />
      </div>
    );
  }
  if (selectedTopic) {
    return (
      <div className="topic-section fade-in" ref={contentRef}>
        <h3>{selectedTopic.title}</h3>
        {/* <div style={{marginBottom: 12}}>
          {translated ? (
            <button onClick={handleReset}>Pokaż oryginał</button>
          ) : (
            <button onClick={() => handleTranslate(selectedTopic.content)} disabled={loading}>
              {loading ? "Tłumaczenie..." : "Tłumacz na angielski"}
            </button>
          )}
        </div> */}
        {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
        <div dangerouslySetInnerHTML={{ __html: translated || selectedTopic.content }} />
        {selectedTopic.quests && selectedTopic.quests.length > 0 && !translated && (
          <div style={{marginTop: 24}}>
            <h4>Zadania:</h4>
            <ul style={{paddingLeft: 16}}>
              {selectedTopic.quests.map(quest => (
                <li key={quest.id}>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#1565c0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0
                    }}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {quest.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return <p ref={contentRef} className="fade-in">Wybierz temat z listy.</p>;
}

export default CourseContent; 