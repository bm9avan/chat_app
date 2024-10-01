"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { User } from "next-auth";
import { FC, ReactNode, useEffect, useState } from "react";
import SideBar from "./SideBar";

interface pageProps {
  position: number[] | undefined;
  children: ReactNode;
  me: User;
  friends: User[];
}

const ChatLayout: FC<pageProps> = ({
  position = [25, 75],
  children,
  me,
  friends,
}) => {
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
        <SideBar isCollapsed={isCollapsed} friends={friends} me={me} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={position[1]}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatLayout;
