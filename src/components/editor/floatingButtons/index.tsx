import GeneratorButtonGroup from "./generators";
import EditorMenu from "./editor-menu";
import { ViewControls } from "./view-controlls";
import PointerActionsToolbar from "./pointer-actions-selection";
import PointerActionsOptions from "./pointer-actions-options";


export function EditorFloatButtons() {

  return (
    <>

      {/* pointer actions toolbar */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <PointerActionsToolbar />
      </div>

      {/* model generation popup trigger */}
      <div className="absolute right-2 top-2 z-20">
        <GeneratorButtonGroup />
      </div>

      {/* App menu */}
      <div className="absolute top-2 left-2 z-20">
        <EditorMenu />
      </div>

      {/* view controls */}
      <div className="absolute left-2 bottom-2 z-20">
        <ViewControls />
      </div>

      {/* selected action options buttons */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 z-20">
        <PointerActionsOptions />
      </div>


    </>
  )
}