import { MerkleMap, isReady } from 'snarkyjs'

// await isReady;

export type Profile = {
    display_name: string,
    avatar: string,
    address: string
}  

export const profileTree = new MerkleMap();


