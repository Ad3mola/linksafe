import { Asset } from "../../utils/assets.utils";
import { OptionLabelContainer } from "./Option-Label.styles";

interface OptionLabelProps {
  option: Asset;
}

const OptionLabel: React.FC<OptionLabelProps> = ({
  option,
}: OptionLabelProps) => {
  return (
    <OptionLabelContainer>
      <div className="option-label__left">
        <img src={option.logo} alt="logo" className="option__icon" />
        <p className="">{option.name}</p>
      </div>
      <p className="option__amount">{option.amount.toFixed(3)}</p>
    </OptionLabelContainer>
  );
};

export default OptionLabel;
