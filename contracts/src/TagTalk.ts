import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  MerkleTree,
  PublicKey,
} from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class TagTalk extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.get();
    this.num.assertEquals(currentState); // precondition that links this.num.get() to the actual on-chain state
    const newState = currentState.add(2);
    this.num.set(newState);
  }
}

export class TagTalks extends SmartContract {
  @state(PublicKey) storageServerPublicKey = State<PublicKey>();

  @state(Field) profilesTreeRoot = State<Field>();
  @state(Field) profilesCount = State<Field>();

  @state(Field) chatroomsTreeRoot = State<Field>();
  @state(Field) chatroomsCount = State<Field>();

  @state(Field) multiSignaturesTreeRoot = State<Field>();
  @state(Field) multiSignaturesCount = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method initState(storageServerPublicKey: PublicKey) {
    this.storageServerPublicKey.set(storageServerPublicKey);
    this.profilesCount.set(Field.zero);

    const emptyTreeRoot = new MerkleTree(8).getRoot();
    this.profilesTreeRoot.set(emptyTreeRoot);
  }
}
