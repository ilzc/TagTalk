import { Fragment } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { Spinner } from "flowbite-react";
import router from "next/router";
import { Avatar, Dropdown, Layout, Menu, MenuProps, theme } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Link from "next/link";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


export function Header({isReady, publicKey}) {


  if (isReady) {
    console.log("isReady:" + isReady);
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'right',
    color: '#fff',
    height: 48,
    paddingInline: 50,
    lineHeight: '48px',
    backgroundColor: '#7dbcea',
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href="/profile">Your Profile</Link>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];

  return (
    <Layout.Header style={headerStyle}>
      <div className="logo" />
        {!isReady ?
        <Spin/> :
        <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large" gap={1}>
          {publicKey}
        </Avatar>
        </Dropdown>
}
    </Layout.Header>
  );
}
