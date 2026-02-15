export interface StudySession {
    id: string;
    topicId: string;
    startTime: string;
    endTime: string;
    duration: number;
    points: number;
    notes?: string;
    createdAt: string;
}

export interface ActiveSession {
    topicId: string;
    startTime: string;
    seconds: number;
}
