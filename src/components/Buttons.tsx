import styled from "styled-components";
import { MetamaskState } from "../hooks";
import { ReactComponent as FirnLogo } from "../assets/firn.svg";

export const Link = styled.a`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSizes.small};
  border-radius: ${(props) => props.theme.radii.button};
  border: 1px solid ${(props) => props.theme.colors.background.inverse};
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
  text-decoration: none;
  font-weight: bold;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    box-sizing: border-box;
  }
`;

export const Button = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

export const ButtonText = styled.span`
  margin-left: 1rem;
`;

export const HeaderButtons = ({ state, onConnectClick }: {
  state: MetamaskState;
  onConnectClick(): unknown;
}) => {
  return <Button onClick={onConnectClick} disabled={state.installedSnap || !state.isFlask || state.locked}>
    <FirnLogo/>
    <ButtonText>{state.installedSnap ? "Connected" : "Connect Firn"}</ButtonText>
  </Button>;
};
