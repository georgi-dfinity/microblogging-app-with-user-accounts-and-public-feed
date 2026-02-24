import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    username: string;
}
export interface Post {
    topic: Topic;
    content: string;
    author: Principal;
    timestamp: Time;
}
export enum Topic {
    tech = "tech",
    random = "random",
    politics = "politics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, topic: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublicFeed(): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsername(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
