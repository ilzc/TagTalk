import type { NextApiRequest, NextApiResponse } from 'next'
import { Field, MerkleMap } from 'snarkyjs'
import { profileTree } from '../../../common/storage';
import Client from 'mina-signer';

const client = new Client({ network: 'testnet' });

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    // client.verifyMessage()
    const requestJson = JSON.parse(req.body);
    console.log(requestJson);
    const requestAddress = requestJson.address;
    const requestProfile = requestJson.profile;
    profileTree.set(Field(String(requestAddress)), Field(requestProfile));
    res.status(200).json(profileTree.getRoot());
  }
  