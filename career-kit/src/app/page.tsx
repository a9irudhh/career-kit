'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code, FileText, Search, MessageSquare, BookOpen,
  Map, Sparkles, ArrowRight, Trophy, Users, Briefcase,
  Layers, Zap, Star, BarChart
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
      {/* Hero Section - Enhanced with more visual elements and clearer value prop */}
      <section className="w-full pt-8 pb-16 md:pt-32 md:pb-24 lg:pt-8 lg:pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Badge variant="outline" className="py-1.5 px-4 bg-white text-primary border-primary/20 rounded-full font-medium text-sm shadow-sm">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Careeer Kit
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <motion.div
              className="flex flex-col space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 leading-tight">
                  Launch Your Tech Career to New Heights
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-medium">
                  One platform. All the tools. Unlimited potential.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-100 space-y-4">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Career Kit brings everything you need to succeed in your tech career journey. From technical interview preparation to resume building, job searching, and career planning.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Some Content to ve yapped here  </p>
              </div>


              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 h-auto rounded-lg shadow-md shadow-primary/20">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="bg-white hover:bg-gray-50 font-medium px-8 py-6 h-auto rounded-lg border-gray-200">
                  View Demo
                </Button>
              </div>
            </motion.div>

            {/* Right column - Illustration */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 -right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>

              <div className="relative p-8">
                {/* Replace with actual illustration or image */}
                <div className="w-full h-[500px] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/logo.jpg"
                    alt="Career growth illustration"
                    fill
                    className="object-fill"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* How it works - Process steps */}
        <div className="container px-4 md:px-6 mx-auto mt-20">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-indigo-100"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center mb-10 text-center">
              <Badge className="mb-3 bg-primary/10 text-primary border-none px-3 py-1 text-sm">
                How It Works
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Path to Success in Four Simple Steps</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Our platform guides you through every step of your career journey with personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
              {[
                {
                  step: "01",
                  title: "Assess Your Skills",
                  description: "Take our assessment to identify your strengths and areas for improvement",
                  icon: <Layers className="h-6 w-6 text-blue-500" />
                },
                {
                  step: "02",
                  title: "Build Your Portfolio",
                  description: "Create an impressive resume and optimize it for applicant tracking systems",
                  icon: <FileText className="h-6 w-6 text-green-500" />
                },
                {
                  step: "03",
                  title: "Practice & Prepare",
                  description: "Master technical interviews with our extensive practice questions",
                  icon: <Code className="h-6 w-6 text-amber-500" />
                },
                {
                  step: "04",
                  title: "Land Your Dream Job",
                  description: "Apply with confidence and track your applications in one place",
                  icon: <Briefcase className="h-6 w-6 text-purple-500" />
                }
              ].map((item, index) => (
                <div key={index} className="relative outline-1 p-3 rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    {item.icon}
                  </div>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-white">
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/90 to-primary">
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