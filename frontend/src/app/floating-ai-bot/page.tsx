import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Zap,
  Bot,
  Users,
  Shield,
  Rocket,
} from "lucide-react";
import FloatingChatbot from "@/components/FloatingChatbot";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 mr-2 animate-pulse duration-700 " />
            Powered by Advanced AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Meet Your New
            <span className="text-primary"> AI Assistant</span>
          </h1>

          <p className="text-xl text-foreground/50 text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of conversation with our intelligent chatbot.
            Get instant answers, creative solutions, and personalized assistance
            24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center group">
            <Link href="/bot">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Chatting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:animate-ping duration-[4000ms]" />
              </Button>
            </Link>
            <Link href="/advanced-ai-bot">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 border-border text-white text-lg font-semibold rounded-xl bg-transparent "
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground/90">
            Why Choose Our AI Assistant?
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            Discover the powerful features that make our chatbot the perfect
            companion for all your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Get instant responses to your questions with our optimized AI
              engine that processes requests in milliseconds.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart & Intuitive</h3>
            <p className="text-muted-foreground">
              Our AI understands context and provides relevant, helpful
              responses tailored to your specific needs.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are protected with enterprise-grade security
              and privacy measures.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Multi-Purpose</h3>
            <p className="text-muted-foreground">
              From creative writing to problem-solving, our AI adapts to help
              with any task or question.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Natural Conversation</h3>
            <p className="text-muted-foreground">
              Chat naturally as if you're talking to a knowledgeable friend
              who's always ready to help.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-all duration-200 border-border/50">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Always Improving</h3>
            <p className="text-muted-foreground">
              Our AI continuously learns and updates to provide better, more
              accurate responses over time.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-primary/5 to-secondary/5 border-border/50">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground/80">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-white/60">
            Join thousands of users who are already experiencing the power of
            AI-assisted conversations.
          </p>
          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try It Now - It's Free
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
      <FloatingChatbot />
    </div>
  );
}
