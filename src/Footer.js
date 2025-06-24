import React from "react";

function Footer() {
  return (
    <footer style={{
      marginTop: 40,
      padding: '24px 0 12px 0',
      textAlign: 'center',
      color: '#888',
      fontSize: 15
    }}>
      <hr style={{marginBottom: 16, border: 'none', borderTop: '1px solid #e3eafc'}} />
      <div>
        © {new Date().getFullYear()} Courses by <a href="https://github.com/PeterPorzuczek/TimeRiddle" target="_blank" rel="noopener noreferrer">Peter Porzuczek</a>
      </div>
      <div>
        © {new Date().getFullYear()} Frontend by <a href="https://github.com/Matthe-W-hite" target="_blank" rel="noopener noreferrer">Mateusz Pokora</a>
      </div>
    </footer>
  );
}

export default Footer; 