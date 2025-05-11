import './App.css';
import { AuthProvider } from './provider/authProvider';
import Routes from "./routes";
import '@bosch/frontend.kit-npm/dist/frontend-kit.complete.css';



function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
