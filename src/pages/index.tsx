import { useContext } from "react";
import styled from "styled-components";
import { MetamaskActions, MetaMaskContext } from "../hooks";
import { ReactComponent as FlaskFox } from "../assets/flask_fox.svg";
import { Button, ButtonText, Card, Link } from "../components";
import { handleBalance, handleInitialize, handleTransact } from "../utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;

  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;

  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }

  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.success.muted};
  border: 1px solid ${({ theme }) => theme.colors.success.default};
  color: ${({ theme }) => theme.colors.success.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  return (
    <Container>
      <Heading>
        Welcome to <Span>@firnprotocol/snap</Span>
      </Heading>
      {/*<Subtitle>*/}
      {/*  Get started by editing <code>src/index.ts</code>*/}
      {/*</Subtitle>*/}
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {state.success && (
          <SuccessMessage>
            <b>Success:</b> {state.success}
          </SuccessMessage>
        )}
        {(
          <Card
            content={{
              title: "Install",
              description: "Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.",
              button: <Link href="https://metamask.io/flask/" target="_blank">
                <FlaskFox/>
                <ButtonText>Install MetaMask Flask</ButtonText>
              </Link>,
            }}
            fullWidth
            disabled={state.isFlask}
          />
        )}
        <Card
          content={{
            title: "Log in",
            description: "Prompt the user to log into his Firn account.",
            button: <Button
              onClick={async () => {
                try {
                  dispatch({ type: MetamaskActions.SetLocked, payload: true });
                  await handleInitialize();
                  const message = `User successfully logged in.`;
                  dispatch({ type: MetamaskActions.SetSuccess, payload: message });
                } catch (error) {
                  dispatch({ type: MetamaskActions.SetError, payload: error });
                } finally {
                  dispatch({ type: MetamaskActions.SetLocked, payload: false });
                }
              }}
              disabled={!state.installedSnap || !state.isFlask || state.locked}
            >
              Log in
            </Button>
          }}
          disabled={!state.installedSnap || !state.isFlask}
          fullWidth
        />
        <Card
          content={{
            title: "Get balance",
            description: "Request the user's Firn account balance.",
            button: <Button
              onClick={async () => {
                try {
                  dispatch({ type: MetamaskActions.SetLocked, payload: true });
                  const balance = await handleBalance();
                  const message = `User's Firn balance is ${(balance / 1000).toFixed(3)} ETH.`;
                  dispatch({ type: MetamaskActions.SetSuccess, payload: message });
                } catch (error) {
                  dispatch({ type: MetamaskActions.SetError, payload: error });
                } finally {
                  dispatch({ type: MetamaskActions.SetLocked, payload: false });
                }
              }}
              disabled={!state.installedSnap || !state.isFlask || state.locked}
            >
              Request balance
            </Button>
          }}
          disabled={!state.installedSnap || !state.isFlask}
          fullWidth
        />
        <Card
          content={{
            title: "Transact",
            description: "Initiate a private transaction via the user's logged-in Firn account. THIS WILL ACTUALLY INDUCE AN ON-CHAIN ACTION IF YOU APPROVE THE PROMPT!",
            button: <Button
              onClick={async () => {
                try {
                  dispatch({ type: MetamaskActions.SetLocked, payload: true });
                  const transactionReceipt = await handleTransact();
                  const message = `Transaction successful; its hash was ${transactionReceipt.transactionHash}.`;
                  dispatch({ type: MetamaskActions.SetSuccess, payload: message });
                } catch (error) {
                  dispatch({ type: MetamaskActions.SetError, payload: error });
                } finally {
                  dispatch({ type: MetamaskActions.SetLocked, payload: false });
                }
              }}
              disabled={!state.installedSnap || !state.isFlask || state.locked}
            >
              Transact
            </Button>
          }}
          disabled={!state.installedSnap || !state.isFlask}
          fullWidth
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
