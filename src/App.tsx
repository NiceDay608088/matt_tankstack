import "./App.css";
import { Route, Routes } from "react-router-dom";
import MyTable from "./components/MyTable";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MyTable />} />
      </Routes>
    </>
  );
}

export default App;
