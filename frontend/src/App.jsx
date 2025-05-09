import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import CoursesPage from "./pages/CoursesPage";

import CourseDetail from "./pages/CourseDetail";
import VideosPage from "./pages/VideosPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import VideoDetail from "./pages/VideoDetail";

function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:domain" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetail />} />

        <Route path="/videos" element={<VideosPage />} />
        <Route path="/videos/:domain" element={<VideosPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:domain" element={<ArticlesPage />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/video/:id" element={<VideoDetail />} />
      </Routes>
    </Box>
  );
}

export default App;
