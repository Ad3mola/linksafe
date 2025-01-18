import { SponsorsContainer } from "./Sponsors.styles";

export const Sponsors = () => {
  return (
    <SponsorsContainer>
      Powered by{" "}
      <img src={"/assets/svg/reown.svg"} alt="reown" className="reown" />
    </SponsorsContainer>
  );
};

export default Sponsors;
