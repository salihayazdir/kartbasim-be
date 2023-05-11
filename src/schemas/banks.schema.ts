import { TypeOf, object, string, boolean } from 'zod';

export const getBanksSchema = object({
	body: object({}),
});
export type GetBanksInput = TypeOf<typeof getBanksSchema>;

export const getBankSchema = object({
	params: object({
		bankId: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const addBankSchema = object({
	body: object({
		bankName: string({
			required_error: 'bankName alanı zorunludur. (String)',
		}),
	}),
});

export const editBankSchema = object({
	body: object({
		bankName: string({
			required_error: 'bankName alanı zorunludur. (String)',
		}),
		isActive: boolean({
			required_error: 'isActive alanı zorunludur. (Boolean)',
		}),
	}),
	params: object({
		bankId: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export const deleteBankSchema = object({
	params: object({
		bankId: string({
			required_error: 'ID Parametresi doğrulanamadı.',
		}),
	}),
});

export type DeleteBankInput = TypeOf<typeof deleteBankSchema>;
export type GetBankInput = TypeOf<typeof getBankSchema>;
export type AddBankInput = TypeOf<typeof addBankSchema>;
export type EditBankInput = TypeOf<typeof editBankSchema>;
