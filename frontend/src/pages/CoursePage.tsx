import { useParams } from "react-router-dom";
import CourseOverview from "../components/CourseOverview";
import { Box } from "@chakra-ui/react";

const CoursePage = () => {
	const { courseId } = useParams();

	return (
		<Box p={4}>
			<CourseOverview courseId={courseId} />
		</Box>
	);
};

export default CoursePage;
