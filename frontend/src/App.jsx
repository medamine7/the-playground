import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Article from "./pages/Article";
import Authentication from "./pages/Authentication";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

const ROUTES = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/article/:provider/:slug",
    element: (
      <ProtectedRoute>
        <Article/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authentication",
    element: <Authentication/>,
  },
  {
    path: "/settings",
    element: <Settings/>,
  }
];

function App() {
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          {ROUTES.map((route, index) => (
            <Route key={`route-${index}`} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
