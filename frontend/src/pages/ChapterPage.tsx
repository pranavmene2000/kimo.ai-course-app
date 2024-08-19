import { useParams } from "react-router-dom";
import Chapter from "../components/Chapter";
import { Box } from "@chakra-ui/react";

const ChapterPage = () => {
	const { courseId, chapterName } = useParams();

	return (
		<Box p={4}>
			<Chapter courseId={courseId} chapterName={chapterName} />
		</Box>
	);
};

export default ChapterPage;
