import { Dispatch } from '@reduxjs/toolkit'
import { addDays, getDate } from 'date-fns'
import { saveMockDays } from '../daysSlice'
import { formatDay } from './date'
import { Bleeding, Day, Mucus } from '../../generated'

export const generateMockData = (dispatch: Dispatch) => {
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )

  const random = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  const days = []
  for (let i = 0; i < 365; i++) {
    const day = addDays(random, i)
    days.push({
      date: formatDay(day),
      bleeding:
        getDate(day) <= 10 && getDate(day) >= 7
          ? {
              strength: Bleeding.strength.STRONG,
            }
          : undefined,
      temperature: {
        value: 36.5 + 0.5 * Math.sin(Math.sin(0.1 * i) * i),
        timestamp: day.toISOString(),
        note: undefined,
      },
      mucus: {
        feeling: Mucus.feeling.DRY,
        texture: Mucus.texture.EGG_WHITE,
      },
    } as Day)
  }
  dispatch(saveMockDays(days))
}
