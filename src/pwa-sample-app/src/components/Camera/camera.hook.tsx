import { useState, useEffect, useCallback } from "react";

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
                setMediaStream(stream);
            } catch (err) {
                // Removed for brevity
            }
        }

        if (!mediaStream) {
            enableStream();
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [mediaStream, requestedMedia]);

    return mediaStream;
}

export function useCardRatio(initialRatio: number) {
    const [aspectRatio, setAspectRatio] = useState(initialRatio);

    const calculateRatio = useCallback((height: any, width: any) => {
        if (height && width) {
            const isLandscape = height <= width;
            const ratio = isLandscape ? width / height : height / width;

            setAspectRatio(ratio);
        }
    }, []);

    return [aspectRatio, calculateRatio];
}