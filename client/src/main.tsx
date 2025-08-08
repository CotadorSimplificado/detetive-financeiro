import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Limpar qualquer sessão mock antiga do localStorage
if (typeof window !== 'undefined') {
  localStorage.removeItem('detetive_financeiro_mock_session');
}

createRoot(document.getElementById("root")!).render(<App />);
