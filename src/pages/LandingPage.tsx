import { useState, useEffect } from "react";
import {
  Ticket,
  ArrowRight,
  Shield,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Headphones,
} from "lucide-react";
import wmcLogo from "../assets/wmcLogo.png";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import useLoggedInStore from "../@utils/store/loggedIn";
import useUserDataStore from "../@utils/store/userDataStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedInStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationTime, setAnimationTime] = useState(0);
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/ticket");
    }
  }, [isLoggedIn, navigate, user]);

  useEffect(() => {
    setIsLoaded(true);
    setAnimationTime(Date.now());

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const animationInterval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(animationInterval);
    };
  }, []);

  const getAnimationStyle = (index = 0) => {
    if (!isLoaded) return {};

    return {
      transform: `translate(${
        mousePosition.x * (index === 0 ? 0.02 : -0.02)
      }px, ${mousePosition.y * (index === 0 ? 0.02 : -0.02)}px) scale(${
        1 + Math.sin(animationTime / (3000 + index * 1000)) * 0.1
      })`,
      transition: "transform 0.1s ease-out",
    };
  };

  const features = [
    {
      icon: Ticket,
      title: "Smart Ticketing",
      description: "Streamlined ticket creation and management system",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor ticket status and progress in real-time",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless communication between departments",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Comprehensive insights and performance metrics",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "99.9%", label: "Uptime", icon: CheckCircle },
    { number: "8AM–5PM", label: "Support", icon: Headphones },
    { number: "150+", label: "Employees", icon: Users },
    { number: "10k+", label: "Tickets Resolved", icon: Star },
  ];

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"
          style={getAnimationStyle(0)}
        />
        <div
          className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl"
          style={getAnimationStyle(1)}
        />
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400/10 to-blue-400/10 blur-3xl"
          style={getAnimationStyle(2)}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 shadow">
            <Image src={wmcLogo} alt="Westlake Medical Center" />
          </div>
          <span className="text-xl font-bold text-gray-900">WMC Ticketing</span>
        </div>

        <button
          onClick={handleSignIn}
          className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl hover:shadow-xl hover:scale-105"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <div
          className="max-w-4xl space-y-8"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : 50}px)`,
            transition: "all 0.8s ease-out",
          }}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100">
            <Zap className="w-4 h-4 mr-2" />
            New Ticketing System
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold leading-tight text-gray-900 lg:text-7xl">
            Streamline Your{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text">
              Support Operations
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Built exclusively for{" "}
            <span className="font-semibold text-blue-600">
              Westlake Medical Center
            </span>{" "}
            to revolutionize internal ticket management and enhance team
            collaboration.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={handleSignIn}
              className="flex items-center px-12 py-4 mx-auto space-x-3 font-semibold text-white transition-all duration-300 transform shadow-2xl group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl hover:shadow-3xl hover:scale-105"
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className="grid w-full max-w-4xl grid-cols-2 gap-8 mt-20 lg:grid-cols-4"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : 30}px)`,
            transition: "all 0.8s ease-out 0.3s",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 text-center transition-all duration-300 border bg-white/60 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/80"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateY(${isLoaded ? 0 : 20}px)`,
                transition: `all 0.6s ease-out ${0.4 + index * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mb-2 text-3xl font-bold text-gray-900">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Powerful Features for{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                Modern Healthcare
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Experience the next generation of ticketing with advanced features
              designed for healthcare environments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-8 transition-all duration-300 border group bg-white/60 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/80 hover:shadow-xl"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: `translateY(${isLoaded ? 0 : 30}px)`,
                  transition: `all 0.6s ease-out ${0.6 + index * 0.1}s`,
                }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t bg-white/30 backdrop-blur-sm border-white/20">
        <div className="max-w-6xl px-8 mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 shadow">
                <Image src={wmcLogo} alt="Westlake Medical Center" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Westlake Medical Center
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Powered by ICT Department</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(+632) 8553-8185</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@westlakemedical.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Pedro, Laguna</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
