import MainWorkSpace from "@/components/sketcher/main";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-8 justify-between w-full h-full">
      {/*
      <PointPlotter />
      */}
      <MainWorkSpace />
    </main >
  );
}
