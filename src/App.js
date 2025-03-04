import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormBuilder from "./modules/FormBuilder/FormBuilder";
import FormRenderer from "./modules/FormRenderer/FormRenderer";
import { FormProvider } from "./context/FormContext";

const App = () => {
  return (
    <Router>
      <FormProvider>
        <div>
          <nav style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
            <Link to="/form-builder" className="nav-link">
              Build Form
            </Link>
            <Link to="/form-renderer" className="nav-link">
              View Forms
            </Link>
          </nav>
          <Routes>
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/form-renderer" element={<FormRenderer />} />
          </Routes>
        </div>
      </FormProvider>
    </Router>
  );
};

export default App;
