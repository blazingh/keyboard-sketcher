import LeftSidebar from "./sidebars/leftSideBar"
import { EditorContextProvider } from "@/contexts/editor-context"
import { WorkSpaceContextProvider } from "@/contexts/workspace-context"
import { ModelContextProvider } from "@/contexts/model-context"

export default function WorkSpace() {

  return (
    <WorkSpaceContextProvider>
      <div className="w-svw h-svh">
        <ModelContextProvider>
          <EditorContextProvider>

            <LeftSidebar />
            {/*
          <RightSidebar />
          */}

          </EditorContextProvider>
        </ModelContextProvider>
      </div>
    </WorkSpaceContextProvider>
  )
}
