import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Video, PenTool } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-black to-blue-900">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Learn Smarter, Not Harder</h1>
          <p className="text-xl mb-8">AI-powered video summaries and quizzes to accelerate your learning</p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-200">
            <Link href="/">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Feature Section */}
      <section className="py-20 bg-blue-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-16">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Video className="w-12 h-12 text-white" />}
              title="Video Summaries"
              description="Get concise summaries of educational videos to grasp key concepts quickly."
            />
            <FeatureCard
              icon={<PenTool className="w-12 h-12 text-white" />}
              title="Interactive Quizzes"
              description="Test your knowledge with AI-generated quizzes tailored to each lesson."
            />
            <FeatureCard
              icon={<BookOpen className="w-12 h-12 text-white" />}
              title="Comprehensive Courses"
              description="Access a wide range of courses across various subjects and disciplines."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students who are already benefiting from our platform.</p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-200">
            <Link href="/">Explore Courses <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 YourPlatformName. All rights reserved.</p>
            <nav className="flex gap-4 mt-4 md:mt-0">
              <Link href="/about" className="hover:text-blue-400">About</Link>
              <Link href="/contact" className="hover:text-blue-400">Contact</Link>
              <Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}