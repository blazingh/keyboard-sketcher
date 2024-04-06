import MainWorkSpace from "@/components/sketcher/main";
import { WorkSpaceOtpionsContextProvider } from "@/contexts/workspace";

export default function Home() {
  return (
    <WorkSpaceOtpionsContextProvider>
      <MainWorkSpace />
    </WorkSpaceOtpionsContextProvider>
  );
}
