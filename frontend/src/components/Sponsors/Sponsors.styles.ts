import styled from "styled-components";
import { flexCenter } from "../../styles/__mixins";

export const SponsorsContainer = styled.div`
  ${flexCenter()};
  gap: 0.5rem;
  font-family: var(--font-family-nista);

  .reown {
    width: 100px;
  }

  .circle {
    width: 80px;
  }
`;
