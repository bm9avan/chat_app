"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FC, ReactNode, useEffect, useState } from "react";
import SideBar from "./SideBar";

interface pageProps {
  position: number[] | undefined;
  children: ReactNode;
}

const ChatLayout: FC<pageProps> = ({ position = [25, 75], children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    function checkIfMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  });

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full"
      onLayout={(size: number[]) => {
        document.cookie = `cookies_current_position=${JSON.stringify(size)}`;
      }}
    >
      <ResizablePanel
        defaultSize={position[0]}
        minSize={isMobile ? 0 : 6}
        maxSize={isMobile ? 10 : 35}
        collapsedSize={isMobile ? 10 : 6}
        collapsible={true}
        onCollapse={() => {
          setIsCollapsed(true);
          // document.cookie = "cookies_is_collapsed=true";
        }}
        onExpand={() => setIsCollapsed(false)}
      >
        <SideBar isCollapsed={isCollapsed} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={position[1]}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatLayout;
