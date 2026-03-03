import { useEffect, useState } from "react";
import Api from "../api/axios";
import { QRCodeCanvas } from "qrcode.react";
import { AiFillThunderbolt } from "react-icons/ai";
import { MdOutlineLink } from "react-icons/md";
import { PiTagSimpleFill } from "react-icons/pi";
import { RxExternalLink } from "react-icons/rx";
import { IoCopySharp } from "react-icons/io5";
import { ImShare2 } from "react-icons/im";
import { FaLocationDot } from "react-icons/fa6";
import { PiDevicesFill } from "react-icons/pi";
import { HiFolder } from "react-icons/hi2";
import { FaStopwatch } from "react-icons/fa6";
import { IoQrCodeSharp } from "react-icons/io5";
import graph from "../images/graph-i.png"
import { useLocation } from "react-router-dom";


function Home() {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });

                // remove hash after scroll
                window.history.replaceState(null, "", location.pathname);
            }
        } else {
            // when navigating to new page like "/" or "/dashboard"
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location])

    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleShorten = async () => {
        if (!url) return alert("Enter the url");

        try {
            setLoading(true);
            const res = await Api.post("/shorten", {
                originalUrl: url,
                customAlias: alias
            });
            // console.log(res.data.data);
            setShortUrl(res.data.data.shortUrl)
        } catch (err) {
            alert(err.response?.data?.message || "Error")
        } finally {
            setLoading(false)
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        alert('Copied!')
    };
    const downloadQR = () => {
        const canvas = document.getElementById("big-qr");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleShare = async () => {
        const shareUrl = `https://wcrfjq87-8000.inc1.devtunnels.ms/${shortUrl}`;
        console.log("Sharing:", shareUrl);
        try {
            await navigator.share({
                title: "Short Link",
                text: "Check this link",
                url: shareUrl,
            });
        } catch (err) {
            console.log("Share cancelled", err);
        }
    };

    return (
        <div className="hide-scrollbar ">
            <section className="min-h-screen mx-auto flex flex-col items-center justify-center relative overflow-hidden text-white border-b border-[#63686c5e]">
                {/* ===== Radial background glow ===== */}
                <div className="absolute -top-48 left-1/3 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-xl"></div>
                <h1 className="text-6xl font-extrabold text-center">
                    Shorten your links,
                    <br />
                    <span className=" text-[#2563EB]">broaden your reach</span>
                </h1>

                <p className="text-xl text-gray-400 mt-6 max-w-[48rem] text-center mb-12">The professional-grade link management platform for modern marketers. Create, track, and optimize your customer touchpoints with ease.</p>

                <div className="flex gap-2 z-10 bg-[#111827] w-[900px] outline-2 outline-[#1E293B] rounded-xl p-2 shadow-lg">
                    <div className="flex flex-1/4 p-3 rounded-lg bg-[#26324bbd] items-center gap-2">
                        <MdOutlineLink size={20} />
                        <input
                            type="text"
                            placeholder="Paste your long URL here"
                            className="w-full border-0 outline-0"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-1 p-3 items-center gap-2 rounded-lg bg-[#26324bbd]">
                        <PiTagSimpleFill size={20} />
                        <input
                            type="text"
                            placeholder="Custom Alias (Optional)"
                            className="w-full border-0 outline-0"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleShorten}
                        className="bg-[#2563EB] font-bold text-white px-6 text-nowrap flex flex-nowrap items-center gap-2 rounded-lg text-base hover:bg-blue-700 cursor-pointer"
                    >
                        {loading ? "..." : "Shorten Now"}
                        <AiFillThunderbolt />
                    </button>
                </div>
                {shortUrl && (
                    <div className="mt-8 bg-[#111827] max-w-[900px] w-full p-4 rounded-lg shadow flex gap-5 items-center z-10">
                        <div className="w-15 h-15 flex flex-col items-center justify-center rounded-md cursor-pointer bg-[#2563EB]"
                            onClick={() => setShowQR(true)}
                        >
                            <IoQrCodeSharp className="text-[#111827]" size={40} />
                            <div className=" text-black text-[8px] font-extrabold bottom-0 ">
                                <p>Click to view</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold text-white">Short Link:</p>
                                    <a href={`https://wcrfjq87-8000.inc1.devtunnels.ms/${shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 flex items-center">
                                        {shortUrl}
                                        <RxExternalLink />
                                    </a>
                                </div>

                                <p className="text-white">{url}</p>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                    <IoCopySharp /> Copy Link
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="px-3 py-3 bg-transparent outline outline-[#ffffff60] rounded-md hover:bg-[#78747426]"
                                >
                                    <ImShare2 size={20} />
                                </button>
                            </div>



                        </div>

                    </div>
                )}
                {showQR && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-[#111827] p-8 rounded-xl flex flex-col items-center">

                            <QRCodeCanvas value={`https://wcrfjq87-8000.inc1.devtunnels.ms/${shortUrl}`} size={220} bgColor="#111827" id="big-qr" fgColor="#2563EB" level="H" />

                            <button onClick={downloadQR} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">
                                Download QR
                            </button>
                            <button
                                onClick={() => setShowQR(false)}
                                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                )}
                {/* ===== Radial background glow ===== */}
                <div className="absolute -bottom-48 -right-1/3 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-xl"></div>
            </section>
            <section id="features" className="min-h-screen border-[#63686c5e] text-white border-b scroll-mt-34">
                <div className="flex flex-row items-center justify-between mt-35 mx-10">
                    <div className="max-w-[600px] flex flex-col gap-5">
                        <h2 className="text-[2.6rem] font-extrabold">Deep insights into every click</h2>
                        <p className="text-xl font-normal mb-3 text-[#9098a4]">Go beyond basic click counting. Understand your audience behavior with enterprise-grade analytics delivered in real-time.</p>
                        <ul className="space-y-5">
                            <li className="flex flex-row gap-4 items-center">
                                <div className="p-[0.6rem] rounded-xl bg-[#1244b146]">
                                    <FaLocationDot size={24} className="text-[#2563EB]" />
                                </div>
                                <div>
                                    <h4 className="text-[1.20rem] font-bold">Geographic Tracking</h4>
                                    <p className="text-[#9098a4]">Identify top-performing locations across countries and cities.</p>
                                </div>
                            </li>
                            <li className="flex flex-row gap-4 items-center">
                                <div className="p-[0.6rem] rounded-xl bg-[#1244b146]">
                                    <PiDevicesFill size={24} className="text-[#2563EB]" />
                                </div>
                                <div>
                                    <h4 className="text-[1.20rem] font-bold">Device &amp; Browser Analytics</h4>
                                    <p className="text-[#9098a4]">Monitor usage patterns across mobile, desktop, and tablet.</p>
                                </div>
                            </li>
                            <li className="flex flex-row gap-4 items-center">
                                <div className="p-[0.6rem] rounded-xl bg-[#1244b146]">
                                    <HiFolder size={24} className="text-[#2563EB]" />
                                </div>
                                <div>
                                    <h4 className="text-[1.20rem] font-bold">Referrer Data</h4>
                                    <p className="text-[#9098a4]">See exactly where your traffic is coming from.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="">
                        <img src={graph} alt="" className="rounded-3xl w-170 shadow-2xl shadow-[#03146487]" />
                    </div>
                </div>
            </section>
            <section className="min-h-screen border-b border-[#63686c5e] text-white flex flex-row items-center justify-evenly">
                <div className="bg-[#27437e40] rounded-2xl w-[370px] shadow-2xl shadow-[#0d2aab72]">
                    <div className="flex flex-col p-12 gap-2">
                        <FaStopwatch size={24} className="text-[#2563EB]" />
                        <h4 className="text-[1.20rem] font-bold">Real-time tracking</h4>
                        <p>Watch your campaigns come to life as clicks happen. Instant feedback on every link you share.
                        </p>
                    </div>
                </div>
                <div className="bg-[#27437e40] rounded-2xl w-[390px] shadow-2xl shadow-[#0d2aab72]">
                    <div className="flex flex-col p-12 gap-2">
                        <PiTagSimpleFill size={24} className="text-[#2563EB]" />
                        <h4 className="text-[1.20rem] font-bold">Custom Aliases</h4>
                        <p>Create memorable, branded links using custom aliases that fit your campaigns goals and build trust with your audience.</p>
                    </div>
                </div>

                <div className="bg-[#27437e40] rounded-2xl w-[370px] shadow-2xl shadow-[#0d2aab72]">
                    <div className="flex flex-col p-12 gap-2">
                        <IoQrCodeSharp size={24} className="text-[#2563EB]" />
                        <h4 className="text-[1.20rem] font-bold">QR Code Generation</h4>
                        <p>Bridge the gap between offline and online. Generate beautiful, trackable QR codes for every link instantly.</p>
                    </div>
                </div>
            </section>
            <section id="how" className="min-h-screen text-white flex items-center w-full relative">
                <div className="flex text-3xl absolute left-1/2 -translate-1/2 ] text-[#2564eb4a]">---------------------------------------------------------------</div>
                <div className="flex flex-col items-center gap-20 w-full px-25">
                    <h1 className="text-3xl font-extrabold">How it Works</h1>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col items-center gap-5 max-w-[300px]">
                            <div className="w-18 h-18 text-3xl font-bold bg-[#2563EB] rounded-full flex items-center justify-center shadow-2xl shadow-[#0c2dc1]">1</div>
                            <h4 className="text-xl font-bold">Paste your long link</h4>
                            <p className="text-center text-[#9098a4]">Drop your long, messy URL into our shortener tool to get started instantly.</p>
                        </div>
                        <div className="flex flex-col items-center gap-5 max-w-[300px]">
                            <div className="w-18 h-18 text-3xl font-bold bg-[#2563EB] rounded-full flex items-center justify-center shadow-2xl shadow-[#0c2dc1] ">2</div>
                            <h4 className="text-xl font-bold">Customize your alias</h4>
                            <p className="text-center text-[#9098a4]">Create a memorable, branded link that builds trust and increases click-through rates.</p>
                        </div>
                        <div className="flex flex-col items-center gap-5 max-w-[300px]">
                            <div className="w-18 h-18 text-3xl font-bold bg-[#2563EB] rounded-full flex items-center justify-center shadow-2xl shadow-[#0c2dc1]">3</div>
                            <h4 className="text-xl font-bold">Share and track</h4>
                            <p className="text-center text-[#9098a4]">Distribute your link and watch real-time analytics come to life with deep insights.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;