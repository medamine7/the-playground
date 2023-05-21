import { styled } from "styled-components";
import Slogans from "./Slogans";
import { LogOut as LogoutIcon, User as UserIcon, Settings as SettingsIcon, Menu as MenuIcon } from '@geist-ui/icons'

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/auth";
import { Popover, Spacer, Text } from "@geist-ui/core";
import breakpoints from "../style/breakpoints";
import { updateAppState } from "../store/reducers/app";
import { useEffect, useState } from "react";

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 80px;
  width: 100%;
  flex-shrink: 0;

  ${breakpoints.mobile`
    width: 100vw;
  `}
`;

const Masthead = styled.div`
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;

  ${breakpoints.mobile`
    height: 60px;
  `}
`;

const Logo = styled.img`
  width: 430px;
  height: calc(100% - 8px);
  object-fit: contain;
  object-position: center center;
  
  ${breakpoints.smallScreen`
    width: 320px;
  `}
  
  ${breakpoints.mobile`
    width: 200px;
  `}
`;

const UserSettings = styled(Popover)`
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: auto;
  bottom: auto;
`;

const PopoverContainer = styled.div`
  min-width: 150px;

  &&& {
    .pg-user-popover-item {
      cursor: pointer;
      display: flex;
      align-items: center;

      span {
        margin-top: 3px;
      }
    }
  }
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  font-family: var(--theplayground-font-secondary);

  ${breakpoints.mobile`
    small {
      display: none;
    }
  `};
`;

const MenuButton = styled.button`
  position: absolute;
  left: 20px;
  top: auto;
  bottom: auto;
  cursor: pointer;
  align-items: center;
  background: none;
  border: none;
  display: none;

  ${breakpoints.mediumScreen`
    display: flex;
  `}
`;

const SettingsContent = ({ callbacks }) => {
  const { logoutUser } = callbacks;
  const navigate = useNavigate();

  const navigateTo = (path) => () => {
    navigate(path);
  };

  return (
    <PopoverContainer>
      <Popover.Item className="pg-user-popover-item" onClick={navigateTo('/settings')}>
        <SettingsIcon size={16}/><Spacer inline w={.35} /><span>Settings</span>
      </Popover.Item>
      <Popover.Item className="pg-user-popover-item" onClick={logoutUser}>
        <LogoutIcon size={16}/><Spacer inline w={.35} /><span>Sign out</span>
      </Popover.Item>
    </PopoverContainer>
  )
}

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { showMenu } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const logoutUser = () => {
    setLoggingOut(true);
    dispatch(logout());
  };

  useEffect(() => {
    if (loggingOut && !user) {
      navigate("/authentication");
      setLoggingOut(false);
    }
  }, [loggingOut, navigate, user]);

  const toggleMenu = () => {
    dispatch(updateAppState({ showMenu: !showMenu }));
  };

  return (
    <Wrapper>
      <Masthead>
        {
          user && (
            <MenuButton onClick={toggleMenu}>
              <MenuIcon />
            </MenuButton>
          )
        }
        <Link to="/">
          <Logo src="/logo.png" draggable="false"/>
        </Link>
        {
          user && (
          <UserSettings>
            <Popover content={<SettingsContent callbacks={{ logoutUser }}/>}>
              <UserWrapper>
                <Text small>{user.name}</Text><Spacer inline w={.5} />
                <UserIcon size={20}/>
              </UserWrapper>
            </Popover>
          </UserSettings>
          )
        }
      </Masthead>
      <Slogans />
    </Wrapper>
  );
};

export default Header;
