/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const styleMap = {
    RED_LINE: {
      color: "red",
    },
  };
  const handleBeforeInput = (chars, editorState) => {
    const currentContentState = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    const currentBlock = currentContentState.getBlockForKey(
      currentSelection.getStartKey()
    );
    const currentText = currentBlock.getText();
    console.log(chars);
    // '#' => Heading
    if (chars === "#" && currentText.trim() === "") {
      console.log("heading");
      const newEditorState = RichUtils.toggleBlockType(
        editorState,
        "header-one"
      );
      setEditorState(newEditorState);
      return "handled";
    }
    // '*' => Bold
    if (chars === "*" && currentText.trim() === "") {
      console.log("bold");
      const newEditorState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      setEditorState(newEditorState);
      return "handled";
    }
    // '!' => Underline
    if (chars === "!" && currentText.trim() === "") {
      const newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        "UNDERLINE"
      );
      setEditorState(newEditorState);
      return "handled";
    }
    // '@'=> To give Red Color
    if (chars === "@" && currentText.trim() === "") {
      console.log("redline");
      const newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        "RED_LINE"
      );
      setEditorState(newEditorState);
      return "handled";
    }
    return "not-handled";
  };
  const saveToLocalStorage = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(contentRaw));
  };
  return (
    <div className="App">
      <div className="header">
        <header className="header-text">Demo editor by Mukul Bhardwaj</header>
        <button className="save-button" onClick={saveToLocalStorage}>
          Save
        </button>
      </div>
      <div className="instructions-box">
        <h4>How to use :-</h4>
        <p>
          <ol>
            <li>Use '#' as the first character to get heading.</li>
            <li>Use '*' as the first character to get bold text.</li>
            <li>Use '!' as the first character to get underline.</li>
            <li>Use '@' as the first character to get red line.</li>
            <li>Hit 'Save' button to save the current text to storage.</li>
          </ol>
        </p>
      </div>
      <Editor
        editorState={editorState}
        toolbar={""}
        onEditorStateChange={setEditorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
        placeholder="Start typing here ..."
      />
    </div>
  );
}

export default App;
