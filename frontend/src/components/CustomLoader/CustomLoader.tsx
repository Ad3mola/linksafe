import { CustomLoaderContainer } from "./CustomLoader.styles";

export const CustomLoader: React.FC = () => {
  return (
    <CustomLoaderContainer>
      <span
        style={{
          fontSize: "0px",
          display: "inline-block",
          width: "auto !important",
        }}
      >
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "0.881291s ease 0.0812906s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "0.823169s ease 0.0231687s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "1.09256s ease 0.29256s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "1.17757s ease 0.377574s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "0.936415s ease 0.136415s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "1.51783s ease 0.717826s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "0.75325s ease -0.0467501s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "1.56251s ease 0.76251s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "white",
            width: "15px",
            height: "15px",
            margin: "2px",
            borderRadius: "100%",
            animation:
              "1.48937s ease 0.689373s infinite normal none running react-spinners-GridLoader-grid",
          }}
        ></span>
      </span>
    </CustomLoaderContainer>
  );
};

export default CustomLoader;
