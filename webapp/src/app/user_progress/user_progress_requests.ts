import axios from "axios";
import {TrainingProgressUpdate, UserCourseProgressView} from "@shared/user_progress";
import {EnrollCourseRequestPayload, EnrollCourseResponse} from "@shared/user";
import {ViewsRequestParams} from "@shared/views";

export const enrollUserInCourse = async (userCourse: EnrollCourseRequestPayload): Promise<EnrollCourseResponse> => {
    let {userId, courseId} = userCourse;
    return (await axios.post(`/user/${userId}/course/${courseId}/enroll`, userCourse)).data;
};
export const loadUserProgress = async ({userId, courseId}: {userId: string, courseId: string}): Promise<UserCourseProgressView> => {
    let params: ViewsRequestParams = {
        userId, courseId,
        userProgress: true
    };
    return (await axios.get(`/views`, {
        params
    })).data;
};

export const saveUserProgress = async (update: TrainingProgressUpdate) => {
    let {userId, id, type} = update;
    return (await axios.post(`/user/${userId}/training/progress/${type}/${id}/save`, update)).data;
};
