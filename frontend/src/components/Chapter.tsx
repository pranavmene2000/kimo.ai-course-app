import { useCallback, useEffect, useState } from "react";
import { getChapter, voteChapter } from "../services/api";
import { Box, Heading, Text, Spinner, useToast } from "@chakra-ui/react";
import VoteComponent from "./Vote";
import { Chapter } from "./CourseOverview";

interface ChapterProps {
	courseId: string | undefined;
	chapterName: string | undefined;
}

const ChapterComponent = ({ courseId, chapterName }: ChapterProps) => {
	const [chapter, setChapter] = useState<Chapter>();
	const [loading, setLoading] = useState(true);
	const [isUserVoted, setIsUserVoted] = useState(false);
	const toast = useToast();

	useEffect(() => {
		getChapter(courseId, chapterName).then((response) => {
			setChapter(response.data);
			setLoading(false);
		});
	}, [courseId, chapterName]);

	const handleVote = useCallback(
		async (vote: number) => {
			try {
				const {
					data: {
						chapter_votes: { upvotes, downvotes },
					},
				} = await voteChapter(courseId, chapterName, vote);
				setIsUserVoted(true);
				setChapter((prevChapter: any) => {
					return {
						...prevChapter,
						upvotes,
						downvotes,
					};
				});
				toast({
					title: "Voting submitted.",
					status: "success",
					duration: 3000,
					isClosable: true,
					position: "bottom-right",
				});
			} catch (error) {
				toast({
					title: "Error",
					description: "There was an error submitting your rating.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom-right",
				});
			}
		},
		[voteChapter]
	);

	if (loading) {
		return <Spinner size='xl' />;
	}

	return (
		<Box p={4}>
			<Heading as='h2' size='lg' mb={4}>
				{chapter?.name}
			</Heading>
			<Text fontSize='md' mb={4}>
				{chapter?.text}
			</Text>
			<Box pt={10}>
				<VoteComponent
					isDisabled={isUserVoted}
					upvotes={chapter?.upvotes}
					downvotes={chapter?.downvotes}
					handleVote={handleVote}
				/>
			</Box>
		</Box>
	);
};

export default ChapterComponent;
