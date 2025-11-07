import React from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Aurora from "../../components/ui/Aurora";
import AnimatedContent from "../../components/ui/AnimatedContent";
import CountUp from "../../components/ui/CountUp";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        {/* <Aurora
          colorStops={["#f9a620", "#99d6ea", "#548c2f"]}
          blend={0.5}
          amplitude={2.0}
          speed={0.6}
        /> */}
      </div>

      {/* Content on top */}
      <div className="relative z-10 flex flex-col text-white items-center h-screen space-y-14 mt-14">
        <div className="flex flex-row items-center justify-center gap-2 border py-1 rounded-3xl px-4 mt-4 bg-white/10  backdrop-blur-sm">
          <Shield />
          <h1 className="text-sm font-bold">Trusted by 50,000+ investors</h1>
        </div>
        <h1 className="text-7xl font-bold w-1/2 text-center">
          Build Your Wealth Strategically
        </h1>

        <p className="text-lg">
          Track your finances and get a clear picture of your financial health.
        </p>
        <div className="flex gap-6 items-center">
          <button className="bg-black text-white px-6 py-2.5 rounded-md hover:bg-green-400 h-12 flex items-center justify-center hover:border-white transition-colors border border-green-300 font-semibold">
            Get Started
          </button>

          <button
            className="w-32 h-12  items-center justify-center bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
            onClick={() => navigate("/register")}
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center justify-between h-full w-full z-10 rounded-full bg-zinc-950 py-2 px-5 ring-1 ring-white/10">
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

        <div className="cards flex flex-row items-center justify-center gap-4">
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
            <div className="flex flex-col justify-center items-center border rounded-lg p-4 bg-white/10 backdrop-blur-sm">
              <h1 className="text-4xl">$2.5B +</h1>
              <p className="text-sm">Assets Under Management</p>
            </div>
          </AnimatedContent>

          <div className="flex flex-col justify-center items-center border rounded-lg p-4 bg-white/10 backdrop-blur-sm">
            <h1 className="text-4xl">
              <CountUp to={94} from={0} duration={1.2} ease="power3.out" />%
            </h1>
            <p className="text-sm">Client Success Rate</p>
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
            <div className="flex flex-col justify-center items-center border rounded-lg p-4 bg-white/10 backdrop-blur-sm">
              <h1 className="text-4xl">50K+</h1>
              <p className="text-sm">HappyClients Served</p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
