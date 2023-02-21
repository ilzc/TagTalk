// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Field } from 'snarkyjs';
import { profileTree } from '../../../common/storage';




export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const {pid} = req.query
  console.log(req.query.address)
  profileTree.set(Field(String("700")), Field(7001));
  res.status(200).json(profileTree.getRoot())
}
