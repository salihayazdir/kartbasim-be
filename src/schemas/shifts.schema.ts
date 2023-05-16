import { TypeOf, object, string, boolean, number } from 'zod';

export const getShiftsSchema = object({
	body: object({}),
});
export type GetShiftsInput = TypeOf<typeof getShiftsSchema>;

export const getShiftSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const addShiftSchema = object({
	body: object({
		description: string({
			required_error: 'description alani zorunludur. (String)',
		}),
		start_hour: number({
			required_error: 'start hour alani zorunludur. (Number)',
		}),
		end_hour: number({
			required_error: 'end hour alani zorunludur. (Number)',
		}),
	}),
});

export const editShiftSchema = object({
	body: object({
		description: string({
			required_error: 'description alani zorunludur. (String)',
		}),
		start_hour: number({
			required_error: 'start hour alani zorunludur. (Number)',
		}),
		end_hour: number({
			required_error: 'end hour alani zorunludur. (Number)',
		}),
		is_active: boolean({
			required_error: 'is_active alani zorunludur. (Boolean)',
		}),
	}),
	params: object({
		id: string({
			required_error: 'ID Parametresi dogrulanamadi.',
		}),
	}),
});

export const deleteShiftSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi dogrulanamadi.',
		}),
	}),
});

export type DeleteShiftInput = TypeOf<typeof deleteShiftSchema>;
export type GetShiftInput = TypeOf<typeof getShiftSchema>;
export type AddShiftInput = TypeOf<typeof addShiftSchema>;
export type EditShiftInput = TypeOf<typeof editShiftSchema>;
