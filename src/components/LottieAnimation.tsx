import Lottie from "lottie-react";
import loadingAnimation from "@/assets/Loading.json";

const LottieAnimation = () => {
  return (
    <Lottie
      animationData={loadingAnimation}
      loop
      autoplay
    />
  );
};

export default LottieAnimation;