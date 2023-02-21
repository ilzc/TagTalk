import type { NextApiRequest, NextApiResponse } from 'next'

export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ name: 'Robe222rt' }))
}