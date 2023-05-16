import { TypeOf, object, string, boolean } from 'zod';

export const getPrintersSchema = object({
	body: object({}),
});
export type GetPrintersInput = TypeOf<typeof getPrintersSchema>;

export const getPrinterSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const addPrinterSchema = object({
	body: object({
		name: string({
			required_error: 'name alanı zorunludur. (String)',
		}),
		model: string({
			required_error: 'model alanı zorunludur. (String)',
		}),
		serial_no: string({
			required_error: 'serial_no alanı zorunludur. (String)',
		}),
		description: string({
			required_error: 'description alanı zorunludur. (String)',
		}),
	}),
});

export const editPrinterSchema = object({
	body: object({
		name: string({
			required_error: 'name alanı zorunludur. (String)',
		}),
		is_active: boolean({
			required_error: 'is_active alanı zorunludur. (Boolean)',
		}),
		model: string({
			required_error: 'model alanı zorunludur. (String)',
		}),
		serial_no: string({
			required_error: 'serial_no alanı zorunludur. (String)',
		}),
		description: string({
			required_error: 'description alanı zorunludur. (String)',
		}),
	}),
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const deletePrinterSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export type DeletePrinterInput = TypeOf<typeof deletePrinterSchema>;
export type GetPrinterInput = TypeOf<typeof getPrinterSchema>;
export type AddPrinterInput = TypeOf<typeof addPrinterSchema>;
export type EditPrinterInput = TypeOf<typeof editPrinterSchema>;
