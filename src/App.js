import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import courses from "./courses";
import CourseDetail from "./CourseDetail";
import "./App.css";
import Footer from "./Footer";

import { useState, useEffect } from "react";

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme-dark');
    if (saved !== null) {
      return saved === 'true';
    }
    // Jeśli nie ma zapisanego wyboru, sprawdź preferencje systemowe
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite-courses')) || [];
    } catch {
      return [];
    }
  });
  const [favoriteTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite-topics')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem('theme-dark', dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('favorite-courses', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('favorite-topics', JSON.stringify(favoriteTopics));
  }, [favoriteTopics]);

  const toggleFavorite = (id) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  // Ulubione na górze listy
  const sortedCourses = [
    ...filteredCourses.filter(c => favorites.includes(c.id)),
    ...filteredCourses.filter(c => !favorites.includes(c.id))
  ];

  // Zbierz ulubione tematy z wszystkich kursów
  const favoriteTopicsList = [];
  for (const course of courses) {
    if (!favoriteTopics.length) break;
    // Pobierz dane kursu z localStorage jeśli są (cache), lub z endpointu (nie robimy fetch synchronously)
    // Tu uproszczone: tylko id i nazwa kursu + id i tytuł tematu
    if (window.localStorage) {
      const cacheKey = `course-cache-${course.id}`;
      let courseData = null;
      try {
        courseData = JSON.parse(localStorage.getItem(cacheKey));
      } catch {}
      if (courseData && courseData[0] && courseData[0].topics) {
        for (const topic of courseData[0].topics) {
          if (favoriteTopics.includes(topic.id)) {
            favoriteTopicsList.push({
              courseId: course.id,
              courseName: course.name,
              topicId: topic.id,
              topicTitle: topic.title
            });
          }
        }
      }
    }
  }

  return (
    <Router>
      <div className="container">
        <div style={{minHeight: '60vh'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Lista kursów</h1>
            <button
              onClick={() => setDark((d) => !d)}
              style={{
                background: dark ? '#23272a' : '#e3eafc',
                color: dark ? '#90caf9' : '#1976d2',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 16,
                boxShadow: '0 1px 4px rgba(60,72,100,0.08)'
              }}
              aria-label="Przełącz motyw jasny/ciemny"
            >
              {dark ? '🌙 Ciemny' : '☀️ Jasny'}
            </button>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Sekcja ulubionych */}
                  {(favorites.length > 0 || favoriteTopicsList.length > 0) && (
                    <div className="favorites-section">
                      <h2>★ Ulubione</h2>
                      {favorites.length > 0 && (
                        <div style={{marginBottom: 10}}>
                          <strong>Kursy:</strong>
                          <ul>
                            {favorites.map(id => {
                              const c = courses.find(c => c.id === id);
                              return c ? (
                                <li key={c.id}>
                                  <Link to={`/course/${c.id}`}>{c.name}</Link>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      )}
                      {favoriteTopicsList.length > 0 && (
                        <div>
                          <strong>Tematy:</strong>
                          <ul>
                            {favoriteTopicsList.map(t => (
                              <li key={t.topicId}>
                                <Link to={`/course/${t.courseId}`}>{t.courseName} – {t.topicTitle}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Szukaj kursu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: 340,
                      margin: '24px 0 16px 0',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #bbdefb',
                      fontSize: 16,
                      outline: 'none',
                      background: dark ? '#23272a' : '#fff',
                      color: dark ? '#e0e0e0' : '#222',
                      boxShadow: '0 1px 4px rgba(60,72,100,0.04)'
                    }}
                  />
                  <ul className="course-list">
                    {sortedCourses.length === 0 ? (
                      <li>Brak kursów spełniających kryteria.</li>
                    ) : (
                      sortedCourses.map((course) => (
                        <li key={course.id} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <button
                            onClick={() => toggleFavorite(course.id)}
                            aria-label={favorites.includes(course.id) ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: 22,
                              color: favorites.includes(course.id) ? '#ffd600' : '#bbb',
                              marginRight: 4,
                              transition: 'color 0.2s'
                            }}
                          >
                            {favorites.includes(course.id) ? '★' : '☆'}
                          </button>
                          <Link to={`/course/${course.id}`}>{course.name}</Link>
                        </li>
                      ))
                    )}
                  </ul>
                </>
              }
            />
            <Route path="/course/:id" element={<CourseDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
