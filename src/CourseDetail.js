import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import courses from "./courses";
import CourseSidebar from "./CourseSidebar";
import CourseContent from "./CourseContent";

function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState({ topicId: null, questId: null });
  const [favoriteTopics, setFavoriteTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite-topics')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (course) {
      fetch(course.endpoint)
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          if (d && d[0] && d[0].topics && d[0].topics[0]) {
            setSelected({ topicId: d[0].topics[0].id, questId: null });
          }
        })
        .catch(console.error);
    }
  }, [course]);

  useEffect(() => {
    localStorage.setItem('favorite-topics', JSON.stringify(favoriteTopics));
  }, [favoriteTopics]);

  const handleToggleFavoriteTopic = (topicId) => {
    setFavoriteTopics(favs => favs.includes(topicId) ? favs.filter(f => f !== topicId) : [...favs, topicId]);
  };

  if (!course) return <div>Kurs nie znaleziony</div>;

  let selectedTopic = null;
  let selectedQuest = null;
  if (data && data[0] && data[0].topics) {
    selectedTopic = data[0].topics.find(t => t.id === selected.topicId);
    if (selectedTopic && selected.questId) {
      selectedQuest = selectedTopic.quests.find(q => q.id === selected.questId);
    }
  }

  return (
    <div className="course-detail" style={{display: 'flex', gap: 32}}>
      <div style={{minWidth: 260, maxWidth: 320, borderRight: '1px solid #e3eafc', paddingRight: 16}}>
        <Link to="/">← Powrót do listy</Link>
        <h2 style={{marginTop: 16}}>{course.name}</h2>
        {data && data[0] && data[0].topics ? (
          <CourseSidebar
            topics={data[0].topics}
            selected={selected}
            onSelect={setSelected}
            favoriteTopics={favoriteTopics}
            onToggleFavoriteTopic={handleToggleFavoriteTopic}
          />
        ) : <p>Ładowanie...</p>}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <CourseContent selectedTopic={selectedTopic} selectedQuest={selectedQuest} />
      </div>
    </div>
  );
}

export default CourseDetail; 