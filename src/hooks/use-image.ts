import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker'

export function useImage(folderPath: string){
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isLoadingDownload, setIsLoadingDownload] = useState(false)

  useEffect(()=> {
    if (image) downloadImage(folderPath, image)
  }, [image])

  async function downloadImage(folder: string, path: string){
    setIsLoadingDownload(true)
    try {
      const {data, error} = await supabase.storage.from(folder).download(path)

      if(error){
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setUrl(fr.result as string)
      }

    } catch (error) {
      if(error instanceof Error){
        setError(error.message)
      }
      setIsLoadingDownload(false)
    }finally{
      setIsLoadingDownload(false)
    }
  }

  async function uploadImage(){
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if(!result.canceled){
        const img = result.assets[0]
        const arraybuffer = await fetch(img.uri).then((res) => res.arrayBuffer())
        const fileExt = img.uri?.split('.').pop()?.toLocaleLowerCase() ?? 'png';
        const filePath = `${new Date().getTime()}.${fileExt}`;
        const contentType = img.mimeType ?? 'image/jpeg';

        const {data,error} = await supabase.storage.from(folderPath).upload(filePath, arraybuffer, {contentType})
        
        setImage(data?.path || null)
      }

    } catch (error: any) {
        setError(error.message || null)
    }
  }

  return {url, uploading, setUrl, uploadImage, error, setIsLoadingDownload, isLoadingDownload}
}