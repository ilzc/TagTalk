import { PublicKey, PrivateKey, Field, isReady } from "snarkyjs";
import ZkappWorkerClient from "./zkappWorkerClient";
import { useEffect } from "react";

import Client from 'mina-signer';
import { useRequest } from "ahooks";
import { Button, Form, Input } from "antd";

const client = new Client({ network: 'testnet' });

export default function Profile() {

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  

  function editUsername(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve();
        } else {
          reject(new Error('Failed to modify username'));
        }
      }, 1000);
    });
  }

  const { loading, run } = useRequest(editUsername, {
    manual: true,
    onBefore: (params) => {
      // message.info(`Start Request: ${params[0]}`);
    },
    onSuccess: (result, params) => {
      // setState('');
      // message.success(`The username was changed to "${params[0]}" !`);
    },
    onError: (error) => {
      // message.error(error.message);
    },
    onFinally: (params, result, error) => {
      // message.info(`Request finish`);
    },
  });

  useEffect(() => {
    (async () => {
      const zkappWorkerClient = new ZkappWorkerClient();
  
          console.log("Loading SnarkyJS...");
          await zkappWorkerClient.loadSnarkyJS();
  
          const mina = (window as any).mina;
          // const result = await mina.signMessage( { message: 'test12345' } );
          const result = client.signMessage('test12345', { privateKey: 'EKFEpJ233pjYzTJuwbgcmoiefvDjJUvhBQTDhf35JbUPsTtcAqKS', publicKey:'B62qikhXrwM5WXMhhZUM89rVDKtt88u1y2sGnKAPpTGw5FZGsyZFnbZ' })
          console.log("result:" + JSON.stringify(result));
    })();
  }, []);
  
  return (
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Address"
      name="address"
      rules={[{ required: true, message: 'Please input your address!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input your name!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  );
}
