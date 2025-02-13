"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { LoaderPinwheel } from 'lucide-react'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
  

function UploadPdfDialog({children, isMaxFile}){

      const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl);
      const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDb);
      const getFileUrl=useMutation(api.fileStorage.getFileUrl);
      const embedDocument=useAction(api.myAction.ingest)
      const {user} = useUser();
      const [file,setFile]=useState();
      const [loading,setLoading]=useState(false);
      const [fileName,setFileName]=useState();
      const [open,setOpen]=useState(false)
      const OnFileSelect=(event)=>{
        setFile(event.target.files[0]);
      }
      const OnUpload=async()=>{
        setLoading(true);
          // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file?.type },
          body: file,
        });
        const { storageId } = await result.json();
        console.log("Storage ID:", storageId);
        const fileId=uuid4();
        const fileUrl=await getFileUrl({storageId:storageId});
        // Step 3: Save the newly allocated storage id to the database
        
         const resp=await addFileEntry({
            fileId:fileId,
            storageId:storageId,
            fileName:fileName??'Untitled File',
            fileUrl:fileUrl,
            createdBy:user?.primaryEmailAddress?.emailAddress
        })
        console.log(resp);
        const ApiResp=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
        console.log(ApiResp.data.result);
       await embedDocument({
          splitText:ApiResp.data.result,
          fileId:fileId
        });
        // console.log(embededResult)
        setLoading(false);
        setOpen(false);

        toast('File is Ready!')


;      }

    return(
        <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disabled={isMaxFile} className='w-full'>+Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload PDF File</DialogTitle>
      <DialogDescription asChild>
        <div>
            <div className='mt-5 gap-2 p-3 rounded-md border'>
                <h2>Choose a file to upload</h2>
                <input type='file' accept='application/pdf'
                onChange={(event)=>OnFileSelect(event)}/>
            </div>
            <div className='mt-2'>
                <label>File Name *</label>
                <Input placeholder='File Name' onChange={(e)=>setFileName(e.target.value)}/>
            </div>
            <div>
                
            </div>
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?
              <LoaderPinwheel className='animate-spin'/>:'Upload'
            }
            </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

    )
}

export default UploadPdfDialog