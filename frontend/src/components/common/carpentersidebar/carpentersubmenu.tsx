import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  height: 40px;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(163 174 209 / var(--tw-text-opacity));
  justify-content: space-between;
  margin-bottom: 5px;
  &:hover {
    background-color: rgb(255 255 255 / 0.05);
    color: rgb(255 255 255 / var(--tw-text-opacity));
    cursor: pointer;
  }
`;

const SidebarLabel: any = styled.span`
  margin-left: 10px;
  margin-right: 10px !important;
  display: ${(props: any) => (props.$isSidebarActive ? 'none' : 'block')};
`;

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  height: 40px;
  text-decoration: none;
  font-size: 0.85rem;
  line-height: 1;
  font-weight: 500;
  color: rgb(163 174 209 / var(--tw-text-opacity));
  border-radius: 6px;
  &:hover {
    background-color: rgb(255 255 255 / 0.05);
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    cursor: pointer;
  }
`;

const SubMenu = ({ item, isSidebarActive }: any) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} className='submenu-list'>
          {item.icon}
          <SidebarLabel $isSidebarActive={isSidebarActive}>{item.title}</SidebarLabel>
        </div>
        <div className={`menulistcollapsed ${isSidebarActive ? 'hidden' : 'block'}`}>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item: any, index: any) => (
          <DropdownLink to={item.path} key={index}>
            {item.icon}
            <SidebarLabel $isSidebarActive={isSidebarActive}>{item.title}</SidebarLabel>
          </DropdownLink>
        ))}
    </>
  );
};
export default SubMenu;