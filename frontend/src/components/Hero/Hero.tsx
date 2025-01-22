import { HeroContainer, HeroSection, HeroSectionContent } from "./Hero.styles";
import { HEROCONTENT } from "../../utils/hero.utils";
const Hero = () => {
  return (
    <HeroContainer>
      {HEROCONTENT.map((hero, index) => (
        <HeroSection className="move-in" key={index}>
          <HeroSectionContent>
            <div className="hero__header">
              <h2>{hero.title}</h2>
              <img src={hero.image} alt="hero" className="hero__img" />
            </div>
            <p className="hero__description">{hero.description}</p>
          </HeroSectionContent>
        </HeroSection>
      ))}
    </HeroContainer>
  );
};

export default Hero;
