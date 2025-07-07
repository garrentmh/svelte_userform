// User type definition
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	hobby: string;
	createdAt: Date;
}

// Simple in-memory database (will be replaced with file-based storage)
const users: User[] = [];

// Generate a simple ID
function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create a new user
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
	const newUser: User = {
		id: generateId(),
		...userData,
		createdAt: new Date()
	};
	
	users.push(newUser);
	return newUser;
}

// Get all users
export function getAllUsers(): User[] {
	return [...users];
}

// Get user by ID
export function getUserById(id: string): User | undefined {
	return users.find(user => user.id === id);
}

// Update user
export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
	const userIndex = users.findIndex(user => user.id === id);
	if (userIndex === -1) return null;
	
	users[userIndex] = { ...users[userIndex], ...updates };
	return users[userIndex];
}

// Delete user
export function deleteUser(id: string): boolean {
	const userIndex = users.findIndex(user => user.id === id);
	if (userIndex === -1) return false;
	
	users.splice(userIndex, 1);
	return true;
}