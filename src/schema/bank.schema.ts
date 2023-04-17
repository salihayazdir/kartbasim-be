import { TypeOf, object, string, boolean } from 'zod';

export const getBanksSchema = object({
	body: object({}),
});
export type GetBanksInput = TypeOf<typeof getBanksSchema>;

export const getBankSchema = object({
	params: object({
		bankId: string({
			required_error: 'id gerekli',
		}),
	}),
});

export const addBankSchema = object({
	body: object({
		bankName: string({
			required_error: 'isim gerekli',
		}),
	}),
});

export const editBankSchema = object({
	body: object({
		bankName: string({
			required_error: 'bankname gerekli',
		}),
		isActive: boolean({
			required_error: 'isactive gerekli',
		}),
	}),
	params: object({
		bankId: string({
			required_error: 'id gerekli',
		}),
	}),
});

export const deleteBankSchema = object({
	params: object({
		bankId: string({
			required_error: 'id gerekli',
		}),
	}),
});

export type DeleteBankInput = TypeOf<typeof deleteBankSchema>;
export type GetBankInput = TypeOf<typeof getBankSchema>;
export type AddBankInput = TypeOf<typeof addBankSchema>;
export type EditBankInput = TypeOf<typeof editBankSchema>;
