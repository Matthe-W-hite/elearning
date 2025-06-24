import React, { useEffect, useRef } from "react";

function CourseContent({ selectedTopic, selectedQuest }) {
  const contentRef = useRef();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove("fade-in");
      void contentRef.current.offsetWidth;
      contentRef.current.classList.add("fade-in");
    }
  }, [selectedTopic, selectedQuest]);

  if (selectedTopic) {
    return (
      <div className="topic-section fade-in" ref={contentRef}>
        <h3>{selectedTopic.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: selectedTopic.content }} />
        {selectedTopic.quests && selectedTopic.quests.length > 0  && (
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