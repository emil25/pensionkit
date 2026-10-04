import React from 'react';
export default class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="loading-page"><div className="panel" style={{ maxWidth: 450, margin: 20, textAlign: 'center' }}><h2>Valami megakadt.</h2><p className="quiet" style={{ margin: '15px 0' }}>A korábban mentett adataid megmaradtak. Frissítsd az oldalt az újrapróbáláshoz.</p><button className="btn" onClick={() => window.location.reload()}>Oldal újratöltése</button></div></div>;
    return this.props.children;
  }
}
