'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code, FileText, Search, MessageSquare, BookOpen,
  Map, Sparkles, ArrowRight, Trophy, Users, Briefcase,
  Zap, Star, BarChart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const features = [
    {
      title: "Technical Question Practice",
      description: "Prepare for coding interviews with our extensive library of technical questions and real-time feedback.",
      icon: <Code className="h-10 w-10 text-primary" />,
      link: "/codepractice",
      color: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      title: "Resume Creator",
      description: "Build an ATS-friendly resume with our AI-powered resume builder optimized for job applications.",
      icon: <FileText className="h-10 w-10 text-primary" />,
      link: "/resume",
      color: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
    },
    {
      title: "Job Finder",
      description: "Discover opportunities that match your skills and preferences with our smart job search tool.",
      icon: <Search className="h-10 w-10 text-primary" />,
      link: "/jobs",
      color: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
    },
    {
      title: "AI Career Assistant",
      description: "Get personalized career advice and interview tips from our AI-powered assistant.",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      link: "/assistant",
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
    },
    {
      title: "Interview Question Sheets",
      description: "Access curated question sheets for specific companies and roles to focus your preparation.",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      link: "/questions",
      color: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
    },
    {
      title: "Career Roadmap Generator",
      description: "Plan your career progression with customized roadmaps based on your goals and current skills.",
      icon: <Map className="h-10 w-10 text-primary" />,
      link: "/roadmap",
      color: "bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200"
    },
    {
      title: "Community Forum",
      description: "Join our community of job seekers and professionals to share experiences and tips.",
      icon: <Users className="h-10 w-10 text-primary" />,
      link: "/forum",
      color: "bg-gradient-to-br from-teal-50 to-lime-50 border-teal-200"
    },
    {
      title: "Current Job Trends",
      description: "Stay updated with the latest trends in the job market and skills in demand.",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      link: "/trends",
      color: "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"

    },

  ];

  const benefits = [
    { title: "Land Your Dream Job", icon: <Trophy className="h-5 w-5" />, description: "Our users are 3x more likely to get interviews at top tech companies" },
    { title: "Save Valuable Time", icon: <Zap className="h-5 w-5" />, description: "Cut your interview prep time in half with our structured approach" },
    { title: "Gain Confidence", icon: <Star className="h-5 w-5" />, description: "Practice with real interview questions to build your confidence" },
    { title: "Track Your Progress", icon: <BarChart className="h-5 w-5" />, description: "See your improvement over time with detailed analytics" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
   

      {/* Hero Section */}
      <section className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-900 via-primary to-blue-800 py-20 md:py-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-0 h-96 w-96 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-96 w-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
          <div className="absolute grid grid-cols-12 gap-2 opacity-10 inset-0">
            {Array.from({ length: 144 }).map((_, index) => (
              <div key={index} className="h-6 w-6 rounded-full bg-white"></div>
            ))}
          </div>
        </div>

        <div className="container relative px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              className="flex flex-col space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center space-x-2 justify-center rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                <span>Your career journey starts here</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
                Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">Dream Career</span> With Confidence
              </h1>

              <p className="text-lg md:text-xl text-blue-100 max-w-[600px]">
                Comprehensive tools to ace technical interviews, create standout resumes, and navigate your career path with AI-powered guidance.
              </p>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 pt-4">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  Login
                </Button>
              </div>

              <div className="flex items-center pt-2 space-x-4 text-white/80">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-blue-900 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm">Join over <span className="font-bold">10,000+</span> professionals accelerating their careers</p>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl"></div>
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src="/hero.png"
                    alt="Career Kit Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400/0048b3/e0f2fe?text=Career+Kit+Dashboard";
                    }}
                  />
                </div>
                <div className="absolute -right-6 -bottom-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg p-3 shadow-lg transform rotate-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 max-w-[180px]">
                <div className="flex items-center space-x-2 pb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <p className="text-xs font-medium text-green-600">Success Rate</p>
                </div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-gray-500">higher interview success</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,218.7C672,224,768,224,864,213.3C960,203,1056,181,1152,186.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>



      {/* Features Section */}
      <section className="w-full px-4 py-5 md:py-8 bg-white">
        <motion.div
          className="container px-4 md:px-6 mx-auto space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
              Our Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Comprehensive tools to prepare for technical interviews, build your resume, find jobs, and map your career path.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href={feature.link}>
                  <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${feature.color} border`}>
                    <CardHeader>
                      <div className="p-2 w-fit rounded-xl bg-white shadow-sm mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="group p-0">
                        <span>Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>



      {/* CTA Section */}
      <section className="w-3/4 mx-auto rounded-4xl shadow-sm mb-5 py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/90 to-primary">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">Ready to Accelerate Your Career?</h2>
            <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of professionals who are achieving their career goals with our platform.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>



      {/* Why Choose Us Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-3 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold mb-4">We can help you Land Your Dream Jobs</h2>
            <p className="text-gray-600 text-lg">
              Career Kit combines cutting-edge technology with proven strategies to maximize your chances of success
            </p>
          </div>

          <div className="grid grid-cols-1 max-w-5xl mx-auto md:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader className="">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>


        </div>

      </section>



      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-base font-medium">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/codepractice" className="text-gray-400 hover:text-white">Technical Questions</Link></li>
                <li><Link href="/resume" className="text-gray-400 hover:text-white">Resume Creator</Link></li>
                <li><Link href="/roadmap" className="text-gray-400 hover:text-white">Career Roadmap</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Guides</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Career Kit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}