import { useEffect, useRef, useState } from 'react';

const useAudio = () => {
    const [audioChunk, setAudioChunk] = useState<Blob[]>([]);
    const [isRecourding, setIsRecourding] = useState<boolean>(false);
    const media = useRef<any>();
    const recourd = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        media.current = new MediaRecorder(stream);
        media.current.start();
        media.current.addEventListener('dataavailable', (chunk: any) => {
            setAudioChunk([...audioChunk, chunk.data]);
        });
        setIsRecourding(true);
    };
    const puase = () => {
        if (!media.current) return;
        media.current.stop();
        setIsRecourding(false);
    };
    return { puase, recourd, isRecourding, audioChunk };
};

export default useAudio;
