// VoteComponent.js
import { Text, HStack, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

interface VoteProps {
	upvotes: number | undefined;
	downvotes: number | undefined;
	handleVote?: (vote: number) => void;
	isDisabled?: boolean;
}

const VoteComponent = ({
	upvotes = 0,
	downvotes = 0,
	// @ts-ignore
	handleVote = (vote: number) => {},
	isDisabled = false,
}: VoteProps) => {
	return (
		<HStack spacing={0}>
			<IconButton
				isDisabled={isDisabled}
				onClick={() => handleVote(1)}
				aria-label='Upvote'
				icon={<ArrowUpIcon />}
				colorScheme='green'
				isRound={true}
				variant='ghost'
			/>
			<Text mr={3} fontSize='md' fontWeight='bold'>
				{upvotes}
			</Text>
			<IconButton
				isDisabled={isDisabled}
				onClick={() => handleVote(-1)}
				aria-label='Downvote'
				icon={<ArrowDownIcon />}
				colorScheme='red'
				isRound={true}
				variant='ghost'
			/>
			<Text fontSize='md' fontWeight='bold'>
				{downvotes}
			</Text>
		</HStack>
	);
};

export default VoteComponent;
