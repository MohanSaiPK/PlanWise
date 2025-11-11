import React from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Aurora from "../../components/ui/Aurora.jsx";
import AnimatedContent from "../../components/ui/AnimatedContent.jsx";
import CountUp from "../../components/ui/CountUp.jsx";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#f9a620", "#99d6ea", "#548c2f"]}
          blend={0.5}
          amplitude={2.0}
          speed={0.6}
        />
      </div>

      {/* Content on top */}
      <div className="relative z-10 flex flex-col text-white items-center min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Trust Badge */}
        <div className="flex flex-row items-center justify-center gap-2 border border-white/20 py-1.5 sm:py-2 rounded-3xl px-3 sm:px-4 m-4 sm:mb-8 bg-white/10 backdrop-blur-sm">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          <h1 className="text-xs sm:text-sm font-bold">
            Trusted by 50,000+ investors
          </h1>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-1/2 text-center mb-4 sm:mb-6 leading-tight">
          Build Your Wealth Strategically
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-center text-white/90 mb-8 sm:mb-10 md:mb-12 w-full sm:w-4/5 md:w-3/4 lg:w-2/3 px-4">
          Track your finances and get a clear picture of your financial health.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-12 sm:mb-16 w-full sm:w-auto">
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3 sm:py-2.5 rounded-lg hover:bg-green-400 h-12 flex items-center justify-center hover:border-white transition-all duration-300 border border-green-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-green-400/50"
          >
            Get Started
          </button>

          <button
            className="w-full sm:w-auto h-12 items-center justify-center bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
            onClick={() => navigate("/register")}
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center justify-center h-full w-full z-10 rounded-full bg-zinc-950 py-2 px-5 sm:px-6 ring-1 ring-white/10">
              <h1 className="text-sm">Sign Up</h1>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                ></path>
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.25rem] h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={true}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.3}
            animateOnMount={true}
          >
            <div className="flex flex-col justify-center items-center border border-white/20 rounded-lg p-4 sm:p-6 bg-white/10 backdrop-blur-sm w-full sm:w-auto min-w-[140px] sm:min-w-[180px]">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                $2.5B +
              </h1>
              <p className="text-xs sm:text-sm text-center mt-1 text-white/80">
                Assets Under Management
              </p>
            </div>
          </AnimatedContent>

          <div className="flex flex-col justify-center items-center border border-white/20 rounded-lg p-4 sm:p-6 bg-white/10 backdrop-blur-sm w-full sm:w-auto min-w-[140px] sm:min-w-[180px]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <CountUp to={94} from={0} duration={1.2} ease="power3.out" />%
            </h1>
            <p className="text-xs sm:text-sm text-center mt-1 text-white/80">
              Client Success Rate
            </p>
          </div>
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.5}
            animateOnMount={true}
          >
            <div className="flex flex-col justify-center items-center border border-white/20 rounded-lg p-4 sm:p-6 bg-white/10 backdrop-blur-sm w-full sm:w-auto min-w-[140px] sm:min-w-[180px]">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                50K+
              </h1>
              <p className="text-xs sm:text-sm text-center mt-1 text-white/80">
                Happy Clients Served
              </p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
