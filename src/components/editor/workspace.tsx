import LeftSidebar from "./sidebars/leftSideBar"
import AddNodeButton from "./add-node-button"
import { EditorContextProvider } from "@/contexts/editor-context"
import { WorkSpaceContextProvider } from "@/contexts/workspace-context"
import RightSidebar from "./sidebars/rightSideBar"

export default function WorkSpace() {

  return (
    <WorkSpaceContextProvider>
      <div className="w-svw h-svh">
        <EditorContextProvider>

          <div className="absolute bottom-5 right-5 z-10">
            <AddNodeButton />
          </div>

          <LeftSidebar />

          <RightSidebar />

        </EditorContextProvider>
      </div>
    </WorkSpaceContextProvider>
  )
}