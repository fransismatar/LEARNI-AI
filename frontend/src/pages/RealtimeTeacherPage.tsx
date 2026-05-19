import { useRef, useState } from "react";
import api from "../services/api";

const RealtimeTeacherPage = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState("Disconnected");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRealtime = async () => {
    try {
      setConnecting(true);
      setStatus("Creating realtime session...");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("Microphone is not available in this browser.");
        return;
      }

      const token = localStorage.getItem("token");

      const sessionRes = await api.post(
        "/realtime/session",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ephemeralKey = sessionRes.data.value;

      setStatus("Starting microphone...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
        }
      };

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const dataChannel = pc.createDataChannel("oai-events");

      dataChannel.addEventListener("open", () => {
        setStatus("Connected. You can speak now.");

        dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["audio"],
              instructions:
                "Start the lesson. Greet the student and begin with a short English speaking practice.",
            },
          })
        );
      });

      dataChannel.addEventListener("message", (event) => {
        const serverEvent = JSON.parse(event.data);
        console.log("Realtime event:", serverEvent);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp || "",
        }
      );

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.log(errorText);
        setStatus("OpenAI realtime connection failed.");
        return;
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };

      await pc.setRemoteDescription(answer);

      setConnected(true);
      setStatus("Connected. Speak with your AI teacher.");
    } catch (error) {
      console.log(error);
      setStatus("Failed to connect realtime voice.");
    } finally {
      setConnecting(false);
    }
  };

  const stopRealtime = () => {
    pcRef.current?.getSenders().forEach((sender) => {
      sender.track?.stop();
    });

    pcRef.current?.close();
    pcRef.current = null;

    setConnected(false);
    setStatus("Disconnected");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <audio ref={audioRef} autoPlay />

      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8">
        <p className="text-sm font-semibold text-cyan-300">
          Realtime AI Voice Teacher
        </p>

        <h1 className="mt-3 text-5xl font-black">
          Speak naturally with your AI teacher
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          This mode uses WebRTC for live audio conversation with low latency.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-6xl">
          🎙️
        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">{status}</h2>

        <div className="mt-8 flex justify-center gap-4">
          {!connected ? (
            <button
              onClick={startRealtime}
              disabled={connecting}
              className="rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
            >
              {connecting ? "Connecting..." : "Start Voice Lesson"}
            </button>
          ) : (
            <button
              onClick={stopRealtime}
              className="rounded-2xl bg-red-400 px-8 py-4 font-bold text-white transition hover:bg-red-300"
            >
              End Lesson
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RealtimeTeacherPage;