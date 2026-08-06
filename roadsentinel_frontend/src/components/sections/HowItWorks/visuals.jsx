import Step1Img from "../../../assets/images/HowItWorksImages/Step1Image.png";
import Step2Img from "../../../assets/images/HowItWorksImages/Step2Image.png";
import Step3Img from "../../../assets/images/HowItWorksImages/Step3Image.png";
import Step4Img from "../../../assets/images/HowItWorksImages/Step4Image.png";
import Step5Img from "../../../assets/images/HowItWorksImages/Step5Image.png";
import Step6Img from "../../../assets/images/HowItWorksImages/Step6Image.png";

const imageContainerClass =
  "w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0E1210]";

export function ConnectVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step1Img} alt="Connect Step" className="w-full h-full object-cover" />
    </div>
  );
}

export function AutomateVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step2Img} alt="Automate Step" className="w-full h-full object-cover" />
    </div>
  );
}

export function MonitorVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step3Img} alt="Monitor Step" className="w-full h-full object-cover" />
    </div>
  );
}

export function ShipVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step4Img} alt="Ship Step" className="w-full h-full object-cover" />
    </div>
  );
}

export function AnalyzeVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step5Img} alt="Analyze Step" className="w-full h-full object-cover" />
    </div>
  );
}

export function ScaleVisual() {
  return (
    <div className={imageContainerClass}>
      <img src={Step6Img} alt="Scale Step" className="w-full h-full object-cover" />
    </div>
  );
}

// Map the step "visual" keys from steps.js to these components
export const visualsByKey = {
  violation: ConnectVisual,
  capture: AutomateVisual,
  report: MonitorVisual,
  verify: ShipVisual,
  challan: AnalyzeVisual,
  reward: ScaleVisual,
};