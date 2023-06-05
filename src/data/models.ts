export type ResponseObject<T> = {
	error: ErrorDetails;
	data: T;
};

export type ErrorDetails =
	| false
	| {
			code: string;
			message: string;
	  };

export type Bank = {
	id: number;
	name: string;
	is_active: boolean;
	is_deleted: boolean;
	created_at?: string;
	edited_at?: string;
	created_by?: string;
	edited_by?: string;
};

export type Printer = {
	id: number;
	name: string;
	model: string;
	serial_no: string;
	description: string;
	is_active: boolean;
	is_deleted: boolean;
	created_at?: string;
	edited_at?: string;
	created_by?: string;
	edited_by?: string;
};

export type Shift = {
	id: number;
	description: string;
	start_hour: number;
	end_hour: number;
	is_active: boolean;
	is_deleted: boolean;
	created_at?: string;
	created_by?: string;
	edited_at?: string;
	edited_by?: string;
};

export type User = {
	username: string;
	mail: string;
	user_role_id: number;
	name: string;
	sicil: string;
	dn: string;
	title: string;
	team: string;
	service: string;
	department: string;
	created_at: string;
	edited_at: string;
	is_active: boolean;
	manager_name: string;
	manager_username: string;
};
