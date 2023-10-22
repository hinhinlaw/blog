import { parseISO, format } from "date-fns";

interface Props {
  dateString: string
}

export default function Date({dateString}: Props) {
  const date = parseISO(dateString)
  return (
    <time dateTime={dateString} className='text-gray-400 text-sm'>
      {format(date, "yyyy-MM-dd")}
    </time>
  )
}