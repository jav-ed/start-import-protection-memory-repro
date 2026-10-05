import { createFileRoute } from '@tanstack/react-router'
import { total } from '../generated'

export const Route = createFileRoute('/')({
  // Importing the barrel makes the server evaluate (and import protection analyse) every generated module.
  component: () => <p>{total()}</p>,
})
