export interface Story {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image: string;
    author?: {
        id: string;
        name: string;
        penName: string;
    }; // object thông tin tác giả// có thể được định nghĩa rõ hơn nếu cần
    topics: string[];
    tags?: string[];
    status?: string;
    isFinish?: boolean | string;
    isPremium: boolean;
    views: number;
    stars?: number;
    followers: number;
    rates?: number;
    chapters?: number;
    createdAt?: string;
    updatedAt?: string;
}
