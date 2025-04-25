import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const SidebarLink = styled(NavLink)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  height: 40px;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  justify-content: space-between;
  margin-bottom: 5px;

  background-color: ${(props) => (props.$isActive ? 'black' : 'transparent')};
  color: ${(props) => (props.$isActive ? 'white' : 'rgb(49, 48, 48)')};

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? 'black' : 'rgba(53, 51, 51, 0.05)'};
    color: ${(props) => (props.$isActive ? 'white' : 'rgb(8, 8, 8)')};
    cursor: ${(props) => (props.$isActive ? 'default' : 'pointer')};
  }
`;


const SidebarDiv = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  height: 40px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  justify-content: space-between;
  margin-bottom: 5px;

  background-color: ${(props) => (props.$isActive ? 'black' : 'transparent')};
  color: ${(props) => (props.$isActive ? 'white' : 'rgb(49, 48, 48)')};

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? 'black' : 'rgba(53, 51, 51, 0.05)'};
    color: ${(props) => (props.$isActive ? 'white' : 'rgb(8, 8, 8)')};
    cursor: ${(props) => (props.$isActive ? 'default' : 'pointer')};
  }
`;



const SidebarLabel: any = styled.span`
  margin-left: 10px;
  margin-right: 10px !important;
  display: ${(props: any) =>
    props.$isSidebarActive ? (props.$isHover ? 'block' : 'none') : 'block'};
`;

const DropdownLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  height: 40px;
  text-decoration: none;
  font-size: 0.85rem;
  line-height: 1;
  font-weight: 500;
  color: rgb(49, 48, 48);
  border-radius: 6px;

  &.active {
    color: black;
    font-weight: bold;
  }

  &:hover {
    background-color: rgba(53, 51, 51, 0.05);
    color: rgb(8, 8, 8);
    cursor: pointer;
  }
`;

const SubMenu = ({ item, isSidebarActive, isHover }: any) => {
  const location = useLocation();
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  // Check if current path matches the menu or its submenus
  const isActive = () => {
    if (item.path && location.pathname === item.path) return true;

    if (item.subNav && Array.isArray(item.subNav)) {
      return item.subNav.some((sub: any) => location.pathname === sub.path);
    }

    return false;
  };

  useEffect(() => {
    if (isActive()) {
      setSubnav(true);
    }
  }, []);

  const isParentActive = isActive();

  return (
    <>
    {item.path ? (
      <SidebarLink
        to={item.path}
        onClick={item.subNav && showSubnav}
        $isActive={isParentActive}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} className="submenu-list">
          {item.icon}
          <SidebarLabel $isSidebarActive={isSidebarActive} $isHover={isHover}>
            {item.title}
          </SidebarLabel>
        </div>
        <div className={`menulistcollapsed ${isSidebarActive ? (isHover ? 'block' : 'hidden') : 'block'}`}>
          {item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}
        </div>
      </SidebarLink>
    ) : (
      <SidebarDiv onClick={item.subNav && showSubnav} $isActive={isParentActive}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {item.icon}
          <SidebarLabel $isSidebarActive={isSidebarActive} $isHover={isHover}>
            {item.title}
          </SidebarLabel>
        </div>
        <div className={`menulistcollapsed ${isSidebarActive ? (isHover ? 'block' : 'hidden') : 'block'}`}>
          {item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}
        </div>
      </SidebarDiv>
    )}

    {subnav &&
      item.subNav &&
      item.subNav.map((subItem: any, index: any) => (
        <DropdownLink
          to={subItem.path}
          key={index}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {subItem.icon}
          <SidebarLabel $isSidebarActive={isSidebarActive} $isHover={isHover}>
            {subItem.title}
          </SidebarLabel>
        </DropdownLink>
      ))}
  </>
  );
};

export default SubMenu;
