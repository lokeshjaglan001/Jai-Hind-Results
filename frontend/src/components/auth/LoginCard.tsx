import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const offers = ["Courses", "Mock Tests", "Forms"];

export function MobileLoginCard() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const data = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      
      const role = await login(data.access_token);

      setLoginEmail("");
      setLoginPassword("");

    } catch (err: unknown) {
      setLoginError("Invalid email or password.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#1c1e47] via-[#2b2d6c] to-[#34387e] p-4 flex items-center justify-center rounded-2xl max-h-[600px]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-6">
          <div className="flex flex-row">
            <h1 className="text-2xl text-white pl-3 playfair">
              Jai Hind Result
            </h1>
          </div>
          <div className="flex justify-center">
            <img src="/india.png" alt="" className="w-15" />
          </div>

        <Link
          href="https://softricity.in"
          className="flex flex-col items-end pr-0 mb-6"
          >
          <p className="text-right text-white text-[8px] font-extralight">
            Powered by ⚡
          </p>
          <img src="/softricity.png" alt="" className="w-25 h-6 object-cover" />
        </Link>
        </div>

        {/* Title */}
        <div className="text-md text-white text-center mt-5 font-light playfair">
          <span className="text-[#ffde59]">Join Us</span> to access more
          educational content
        </div>

        {/* Animated Offers Slider */}
        <div className="rounded-full w-full p-2 mt-5 bg-gradient-to-r from-[#4d4e84] via-[#393d76] to-[#2f3070] flex relative">
                <img src="/star.png" alt="" className="w-6 h-6 mr-2 p-1 bg-[#313371] rounded-full absolute top-1/2 -translate-y-1/2" />
                <div className="flex-1">
                  <div className="offers-slider">
                    <div
                      className="offer-text text-md text-white playfair !font-extralight text-center"
                      key={currentOfferIndex} // Key ensures re-render for animation
                    >
                      {offers[currentOfferIndex]}
                    </div>
                  </div>
                </div>
              </div>

        {/* Login Form Card */}
        <div className="bg-white p-5 rounded-2xl mt-6">
          <h2 className="text-xl font-semibold text-center mb-6">Sign in</h2>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginEmail}
                placeholder="name@example.com"
                className="text-sm"
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                placeholder="your password here"
                className="text-sm"
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-center text-sm my-5">
              Forgot your password?{" "}
              <a
                href="/auth/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Reset here
              </a>.
            </div>
            
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-[#f14a0d] via-white to-[#007a33] text-black border border-gray-300 px-10 block mx-auto hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Logging in..." : "Sign in"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}