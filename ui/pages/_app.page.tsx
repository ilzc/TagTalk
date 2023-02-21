// import '../styles/globals.css'
import 'antd/dist/reset.css';

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any
  return <AnyComponent {...pageProps} />
}

// import "../styles/globals.css";
// import { useEffect, useRef, useState } from "react";
// import "./reactCOIServiceWorker";

// import ZkappWorkerClient from "./zkappWorkerClient";

// import { PublicKey, PrivateKey, Field, isReady } from "snarkyjs";
// import { Header } from "../components/header";
// import { Button, Tabs } from "flowbite-react/lib/esm/components";
// import { Switch } from "@headlessui/react";

// import { useRouter } from 'next/router'

// let transactionFee = 0.1;

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function App() {
//   let [state, setState] = useState({
//     zkappWorkerClient: null as null | ZkappWorkerClient,
//     hasWallet: null as null | boolean,
//     hasBeenSetup: false,
//     accountExists: false,
//     currentNum: null as null | Field,
//     publicKey: null as null | PublicKey,
//     zkappPublicKey: null as null | PublicKey,
//     creatingTransaction: false,
//   });

//   // -------------------------------------------------------
//   // Do Setup

//   useEffect(() => {
//     (async () => {
//       if (!state.hasBeenSetup) {
//         const zkappWorkerClient = new ZkappWorkerClient();

//         console.log("Loading SnarkyJS...");
//         await zkappWorkerClient.loadSnarkyJS();
//         console.log("done");

//         await zkappWorkerClient.setActiveInstanceToBerkeley();

//         const mina = (window as any).mina;

//         if (mina == null) {
//           setState({ ...state, hasWallet: false });
//           return;
//         }

//         const publicKeyBase58: string = (await mina.requestAccounts())[0];
//         const publicKey = PublicKey.fromBase58(publicKeyBase58);

//         console.log("using key", publicKey.toBase58());

//         console.log("checking if account exists...");
//         const res = await zkappWorkerClient.fetchAccount({
//           publicKey: publicKey!,
//         });
//         const accountExists = res.error == null;

//         await zkappWorkerClient.loadContract();

//         console.log("compiling zkApp");
//         await zkappWorkerClient.compileContract();
//         console.log("zkApp compiled");

//         const zkappPublicKey = PublicKey.fromBase58(
//           "B62qpPkT4EYiCzyM8xqpdz25uQhorr2ZwSZvLWQSPk7RKqzasHZYLmT"
//         );

//         await zkappWorkerClient.initZkappInstance(zkappPublicKey);

//         console.log("getting zkApp state...");
//         await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
//         const currentNum = await zkappWorkerClient.getNum();
//         console.log("current state:", currentNum.toString());

//         setState({
//           ...state,
//           zkappWorkerClient,
//           hasWallet: true,
//           hasBeenSetup: true,
//           publicKey,
//           zkappPublicKey,
//           accountExists,
//           currentNum,
//         });
//       }
//     })();
//   }, []);

//   // -------------------------------------------------------
//   // Wait for account to exist, if it didn't

//   useEffect(() => {
//     (async () => {
//       if (state.hasBeenSetup && !state.accountExists) {
//         for (;;) {
//           console.log("checking if account exists...");
//           const res = await state.zkappWorkerClient!.fetchAccount({
//             publicKey: state.publicKey!,
//           });
//           const accountExists = res.error == null;
//           if (accountExists) {
//             break;
//           }
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//         }
//         setState({ ...state, accountExists: true });
//       }
//     })();
//   }, [state.hasBeenSetup]);

//   // -------------------------------------------------------
//   // Send a transaction

//   const onSendTransaction = async () => {
//     setState({ ...state, creatingTransaction: true });
//     console.log("sending a transaction...");

//     await state.zkappWorkerClient!.fetchAccount({
//       publicKey: state.publicKey!,
//     });

//     await state.zkappWorkerClient!.createUpdateTransaction();

//     console.log("creating proof...");
//     await state.zkappWorkerClient!.proveUpdateTransaction();

//     console.log("getting Transaction JSON...");
//     const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

//     console.log("requesting send transaction...");
//     const { hash } = await (window as any).mina.sendTransaction({
//       transaction: transactionJSON,
//       feePayer: {
//         fee: transactionFee,
//         memo: "",
//       },
//     });

//     console.log(
//       "See transaction at https://berkeley.minaexplorer.com/transaction/" + hash
//     );

//     setState({ ...state, creatingTransaction: false });
//   };

//   // -------------------------------------------------------
//   // Refresh the current state

//   const onRefreshCurrentNum = async () => {
//     console.log("getting zkApp state...");
//     await state.zkappWorkerClient!.fetchAccount({
//       publicKey: state.zkappPublicKey!,
//     });
//     const currentNum = await state.zkappWorkerClient!.getNum();
//     console.log("current state:", currentNum.toString());

//     setState({ ...state, currentNum });
//   };

//   // -------------------------------------------------------
//   // Create UI elements

//   let hasWallet;
//   if (state.hasWallet != null && !state.hasWallet) {
//     const auroLink = "https://www.aurowallet.com/";
//     const auroLinkElem = (
//       <a href={auroLink} target="_blank" rel="noreferrer">
//         {" "}
//         [Link]{" "}
//       </a>
//     );
//     hasWallet = (
//       <div>
//         {" "}
//         Could not find a wallet. Install Auro wallet here: {auroLinkElem}
//       </div>
//     );
//   }

//   let setupText = state.hasBeenSetup
//     ? "SnarkyJS Ready"
//     : "Setting up SnarkyJS...";
//   let setup = (
//     <div>
//       {" "}
//       {setupText} {hasWallet}
//     </div>
//   );

//   let accountDoesNotExist;
//   if (state.hasBeenSetup && !state.accountExists) {
//     const faucetLink =
//       "https://faucet.minaprotocol.com/?address=" + state.publicKey!.toBase58();
//     accountDoesNotExist = (
//       <div>
//         Account does not exist. Please visit the faucet to fund this account
//         <a href={faucetLink} target="_blank" rel="noreferrer">
//           {" "}
//           [Link]{" "}
//         </a>
//       </div>
//     );
//   }

//   let mainContent;
//   if (state.hasBeenSetup && state.accountExists) {
//     mainContent = (
//       <div>
//         <button
//           onClick={onSendTransaction}
//           disabled={state.creatingTransaction}
//         >
//           {" "}
//           Send Transaction{" "}
//         </button>
//         <div> Current Number in zkApp: {state.currentNum!.toString()} </div>
//         <button onClick={onRefreshCurrentNum}> Get Latest State </button>
//       </div>
//     );
//   }

//   const [enabled, setEnabled] = useState(false);
//   const router = useRouter()
//   let content = (
//     <div className="container mx-auto flex flex-col px-5 py-24 justify-center items-center">
//       <div className="w-full md:w-2/3 flex flex-col mb-16 items-center text-center">
//         <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
//           TagTalk
//         </h1>
//         <p className="mb-8 leading-relaxed">A Web3 styled chatting space.</p>
//         <div className="flex w-full justify-center items-end">
//           <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
//             <input
//               type="text"
//               name="name"
//               id="name"
//               className="block w-full rounded-full border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               placeholder="Tag"
//             />
//           </div>
//           <Switch.Group as="div" className="flex items-center">
//             <Switch
//               checked={enabled}
//               onChange={setEnabled}
//               className={classNames(
//                 enabled ? "bg-indigo-600" : "bg-gray-200",
//                 "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//               )}
//             >
//               <span
//                 aria-hidden="true"
//                 className={classNames(
//                   enabled ? "translate-x-5" : "translate-x-0",
//                   "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
//                 )}
//               />
//             </Switch>
//             <Switch.Label as="span" className="ml-3">
//               <span className="text-sm font-medium text-gray-900">Private</span>
//             </Switch.Label>
//           </Switch.Group>
//         </div>
        
//         <button
//           type="button"
//           className="inline-flex items-center mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           onClick={() => router.push('/chat')}
//         >
//           Talk!
//         </button>
//         <p className="text-sm mt-2 text-gray-500 mb-8 w-full">{setupText}</p>
//       </div>
//     </div>
//   );

//   let tags = (
//     <div className="w-full text-center">
//       <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 mr-2">
//         Mina
//       </span>
//       <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 mr-2">
//         Eth2.0
//       </span>
//       <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 mr-2">
//         zkApps
//       </span>
//       <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 mr-2">
//         Eth2.0
//       </span>
//       <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
//         Bitcoin
//       </span>
//       <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 mr-2">
//         Buidlers
//       </span>
//       <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 mr-2">
//         Defi
//       </span>
//       <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
//         DAO
//       </span>
//     </div>
//   );

//   let isReady = state.hasBeenSetup && state.accountExists

//   return (
//     <div>
//       {/* { setup } */}
//       <Header isReady={isReady} publicKey={state.publicKey?.toBase58()}/>
//       {accountDoesNotExist}
//       {mainContent}
//       {content}
//       {tags}
//     </div>
//   );
// }
