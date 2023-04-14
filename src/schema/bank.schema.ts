import { TypeOf, object } from "zod"

export const getBanksSchema = object({
    body: object({})
})

export type GetBanksInput = TypeOf<typeof getBanksSchema>