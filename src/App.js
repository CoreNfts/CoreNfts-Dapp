import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { connect2 } from "./redux/blockchain/tokenActions";
import { fetchData } from "./redux/data/dataActions";
import { fetchData2 } from "./redux/data/tokendataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Approve to proceed.`);
  const [tokenId, setTokenId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [approveAmount, setApproveAmount] = useState(900000000000000000000);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    TOKEN_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    TWITTER_LINK: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const approveStake = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    let stakingContract = String(CONFIG.CONTRACT_ADDRESS);
    let Amnt = String(approveAmount);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`approval processing...`);
    blockchain.smartContract.methods
      .approve(stakingContract, Amnt)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.TOKEN_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `approval successful ✔️`
        );
        dispatch(fetchData(blockchain.account));
        dispatch(connect());
      });
  };

  const stakeEmperor = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    let stakeAmount = String(amount);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Stake Processing...`);
    blockchain.smartContract.methods
      .stake(stakeAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Stake successful ✔️`
        );
        dispatch(fetchData(blockchain.account));
      });
  };

  const unStakeEmperor = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`unstaking processing...`);
    blockchain.smartContract.methods
      .withdraw()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `unstaking successful ✔️`
        );
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimReward = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`claim processing...`);
    blockchain.smartContract.methods
      .claim()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `claiming successful ✔️`
        );
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementTokenId = () => {
    let newTokenId = tokenId - 1;
    if (newTokenId < 1) {
      newTokenId = 1;
    }
    setTokenId(newTokenId);

    let newAmount = amount - 1000000000000000000;
    if (newAmount < 1000000000000000000) {
      newAmount = 1000000000000000000;
    }
    setAmount(newAmount);
  };

  const incrementTokenId = () => {
    let newTokenId = tokenId + 1;
    if (newTokenId > 900) {
      newTokenId = 900;
    }
    setTokenId(newTokenId);

    let newAmount = amount + 1000000000000000000;
    if (newAmount > 900000000000000000000) {
      newAmount = 900000000000000000000;
    }
    setAmount(newAmount);
  };

  const decrementTokenId50 = () => {
    let newTokenId = tokenId - 50;
    if (newTokenId < 0) {
      newTokenId = 0;
    }
    setTokenId(newTokenId);

    let newAmount = amount - 50000000000000000000;
    if (newAmount < 0) {
      newAmount = 0;
    }
    setAmount(newAmount);
  };

  const incrementTokenId50 = () => {
    let newTokenId = tokenId + 50;
    if (newTokenId > 900) {
      newTokenId = 900;
    }
    setTokenId(newTokenId);

    let newAmount = amount + 50000000000000000000;
    if (newAmount > 900000000000000000000) {
      newAmount = 900000000000000000000;
    }
    setAmount(newAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <a href={CONFIG.TWITTER_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.Sale}
            </s.TextTitle>
                <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.MARKETPLACE, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.Supply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  EMPEROR POOL STAKING
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  stake and earn more emperor
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect2());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {tokenId}
                      </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementTokenId50();
                        }}
                      >
                        50-
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementTokenId();
                        }}
                      >
                        1-
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementTokenId();
                        }}
                      >
                        +1
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementTokenId50();
                        }}
                      >
                        +50
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        onClick={(e) => {
                          stakeEmperor();
                          getData();
                        }}
                      >
                        STAKE
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          unStakeEmperor();
                          getData();
                        }}
                      >
                        UNSTAKEALL
                      </StyledButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          claimReward();
                          getData();
                        }}
                      >
                        CLAIM
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          approveStake();
                          getData();
                        }}
                      >
                        APPROVE
                      </StyledButton>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
      </s.Container>
    </s.Screen>
  );
}

export default App;
