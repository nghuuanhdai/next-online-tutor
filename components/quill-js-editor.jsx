import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import { useEffect } from 'react';
export default function QuillJsEditor({delta, onQuillSet})
{
  const theme = 'snow';
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['link', 'image'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
  
      ['clean']                                         // remove formatting button
    ],
  };

  const { quill, quillRef } = useQuill({ theme, modules });
  
  useEffect(()=>{
    quill?.setContents(delta)
  },[quill])

  useEffect(()=>{
    if(quill)
      onQuillSet(quill)
  })

  return (
    <div className='pb-10'>
      <div style={{ width: '100%'}}>
        <div ref={quillRef} style={{ height: 300 }}/>
        <div id="toolbar" />
      </div>
    </div>
  );
}