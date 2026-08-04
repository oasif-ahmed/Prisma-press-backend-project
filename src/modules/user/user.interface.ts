export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

enum Role{
 ADMIN,
 USER
}

export interface IjwtUserPayload {
    id: string;
    name: string;
    email: string;
    role: Role
}