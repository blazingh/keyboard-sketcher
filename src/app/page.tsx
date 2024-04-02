import MainWorkSpace from "@/components/sketcher/main";
import { WorkSpaceOtpionsContextProvider } from "@/contexts/workspace";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8 justify-between w-full h-full">
      {/*
      <PointPlotter />
      */}
      <WorkSpaceOtpionsContextProvider>
        <MainWorkSpace />
      </WorkSpaceOtpionsContextProvider>
    </main >
  );
}
