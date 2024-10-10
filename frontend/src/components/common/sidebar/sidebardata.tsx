import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { SlArrowRight, SlArrowDown } from 'react-icons/sl';
import { VscCircle } from "react-icons/vsc";
import { AiFillProduct } from "react-icons/ai";
import { GrUserWorker } from "react-icons/gr";
import { MdRedeem } from "react-icons/md";
import { MdCampaign } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { IconCashRegister } from '@tabler/icons-react';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { IconScan } from '@tabler/icons-react';
import { IconBuildingBank } from '@tabler/icons-react';
import { IconCoins } from '@tabler/icons-react';
import RedeemIcon from '@mui/icons-material/Redeem'; 
import { IconHelpHexagon } from '@tabler/icons-react';

import '../../../assets/css/sidebar.css';


const iconStyle = { height: '8px', width: '8px', strokeWidth: '5rem' };



export const SidebarData = [
  {
    title: 'Admin Dashboard',
    path: '/admin-dashboard',
    icon: <AiIcons.AiFillHome className='sidebaricon' />,

  },
  {
    title: 'Product Dashboard',
    // path: '/admin-dashboard',
    icon: <AiFillProduct className='sidebaricon' />,
    iconClosed:<SlArrowRight style={iconStyle}  /> ,
    iconOpened: <SlArrowDown style={iconStyle}  />,

    subNav: [
      {
        title: 'Product Master',
        path: '/product-master',
        icon: <VscCircle />,
        cName: 'sub-nav'
      },
      {
        title: 'Product QR History',
    path: '/product-qr-history',
        icon: <VscCircle />,
        cName: 'sub-nav'
      },
    ]
  },
  {
    title: 'Customer Dashboard',
    // path: '/carpenter-dashboard',
    icon: <GrUserWorker className='sidebaricon'  />,

    iconClosed:<SlArrowRight  style={iconStyle} /> ,
    iconOpened: <SlArrowDown  style={iconStyle} />,

    subNav: [
      {
        title: 'Customer Registration',
        path: '/carpenter-registration',
        icon: <VscCircle />
      },
      {
        title: 'Customer Details',
        path: '/carpenter-details',
        icon: <VscCircle  />
      }
    ]
  },
  {
    title: 'Reward Request',
    path: '/redeemption-request',
    icon: <MdRedeem className='sidebaricon'/>
  },
  {
    title: 'Transaction History',
    path: '/transaction-history',
    icon: <IconCashRegister className='sidebaricon' />
  },
  {
    title: 'Announcement',
    path: '/announcement',
    icon: <MdCampaign className='sidebaricon'  />
  },
  {
    title: 'Set Reward Points',
    path: '/set-reward-points',
    icon: <IconCoins className='sidebaricon'  />
  },
  {
    title: "FAQ's",
    path: '/frequently-asked-question',
    icon: <IoIcons.IoMdHelpCircle className='sidebaricon'  />
  },
  
  {
    title: 'Add User',
    path: '/add-user',
    icon: <FaUserPlus  className='sidebaricon'/>
  },
  {
    title: 'Dashboard',
    path: '/carpenter-dashboard',
    icon: <IconLayoutDashboard  className='sidebaricon'/>
  },
  {
    title: 'QR Scanner',
    path: '/qr-scanner',
    icon: <IconScan  className='sidebaricon'/>
  },
  {
    title: 'Banking History',
    path: '/banking-history',
    icon: <IconBuildingBank  className='sidebaricon'/>
  },
  {
    title: 'Point History',
    path: '/point-history',
    icon: <IconCoins  className='sidebaricon'/>
  },
  {
    title: 'Redeem Request',
    path: '/redeem-request',
    icon: <RedeemIcon  className='sidebaricon'/>
  },
  {
    title: 'Help & Support',
    path: '/help-and-support',
    icon: <IconHelpHexagon  className='sidebaricon'/>
  },
  {
    title: 'Announcements',
    path: '/customer-announcement',
    icon: <MdCampaign className='sidebaricon'  />
  },
  
];
