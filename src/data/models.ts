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
