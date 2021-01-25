import { format } from 'date-fns'

export const formatDay = (date: Date) => format(date, 'yyyy-MM-dd')

export const parseDay = (string: string) => new Date(string)
