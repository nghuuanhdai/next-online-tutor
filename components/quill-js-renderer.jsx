import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import 'quill/dist/quill.snow.css'; 

export default function QuillJSRenderer({ delta }) {
  const converter = new QuillDeltaToHtmlConverter(delta["ops"]);
  const html = converter.convert()

  return (
    <div className="ql-snow ql-container">
      <div className="ql-editor" dangerouslySetInnerHTML={{__html: html}}></div>
    </div>
  )
}