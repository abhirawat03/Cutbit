import logo from "../images/logo.png";

function Footer() {
    return (
        <footer className="min-h-50 border-t-2 border-[#202733] text-white">
            <div className="flex flex-col items-center my-12 gap-2">
                <div className="flex flex-row gap-2 items-center cursor-pointer">
                    <img src={logo} alt="" className="w-10 h-10" />
                    <h1 className="font-bold text-white text-xl">Cutbit</h1>
                </div>
                <p className="font-bold">@ 2026 Cutbit. All right reserved</p>
            </div>
        </footer>
    );
}

export default Footer;