import { useState } from "react";
import { EditorState, convertToRaw, RichUtils} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleBeforeInput = (chars, editorState) => {
    const currentContentState = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContentState.getBlockForKey(
      currentSelection.getStartKey()
    );
    const currentText = currentBlock.getText();

    // '#' => Heading
    if (chars === "#" && currentText.trim() === "") {
      const newEditorState = RichUtils.toggleBlockType(
        editorState,
        "header-one"
      );
      setEditorState(newEditorState);
      return "handled";
    }

    // '*' => Bold
    if (chars === "*" && currentText.trim() === "") {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      setEditorState(newEditorState);
      return "handled";
    }
    // '^' => Underline
    if (chars === "^" && currentText.trim() === "") {
      const newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        "UNDERLINE"
      );
      setEditorState(newEditorState);
      return "handled";
    }
    //make red color line

    return "not-handled";
  };
  return (
    <div className="App">
      <div className="header">
        <header className="header-text">Demo editor by Mukul Bhardwaj</header>
        <button>Save</button>
      </div>
      <Editor
        editorState={editorState}
        toolbar={""}
        onEditorStateChange={setEditorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        handleBeforeInput={handleBeforeInput}
      />
      {console.log(convertToRaw(editorState.getCurrentContent()))}
    </div>
  );
}

export default App;
