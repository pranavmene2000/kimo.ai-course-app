import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Replace with your FastAPI server URL

export const getCourses = (sortBy = "name", domain = "") => {
	return axios.get(
		`${API_BASE_URL}/courses?sort_by=${sortBy}&domain=${domain}`
	);
};

export const getCourseOverview = (courseId: any) => {
	return axios.get(`${API_BASE_URL}/courses/${courseId}`);
};

export const getChapter = (courseId: any, chapterName: any) => {
	return axios.get(
		`${API_BASE_URL}/courses/${courseId}/chapters/${chapterName}`
	);
};

export const voteChapter = (courseId: any, chapterName: any, vote: any) => {
	return axios.post(
		`${API_BASE_URL}/courses/${courseId}/chapters/${chapterName}/vote?vote=${vote}`
	);
};

export const getDomains = () => {
	return axios.get(`${API_BASE_URL}/courses/domain/all`);
};
