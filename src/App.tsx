import "./App.css";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-3xl font-bold text-blue-500">
          Edit and save to reload.
        </p>
        <p className="text-3xl font-bold text-blue-100 bg-white text-green-900 hover:text-red-900 hover:-translate-y-10 duration-[3000ms]">
          Edit and save to reload.
        </p>
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
