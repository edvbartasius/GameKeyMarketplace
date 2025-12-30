import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import api from './services/api';

function App() {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/test');
      setTestData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={fetchTestData} disabled={loading}>
          {loading ? 'Loading...' : 'Test API Connection'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {testData && (
          <pre style={{ textAlign: 'left', fontSize: '14px' }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
