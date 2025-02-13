
import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditorExtensions from './EditorExtensions'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import Blockquote from '@tiptap/extension-blockquote'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'



function TextEditor({fileId}) {

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId,
    })


    console.log(notes);
  const editor = useEditor({


    extensions: [StarterKit,
        Placeholder.configure({placeholder: 'Start taking notes...'}),
        Highlight.configure({ multicolor: true }),
        Underline,
        Heading.configure({
            levels: [1, 2, 3],}),
        TextAlign.configure({
            types: ['heading', 'paragraph'],}),
        BulletList,
        Blockquote,
    ],
    
    editorProps:{
        attributes: {
            class:'focus:outline-none h-screen p-5',
        },
        
    },
  

  })
 
  useEffect(()=>{
    editor&&editor.commands.setContent(notes)
  },[notes&&editor])
  

  return(
    <div>
        <EditorExtensions editor={editor}/>
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor
