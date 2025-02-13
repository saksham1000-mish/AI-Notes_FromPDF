import { Button } from '@/components/ui/button';
import { chatSession } from '@/configs/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation } from 'convex/react';
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, BrainCircuit, Heading1, Heading2Icon, Heading3Icon, HighlighterIcon, ItalicIcon, List, StrikethroughIcon, TextQuote, UnderlineIcon } from 'lucide-react'
import { useParams } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

function EditorExtensions({editor}){
    const {fileId}=useParams();
    const searchAI=useAction(api.myAction.search)
    const saveNotes=useMutation(api.notes.AddNotes);
    const {user}=useUser();
    const onAiClick = async() =>{
        toast("AI is generating response...");
        const selectedText=editor.state.doc.textBetween(
            editor.state.selection.from, 
            editor.state.selection.to,
            ' '
        );
        console.log("selectedText",selectedText);
        const result=await searchAI({
            query:selectedText,
            fileId:fileId
        })

        const UnformattedAns=JSON.parse(result);
        let AllUnformattedAns = '';
        UnformattedAns&&UnformattedAns.forEach(item=>{
          AllUnformattedAns =AllUnformattedAns +item.pageContent
        });
        const PROMPT="For question :"+selectedText+" and with the given content, "+
        "please elaborate more and answer in HTML format. Give only the answer and no other text. If the content is empty then only answer on your own. The content is:"+AllUnformattedAns ;

        const AiModelResult=await chatSession.sendMessage(PROMPT);
        console.log(AiModelResult.response.text());
        const FinalAns = AiModelResult.response.text().replace('```','').replace('html','').replace('```','');

        const AllText=editor.getHTML();
        editor.commands.setContent(AllText+'<p><strong>Answer: </strong>'+FinalAns+'</p>');

        saveNotes({
            fileId:fileId,
            notes:editor.getHTML(),
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
    }

    return editor&&( 
        <div className='p-5'>
            <div className="control-group">
            <div className="button-group flex gap-3">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-slate-300 rounded-lg' :'' }
            >
                <BoldIcon/>
            </button>

            <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-slate-300 rounded-lg' :''}
          >
            <ItalicIcon/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'bg-slate-300 rounded-lg' :''}
          >
            <HighlighterIcon/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-slate-300 rounded-lg' :''}
          >
            <List/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-slate-300 rounded-lg' :''}
          >
            <TextQuote/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-slate-300 rounded-lg' :''}
          >
            <StrikethroughIcon/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-slate-300 rounded-lg' :''}
          >
            <UnderlineIcon/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <Heading1/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <Heading2Icon/>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <Heading3Icon/>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <AlignLeftIcon/>
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <AlignCenterIcon/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <AlignRightIcon/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-300 rounded-lg' :''}
          >
            <AlignJustifyIcon/>
          </button>

          <Button
            onClick={() => onAiClick()}
            className={'bg-orange-500'}
          >
            <BrainCircuit/> Generate AI Answer
          </Button>
          

            </div>
            </div>

        </div>
    )
}
export default EditorExtensions