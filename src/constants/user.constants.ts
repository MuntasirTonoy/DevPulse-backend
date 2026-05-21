export const USER_ROLES = ['contributor', 'maintainer'] as const;
export type UserRole = (typeof USER_ROLES)[number];
