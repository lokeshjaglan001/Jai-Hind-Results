import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import Link from "next/link";
import { X } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
  redirectAfterLogin?: string; // Optional redirect path after successful login
}

const offers = [
  "Courses","Mock Tests","Forms"
];

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "login",
  redirectAfterLogin,
}: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const router = useRouter();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup state
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 1000); // Change offer every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
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

      // Close dialog
      onOpenChange(false);

      // Reset form
      setLoginEmail("");
      setLoginPassword("");

      // Redirect if specified (e.g., after purchase)
      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      } else if (role === "admin") {
        // Only auto-redirect admins to admin panel
        router.push("/admin");
      }
      // Regular users stay on current page unless redirectAfterLogin is set

    } catch (err: unknown) {
      setLoginError("Invalid email or password.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setSignupError(null);
    try {
      await api.post("/auth/signup", {
        full_name: signupFullName,
        email: signupEmail,
        password: signupPassword,
      });

      // Switch to login tab after successful signup
      setActiveTab("login");
      setLoginEmail(signupEmail);

      // Reset signup form
      setSignupFullName("");
      setSignupEmail("");
      setSignupPassword("");

      // Show success message (optional)
      setLoginError("Account created! Please log in.");
    } catch (err: unknown) {
      setSignupError(
        err instanceof Error ? err.message : "Failed to create account."
      );
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50" />
      <DialogContent className="min-w-[300px] sm:min-w-[800px] bg-gradient-to-b from-[#f14a0d] to-[#007a33] border-0 rounded-3xl shadow-lg [&>button]:hidden p-3 sm:p-6">
        <DialogTrigger >
          <div className="text-white text-2xl font-light hover:text-gray-300 transition-colors">
            <X
              size={17}
              className="bg-white/20 text-black rounded-full p-0.5"
            />
          </div>
        </DialogTrigger>
        <div className="flex sm:hidden justify-end">
          <DialogTrigger asChild>
            <button 
              className="text-white text-2xl font-light hover:text-gray-300 transition-colors"
              aria-label="Close dialog"
              title="Close"
            >
              <X
                size={17}
                className="bg-white/20 text-black rounded-full p-0.5"
              />
            </button>
          </DialogTrigger>
        </div>
        <div className="grid grid-cols-1 sm:[grid-template-columns:1.5fr_1fr] gap-4">
          <img src="/baccha.jpg" alt="" className="absolute w-30 -right-29.5 bottom-3 lg:block hidden" />
          <div>
            <div className="grid grid-cols-3 items-center">
              <div className="flex flex-row sm:flex-col sm:ml-5 sm:col-span-2 sm:mt-4">
                <h1 className="text-2xl sm:text-3xl playfair text-white pl-3 sm:pl-0">
                  Jai Hind Result
                </h1>
                <p className="text-white text-xs hidden sm:inline">
                  Accurate | Fast | Reliable{" "}
                  <img src="/india.png" alt="" className="w-12 inline ml-3" />
                </p>
              </div>
              <div className="flex justify-center sm:hidden">
                <img
                  src="/india.png"
                  alt="Jai Hind result Logo"
                  className="w-16"
                />
              </div>
              <Link
                href={"https://softricity.in"}
                className="flex flex-col items-end pr-0 sm:pr-6"
              >
                <p className="text-right text-white text-[8px] font-extralight">
                  Powered by{" "}
                  <img src="/bijli.png" alt="" className="inline h-2.5" />
                </p>
                <img
                  src="/softricity.png"
                  className="w-25 h-7 object-cover"
                  alt=""
                />
              </Link>
            </div>

            <div className="text-md sm:text-xl playfair text-white text-center mt-5 !font-[300] sm:mt-16">
              <span className="text-[#ffde59]">Join Us</span> to access more
              educational content
            </div>
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    title: "Mock Tests",
                    desc: "Practice tests tailored for exams",
                  },
                  {
                    title: "Courses",
                    desc: "Advanced courses for your learning",
                  },
                  {
                    title: "Forms",
                    desc: "Exclusive forms for applying to schemes",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`
                      rounded-2xl
                      p-2
                      mt-5
                      bg-gradient-to-b
                      ${
                        index % 3 === 0
                          ? "from-[#f14a0d] to-[#f14a0d]"
                          : index % 3 === 1
                          ? "from-white to-white border border-gray-300"
                          : "from-[#007a33] to-[#007a33]"
                      }
                    `}
                  >
                    <div className={`
                        py-2
                        rounded-2xl
                        h-full
                        flex
                        flex-col
                        items-center
                        space-y-2
                        ${
                          index % 3 === 1
                            ? "bg-white"
                            : "bg-black/10"
                        }
                      `}>
                      <img src="/star.png" alt="" className="w-8" />
                      <h3 className={`
                        playfair
                        text-center
                        !font-extralight
                        mb-2
                        text-lg
                        ${
                          index % 3 === 1
                            ? "text-black"
                            : "text-white"
                        }
                      `}>
                        {feature.title}
                      </h3>
                      <p className={`
                        text-[10px]
                        text-center
                        ${
                          index % 3 === 1
                            ? "text-gray-700"
                            : "text-gray-200"
                        }
                      `}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block sm:hidden">
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
            </div>
          </div>

          <Tabs
            className="bg-white p-5 rounded-2xl"
            value={activeTab}
            onValueChange={(value : any) => setActiveTab(value as "login" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl">
              <TabsTrigger
                value="login"
                className="bg-transparent text-gray-600 data-[state=active]:!bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-2"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="bg-transparent text-gray-600 data-[state=active]:!bg-white data-[state=active]:text-black data-[state=active]:shadow-sm rounded-lg py-2"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
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
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Reset here
                  </Link>.
                </div>
                {loginError && (
                  <p
                    className={`text-sm ${
                      loginError.includes("created")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {loginError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#f14a0d] via-white to-[#007a33] text-black border border-gray-300 px-10 block mx-auto hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? "Logging in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    value={signupFullName}
                    placeholder="John Doe"
                    className="text-sm"
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    placeholder="name@example.com"
                    className="text-sm"
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    placeholder="your password here"
                    className="text-sm"
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                {signupError && (
                  <p className="text-sm text-red-600">{signupError}</p>
                )}
                <Button
                  type="submit"
                  disabled={isSignupLoading}
                  className="bg-gradient-to-r from-[#f14a0d] via-white to-[#007a33] text-black border border-gray-300 px-10 block mx-auto hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                >
                  {isSignupLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
