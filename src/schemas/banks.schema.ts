import { TypeOf, object, string, boolean } from 'zod';

export const getBanksSchema = object({
	body: object({}),
});
export type GetBanksInput = TypeOf<typeof getBanksSchema>;

export const getBankSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const addBankSchema = object({
	body: object({
		name: string({
			required_error: 'name alanı zorunludur. (String)',
		}),
	}),
});

export const editBankSchema = object({
	body: object({
		name: string({
			required_error: 'name alanı zorunludur. (String)',
		}),
		is_active: boolean({
			required_error: 'is_active alanı zorunludur. (Boolean)',
		}),
	}),
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const deleteBankSchema = object({
	params: object({
		id: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export type DeleteBankInput = TypeOf<typeof deleteBankSchema>;
export type GetBankInput = TypeOf<typeof getBankSchema>;
export type AddBankInput = TypeOf<typeof addBankSchema>;
export type EditBankInput = TypeOf<typeof editBankSchema>;
