import React from "react";

function CourseSidebar({ topics, selected, onSelect }) {
  return (
    <ul style={{padding: 0, listStyle: 'none'}}>
      {topics.map(topic => (
        <li key={topic.id} style={{marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 4}}>
          <button
            style={{
              background: selected.topicId === topic.id && !selected.questId ? '#bbdefb' : 'transparent',
              border: 'none',
              color: '#1976d2',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              padding: '6px 8px',
              borderRadius: 6
            }}
            onClick={() => onSelect({ topicId: topic.id, questId: null })}
          >
            {topic.title}
          </button>
          {/* <button
            onClick={() => onToggleFavoriteTopic(topic.id)}
            aria-label={favoriteTopics.includes(topic.id) ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: favoriteTopics.includes(topic.id) ? '#ffd600' : '#bbb',
              marginLeft: 2,
              transition: 'color 0.2s'
            }}
          >
            {favoriteTopics.includes(topic.id) ? '★' : '☆'}
          </button> */}
          {topic.quests && topic.quests.length > 0 && (
            <ul style={{paddingLeft: 16, marginTop: 4}}>
              {topic.quests.map(quest => (
                <li key={quest.id}>
                  <button
                    style={{
                      background: selected.topicId === topic.id && selected.questId === quest.id ? '#e3f2fd' : 'transparent',
                      border: 'none',
                      color: '#1565c0',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      padding: '4px 8px',
                      borderRadius: 6
                    }}
                    onClick={() => onSelect({ topicId: topic.id, questId: quest.id })}
                  >
                    {quest.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default CourseSidebar; 