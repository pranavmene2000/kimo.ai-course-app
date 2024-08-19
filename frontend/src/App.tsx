import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import ChapterPage from "./pages/ChapterPage";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
	return (
		<ChakraProvider>
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/courses/:courseId' element={<CoursePage />} />
					<Route
						path='/courses/:courseId/chapters/:chapterName'
						element={<ChapterPage />}
					/>
				</Routes>
			</Router>
		</ChakraProvider>
	);
}

export default App;
