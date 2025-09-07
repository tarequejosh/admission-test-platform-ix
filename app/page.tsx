import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, FileText, BarChart3, Shield, Clock, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">DIU Admission Portal</h1>
                <p className="text-sm text-muted-foreground">Excellence in Education Since 2002</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/student/login">
                <Button variant="ghost" size="lg" className="font-medium">
                  Student Login
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button size="lg" className="font-medium">
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              🎓 Trusted by 20,000+ Students Worldwide
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Transform Your Future at
              <span className="text-primary block mt-2">Daffodil International University</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty leading-relaxed">
              Join Bangladesh's top-ranked private university in sustainability. Experience our cutting-edge online
              admission platform designed for academic excellence and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/student/login">
                <Button size="lg" className="text-lg px-8 py-6 font-semibold">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-semibold bg-transparent">
                  Admin Access
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose DIU?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leading innovation in education with world-class facilities and global recognition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Global Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Join 500+ international students from diverse backgrounds in our inclusive academic environment
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-accent/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-xl w-fit group-hover:bg-accent/20 transition-colors">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">38 Programs Available</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Choose from undergraduate and graduate programs across 6 faculties designed for 21st-century careers
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-chart-3/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-chart-3/10 rounded-xl w-fit group-hover:bg-chart-3/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-chart-3" />
                </div>
                <CardTitle className="text-xl">QS Ranked University</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Top-ranked in QS World Sustainability Rankings 2024 - 1st among private universities in Bangladesh
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-chart-4/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-chart-4/10 rounded-xl w-fit group-hover:bg-chart-4/20 transition-colors">
                  <Shield className="h-8 w-8 text-chart-4" />
                </div>
                <CardTitle className="text-xl">150-Acre Smart Campus</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  State-of-the-art facilities with "One Student One Laptop" program and modern learning environments
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16">
          <Card className="border-border/50 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">Begin Your DIU Journey</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Take the first step towards excellence at Bangladesh's most innovative university
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="text-center group">
                  <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-primary">For Students</h4>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Access your personalized admission test with your application credentials. Experience our
                    user-friendly interface designed for your success.
                  </p>
                  <Link href="/student/login">
                    <Button size="lg" className="text-lg px-8 py-6 font-semibold w-full sm:w-auto">
                      Start Your Test
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="text-center group">
                  <div className="mb-6 p-4 bg-secondary/20 rounded-2xl w-fit mx-auto group-hover:bg-secondary/30 transition-colors">
                    <Clock className="h-12 w-12 text-secondary-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-secondary-foreground">For Administrators</h4>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Comprehensive dashboard for question management, exam monitoring, and detailed analytics across all
                    departments.
                  </p>
                  <Link href="/admin/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-6 font-semibold w-full sm:w-auto bg-transparent"
                    >
                      Admin Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Daffodil International University</span>
          </div>
          <p className="text-foreground font-medium">
            &copy; 2024 Daffodil International University. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-2">Excellence in Education Since 2002 - Shaping Tomorrow's Leaders</p>
        </div>
      </footer>
    </div>
  )
}
