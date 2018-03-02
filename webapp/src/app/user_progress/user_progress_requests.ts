import axios from "axios";
import {TrainingProgressUpdate, UserCourseProgressView} from "@shared/user_progress";
import {EnrollCourseRequestPayload, EnrollCourseResponse} from "@shared/user";

export const enrollUserInCourse = async (userCourse: EnrollCourseRequestPayload): Promise<EnrollCourseResponse> => {
    let {userId, courseId} = userCourse;
    return (await axios.post(`'/user/${userId}/course/${courseId}/enroll'`, userCourse)).data;
};
export const loadUserProgress = async ({userId, courseId}: {userId: string, courseId: string}): Promise<UserCourseProgressView> => {
    return (await axios.get(`/user/${userId}/course/${courseId}/progress`)).data;
};

export const saveUserProgress = async (update: TrainingProgressUpdate) => {
    let {userId, id, type} = update;
    return (await axios.post(`/user/${userId}/training/progress/${type}/${id}/save`, update)).data;
};
